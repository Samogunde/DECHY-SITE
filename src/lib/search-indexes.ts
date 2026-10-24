/**
 * The two search indexes as the browser sees them: entry shapes and how each is ranked. Kept free
 * of server code so the search components stay small. Built by search.ts at build time.
 */
import { SearchIndex } from "./search-engine";

export type SearchEntry = {
  /** Display title. */
  t: string;
  /** Path, with an anchor for a question or a team member. */
  p: string;
  /** Kind label shown next to the result. */
  k: string;
  /** One-line description. */
  d: string;
  /** Extra search terms (intent, headings, category, page name). Not displayed. */
  w: string;
  /** Text excerpt, searched and used for snippets. */
  x: string;
};

export type ArticleEntry = {
  t: string;
  p: string;
  /** Category key and its label. */
  c: string;
  cl: string;
  d: string;
  /** The article's full text. */
  x: string;
};

const KIND_BOOST: Record<string, number> = {
  Service: 3,
  Industry: 2,
  Solution: 2,
  Technology: 2,
  "Work Area": 1.5,
  Directory: 1.5,
  Company: 1,
  Team: 1,
};

/** The site index: title counts most, then terms and headings, the description, then the text. */
export const siteIndex = (entries: SearchEntry[]) =>
  new SearchIndex(
    entries,
    (e) => [e.t, e.w, e.d, e.x],
    [10, 4, 3, 1],
    (e) => KIND_BOOST[e.k] ?? 0,
  );

/** The articles index: title, summary, then the full text. */
export const articleIndex = (entries: ArticleEntry[]) =>
  new SearchIndex(entries, (e) => [e.t, e.d, e.x], [10, 3, 1]);
