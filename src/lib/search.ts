/**
 * Site search: a static index built from the registry and a small, dependency-free matcher.
 * The index lists published pages only, so a result is always a real destination. It is served as
 * one cached JSON file; no cookies, no external service, no query leaves the browser.
 */
import type { Registry } from "./content/load";

export type SearchEntry = {
  /** Display title. */
  t: string;
  /** Path. */
  p: string;
  /** Kind label shown next to the result. */
  k: string;
  /** One-line description. */
  d: string;
  /** Extra search terms (intent, aliases, category). Not displayed. */
  w: string;
};

const KIND_LABEL: Record<string, string> = {
  home: "Home",
  service: "Service",
  technology: "Technology",
  "work-area": "Work Area",
  "work-hub": "Work",
  hub: "Directory",
  company: "Company",
  contact: "Contact",
  legal: "Legal",
};

export function buildSearchEntries(registry: Registry): SearchEntry[] {
  const techCategory = new Map<string, string>();
  for (const c of registry.nav.technologies.categories)
    for (const id of c.items) techCategory.set(id, c.label);
  const workGroup = new Map<string, string>();
  for (const g of registry.nav.work.groups) for (const id of g.items) workGroup.set(id, g.label);

  return registry.pages
    .filter((p) => p.indexing === "index")
    .map((p) => {
      const node = p.entityId ? registry.nodes.get(p.entityId) : undefined;
      const service = node?.primaryService ? registry.nodes.get(node.primaryService) : undefined;
      const terms = [
        p.intent.primary,
        ...p.intent.secondary,
        node?.name ?? "",
        service?.name ?? "",
        techCategory.get(p.entityId ?? "") ?? "",
        workGroup.get(p.entityId ?? "") ?? "",
      ];
      return {
        t: p.breadcrumbLabel,
        p: p.path,
        k: KIND_LABEL[p.kind] ?? "Page",
        d: p.description,
        w: terms.filter(Boolean).join(" "),
      };
    })
    .sort((a, b) => a.p.localeCompare(b.p));
}

/** Lowercase and strip punctuation, so "Next.js", "next js", and "nextjs" all match. */
export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const words = (s: string) =>
  s
    .toLowerCase()
    .split(/[\s/,&-]+/)
    .filter(Boolean);

const KIND_RANK: Record<string, number> = {
  Service: 6,
  Technology: 5,
  "Work Area": 5,
  Directory: 4,
  Work: 4,
  Company: 3,
  Contact: 2,
  Home: 1,
  Legal: 0,
};

/** Every query word must match; the title counts most, then extra terms, then the description. */
export function searchEntries(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const tokens = words(query).map(normalize).filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { e: SearchEntry; score: number }[] = [];
  for (const e of entries) {
    const title = normalize(e.t);
    const titleWords = words(e.t).map(normalize);
    const termWords = words(e.w).map(normalize);
    const desc = normalize(e.d);
    let score = 0;
    let ok = true;
    for (const tok of tokens) {
      if (title === tok) score += 100;
      else if (titleWords.some((w) => w.startsWith(tok)) || title.startsWith(tok)) score += 60;
      else if (title.includes(tok)) score += 35;
      else if (termWords.some((w) => w.startsWith(tok))) score += 30;
      else if (normalize(e.w).includes(tok)) score += 18;
      else if (desc.includes(tok)) score += 8;
      else {
        ok = false;
        break;
      }
    }
    if (ok) scored.push({ e, score: score + (KIND_RANK[e.k] ?? 0) });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.e.t.length - b.e.t.length || a.e.p.localeCompare(b.e.p))
    .slice(0, limit)
    .map((s) => s.e);
}
