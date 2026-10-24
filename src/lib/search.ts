/**
 * Search indexes, built at build time from the registry and served as static JSON files. No
 * cookies, no external service, and no query ever leaves the browser.
 *
 * - The site index (/search-index.json) lists every published page, each page's questions, and
 *   the team, with a short text excerpt per page for snippets. It stays small for the header.
 * - The articles index (/articles-index.json) holds the full text of every article, for the
 *   Resources search.
 * Matching runs in the browser with `SearchIndex` (search-engine.ts).
 */
import { bodyCopy } from "./content/clarity";
import { toPlainText } from "./content/inline";
import type { Registry } from "./content/load";
import type { Page } from "./content/schema";
import { tokenize } from "./search-engine";
import { siteIndex, type ArticleEntry, type SearchEntry } from "./search-indexes";

export type { ArticleEntry, SearchEntry };

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
  solution: "Solution",
  industry: "Industry",
  location: "Location",
  "case-study": "Case study",
};

export const ARTICLE_CATEGORY: Record<string, string> = {
  guide: "Guide",
  decision: "Decision guide",
  explainer: "Explainer",
  industry: "Industry note",
  comparison: "Comparison",
  cost: "Cost guide",
};

const kindOf = (p: Page) =>
  p.kind === "article"
    ? (ARTICLE_CATEGORY[p.article?.category ?? ""] ?? "Article")
    : (KIND_LABEL[p.kind] ?? "Page");

/** Plain text, cut at a word boundary. */
const cut = (s: string, n: number) =>
  s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")}...`;

export function buildSearchEntries(registry: Registry): SearchEntry[] {
  const plain = (s: string) => toPlainText(s, registry.facts);
  const techCategory = new Map<string, string>();
  for (const c of registry.nav.technologies.categories)
    for (const id of c.items) techCategory.set(id, c.label);
  const workGroup = new Map<string, string>();
  for (const g of registry.nav.work.groups) for (const id of g.items) workGroup.set(id, g.label);

  const out: SearchEntry[] = [];
  const seenQuestions = new Set<string>();
  for (const p of registry.pages.filter((x) => x.indexing === "index")) {
    const node = p.entityId ? registry.nodes.get(p.entityId) : undefined;
    const service = node?.primaryService ? registry.nodes.get(node.primaryService) : undefined;
    const headings = p.sections
      .map((b) => ("heading" in b && typeof b.heading === "string" ? plain(b.heading) : ""))
      .filter(Boolean);
    const terms = [
      p.intent.primary,
      ...p.intent.secondary,
      node?.name ?? "",
      service?.name ?? "",
      techCategory.get(p.entityId ?? "") ?? "",
      workGroup.get(p.entityId ?? "") ?? "",
      ...headings,
    ];
    const text =
      p.kind === "article" ? (p.article?.summary ?? "") : bodyCopy(p, registry.facts).join(" ");
    out.push({
      t: p.breadcrumbLabel,
      p: p.path,
      k: kindOf(p),
      d: plain(p.description),
      w: terms.filter(Boolean).join(" "),
      x: cut(plain(text), 1400),
    });
    // Each question is its own result, linked to the questions on its page.
    for (const b of p.sections) {
      if (b.type !== "faq") continue;
      for (const item of b.items) {
        const q = plain(item.q);
        const a = plain(item.a);
        if (seenQuestions.has(q + a)) continue;
        seenQuestions.add(q + a);
        out.push({
          t: q,
          p: `${p.path}#${b.id}`,
          k: "FAQ",
          d: cut(a, 400),
          w: p.breadcrumbLabel,
          x: "",
        });
      }
    }
    // The team, by name, role, and skills.
    for (const b of p.sections) {
      if (b.type !== "team") continue;
      for (const m of b.members)
        out.push({
          t: m.name,
          p: `${p.path}#${b.id}`,
          k: "Team",
          d: `${m.role}. ${m.owns}`,
          w: m.focus.join(" "),
          x: "",
        });
    }
  }
  return out.sort((a, b) => a.p.localeCompare(b.p) || a.t.localeCompare(b.t));
}

export function buildArticleEntries(registry: Registry): ArticleEntry[] {
  return registry.pages
    .filter((p) => p.kind === "article" && p.indexing === "index")
    .map((p) => ({
      t: p.breadcrumbLabel,
      p: p.path,
      c: p.article?.category ?? "guide",
      cl: kindOf(p),
      d: toPlainText(p.article?.summary ?? p.description, registry.facts),
      x: bodyCopy(p, registry.facts).join(" "),
    }))
    .sort((a, b) => a.p.localeCompare(b.p));
}

/** Lowercase and strip punctuation, so "Next.js", "next js", and "nextjs" compare equal. */
export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** Ranked site results (used by tests and by the dialog). */
export function searchEntries(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  return siteIndex(entries)
    .search(query)
    .hits.slice(0, limit)
    .map((h) => entries[h.doc]!);
}

export { tokenize };
