"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Highlight, SearchSuggestions, resultText, useSiteIndex } from "./SearchKit";

const PAGE = 20;

/** "12 results for x", and how many more pages mention only some of the words. */
function countLine(hits: { full: boolean }[], q: string) {
  const full = hits.filter((h) => h.full).length;
  const some = hits.length - full;
  if (full === 0) return `No page has every word of "${q}". ${some} pages mention some of them.`;
  return `${full} ${full === 1 ? "result" : "results"} for "${q}"${
    some ? `, and ${some} more pages that mention some of the words` : ""
  }`;
}

/**
 * The full search results page (/search/?q=...). Every match is listed, strongest first, twenty at
 * a time. The page is noindex: results are for visitors, not search engines.
 */
export function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [shown, setShown] = useState(PAGE);
  const { index, entries, failed } = useSiteIndex(true);
  const deferred = useDeferredValue(query);

  // Keep the address in step with the box, so a search can be shared or revisited.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      router.replace(q ? `/search/?q=${encodeURIComponent(q)}` : "/search/", { scroll: false });
    }, 300);
    return () => clearTimeout(t);
  }, [query, router]);

  const result = useMemo(
    () => (index && deferred.trim() ? index.search(deferred) : null),
    [index, deferred],
  );
  const hits = result?.hits ?? [];
  const q = query.trim();
  const firstPartial = hits.findIndex((h) => !h.full);

  return (
    <div className="search-page">
      <label className="search-page-field">
        <span className="sr-only">Search the site</span>
        <input
          type="search"
          value={query}
          autoFocus
          enterKeyHint="search"
          placeholder="Search pages, services, articles, and questions"
          onChange={(e) => {
            setQuery(e.target.value);
            setShown(PAGE);
          }}
        />
      </label>
      <p className="search-page-count" aria-live="polite">
        {failed
          ? "Search is not available right now. Use the menu to browse."
          : !q
            ? "Type a word or two: a service, a technology, a question, or a person."
            : !index
              ? "Loading..."
              : hits.length === 0
                ? `Nothing matches "${q}". Try another word, or start from one of these.`
                : countLine(hits, q)}
      </p>
      {result && hits.length > 0 ? (
        <ol className="search-page-list">
          {hits.slice(0, shown).map((h, i) => {
            const e = entries![h.doc]!;
            return (
              <li
                key={`${e.p}|${e.t}`}
                data-partial-start={i === firstPartial && i > 0 ? "true" : undefined}
              >
                <Link href={e.p} className="search-page-result">
                  <span className="search-kind">{e.k}</span>
                  <span className="search-title">
                    <Highlight text={e.t} terms={result.terms} />
                  </span>
                  <span className="search-desc">
                    <Highlight text={resultText(e, result.terms)} terms={result.terms} />
                  </span>
                  <span className="search-path">{e.p.replace(/#.*$/, "")}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : null}
      {hits.length > shown ? (
        <button type="button" className="search-more" onClick={() => setShown((n) => n + PAGE)}>
          Load more ({hits.length - shown} more)
        </button>
      ) : null}
      {!q || (result && hits.length === 0) ? (
        <SearchSuggestions onPick={(s) => setQuery(s)} />
      ) : null}
    </div>
  );
}
