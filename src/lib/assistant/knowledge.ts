/**
 * The assistant's approved knowledge, built from the site's own content and entity graph (no
 * second knowledge base). Every item is a published page: its name, path, and the plain answers
 * the page already gives (what we do, the problem, who it helps, how to choose). The assistant may
 * recommend only these ids, and links are built here, never by the model. Server-only.
 */
import { getRegistry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { DESCRIPTOR, SITE_NAME } from "@/lib/site";

export type KnowledgeKind = "service" | "solution" | "work-area" | "industry" | "technology";

export type KnowledgeItem = {
  id: string;
  kind: KnowledgeKind;
  name: string;
  path: string;
  what: string;
  problem: string;
  audience: string;
  choose: string;
  next: string;
  keywords: string[];
};

const KINDS = new Set<KnowledgeKind>([
  "service",
  "solution",
  "work-area",
  "industry",
  "technology",
]);

let cache: KnowledgeItem[] | null = null;

export function knowledge(): KnowledgeItem[] {
  if (cache) return cache;
  const registry = getRegistry();
  const items: KnowledgeItem[] = [];
  for (const p of registry.pages as Page[]) {
    if (!KINDS.has(p.kind as KnowledgeKind) || !p.entityId || !p.comprehension) continue;
    const c = p.comprehension;
    items.push({
      id: p.entityId,
      kind: p.kind as KnowledgeKind,
      name: p.breadcrumbLabel,
      path: p.path,
      what: c.what,
      problem: c.problem,
      audience: c.audience,
      choose: c.choose,
      next: c.next,
      keywords: [p.breadcrumbLabel, p.intent.primary, ...p.intent.secondary].map((k) =>
        k.toLowerCase(),
      ),
    });
  }
  cache = items;
  return items;
}

export function byId(id: string): KnowledgeItem | undefined {
  return knowledge().find((k) => k.id === id);
}

/** Approved company facts only (the facts register). */
export function companyFacts(): string[] {
  const facts = getRegistry().facts;
  const out = [`${SITE_NAME}: ${DESCRIPTOR}.`];
  for (const key of ["company.statement", "company.positioning", "company.breadth"]) {
    const v = facts.get(key)?.value;
    if (v) out.push(v);
  }
  out.push(
    "DECHY is a global company and works with clients remotely, across time zones. It has no local offices.",
  );
  return out;
}

const STOP = new Set(
  "a an and are as at be but by can do does for from have how i if in into is it its me my need needs of on or our so that the their them they this to us want we what when where which who why will with without you your".split(
    " ",
  ),
);

export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Singular and plural count as the same word ("agent", "agents"). */
const stem = (w: string) =>
  w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w;

/** Simple, explainable relevance: phrase matches on keywords, then word overlap. */
export function rank(
  text: string,
  kinds?: KnowledgeKind[],
): { item: KnowledgeItem; score: number }[] {
  const lower = ` ${text.toLowerCase()} `;
  const words = new Set(tokens(text).map(stem));
  const out: { item: KnowledgeItem; score: number }[] = [];
  for (const item of knowledge()) {
    if (kinds && !kinds.includes(item.kind)) continue;
    let score = 0;
    for (const k of item.keywords)
      if (k.length > 3 && (lower.includes(` ${k} `) || lower.includes(` ${stem(k)} `))) score += 6;
    const vocab = new Set(
      tokens(`${item.keywords.join(" ")} ${item.problem} ${item.what}`).map(stem),
    );
    for (const w of words)
      if (vocab.has(w)) score += item.keywords.some((k) => k.includes(w)) ? 2 : 1;
    for (const cue of CUES) if (cue.pattern.test(text)) score += cue.boost[item.id] ?? 0;
    if (item.kind === "service") score *= 1.15;
    if (score > 0) out.push({ item, score });
  }
  return out.sort((a, b) => b.score - a.score);
}

/**
 * How people describe a problem often matters more than the nouns in it: "we copy orders from the
 * store into accounting by hand" is about automation and integration, not about building a store.
 */
const CUES: { pattern: RegExp; boost: Record<string, number> }[] = [
  {
    pattern:
      /\b(by hand|manual(ly)?|copy(ing)?|re-?typ\w*|re-?enter\w*|chas(e|ing)|repetitive|over and over|every (day|week)|same tasks?)\b/i,
    boost: { "svc.automation": 9, "sol.business-process-automation": 7, "svc.api-integration": 3 },
  },
  {
    pattern:
      /\b(connect\w*|integrat\w*|sync\w*|talk to each other|between (our|the|two)|into (the|our)|from (the|our) \w+ (into|to))\b/i,
    boost: { "svc.api-integration": 9, "sol.crm-integration": 3, "svc.automation": 2 },
  },
  {
    pattern: /\b(report(s|ing)?|dashboards?|numbers|figures|kpis?|spreadsheets? to report)\b/i,
    boost: { "svc.data-analytics": 6, "sol.business-dashboards": 6 },
  },
  {
    pattern: /\b(old|legacy|outdated|unsupported|nobody understands)\b.*\b(system|software|app)\b/i,
    boost: { "sol.legacy-system-modernization": 8, "svc.software-development": 3 },
  },
  {
    pattern: /\b(sell online|new (online )?store|start selling|open a shop|checkout)\b/i,
    boost: { "svc.ecommerce": 8 },
  },
];

/** Compact catalog for the model prompt: ids it may recommend, with the approved descriptions. */
export function catalogForPrompt(): string {
  const group = (kind: KnowledgeKind, detail: boolean) =>
    knowledge()
      .filter((k) => k.kind === kind)
      .map((k) =>
        detail
          ? `- ${k.id} | ${k.name} | ${k.what} Problem: ${k.problem}`
          : `- ${k.id} | ${k.name}`,
      )
      .join("\n");
  return [
    "SERVICES (what DECHY does):",
    group("service", true),
    "",
    "SOLUTIONS (business problems DECHY solves):",
    group("solution", true),
    "",
    "WORK AREAS (kinds of system DECHY builds):",
    group("work-area", false),
    "",
    "INDUSTRIES:",
    group("industry", false),
    "",
    "TECHNOLOGIES:",
    group("technology", false),
  ].join("\n");
}

/** The catalog item for a page path, if the visitor is on one. */
export function byPath(path: string): KnowledgeItem | undefined {
  const p = path.endsWith("/") ? path : `${path}/`;
  return knowledge().find((k) => k.path === p);
}

export type PageContext = {
  id: string;
  name: string;
  kind: KnowledgeKind;
  path: string;
  /** A first-state suggestion that fits this kind of page (an offer, not a question asked). */
  suggestion: { label: string; message: string };
};

/** Page awareness: what the visitor is looking at, worded for its kind of page. */
export function pageContext(path: string | undefined): PageContext | null {
  if (!path) return null;
  const item = byPath(path);
  if (!item) return null;
  const n = item.name;
  const suggestion =
    item.kind === "service"
      ? {
          label: `Questions about ${n}?`,
          message: `I'd like to know how DECHY could help us with ${n}.`,
        }
      : item.kind === "technology"
        ? {
            label: `Is ${n} right for us?`,
            message: `We're considering ${n}. Is it the right choice for what we need?`,
          }
        : item.kind === "solution"
          ? {
              label: `Does ${n} fit our situation?`,
              message: `Could ${n} help us? I'd like to understand whether it fits our situation.`,
            }
          : item.kind === "industry"
            ? {
                label: `Systems for ${n.toLowerCase()}`,
                message: `What could DECHY build for a ${n.toLowerCase()} organization like ours?`,
              }
            : {
                label: `What would ${n} take?`,
                message: `What would it take to build ${n.toLowerCase()} for us?`,
              };
  return { id: item.id, name: n, kind: item.kind, path: item.path, suggestion };
}
