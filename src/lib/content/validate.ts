/**
 * Content and graph validation (AGENTS 62 and 63). Pure functions over a loaded Registry, so the
 * same rules run in the CLI (npm run validate, part of every build), in unit tests, and in CI.
 * A rule that fails an `error` fails the build; this is how the architecture is enforced.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { breadcrumbsFor } from "./breadcrumbs";
import { expandFacts, linkTargets, toPlainText } from "./inline";
import type { Registry } from "./load";
import type { Block, Page } from "./schema";
import { entityPath, pathExists } from "./urls";
import { buildGraph } from "@/lib/seo/structured-data";
import { DESCRIPTOR } from "@/lib/site";

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

const APPROVED_NAV = [
  "Services",
  "Solutions",
  "Technologies",
  "Industries",
  "Work",
  "Resources",
  "Company",
];

const SKIP_KEYS = new Set([
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
  /\bcase stud(?:y|ies)\b/i,
  /\b\d[\d,]*\+?\s+(?:clients|customers|projects|years)\b/i,
  /\btrusted by\b/i,
];

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function validateRegistry(registry: Registry): Issue[] {
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
    if (r.type === "offersSolution" && t !== "solution")
      err("relation-type", where, "offersSolution must target a solution");
    if ((r.type === "addressesProblem" || r.type === "solves") && t !== "problem")
      err("relation-type", where, `${r.type} must target a problem`);
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
    for (const s of strings) {
      const label = `${where} :: ${s.slice(0, 50)}`;
      if (DASHES.test(s)) err("dash", label, "Contains an em or en dash (AGENTS 1A.16)");
      if (EMOJI.test(s)) err("emoji", label, "Contains an emoji");
      for (const re of BANNED_PHRASES) if (re.test(s)) err("banned-phrase", label, `Matches ${re}`);
      for (const re of WRONG_DESCRIPTOR)
        if (re.test(s)) err("descriptor", label, `Non-approved descriptor wording (${re})`);
      for (const re of UNSUPPORTED)
        if (re.test(s)) err("unsupported-claim", label, `Unsupported claim wording (${re})`);
      // The company statistic and history may only come from the facts register.
      if (/1,?500|\b2010\b/.test(s.replace(/\{\{fact:[^}]+\}\}/g, ""))) {
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
    const minVariety = page.kind === "home" || page.kind === "service" ? 8 : 1;
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
  ]) {
    if (!registry.assets.some((a) => a.id === `asset.fig-${figure}`))
      err("asset-figure", figure, "Diagram has no registry entry");
  }

  /* ---- navigation and orphan check ---- */
  const primaryLabels = registry.nav.primary.map((i) => i.label);
  if (JSON.stringify(primaryLabels) !== JSON.stringify(APPROVED_NAV))
    err("nav-approved", "nav.yaml", `Primary navigation must be ${APPROVED_NAV.join(", ")}`);
  if (registry.nav.cta.label !== "Talk to DECHY")
    err("nav-cta", "nav.yaml", "CTA must be Talk to DECHY");
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
  for (const s of registry.services) {
    const p = entityPath(registry.nodes.get(s.id)!, registry);
    if (p && pathExists(p, registry)) {
      link("nav", p);
      link("footer", p);
    }
  }
  for (const page of registry.pages) {
    if (page.path === "/") continue;
    if (!inbound.get(page.path) || inbound.get(page.path)!.size === 0)
      err("orphan", page.path, "Page has no inbound internal link");
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
