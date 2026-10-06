/**
 * Clarity and comprehension checks (docs/design/clarity-and-comprehension-standard.md, ADR 0004).
 * Pure functions over page records, shared by the build validator and the unit tests.
 *
 * What is enforced mechanically: jargon is explained the first time it is used in body copy,
 * sentences stay readable, diagrams state their purpose and takeaway and have a caption that
 * says what they show, and diagram labels stay short. What cannot be enforced mechanically (is the
 * explanation actually good?) is covered by the per-page comprehension record and review.
 */
import { expandFacts, toPlainText } from "./inline";
import type { Fact, Page } from "./schema";

/** Keys whose values are headings or labels rather than explanatory copy. */
const LABEL_KEYS = new Set([
  "heading",
  "headline",
  "label",
  "eyebrow",
  "title",
  "need",
  "when",
  "choose",
  "question",
  "q",
  "action",
  "supportLabel",
  "layerLabel",
  "hubLabel",
  "visualTitle",
  "variant",
  "kind",
]);
const SKIP_KEYS = new Set([
  "id",
  "type",
  "tone",
  "figure",
  "style",
  "numbered",
  "href",
  "ref",
  "entityIds",
  "factId",
  "asset",
  "layout",
  "position",
  "purpose",
  "columns_count",
]);

/** Explanatory copy in reading order: hero text, the at-a-glance answers, then the blocks. */
export function bodyCopy(page: Page, facts: Map<string, Fact>): string[] {
  const out: string[] = [];
  const push = (s: string) => {
    try {
      out.push(toPlainText(s, facts));
    } catch {
      out.push(s);
    }
  };
  const walk = (value: unknown, key = "") => {
    if (typeof value === "string") {
      if (!LABEL_KEYS.has(key) && !SKIP_KEYS.has(key)) push(value);
    } else if (Array.isArray(value)) {
      for (const v of value) walk(v, key);
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, k);
    }
  };
  const [first, ...rest] = page.sections;
  if (first?.type === "hero") walk(first);
  if (page.lead) push(page.lead);
  if (page.comprehension) walk(page.comprehension);
  for (const b of first?.type === "hero" ? rest : page.sections) walk(b);
  return out;
}

/** Jargon a general visitor may not know. Each needs a plain explanation where first used. */
export const JARGON: { term: string; pattern: RegExp }[] = [
  { term: "API", pattern: /\bAPIs?\b/ },
  { term: "CRM", pattern: /\bCRM\b/ },
  { term: "ERP", pattern: /\bERP\b/ },
  { term: "SaaS", pattern: /\bSaaS\b/ },
  { term: "CI/CD", pattern: /\bCI\/CD\b/ },
  { term: "DevOps", pattern: /\bDevOps\b/ },
  { term: "RAG", pattern: /\bRAG\b/ },
  { term: "LLM", pattern: /\bLLMs?\b/ },
  { term: "OWASP", pattern: /\bOWASP\b/ },
  { term: "ETL", pattern: /\bETL\b/ },
  { term: "SEO", pattern: /\bSEO\b/ },
  { term: "AEO", pattern: /\bAEO\b/ },
  { term: "GEO", pattern: /\bGEO\b/ },
  { term: "CMS", pattern: /\bCMS\b/ },
  { term: "MVP", pattern: /\bMVP\b/ },
  { term: "PWA", pattern: /\bPWAs?\b/ },
  { term: "MFA", pattern: /\bMFA\b/ },
  { term: "IAM", pattern: /\bIAM\b/ },
  { term: "SSO", pattern: /\bSSO\b/ },
  { term: "KPI", pattern: /\bKPIs?\b/ },
  { term: "UX", pattern: /\bUX\b/ },
  { term: "UI", pattern: /\bUI\b/ },
  { term: "RPA", pattern: /\bRPA\b/ },
  { term: "GDPR", pattern: /\bGDPR\b/ },
  { term: "SLA", pattern: /\bSLAs?\b/ },
];

/**
 * A term counts as explained when, right where it is first used, the sentence says what it is:
 * "an API (a way for ...)", "an API, which ...", "an API is ...", "called ...", "short for ...",
 * or the full name appears with it ("customer relationship management (CRM)").
 */
const EXPLAINED_AFTER =
  /^\s*(\([^)]{6,}\)|,\s+(which|a|an|the|short|also)\b|\s+(is|are|means|stands for)\b|:\s)/i;
const EXPLAINED_BEFORE = /(called|known as|short for|stands for|or|the)\s*$/i;

export function glossaryIssues(page: Page, facts: Map<string, Fact>): string[] {
  const copy = bodyCopy(page, facts);
  const issues: string[] = [];
  for (const { term, pattern } of JARGON) {
    for (const text of copy) {
      const m = pattern.exec(text);
      if (!m) continue;
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 160);
      const before = text.slice(Math.max(0, m.index - 40), m.index);
      // Full name written out directly before the abbreviation: "management (CRM)".
      const fullNameFirst = /\(\s*$/.test(before);
      if (!EXPLAINED_AFTER.test(after) && !fullNameFirst && !EXPLAINED_BEFORE.test(before)) {
        issues.push(`${term} is used without a plain explanation: "${text.slice(0, 70)}"`);
      }
      break; // only the first body use per term matters
    }
  }
  return issues;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?]["')\]]*)\s+(?=[A-Z0-9"'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const MAX_SENTENCE_WORDS = 40;
export const MAX_AVERAGE_WORDS = 21;

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function readabilityIssues(
  page: Page,
  facts: Map<string, Fact>,
): { errors: string[]; average: number } {
  const errors: string[] = [];
  let total = 0;
  let count = 0;
  for (const para of bodyCopy(page, facts)) {
    for (const s of sentences(para)) {
      const n = words(s);
      // The approved company statement is a single long sentence that must not change.
      if (s.startsWith("Since 2010, DECHY has helped")) continue;
      total += n;
      count += 1;
      if (n > MAX_SENTENCE_WORDS) errors.push(`${n}-word sentence: "${s.slice(0, 80)}..."`);
    }
  }
  const average = count ? total / count : 0;
  if (average > MAX_AVERAGE_WORDS)
    errors.push(`average sentence length ${average.toFixed(1)} words (limit ${MAX_AVERAGE_WORDS})`);
  return { errors, average };
}

/** A caption must say what the diagram shows. */
export const CAPTION_VERB =
  /\b(shows?|compares?|traces?|maps?|explains?|walks? through|contrasts?|lays? out|illustrates?|sets? out|follows?|breaks? down|pictures?|puts|lists?)\b/i;

export function diagramIssues(page: Page): string[] {
  const issues: string[] = [];
  const check = (
    where: string,
    parts: { figure?: unknown; spec?: unknown; takeaway?: string; caption?: string },
  ) => {
    if (Boolean(parts.figure) === Boolean(parts.spec))
      issues.push(`${where}: a diagram needs exactly one of figure or spec`);
    if (!parts.takeaway || parts.takeaway.trim().length < 20)
      issues.push(`${where}: a diagram needs a one-sentence takeaway`);
    if (!parts.caption || !CAPTION_VERB.test(parts.caption))
      issues.push(`${where}: the caption must say what the diagram shows`);
    const spec = parts.spec as
      | {
          kind: string;
          [k: string]: unknown;
        }
      | undefined;
    if (spec) {
      const labels: { title?: string; text?: string }[] = [];
      const collect = (xs: unknown) => {
        if (Array.isArray(xs))
          for (const x of xs) labels.push(x as { title?: string; text?: string });
      };
      collect(spec.steps);
      collect(spec.stages);
      collect(spec.spokes);
      if (Array.isArray(spec.layers))
        for (const l of spec.layers as { title: string; text?: string; support?: unknown[] }[]) {
          labels.push(l);
          collect(l.support);
        }
      for (const side of ["before", "after"] as const) {
        const part = spec[side] as { nodes?: unknown } | undefined;
        if (part) collect(part.nodes);
      }
      for (const l of labels) {
        if ((l.title ?? "").length > 48)
          issues.push(`${where}: label too long for a diagram ("${l.title}")`);
        if ((l.text ?? "").length > 150)
          issues.push(`${where}: diagram text too long ("${(l.text ?? "").slice(0, 40)}...")`);
      }
    }
  };
  for (const b of page.sections) {
    if (b.type === "diagram")
      check(`${page.path} :: ${b.id}`, {
        figure: b.figure,
        spec: b.spec,
        takeaway: b.takeaway,
        caption: b.caption,
      });
    if (b.type === "hero" && (b.figure || b.spec))
      check(`${page.path} :: ${b.id}`, {
        figure: b.figure,
        spec: b.spec,
        takeaway: b.takeaway,
        caption: b.figureCaption,
      });
  }
  return issues;
}

/** Visible text of every explanatory string, for similarity measures (no facts macros). */
export function pageWords(page: Page, facts: Map<string, Fact>): string[] {
  return bodyCopy(page, facts)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export { expandFacts };
