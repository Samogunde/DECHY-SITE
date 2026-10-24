/**
 * The search engine behind site search and the Resources search. It runs in the browser over a
 * static index, with no dependency and no request per keystroke.
 *
 * Matching: every query word is matched against the index vocabulary as an exact word, a plural or
 * singular form ("app" finds "apps", "companies" finds "company"), a partial word ("integr" finds
 * "integration"), or a near miss with one or two typos ("shopfy" finds "shopify"). Pages that match
 * every word rank first; pages that match only some words are kept and shown after them, so no
 * weaker match is hidden.
 */

const STOP = new Set(
  "a an and are as at be by can do does for from how i in is it my of on or our the to we what with you your".split(
    " ",
  ),
);

/** Lowercase words without accents or punctuation. */
export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** A light stem that folds plurals onto the singular: apps, companies, boxes, processes. */
export function stem(w: string): string {
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && /(ss|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
  return w;
}

/** Edit distance with transpositions, abandoned as soon as it exceeds `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        v = Math.min(v, prev2[j - 2]! + 1);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length]!;
}

export type Hit = {
  /** Position of the document in the list the index was built from. */
  doc: number;
  score: number;
  /** True when every query word matched. */
  full: boolean;
};

export type SearchResult = { hits: Hit[]; terms: Set<string> };

/**
 * An in-memory index. `fields(doc)` returns the document's searchable texts; `weights` gives each
 * field's importance (title highest, body lowest). A word counts once per field.
 */
export class SearchIndex<D> {
  private postings = new Map<string, Map<number, number>>();
  private vocab: string[];
  private expansions = new Map<string, { term: string; q: number }[]>();

  private titles: string[];

  constructor(
    readonly docs: D[],
    fields: (d: D) => string[],
    weights: number[],
    private boost: (d: D) => number = () => 0,
  ) {
    this.titles = docs.map((d) => tokenize(fields(d)[0] ?? "").join(" "));
    docs.forEach((d, i) => {
      fields(d).forEach((text, f) => {
        const w = weights[f] ?? 1;
        const words = tokenize(text);
        // Strong fields also index joined neighbours, so "nextjs" finds "Next.js".
        const joined = w >= 3 ? words.slice(1).map((x, k) => words[k] + x) : [];
        for (const s of new Set([...words.map(stem), ...joined])) {
          let m = this.postings.get(s);
          if (!m) this.postings.set(s, (m = new Map()));
          m.set(i, (m.get(i) ?? 0) + w);
        }
      });
    });
    this.vocab = [...this.postings.keys()];
  }

  /** Index terms a query word can stand for, with a match quality from 0 to 1. */
  private expand(word: string): { term: string; q: number }[] {
    const cached = this.expansions.get(word);
    if (cached) return cached;
    const s = stem(word);
    const out = new Map<string, number>();
    if (this.postings.has(s)) out.set(s, 1);
    const max = s.length >= 8 ? 2 : s.length >= 4 ? 1 : 0;
    for (const t of this.vocab) {
      if (t === s) continue;
      if (s.length >= 2 && t.startsWith(s)) out.set(t, Math.max(out.get(t) ?? 0, 0.75));
      else if (max > 0) {
        if (distance(s, t, max) <= max) out.set(t, Math.max(out.get(t) ?? 0, 0.5));
        // A partly typed word with a typo: "integr" with one slip still finds "integration".
        else if (s.length >= 5 && t.length > s.length && distance(s, t.slice(0, s.length), 1) <= 1)
          out.set(t, Math.max(out.get(t) ?? 0, 0.35));
      }
    }
    const list = [...out.entries()]
      .map(([term, q]) => ({ term, q }))
      .sort((a, b) => b.q - a.q)
      .slice(0, 80);
    this.expansions.set(word, list);
    return list;
  }

  search(query: string): SearchResult {
    const all = tokenize(query);
    const words = all.filter((w) => !STOP.has(w));
    const used = words.length ? words : all;
    const terms = new Set<string>();
    if (used.length === 0) return { hits: [], terms };
    const perWord = used.map((w) => {
      const scores = new Map<number, number>();
      for (const { term, q } of this.expand(w)) {
        terms.add(term);
        for (const [doc, weight] of this.postings.get(term) ?? []) {
          const v = q * weight;
          if (v > (scores.get(doc) ?? 0)) scores.set(doc, v);
        }
      }
      return scores;
    });
    const total = new Map<number, { score: number; n: number }>();
    for (const scores of perWord)
      for (const [doc, v] of scores) {
        const t = total.get(doc) ?? { score: 0, n: 0 };
        t.score += v;
        t.n += 1;
        total.set(doc, t);
      }
    // The whole query as a phrase in the title (the first field) ranks that page first.
    const phrase = all.join(" ");
    const hits: Hit[] = [...total.entries()].map(([doc, t]) => {
      const full = t.n === used.length;
      const title = this.titles[doc] ?? "";
      const bonus = title === phrase ? 100 : phrase.length > 2 && title.includes(phrase) ? 25 : 0;
      return {
        doc,
        full,
        score: (full ? t.score : t.score * 0.4) + bonus + this.boost(this.docs[doc]!),
      };
    });
    hits.sort((a, b) => Number(b.full) - Number(a.full) || b.score - a.score || a.doc - b.doc);
    return { hits, terms };
  }
}

export type Segment = { text: string; hit: boolean };

/** Splits text into plain and highlighted runs: a word is highlighted when it matched the query. */
export function highlight(text: string, terms: Set<string>): Segment[] {
  const out: Segment[] = [];
  for (const part of text.split(/([A-Za-z0-9À-ɏ]+)/)) {
    if (!part) continue;
    const isWord = /[A-Za-z0-9]/.test(part);
    const hit = isWord && terms.has(stem(tokenize(part)[0] ?? ""));
    const last = out[out.length - 1];
    if (last && last.hit === hit) last.text += part;
    else out.push({ text: part, hit });
  }
  return out;
}

/** A short window of `text` around the first matched word, cut at word boundaries. */
export function snippet(text: string, terms: Set<string>, length = 170): string {
  if (text.length <= length) return text;
  const re = /[A-Za-z0-9]+/g;
  let at = -1;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (terms.has(stem(m[0].toLowerCase()))) {
      at = m.index;
      break;
    }
  }
  if (at < 0) return `${text.slice(0, length).replace(/\s+\S*$/, "")}...`;
  let start = Math.max(0, at - 50);
  if (start > 0) start = text.indexOf(" ", start) + 1;
  let end = Math.min(text.length, start + length);
  if (end < text.length) end = text.lastIndexOf(" ", end);
  return `${start > 0 ? "..." : ""}${text.slice(start, end).trim()}${end < text.length ? "..." : ""}`;
}
