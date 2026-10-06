/**
 * Similarity control for pages that must not be clones of each other (owner requirement).
 * Detects: identical or near-identical block sequences, repeated headings, copy-paste text,
 * identical diagrams, and identical decision structures. Thresholds are deliberately generous:
 * the aim is to catch templated copies, not to force artificial differences.
 */
import { pageWords } from "./clarity";
import type { Fact, Page } from "./schema";

export type SimilarityConfig = {
  /** Maximum normalized similarity (0 to 1) between two block-type sequences. */
  maxSequence: number;
  /** Maximum Jaccard overlap of 5-word shingles between two pages' copy. */
  maxShingle: number;
  /** Maximum number of identical headings shared by two pages. */
  maxSharedHeadings: number;
};

export const SERVICE_SIMILARITY: SimilarityConfig = {
  maxSequence: 0.82,
  maxShingle: 0.06,
  maxSharedHeadings: 1,
};
export const TECH_SIMILARITY: SimilarityConfig = {
  maxSequence: 0.95,
  maxShingle: 0.05,
  maxSharedHeadings: 2,
};
export const WORK_SIMILARITY: SimilarityConfig = {
  maxSequence: 0.92,
  maxShingle: 0.07,
  maxSharedHeadings: 2,
};

/** Normalized edit-distance similarity of two sequences (1 means identical). */
export function sequenceSimilarity(a: string[], b: string[]): number {
  const n = a.length;
  const m = b.length;
  if (n === 0 && m === 0) return 1;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) => [i, ...Array(m).fill(0)]);
  for (let j = 0; j <= m; j++) dp[0]![j] = j;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return 1 - dp[n]![m]! / Math.max(n, m);
}

function shingles(words: string[], size = 5): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i + size <= words.length; i++) out.add(words.slice(i, i + size).join(" "));
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

const headingsOf = (page: Page): string[] =>
  page.sections.flatMap((b) =>
    "heading" in b && typeof b.heading === "string" ? [b.heading.toLowerCase()] : [],
  );

/** A diagram's identity: its named figure, or its spec content. */
const diagramKeys = (page: Page): string[] =>
  page.sections.flatMap((b) => {
    if (b.type !== "diagram" && b.type !== "hero") return [];
    if (b.figure) return [`figure:${b.figure}`];
    if (b.spec) return [`spec:${JSON.stringify(b.spec)}`];
    return [];
  });

const takeawaysOf = (page: Page): string[] =>
  page.sections.flatMap((b) =>
    (b.type === "diagram" || b.type === "hero") && b.takeaway ? [b.takeaway.toLowerCase()] : [],
  );

const choosersOf = (page: Page): string[] =>
  page.sections.flatMap((b) =>
    b.type === "chooser"
      ? [
          b.options
            .map((o) => o.label.toLowerCase())
            .sort()
            .join("|"),
        ]
      : [],
  );

export type SimilarityIssue = { a: string; b: string; message: string };

export function similarityIssues(
  pages: Page[],
  facts: Map<string, Fact>,
  config: SimilarityConfig,
): SimilarityIssue[] {
  const issues: SimilarityIssue[] = [];
  const prepared = pages.map((p) => ({
    page: p,
    seq: p.sections.map((s) => s.type as string),
    shingles: shingles(pageWords(p, facts)),
    headings: new Set(headingsOf(p)),
    diagrams: new Set(diagramKeys(p)),
    takeaways: new Set(takeawaysOf(p)),
    choosers: new Set(choosersOf(p)),
  }));
  for (let i = 0; i < prepared.length; i++)
    for (let j = i + 1; j < prepared.length; j++) {
      const x = prepared[i]!;
      const y = prepared[j]!;
      const pair = { a: x.page.path, b: y.page.path };
      const seq = sequenceSimilarity(x.seq, y.seq);
      if (seq > config.maxSequence)
        issues.push({ ...pair, message: `block sequences are ${(seq * 100).toFixed(0)}% alike` });
      const sh = jaccard(x.shingles, y.shingles);
      if (sh > config.maxShingle)
        issues.push({ ...pair, message: `copy overlaps ${(sh * 100).toFixed(1)}% (5-word runs)` });
      const sharedHeadings = [...x.headings].filter((h) => y.headings.has(h));
      if (sharedHeadings.length > config.maxSharedHeadings)
        issues.push({ ...pair, message: `shares headings: ${sharedHeadings.join("; ")}` });
      for (const d of x.diagrams)
        if (y.diagrams.has(d)) issues.push({ ...pair, message: "uses an identical diagram" });
      for (const t of x.takeaways)
        if (y.takeaways.has(t)) issues.push({ ...pair, message: "identical diagram takeaway" });
      for (const c of x.choosers)
        if (y.choosers.has(c)) issues.push({ ...pair, message: "identical decision structure" });
    }
  return issues;
}
