/**
 * Content loader. Reads and validates data/ and content/ at build time (server only).
 * Every file is parsed with Zod; any shape error throws with the file name so a bad edit fails
 * the build instead of shipping.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
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

  const assets = readYaml("data/assets/images.yaml", AssetFile).assets;

  const relations: Relation[] = [];
  for (const file of listFiles("data/relations")) {
    relations.push(...readYaml(file, RelationFile).relations);
  }

  const pages: Page[] = [];
  for (const file of listFiles("content/pages/en")) {
    const page = readYaml(file, Page);
    // Draft sections wait for owner-supplied facts; outside a review build they do not exist.
    if (!showDrafts()) page.sections = page.sections.filter((b) => !("draft" in b && b.draft));
    pages.push(page);
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
