/**
 * Content loader. Reads and validates data/ and content/ at build time (server only).
 * Every file is parsed with Zod; any shape error throws with the file name so a bad edit fails
 * the build instead of shipping.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { applyPhotographs, reservePhotographs } from "./visuals";
import { servicePricing } from "./samples";
import { priceFacts } from "./prices";
import { expandFacts } from "./inline";
import { forIndustry, forService, homeTestimonials, type Testimonial } from "./testimonials";
import { blockPhotos } from "./photos";
import { portfolioGrid, portfolioPages, projectPath, projects, selectedWork } from "./portfolio";
import { placeCtas, type CtaContext } from "./ctas";
import { loadArticles } from "./articles";
import { z } from "zod";
import {
  Asset,
  AssetFile,
  Country,
  CountryFile,
  Entity,
  EntityFile,
  Fact,
  FactFile,
  type Block,
  Page,
  Relation,
  RelationFile,
  Service,
  ServiceFile,
  type ServiceFamily,
} from "./schema";

export const NAV_KINDS = [
  "services",
  "technologies",
  "work",
  "solutions",
  "industries",
  "resources",
  "about",
  "link",
] as const;

const MenuList = z.object({
  heading: z.string(),
  allLabel: z.string(),
  items: z.array(z.object({ id: z.string(), summary: z.string() })),
});

const NavFile = z.object({
  primary: z.array(z.object({ label: z.string(), kind: z.enum(NAV_KINDS), path: z.string() })),
  cta: z.object({ label: z.string(), path: z.string() }),
  technologies: z.object({
    menuLimit: z.number().int().min(3).max(12),
    categories: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        summary: z.string(),
        items: z.array(z.string()),
      }),
    ),
  }),
  work: z.object({
    heading: z.string(),
    groups: z.array(z.object({ id: z.string(), label: z.string(), items: z.array(z.string()) })),
  }),
  solutions: MenuList,
  industries: MenuList,
  about: z.object({
    heading: z.string(),
    allLabel: z.string(),
    links: z.array(z.object({ label: z.string(), path: z.string(), summary: z.string() })),
  }),
  resources: z.object({
    heading: z.string(),
    allLabel: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        path: z.string(),
        summary: z.string(),
        when: z.enum(["cost", "comparison"]).optional(),
      }),
    ),
  }),
  footer: z.object({
    explore: z.array(z.object({ label: z.string(), path: z.string() })),
    legal: z.array(z.object({ label: z.string(), path: z.string() })),
  }),
});
export type Nav = z.infer<typeof NavFile>;
export type NavItem = Nav["primary"][number];

/** Uniform lightweight view over every graph node, whatever file it came from. */
export type Node = {
  id: string;
  type: Entity["type"];
  name: string;
  slug: string;
  primaryService?: string;
  alsoListedUnder?: string[];
  pagePolicy: Entity["pagePolicy"];
  prominence?: Entity["prominence"];
  source: "taxonomy" | "service" | "country";
};

export type Registry = {
  nodes: Map<string, Node>;
  services: Service[];
  families: { id: ServiceFamily; label: string }[];
  facts: Map<string, Fact>;
  assets: Asset[];
  relations: Relation[];
  pages: Page[];
  pageByPath: Map<string, Page>;
  nav: Nav;
};

const ROOT = process.cwd();

/** A local review build (DECHY_SHOW_DRAFTS=true) keeps draft sections, labeled as drafts. */
export const showDrafts = () => process.env.DECHY_SHOW_DRAFTS === "true";

function readYaml<T>(file: string, schema: z.ZodType<T>): T {
  // Content is read at build time only (every page is statically generated), so this must not
  // pull the whole project into server bundles.
  const full = path.join(/*turbopackIgnore: true*/ ROOT, file);
  let raw: string;
  try {
    raw = fs.readFileSync(full, "utf8");
  } catch (e) {
    throw new Error(`Cannot read ${file}: ${(e as Error).message}`);
  }
  const parsed = schema.safeParse(YAML.parse(raw));
  if (!parsed.success) {
    throw new Error(`Invalid content in ${file}:\n${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}

function listFiles(dir: string, ext = ".yaml"): string[] {
  const full = path.join(/*turbopackIgnore: true*/ ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => path.posix.join(dir, f));
}

export function buildRegistry(): Registry {
  const nodes = new Map<string, Node>();
  const addNode = (n: Node) => {
    if (nodes.has(n.id)) throw new Error(`Duplicate entity id: ${n.id}`);
    nodes.set(n.id, n);
  };

  const svcFile = readYaml("data/taxonomy/services.yaml", ServiceFile);
  for (const s of svcFile.services) {
    addNode({
      id: s.id,
      type: "service",
      name: s.name,
      slug: s.slug,
      pagePolicy: s.pagePolicy,
      prominence: "feature",
      source: "service",
    });
  }

  for (const file of listFiles("data/taxonomy")) {
    if (file.endsWith("services.yaml") || file.endsWith("countries.yaml")) continue;
    const { entities } = readYaml(file, EntityFile);
    for (const e of entities) {
      addNode({
        id: e.id,
        type: e.type,
        name: e.name,
        slug: e.slug,
        primaryService: e.primaryService,
        alsoListedUnder: e.alsoListedUnder,
        pagePolicy: e.pagePolicy,
        prominence: e.prominence,
        source: "taxonomy",
      });
    }
  }

  const { countries } = readYaml("data/taxonomy/countries.yaml", CountryFile);
  for (const c of countries as Country[]) {
    addNode({
      id: c.id,
      type: "country",
      name: c.name,
      slug: c.slug,
      pagePolicy: c.pagePolicy,
      source: "country",
    });
  }

  const facts = new Map<string, Fact>();
  for (const f of readYaml("data/facts/company.yaml", FactFile).facts) {
    if (facts.has(f.id)) throw new Error(`Duplicate fact id: ${f.id}`);
    facts.set(f.id, f);
  }
  // Every price in data/pricing/prices.yaml, as {{fact:price.<id>}} (owner, 22 October 2026).
  for (const f of priceFacts()) {
    if (facts.has(f.id)) throw new Error(`Duplicate price id: ${f.id}`);
    facts.set(f.id, f);
  }

  const assets = readYaml("data/assets/images.yaml", AssetFile).assets;

  const relations: Relation[] = [];
  for (const file of listFiles("data/relations")) {
    relations.push(...readYaml(file, RelationFile).relations);
  }

  // A work area's photographs come from its home service's topic.
  const serviceSlug = new Map(svcFile.services.map((s) => [s.id, s.slug]));
  const serviceOfEntity = (id: string) => {
    const node = nodes.get(id);
    return node?.primaryService ? serviceSlug.get(node.primaryService) : undefined;
  };
  const pages: Page[] = [];
  for (const file of listFiles("content/pages/en")) {
    const page = readYaml(file, Page);
    // Draft sections wait for owner-supplied facts; outside a review build they do not exist.
    if (!showDrafts()) page.sections = page.sections.filter((b) => !("draft" in b && b.draft));
    pages.push(page);
  }
  // Blog articles are written as markdown and join the pages here (content/articles).
  pages.push(...loadArticles(ROOT));
  // Every service page: typical price ranges and timelines, before the questions (owner, 20 Oct).
  for (const page of pages.filter((p) => p.kind === "service")) {
    const at = page.sections.findIndex((b) => b.type === "faq" || b.type === "cta");
    page.sections.splice(
      at < 0 ? page.sections.length : at,
      0,
      ...servicePricing(page.path.replace(/\//g, "")),
    );
  }
  // The portfolio (owner's real projects): case study pages, the Work grid, and selected work on
  // every service and industry page.
  const labels = {
    services: Object.fromEntries(svcFile.services.map((s) => [s.slug, s.name])),
    industries: Object.fromEntries(
      [...nodes.values()].filter((n) => n.type === "industry").map((n) => [n.id, n.name]),
    ),
  };
  pages.push(...portfolioPages(labels));
  const beforeClose = (page: Page, blocks: Block[]) => {
    const at = page.sections.findIndex((b) => b.type === "faq" || b.type === "related");
    page.sections.splice(at < 0 ? page.sections.length : at, 0, ...blocks);
  };
  // Client testimonials (data/testimonials/testimonials.yaml): each card names the service it is
  // about and the client's industry, linked to those pages when they exist.
  const industryPath = new Map(
    pages.filter((p) => p.kind === "industry" && p.entityId).map((p) => [p.entityId!, p.path]),
  );
  const quoteItems = (list: Testimonial[]) =>
    list.map((t) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
      company: t.company,
      tags: [
        { label: labels.services[t.service] ?? t.service, href: `/${t.service}/` },
        { label: labels.industries[t.industry] ?? t.industry, href: industryPath.get(t.industry) },
      ],
    }));
  const quoteBlock = (list: Testimonial[], heading: string): Block[] =>
    list.length
      ? [
          {
            type: "testimonials",
            id: "client-quotes",
            tone: "ink",
            label: "What clients say",
            heading,
            items: quoteItems(list),
          } as Block,
        ]
      : [];
  for (const page of pages)
    for (const b of page.sections)
      if (b.type === "testimonials" && b.items.length === 0)
        b.items = quoteItems(homeTestimonials());
  const industryPages = pages.filter((p) => p.kind === "industry" && p.entityId);
  const borrowed = new Map<string, number>();
  for (const page of pages.filter((p) => p.kind === "service")) {
    const slug = page.path.replace(/\//g, "");
    const list = projects()
      .filter((p) => p.services.includes(slug))
      .sort((a, b) => Number(b.service === slug) - Number(a.service === slug));
    beforeClose(
      page,
      selectedWork(
        list,
        labels,
        showDrafts(),
        `${labels.services[slug] ?? "Our"} projects we have delivered`,
      ),
    );
    beforeClose(page, quoteBlock(forService(slug), "In our clients' words"));
  }
  for (const page of industryPages) {
    beforeClose(
      page,
      selectedWork(
        projects().filter((p) => p.industry === page.entityId),
        labels,
        showDrafts(),
        `${labels.industries[page.entityId!] ?? "Industry"} projects we have delivered`,
      ),
    );
    const related = page.sections.find((b) => b.type === "related");
    const services =
      related && related.type === "related"
        ? related.groups
            .flatMap((g) => g.entityIds)
            .filter((id) => id.startsWith("svc."))
            .map((id) => id.replace(/^svc\./, ""))
        : [];
    beforeClose(
      page,
      quoteBlock(
        forIndustry(page.entityId!, services, borrowed),
        "Teams like yours, in their own words",
      ),
    );
  }
  const work = pages.find((p) => p.path === "/work/");
  if (work) work.sections.splice(1, 0, portfolioGrid(labels, showDrafts()));
  // A service's pricing section links to its full cost guide once one is published.
  for (const page of pages.filter((p) => p.kind === "service")) {
    const slug = page.path.replace(/\//g, "");
    const guide = pages.find(
      (p) => p.kind === "article" && p.article?.category === "cost" && p.article.pricing === slug,
    );
    const block = page.sections.find((b) => b.type === "pricing");
    if (guide && block && block.type === "pricing")
      block.note = `${block.note ?? ""} [Read the full cost guide](${guide.path}).`.trim();
  }
  // The glossary terms (data/glossary/terms.json) fill every glossary section.
  const { records: terms } = readYaml(
    "data/glossary/terms.json",
    z.object({ records: z.array(z.object({ term: z.string(), definition: z.string() })) }),
  );
  for (const page of pages)
    for (const b of page.sections)
      if (b.type === "glossary" && b.items.length === 0) b.items = terms;
  // The proof strip under every service page's hero, then calls to action through each page.
  for (const page of pages.filter((p) => p.kind === "service"))
    page.sections.splice(1, 0, { type: "proof-strip", id: "proof", tone: "ink" } as Block);
  const has = (path: string) => pages.some((p) => p.path === path);
  const ctaContext: CtaContext = {
    estimator: has("/tools/cost-estimator/") ? "/tools/cost-estimator/" : undefined,
    costHub: has("/cost/") ? "/cost/" : undefined,
    costGuide: (slug) =>
      pages.find(
        (p) => p.kind === "article" && p.article?.category === "cost" && p.article.pricing === slug,
      )?.path,
    serviceName: (slug) => labels.services[slug],
    work: (page) => {
      const slug = page.path.replace(/\//g, "");
      const list =
        page.kind === "service"
          ? projects().filter((p) => p.services.includes(slug))
          : page.kind === "industry"
            ? projects().filter((p) => p.industry === page.entityId)
            : projects();
      return list.slice(0, 2).map((p) => ({ title: p.title, path: projectPath(p) }));
    },
  };
  for (const page of pages) {
    const target =
      page.kind === "home" || page.kind === "service" ? 6 : page.kind === "industry" ? 4 : 0;
    if (target) placeCtas(page, ctaContext, target);
  }
  // Photographs: hand-placed ones first, then every other placement gets an unused one.
  const usedPhotos = new Map<string, number>();
  reservePhotographs(pages, usedPhotos, blockPhotos);
  for (const page of pages) applyPhotographs(page, serviceOfEntity, usedPhotos);
  // Titles, descriptions, headlines, and leads go to metadata, structured data, and the search
  // index as plain strings, so their fact and price tokens are filled in here, once.
  for (const p of pages) {
    p.title = expandFacts(p.title, facts);
    p.description = expandFacts(p.description, facts);
    if (p.h1) p.h1 = expandFacts(p.h1, facts);
    if (p.lead) p.lead = expandFacts(p.lead, facts);
    // Guide summaries are printed as plain text on the cost hub and Resources cards.
    if (p.article?.summary) p.article.summary = expandFacts(p.article.summary, facts);
  }
  const pageByPath = new Map<string, Page>();
  for (const p of pages) {
    if (pageByPath.has(p.path)) throw new Error(`Two pages share the path ${p.path}`);
    pageByPath.set(p.path, p);
  }

  const nav = readYaml("data/navigation/nav.yaml", NavFile);

  return {
    nodes,
    services: [...svcFile.services].sort((a, b) => a.order - b.order),
    families: svcFile.families,
    facts,
    assets,
    relations,
    pages,
    pageByPath,
    nav,
  };
}

let cached: Registry | undefined;
let cachedSignature = "";

/** Newest modification time across all content and data files (cheap: a few dozen stat calls). */
function contentSignature(): string {
  let newest = 0;
  const walk = (dir: string) => {
    const full = path.join(/*turbopackIgnore: true*/ ROOT, dir);
    if (!fs.existsSync(full)) return;
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      const rel = path.posix.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else
        newest = Math.max(
          newest,
          fs.statSync(path.join(/*turbopackIgnore: true*/ ROOT, rel)).mtimeMs,
        );
    }
  };
  walk("data");
  walk("content");
  return String(newest);
}

/**
 * Cached for the life of the process in production. In development the cache is invalidated when
 * any content file changes, so edits show immediately without re-parsing on every call.
 */
export function getRegistry(): Registry {
  if (process.env.NODE_ENV === "development") {
    const sig = contentSignature();
    if (!cached || sig !== cachedSignature) {
      cached = buildRegistry();
      cachedSignature = sig;
    }
    return cached;
  }
  // One parse per server process, shared by every route bundle (each bundle has its own copy of
  // this module, so a module-level cache alone would parse the content once per route).
  const shared = globalThis as { __dechyRegistry?: Registry };
  shared.__dechyRegistry ??= buildRegistry();
  return shared.__dechyRegistry;
}

export function getPage(pathname: string): Page {
  const page = getRegistry().pageByPath.get(pathname);
  if (!page) throw new Error(`No page record for ${pathname}`);
  return page;
}
