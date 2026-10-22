/**
 * Content and graph validation (AGENTS 62 and 63). Pure functions over a loaded Registry, so the
 * same rules run in the CLI (npm run validate, part of every build), in unit tests, and in CI.
 * A rule that fails an `error` fails the build; this is how the architecture is enforced.
 */
import { modelTable, pricingFor } from "./samples";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { breadcrumbsFor } from "./breadcrumbs";
import { diagramIssues, glossaryIssues, readabilityIssues } from "./clarity";
import {
  INDUSTRY_SIMILARITY,
  LOCATION_SIMILARITY,
  SERVICE_SIMILARITY,
  SOLUTION_SIMILARITY,
  TECH_SIMILARITY,
  WORK_SIMILARITY,
  similarityIssues,
} from "./similarity";
import { expandFacts, linkTargets, toPlainText } from "./inline";
import type { Registry } from "./load";
import { requiredPhotoWidth } from "./photo-geometry";
import { blockPhotos } from "./photos";
export { blockPhotos };
import type { Block, Page, PhotoRef } from "./schema";

type PhotoLayout = PhotoRef["layout"];

import { entityPath, pathExists, publishedPath } from "./urls";
import { buildGraph } from "@/lib/seo/structured-data";
import { DESCRIPTOR } from "@/lib/site";

/** Entity types a technology page may belong to. */
const TECHNOLOGY_TYPES = new Set([
  "technology",
  "platform",
  "language",
  "framework",
  "provider",
  "tool",
  "integration",
]);

/** Wording that would imply an office, branch, local team, or address (the company has none). */
const PRESENCE_CLAIMS = [
  /\b(local|regional|in-country|country|head) (office|branch|team|presence|address|staff)s?\b/i,
  /\boffices? (in|across|near)\b/i,
  /\bvisit (us|our)\b/i,
  /\bheadquarter/i,
  /\bon the ground\b/i,
  /\blocal (employees|engineers|specialists|consultants)\b/i,
];

/** Named products whose capability the owner has not confirmed (doc 14, section 10.3). */
const UNCONFIRMED_PRODUCTS = [
  /\bpower ?bi\b/i,
  /\btableau\b/i,
  /\blooker\b/i,
  /\bkafka\b/i,
  /\brabbitmq\b/i,
  /\bopensearch\b/i,
  /\bdatadog\b/i,
  /\bsentry\b/i,
  /\bruby on rails\b/i,
];

export type Issue = { level: "error" | "warn"; code: string; where: string; message: string };

const APPROVED_SERVICES = [
  "Software Development",
  "Web Development",
  "Mobile App Development",
  "AI & Machine Learning",
  "Automation, Workflows & AI Solutions",
  "Cloud & DevOps",
  "Cybersecurity",
  "Data & Analytics",
  "API & Systems Integration",
  "Ecommerce Solutions",
  "UI/UX & Product Design",
  "Branding & Creative",
  "SEO, AEO & GEO",
  "Digital Marketing",
  "Consulting & Digital Transformation",
];

// Owner direction, 20 October 2026: buyer-friendly labels and order.
const APPROVED_NAV = [
  "Services",
  "Industries",
  "Our Work",
  "Solutions",
  "Technologies",
  "Resources",
  "About us",
];

const SKIP_KEYS = new Set([
  "serviceLabel",
  "industryLabel",
  "sector",
  "id",
  "type",
  "tone",
  "figure",
  "variant",
  "style",
  "numbered",
  "columns_count",
  "href",
  "ref",
  "entityIds",
  "factId",
  "asset",
  "layout",
  "position",
]);

/** All human-readable strings in a block (not identifiers or paths). */
export function blockStrings(value: unknown, out: string[] = [], key = ""): string[] {
  if (typeof value === "string") {
    if (!SKIP_KEYS.has(key)) out.push(value);
  } else if (Array.isArray(value)) {
    for (const v of value) blockStrings(v, out, key);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) blockStrings(v, out, k);
  }
  return out;
}

export function pageStrings(page: Page): string[] {
  return [
    page.title,
    page.description,
    page.breadcrumbLabel,
    page.h1 ?? "",
    page.lead ?? "",
    // Article fields the page shows: the short answer, the tables, and the comparison.
    page.article?.answer ?? "",
    ...(page.article?.pricing && page.article.pricing !== "all"
      ? (pricingFor(page.article.pricing)?.plans ?? []).flatMap((p) => [
          p.name,
          p.range,
          p.timeline,
          p.summary,
        ])
      : []),
    ...[
      ...(page.article?.models ?? []).map((k) => modelTable(k)),
      ...(page.article?.tables ?? []),
    ].flatMap((t) => [t.heading, ...t.columns, ...t.rows.flat(), t.note ?? ""]),
    ...(page.article?.compare
      ? [
          ...page.article.compare.options,
          ...page.article.compare.rows.flatMap((r) => [r.label, ...r.values]),
          ...page.article.compare.choose.flatMap((c) => c.when),
          page.article.compare.recommendation,
        ]
      : []),
    ...page.sections.flatMap((s) => blockStrings(s)),
  ].filter(Boolean);
}

const DASHES = /[\u2013\u2014]/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/u;
const BANNED_PHRASES = [
  /technology\.\s*people\.\s*progress/i,
  /coming soon/i,
  /lorem ipsum/i,
  /\bplaceholder\b/i,
  /\bTODO\b/,
  /\bTBD\b/,
  // Image source credits are never shown on the site (they live in the asset registry only).
  /\bunsplash\b/i,
  /\bpexels\b/i,
  /\bphoto(?:graph)?s?\s+(?:by|credit|courtesy)\b/i,
  /\bphoto:\s/i,
  /\bimage\s+credits?\b/i,
];
const WRONG_DESCRIPTOR = [
  /Technology\s*(?:&|and)\s*Digital Solutions/i,
  /\b(?:Technology|Digital|Software|AI|Web) Agency\b/,
];
/** Claims DECHY has not supplied evidence for (AGENTS 46 and 47). */
const UNSUPPORTED = [
  /\btestimonials?\b/i,
  /\baward[- ]winning\b/i,
  /\bawarded\b/i,
  /\bcertified (?:partner|expert)\b/i,
  /\bour offices?\b/i,
  /\bour headquarters\b/i,
  /\bour branch(?:es)?\b/i,
  /\blocal team\b/i,
  /\bvisit us\b/i,
  /\b\d[\d,]*\+?\s+(?:clients|customers|projects|years)\b/i,
  /\btrusted by\b/i,
];

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function validateRegistry(input: Registry): Issue[] {
  // Sample (draft) sections exist only in review builds and are never published; content rules
  // apply to what the live site will show.
  const pages = input.pages
    .filter((p) => !p.id.startsWith("sample."))
    .map((p) => ({
      ...p,
      sections: p.sections.filter((b) => !("draft" in b && b.draft)),
    }));
  const registry: Registry = {
    ...input,
    pages,
    pageByPath: new Map(pages.map((p) => [p.path, p])),
  };
  const issues: Issue[] = [];
  const err = (code: string, where: string, message: string) =>
    issues.push({ level: "error", code, where, message });
  const warn = (code: string, where: string, message: string) =>
    issues.push({ level: "warn", code, where, message });

  /* ---- services ---- */
  const names = registry.services.map((s) => s.name);
  if (JSON.stringify(names) !== JSON.stringify(APPROVED_SERVICES)) {
    err(
      "services-approved",
      "services.yaml",
      `The 15 approved services must match exactly, in order. Got: ${names.join(" | ")}`,
    );
  }
  for (const f of registry.families) {
    if (!registry.services.some((s) => s.family === f.id)) {
      err("family-empty", f.id, "Every navigation family must contain at least one service.");
    }
  }
  const slugs = new Set<string>();
  for (const s of registry.services) {
    if (slugs.has(s.slug)) err("service-slug-dup", s.id, `Duplicate service slug ${s.slug}`);
    slugs.add(s.slug);
  }

  /* ---- entities ---- */
  const urlOwner = new Map<string, string>();
  for (const n of registry.nodes.values()) {
    if (n.primaryService) {
      const parent = registry.nodes.get(n.primaryService);
      if (!parent || parent.type !== "service") {
        err("primary-service", n.id, `primaryService ${n.primaryService} is not a service`);
      }
    }
    for (const a of n.alsoListedUnder ?? []) {
      if (!registry.nodes.has(a)) err("also-listed", n.id, `alsoListedUnder ${a} does not exist`);
    }
    const p = entityPath(n, registry);
    if (p) {
      const prior = urlOwner.get(p);
      if (prior) err("slug-collision", n.id, `Would share the URL ${p} with ${prior}`);
      urlOwner.set(p, n.id);
    }
    if (DASHES.test(n.name) || EMOJI.test(n.name)) {
      err("entity-name-style", n.id, `Entity name contains a forbidden dash or emoji: ${n.name}`);
    }
  }
  if (registry.nodes.size < 700) {
    err(
      "capability-preserved",
      "taxonomy",
      `Expected the full seeded capability architecture (700+ entities); found ${registry.nodes.size}`,
    );
  }
  const countries = [...registry.nodes.values()].filter((n) => n.type === "country");
  if (countries.length < 10 || countries.length > 15) {
    err("countries", "countries.yaml", `Country set must be 10 to 15; found ${countries.length}`);
  }

  /* ---- relations ---- */
  const typeOf = (id: string) => registry.nodes.get(id)?.type;
  for (const r of registry.relations) {
    const where = `${r.from} ${r.type} ${r.to}`;
    if (!registry.nodes.has(r.from) || !registry.nodes.has(r.to)) {
      err("relation-endpoint", where, "Relation endpoint does not exist");
      continue;
    }
    if (r.from === r.to) err("relation-self", where, "Self relation");
    const f = typeOf(r.from);
    const t = typeOf(r.to);
    if (r.type === "relatedService" && !(f === "service" && t === "service"))
      err("relation-type", where, "relatedService must connect two services");
    if (r.type === "appliesToIndustry" && t !== "industry")
      err("relation-type", where, "appliesToIndustry must target an industry");
    if (r.type === "hasWorkArea" && !(f === "service" && t === "work-area"))
      err("relation-type", where, "hasWorkArea must connect a service to a work area");
    if (r.type === "relatedWork" && !(f === "work-area" && t === "work-area"))
      err("relation-type", where, "relatedWork must connect two work areas");
    if (r.type === "offersSolution" && t !== "solution")
      err("relation-type", where, "offersSolution must target a solution");
    if ((r.type === "addressesProblem" || r.type === "solves") && t !== "problem")
      err("relation-type", where, `${r.type} must target a problem`);
    if (r.type === "hasPart")
      err("relation-type", where, "hasPart is derived; store the edge as partOf (child to parent)");
    if (r.type === "partOf") {
      if (!(TECHNOLOGY_TYPES.has(f ?? "") && TECHNOLOGY_TYPES.has(t ?? "")))
        err("relation-type", where, "partOf must connect two technology entities");
      if (registry.relations.some((o) => o.type === "partOf" && o.from === r.to && o.to === r.from))
        err("relation-type", where, "partOf must not form a cycle");
    }
  }

  /* ---- pages ---- */
  const titles = new Map<string, string>();
  const descs = new Map<string, string>();
  const intents = new Map<string, string>();
  const inbound = new Map<string, Set<string>>();
  const link = (from: string, to: string) => {
    if (!inbound.has(to)) inbound.set(to, new Set());
    inbound.get(to)?.add(from);
  };

  for (const page of registry.pages) {
    const where = page.path;
    if (titles.has(page.title)) err("title-dup", where, `Same title as ${titles.get(page.title)}`);
    titles.set(page.title, where);
    // Search titles say what the page is first and carry the brand once, at the end.
    if (!page.title.endsWith(" | DECHY") || page.title.indexOf("DECHY") !== page.title.length - 5)
      err("title-format", where, `Title must describe the page and end with " | DECHY" only`);
    if (page.title.length > 60)
      err("title-length", where, `Title is ${page.title.length} characters (max 60)`);
    if (page.description.length < 70 || page.description.length > 160)
      err("desc-length", where, `Description is ${page.description.length} characters (70 to 160)`);
    if (descs.has(page.description))
      err("desc-dup", where, `Same description as ${descs.get(page.description)}`);
    descs.set(page.description, where);
    const intentKey = page.intent.primary.toLowerCase();
    if (intents.has(intentKey))
      err("intent-dup", where, `Same primary intent as ${intents.get(intentKey)}`);
    intents.set(intentKey, where);

    if (page.kind === "home" && page.path !== "/") err("home-path", where, "Home must live at /");
    if (page.entityId) {
      const node = registry.nodes.get(page.entityId);
      if (!node) err("page-entity", where, `Unknown entity ${page.entityId}`);
      else if (entityPath(node, registry) !== page.path)
        err(
          "canonical-home",
          where,
          `Entity ${page.entityId} belongs at ${entityPath(node, registry)}`,
        );
    }

    // One H1 per page: a hero block (first) or h1 on the record, never both or neither.
    const heroes = page.sections.filter((s) => s.type === "hero");
    const heroFirst = page.sections[0]?.type === "hero";
    if (heroes.length > 1) err("h1-multiple", where, "More than one hero block");
    if (heroes.length === 1 && !heroFirst)
      err("hero-position", where, "Hero must be the first block");
    if (heroes.length === 1 && page.h1)
      err("h1-both", where, "Page has both a hero and an h1 field");
    if (heroes.length === 0 && !page.h1) err("h1-missing", where, "Page has no H1");

    const ids = new Set<string>();
    for (const b of page.sections) {
      if (ids.has(b.id)) err("block-id-dup", where, `Duplicate block id ${b.id}`);
      ids.add(b.id);
    }

    const faq = page.sections.some((b) => b.type === "faq");
    if (page.schemaTypes.includes("FAQPage") !== faq)
      err(
        "faq-schema",
        where,
        "FAQPage schema must be present exactly when the page has an FAQ block",
      );

    // Breadcrumbs must resolve.
    breadcrumbsFor(page, registry);

    // Strings: style, banned phrases, unsupported claims, descriptor exactness, facts.
    const strings = pageStrings(page);
    // Draft sections never reach the live site; their placeholder proof wording is not a claim.
    const draftStrings = new Set(
      page.sections.filter((b) => "draft" in b && b.draft).flatMap((b) => blockStrings(b)),
    );
    for (const s of strings) {
      const label = `${where} :: ${s.slice(0, 50)}`;
      if (DASHES.test(s)) err("dash", label, "Contains an em or en dash (AGENTS 1A.16)");
      if (EMOJI.test(s)) err("emoji", label, "Contains an emoji");
      for (const re of BANNED_PHRASES) if (re.test(s)) err("banned-phrase", label, `Matches ${re}`);
      for (const re of WRONG_DESCRIPTOR)
        if (re.test(s)) err("descriptor", label, `Non-approved descriptor wording (${re})`);
      for (const re of draftStrings.has(s) ? [] : UNSUPPORTED)
        if (re.test(s)) err("unsupported-claim", label, `Unsupported claim wording (${re})`);
      // The company statistic and history may only come from the facts register.
      // Prices such as "$1,500" are not the client count.
      if (/(?<!\$)\b1,?500\b|\b2010\b/.test(s.replace(/\{\{fact:[^}]+\}\}/g, ""))) {
        err(
          "fact-bypass",
          label,
          "The company statistic or founding year must come from a {{fact:...}} macro",
        );
      }
      if (/Technology, Software/.test(s) && !s.includes(DESCRIPTOR)) {
        err("descriptor", label, "Descriptor appears but is not exact");
      }
      try {
        expandFacts(s, registry.facts);
      } catch (e) {
        err("fact-unknown", label, (e as Error).message);
      }
      // Links
      for (const target of linkTargets(s)) {
        if (target.startsWith("ref:")) {
          if (!registry.nodes.has(target.slice(4)))
            err("link-ref", label, `Unknown entity ${target}`);
        } else if (target.startsWith("/")) {
          if (!pathExists(target, registry))
            err("link-path", label, `Internal link to missing page ${target}`);
          else link(page.path, target);
        } else if (!/^https:\/\//.test(target)) {
          err("link-scheme", label, `Unsupported link target ${target}`);
        }
      }
    }
    for (const claim of page.claims) {
      if (!registry.facts.has(claim))
        err("claim-fact", where, `claims[] cites unknown fact ${claim}`);
    }

    // Block-level checks
    const blockTypes = new Set(page.sections.map((b) => b.type));
    for (const b of page.sections) {
      checkBlock(b, page, registry, err, link);
    }
    // Photography: each placement must resolve to a registered, approved photograph, and a page
    // carries a few purposeful photographs, not a gallery.
    const photoRefs = page.sections.flatMap((b) =>
      blockPhotos(b).map((p) => ({ block: b.id, ref: p.asset })),
    );
    for (const p of photoRefs) {
      const asset = registry.assets.find((a) => a.id === p.ref);
      if (!asset || asset.role !== "photograph")
        err("photo-ref", `${where}#${p.block}`, `${p.ref} is not a registered photograph`);
    }
    // A published testimonial shows the real person: never a stock portrait.
    for (const b of page.sections)
      if (b.type === "testimonials" && !b.draft)
        for (const q of b.items) {
          const a = q.photo && registry.assets.find((x) => x.id === q.photo?.asset);
          if (a && a.source === "licensed-stock")
            err(
              "testimonial-photo",
              `${where}#${b.id}`,
              `${q.name} uses a stock portrait; use the person's own photo`,
            );
        }
    // The home page carries the photographic story (owner direction, 19 October 2026).
    // About us shows the DECHY workspace as a gallery (owner direction, 20 October 2026).
    const photoLimit = page.kind === "home" ? 40 : page.path === "/company/" ? 6 : 4;
    // Sample (draft) sections show in review builds only and do not count toward the limit.
    const livePhotos = page.sections
      .filter((b) => !("draft" in b && b.draft))
      .flatMap((b) => blockPhotos(b))
      // Portfolio screens are project work, not photographs, and do not count.
      .filter((ph) => !ph.asset.startsWith("asset.photo-portfolio-"));
    if (livePhotos.length > photoLimit)
      err(
        "photo-count",
        where,
        `${livePhotos.length} photographs on one page; the limit is ${photoLimit}`,
      );
    // Clarity and comprehension standard (ADR 0004).
    const GUIDED = [
      "service",
      "hub",
      "company",
      "work-hub",
      "work-area",
      "technology",
      "solution",
      "industry",
      "location",
    ];
    if (GUIDED.includes(page.kind)) {
      if (!page.comprehension)
        err("comprehension-missing", where, "A commercial page needs its comprehension record");
      if (!page.sections.some((b) => b.type === "cta"))
        err("next-step", where, "A commercial page needs a clear next step (a call to action)");
    }
    if (page.kind === "work-area") {
      if (!page.entityId?.startsWith("workarea."))
        err("work-entity", where, "A Work Area page must belong to a work-area entity");
      if (!page.sections.some((b) => b.type === "callout" && b.variant === "illustrative"))
        err("work-illustrative", where, "A Work Area needs a labeled illustrative scenario");
    }
    if (page.kind === "technology") {
      const node = page.entityId ? registry.nodes.get(page.entityId) : undefined;
      if (!node || !TECHNOLOGY_TYPES.has(node.type))
        err("tech-entity", where, "A technology page must belong to a technology-like entity");
      const home = node?.primaryService ? registry.nodes.get(node.primaryService) : undefined;
      if (home && page.parent !== `/${home.slug}/`)
        err("tech-parent", where, `A technology page's parent must be its service (${home.slug})`);
      const related = page.sections.flatMap((b) => (b.type === "related" ? b.groups : []));
      if (node?.primaryService && !related.some((g) => g.entityIds.includes(node.primaryService!)))
        err("tech-service-link", where, "A technology page must link to its canonical service");
      if (page.sections.some((b) => b.type === "callout" && b.variant === "illustrative"))
        err("tech-disclaimer", where, "Technology pages use natural wording, not disclaimer boxes");
      const specs = page.sections.flatMap((b) =>
        b.type === "hero" || b.type === "diagram" ? (b.spec ? [b.spec] : []) : [],
      );
      const figures = page.sections.filter(
        (b) => (b.type === "hero" || b.type === "diagram") && b.figure,
      ).length;
      if (specs.length + figures === 0)
        err("tech-diagram", where, "A technology page needs a diagram");
      if (node?.type === "integration" && !specs.some((s) => s.kind === "flow"))
        err("integration-flow", where, "An integration page needs a data-flow diagram (AGENTS 76)");
    }
    if (page.kind === "solution") {
      const node = page.entityId ? registry.nodes.get(page.entityId) : undefined;
      if (!node || node.type !== "solution")
        err("solution-entity", where, "A solution page must belong to a solution entity");
      if (page.parent !== "/solutions/")
        err("solution-parent", where, "A solution page's parent must be /solutions/");
      const related = page.sections.flatMap((b) => (b.type === "related" ? b.groups : []));
      const relatedTypes = (types: string[]) =>
        related
          .flatMap((g) => g.entityIds)
          .filter((id) => types.includes(registry.nodes.get(id)?.type ?? "")).length;
      if (relatedTypes(["service"]) < 1)
        err("solution-service", where, "A solution page must link at least one service");
      if (relatedTypes(["work-area"]) < 1)
        err("solution-work-area", where, "A solution page must link at least one Work Area");
      if (relatedTypes([...TECHNOLOGY_TYPES]) < 2)
        err("solution-technology", where, "A solution page must link at least two technologies");
      if (page.sections.some((b) => b.type === "callout" && b.variant === "illustrative"))
        err(
          "solution-disclaimer",
          where,
          "Solution pages use natural wording, not disclaimer boxes",
        );
      const first = page.sections[0];
      if (first?.type !== "hero" || !first.spec)
        err("solution-diagram", where, "A solution page opens with a hero that carries a diagram");
    }
    if (page.kind === "industry") {
      const node = page.entityId ? registry.nodes.get(page.entityId) : undefined;
      if (!node || node.type !== "industry")
        err("industry-entity", where, "An industry page must belong to an industry entity");
      if (page.parent !== "/industries/")
        err("industry-parent", where, "An industry page's parent must be /industries/");
      if (page.sections.some((b) => b.type === "callout" && b.variant === "illustrative"))
        err(
          "industry-disclaimer",
          where,
          "Industry pages use natural wording, not disclaimer boxes",
        );
    }
    if (page.kind === "location") {
      const node = page.entityId ? registry.nodes.get(page.entityId) : undefined;
      if (!node || node.type !== "country")
        err("location-entity", where, "A location page must belong to a country entity");
      if (page.parent !== "/locations/")
        err("location-parent", where, "A location page's parent must be /locations/");
    }
    if (page.kind === "article") {
      if (!page.article) err("article-meta", where, "An article needs its article record");
      if (page.parent !== "/resources/")
        err("article-parent", where, "An article's parent must be /resources/");
      if (!page.schemaTypes.includes("Article"))
        err("article-schema", where, "An article page declares the Article schema type");
    }
    // Presence claims: DECHY is a global company with no offices, branches, local teams, or
    // addresses. Location, industry, and solution pages never imply otherwise.
    if (["location", "industry", "solution", "article"].includes(page.kind)) {
      for (const s of strings)
        for (const re of PRESENCE_CLAIMS)
          if (re.test(s))
            err(
              "presence-claim",
              `${where} :: ${s.slice(0, 50)}`,
              `Implies a physical presence (${re})`,
            );
    }
    // Capabilities awaiting the owner's confirmation are never named in page copy.
    for (const s of strings)
      for (const re of UNCONFIRMED_PRODUCTS)
        if (re.test(s))
          err(
            "unconfirmed-capability",
            `${where} :: ${s.slice(0, 50)}`,
            `Names an unconfirmed product (${re})`,
          );
    if (page.kind !== "legal") {
      for (const m of glossaryIssues(page, registry.facts)) err("glossary", where, m);
      for (const m of readabilityIssues(page, registry.facts).errors) err("readability", where, m);
    }
    for (const m of diagramIssues(page)) err("diagram-clarity", where, m);
    // The Resources library and the Glossary are deliberately lean listings (owner, 21 October 2026).
    const LISTING_PAGES = new Set([
      "/resources/",
      "/resources/glossary/",
      "/cost/",
      "/tools/cost-estimator/",
    ]);
    const minVariety = LISTING_PAGES.has(page.path)
      ? 1
      : page.kind === "home" || page.kind === "service"
        ? 8
        : page.kind === "work-area" || page.kind === "hub"
          ? 6
          : page.kind === "technology" || page.kind === "industry" || page.kind === "location"
            ? 7
            : page.kind === "solution"
              ? 8
              : 1;
    if (blockTypes.size < minVariety)
      err(
        "template-sameness",
        where,
        `Only ${blockTypes.size} distinct block types; ${minVariety} required for ${page.kind} pages`,
      );

    // Thin-page guard
    const words = wordCount(
      strings
        .map((s) => {
          try {
            return toPlainText(s, registry.facts);
          } catch {
            return s; // unknown facts are reported separately above
          }
        })
        .join(" "),
    );
    const min =
      page.kind === "service"
        ? 1500
        : page.kind === "home"
          ? 1300
          : page.kind === "contact"
            ? 140
            : page.kind === "technology"
              ? 900
              : page.kind === "solution"
                ? 1100
                : page.kind === "industry"
                  ? 1000
                  : page.kind === "location"
                    ? 900
                    : page.kind === "article"
                      ? 1400
                      : 0;
    if (words < min)
      err("thin-page", where, `${words} words; ${min} required for ${page.kind} pages`);

    // JSON-LD
    const graph = buildGraph(page, registry);
    const nodes = (graph as unknown as { "@graph": Record<string, unknown>[] })["@graph"];
    const idsSeen = new Set<string>();
    for (const n of nodes) {
      const id = n["@id"] as string | undefined;
      if (id) {
        if (idsSeen.has(id)) err("jsonld-id-dup", where, `Duplicate JSON-LD @id ${id}`);
        idsSeen.add(id);
      }
      for (const banned of [
        "address",
        "aggregateRating",
        "review",
        "award",
        "sameAs",
        "numberOfEmployees",
        "contactPoint",
      ]) {
        if (banned in n)
          err("jsonld-unsupported", where, `JSON-LD property ${banned} has no supporting fact`);
      }
      if (n["@type"] === "LocalBusiness")
        err("jsonld-localbusiness", where, "LocalBusiness is not applicable");
    }
  }

  /* ---- asset registry and provenance ---- */
  const root = process.cwd();
  const registered = new Set<string>();
  const assetIds = new Set<string>();
  // Where each photograph is placed, by layout, for the resolution rule below.
  const photoUse = new Map<string, Set<PhotoLayout>>();
  for (const page of registry.pages)
    for (const b of page.sections)
      for (const p of blockPhotos(b)) {
        const set = photoUse.get(p.asset) ?? new Set<PhotoLayout>();
        set.add(p.layout);
        photoUse.set(p.asset, set);
      }
  for (const a of registry.assets) {
    if (assetIds.has(a.id)) err("asset-dup", a.id, "Duplicate asset id");
    assetIds.add(a.id);
    registered.add(a.file);
    const full = path.join(root, a.file);
    if (!fs.existsSync(full)) {
      err("asset-missing", a.id, `Registered file does not exist: ${a.file}`);
      continue;
    }
    if (a.sha256) {
      const actual = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
      if (actual !== a.sha256) err("asset-hash", a.id, "File does not match its recorded SHA-256");
    }
    if (a.source === "licensed-stock" && (!a.sourceUrl || !a.licenseUrl))
      err("asset-license", a.id, "Licensed stock needs sourceUrl and licenseUrl");
    if (a.approval !== "approved")
      err("asset-approval", a.id, "Asset is not approved but is registered for use");
    if (a.source === "licensed-stock") {
      const evidence = path.join(
        root,
        "data/assets/licenses",
        `${a.id.replace(/^asset\./, "")}.md`,
      );
      if (!fs.existsSync(evidence))
        err(
          "asset-evidence",
          a.id,
          "Licensed stock needs license evidence in data/assets/licenses/",
        );
    }
    if (a.caption && /unsplash|pexels|photo:|credit|courtesy|\bby [A-Z]/i.test(a.caption))
      err(
        "asset-visible-credit",
        a.id,
        "A caption must describe the image; it must not carry a source credit",
      );
    if (a.role === "photograph") {
      if (!a.width || !a.height || !a.sha256)
        err("asset-photo", a.id, "A photograph needs width, height, and sha256");
      if (a.alt.length < 20) err("asset-photo", a.id, "A photograph needs descriptive alt text");
      // Sharp at 2x: the stored width must be at least twice the widest the photograph is painted
      // at in any layout it is placed in, crop included (a full-width band keeps a 2400 px floor).
      // Portfolio screens are shown whole in 4:3 frames, never cropped wider.
      const ratio = a.id.startsWith("asset.photo-portfolio-")
        ? Math.min((a.width ?? 1) / (a.height ?? 1), 4 / 3)
        : (a.width ?? 1) / (a.height ?? 1);
      const need = Math.max(
        0,
        ...[...(photoUse.get(a.id) ?? [])].map((l) => requiredPhotoWidth(l, ratio)),
      );
      if ((a.width ?? 0) < need)
        err(
          "asset-photo-resolution",
          a.id,
          `A photograph used as "${[...(photoUse.get(a.id) ?? [])].join(", ")}" must be at least ${need} px wide so it stays sharp at 2x`,
        );
      if (a.source === "original")
        err("asset-photo", a.id, "A photograph must be licensed, supplied, or client-owned");
    }
  }
  const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i;
  const walkImages = (dir: string) => {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) return;
    for (const e of fs.readdirSync(full, { withFileTypes: true })) {
      const rel = path.posix.join(dir, e.name);
      if (e.isDirectory()) walkImages(rel);
      else if (IMAGE_EXT.test(e.name) && !registered.has(rel))
        err(
          "asset-unregistered",
          rel,
          "Image file is not in data/assets/images.yaml (source and license are required)",
        );
    }
  };
  walkImages("public");
  walkImages("brand");
  for (const figure of [
    "system-map",
    "connected-flow",
    "software-anatomy",
    "quality-layers",
    "modernization-path",
    "portal-wireframe",
    "site-builder",
    "store-ui",
    "dashboard-ui",
    "mobile-app-ui",
    "crm-ui",
    "analytics-ui",
    "assistant-ui",
    "workflow-ui",
    "interface-set",
    "platform-ui",
  ]) {
    if (!registry.assets.some((a) => a.id === `asset.fig-${figure}`))
      err("asset-figure", figure, "Diagram has no registry entry");
  }

  /* ---- navigation and orphan check ---- */
  const primaryLabels = registry.nav.primary.map((i) => i.label);
  if (JSON.stringify(primaryLabels) !== JSON.stringify(APPROVED_NAV))
    err("nav-approved", "nav.yaml", `Primary navigation must be ${APPROVED_NAV.join(", ")}`);
  if (registry.nav.cta.label !== "Get a quote")
    err("nav-cta", "nav.yaml", "The header button must read Get a quote (owner, 21 October 2026)");
  if (!pathExists(registry.nav.cta.path, registry))
    err("nav-cta-path", "nav.yaml", "CTA target page does not exist");
  for (const l of registry.nav.footer.legal) {
    if (!pathExists(l.path, registry))
      err("footer-legal", l.path, "Legal link target page does not exist");
    else link("footer", l.path);
  }
  for (const l of registry.nav.footer.explore)
    if (pathExists(l.path, registry)) link("footer", l.path);
  if (pathExists(registry.nav.cta.path, registry)) link("nav", registry.nav.cta.path);
  // Menus: kinds match the approved structure; every technology and Work Area page is placed once.
  const KIND_BY_LABEL: Record<string, string> = {
    Services: "services",
    Technologies: "technologies",
    "Our Work": "work",
    Solutions: "solutions",
    Industries: "industries",
    Resources: "resources",
    "About us": "about",
  };
  for (const item of registry.nav.primary) {
    const want = KIND_BY_LABEL[item.label] ?? "link";
    if (item.kind !== want)
      err("nav-kind", item.label, `Primary item ${item.label} must be of kind ${want}`);
  }
  const placed = new Map<string, string>();
  const place = (id: string, where: string, expectTypes: string[]) => {
    const node = registry.nodes.get(id);
    if (!node) return err("nav-entity", where, `Unknown entity ${id}`);
    if (!expectTypes.includes(node.type))
      err(
        "nav-entity-type",
        where,
        `${id} is a ${node.type}, not one of ${expectTypes.join(", ")}`,
      );
    if (placed.has(id)) err("nav-duplicate", where, `${id} is also placed in ${placed.get(id)}`);
    placed.set(id, where);
    const path = publishedPath(node, registry);
    if (path) link("nav", path);
  };
  const TECH_TYPES = [
    "technology",
    "platform",
    "language",
    "framework",
    "provider",
    "tool",
    "integration",
  ];
  for (const c of registry.nav.technologies.categories)
    for (const id of c.items) place(id, `technologies/${c.id}`, TECH_TYPES);
  for (const p of registry.pages.filter((x) => x.kind === "technology"))
    if (!placed.has(p.entityId ?? ""))
      err(
        "nav-tech-missing",
        p.path,
        "Technology page is not placed in a Technologies menu category",
      );
  for (const [key, type] of [
    ["solutions", "solution"],
    ["industries", "industry"],
  ] as const) {
    const seen = new Set<string>();
    for (const i of registry.nav[key].items) {
      const node = registry.nodes.get(i.id);
      if (!node || node.type !== type)
        err("nav-entity", `${key}/${i.id}`, `${i.id} is not a ${type} entity`);
      if (seen.has(i.id)) err("nav-duplicate", `${key}/${i.id}`, "Placed twice");
      seen.add(i.id);
      const path = node ? publishedPath(node, registry) : null;
      if (path) link("nav", path);
    }
    for (const p of registry.pages.filter((x) => x.kind === type))
      if (!seen.has(p.entityId ?? ""))
        err("nav-missing", p.path, `${type} page is not placed in the ${key} menu`);
  }
  placed.clear();
  for (const g of registry.nav.work.groups)
    for (const id of g.items) place(id, `work/${g.id}`, ["work-area"]);
  for (const p of registry.pages.filter((x) => x.kind === "work-area"))
    if (!placed.has(p.entityId ?? ""))
      err("nav-work-missing", p.path, "Work Area page is not placed in a Work menu group");

  for (const s of registry.services) {
    const p = entityPath(registry.nodes.get(s.id)!, registry);
    if (p && pathExists(p, registry)) {
      link("nav", p);
      link("footer", p);
    }
  }
  // The blog listing on /resources/ links every published article.
  const resources = registry.pageByPath.get("/resources/");
  if (resources?.sections.some((b) => b.type === "articles" || b.type === "library"))
    for (const p of registry.pages) if (p.kind === "article") link("/resources/", p.path);
  // Every case study is linked from the portfolio grid on Our Work.
  for (const p of registry.pages) if (p.kind === "case-study") link("/work/", p.path);
  for (const page of registry.pages) {
    if (page.path === "/") continue;
    if (!inbound.get(page.path) || inbound.get(page.path)!.size === 0)
      err("orphan", page.path, "Page has no inbound internal link");
  }

  /* ---- pages that must not be clones of each other ---- */
  for (const [kind, config] of [
    ["service", SERVICE_SIMILARITY],
    ["work-area", WORK_SIMILARITY],
    ["technology", TECH_SIMILARITY],
    ["solution", SOLUTION_SIMILARITY],
    ["industry", INDUSTRY_SIMILARITY],
    ["location", LOCATION_SIMILARITY],
  ] as const) {
    const group = registry.pages.filter((p) => p.kind === kind);
    for (const i of similarityIssues(group, registry.facts, config))
      err("similarity", `${i.a} and ${i.b}`, i.message);
  }

  /* ---- related blocks must be backed by graph edges ---- */
  for (const page of registry.pages) {
    if (!page.entityId) continue;
    const linked = new Set<string>();
    for (const r of registry.relations) {
      if (r.from === page.entityId) linked.add(r.to);
      if (r.to === page.entityId) linked.add(r.from);
    }
    for (const b of page.sections) {
      if (b.type !== "related") continue;
      for (const g of b.groups)
        for (const id of g.entityIds)
          if (!linked.has(id))
            err(
              "related-no-edge",
              `${page.path} :: ${b.id}`,
              `${id} has no relation to ${page.entityId}`,
            );
    }
  }

  void warn;
  return issues;
}

function checkBlock(
  b: Block,
  page: Page,
  registry: Registry,
  err: (code: string, where: string, message: string) => void,
  link: (from: string, to: string) => void,
) {
  const where = `${page.path} :: ${b.id}`;
  const entityIds: string[] = [];
  if (b.type === "entities") for (const g of b.groups) entityIds.push(...g.entityIds);
  if (b.type === "related") for (const g of b.groups) entityIds.push(...g.entityIds);
  if (b.type === "index") for (const i of b.items) if (i.ref) entityIds.push(i.ref);
  for (const id of entityIds)
    if (!registry.nodes.has(id)) err("block-entity", where, `Unknown entity ${id}`);
  if (b.type === "statement" && !registry.facts.has(b.factId))
    err("statement-fact", where, `Unknown fact ${b.factId}`);
  if (b.type === "table") {
    for (const row of b.rows)
      if (row.length !== b.columns.length)
        err("table-shape", where, "Row length differs from column count");
  }
  if (b.type === "cta") {
    for (const c of [b.primary, b.secondary]) {
      if (!c) continue;
      const base = c.href.split(/[?#]/)[0] ?? "";
      if (!pathExists(base, registry))
        err("cta-path", where, `CTA points to missing page ${c.href}`);
      else link(page.path, base);
    }
  }
  if (b.type === "pathfinder") {
    for (const p of b.paths) {
      const base = p.href.split(/[?#]/)[0] ?? "";
      if (!pathExists(base, registry))
        err("path-missing", where, `Pathway "${p.need}" points to missing page ${p.href}`);
      else link(page.path, base);
    }
  }
  if (b.type === "chooser") {
    for (const o of b.options)
      if (o.cta) {
        const base = o.cta.href.split(/[?#]/)[0] ?? "";
        if (!pathExists(base, registry))
          err("cta-path", where, `Option CTA points to missing page ${o.cta.href}`);
        else link(page.path, base);
      }
  }
  if (b.type === "index") {
    for (const i of b.items)
      if (i.href) {
        if (!pathExists(i.href, registry))
          err("index-href", where, `Row "${i.title}" points to missing page ${i.href}`);
        else link(page.path, i.href);
      }
  }
  if (b.type === "hero") {
    for (const c of b.ctas) {
      if (c.href.startsWith("#")) {
        const target = c.href.slice(1);
        if (!page.sections.some((s) => s.id === target))
          err("hero-anchor", where, `Anchor ${c.href} has no matching section`);
        continue;
      }
      const base = c.href.split(/[?#]/)[0] ?? "";
      if (!pathExists(base, registry))
        err("cta-path", where, `CTA points to missing page ${c.href}`);
      else link(page.path, base);
    }
  }
  // Service links produced by entity ids in blocks count toward inbound links when published.
  for (const id of entityIds) {
    const node = registry.nodes.get(id);
    const p = node ? entityPath(node, registry) : null;
    if (p && pathExists(p, registry)) link(page.path, p);
  }
}
