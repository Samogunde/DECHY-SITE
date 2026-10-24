"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { Highlight } from "@/components/patterns/search/SearchKit";
import { snippet } from "@/lib/search-engine";
import { articleIndex, type ArticleEntry } from "@/lib/search-indexes";

type Card = { key: string; group: string; node: ReactNode };

let articlesPromise: Promise<ArticleEntry[]> | null = null;

/**
 * The Resources library: a search over the full text of every article, category filters (with a
 * link to the Glossary), the featured article, then the latest articles. Every card is in the HTML;
 * the filters only hide cards. While a search is active, ranked results with the matching passage
 * replace the cards, and the filters narrow the results.
 */
export function ResourceLibrary({
  tabs,
  featured,
  featuredKey,
  cards,
  glossaryHref,
}: {
  tabs: { key: string; label: string; count: number }[];
  featured?: ReactNode;
  /** The featured article's card key: shown as the large card under All, as a card otherwise. */
  featuredKey?: string;
  cards: Card[];
  glossaryHref?: string;
}) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [want, setWant] = useState(false);
  const [entries, setEntries] = useState<ArticleEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    if (!want || entries) return;
    articlesPromise ??= fetch("/articles-index.json").then((r) =>
      r.ok ? (r.json() as Promise<ArticleEntry[]>) : Promise.reject(new Error(String(r.status))),
    );
    articlesPromise.then(setEntries).catch(() => {
      articlesPromise = null;
      setFailed(true);
    });
  }, [want, entries]);

  const index = useMemo(() => (entries ? articleIndex(entries) : null), [entries]);
  const q = deferred.trim();
  const result = useMemo(() => (index && q ? index.search(q) : null), [index, q]);
  const hits = (result?.hits ?? []).filter(
    (h) => active === "all" || entries![h.doc]!.c === active,
  );
  const searching = query.trim().length > 0;
  const activeLabel = tabs.find((t) => t.key === active)?.label;

  return (
    <div className="rl">
      <div className="rl-search">
        <label className="rl-search-field">
          <span className="sr-only">Search all articles</span>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            enterKeyHint="search"
            placeholder="Search every article: costs, tools, how-tos"
            onFocus={() => setWant(true)}
            onChange={(e) => {
              setWant(true);
              setQuery(e.target.value);
            }}
          />
        </label>
        <p className="rl-search-count" aria-live="polite">
          {!searching
            ? `${cards.length} articles`
            : failed
              ? "Search is not available right now."
              : !result
                ? "Searching..."
                : `${hits.length} ${hits.length === 1 ? "article matches" : "articles match"} "${query.trim()}"${active !== "all" && activeLabel ? ` in ${activeLabel}` : ""}`}
        </p>
      </div>
      <div className="rl-tabs" role="group" aria-label="Filter by category">
        <button
          type="button"
          className="rl-tab"
          aria-pressed={active === "all"}
          onClick={() => setActive("all")}
        >
          All
        </button>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className="rl-tab"
            aria-pressed={active === t.key}
            onClick={() => setActive(t.key)}
          >
            {t.label} <span className="rl-count">{t.count}</span>
          </button>
        ))}
        {glossaryHref ? (
          <Link href={glossaryHref} className="rl-tab rl-tab-link">
            Glossary
          </Link>
        ) : null}
      </div>
      {searching && result ? (
        hits.length ? (
          <ol className="rl-results">
            {hits.map((h) => {
              const e = entries![h.doc]!;
              const text = e.x ? snippet(e.x, result.terms, 220) : e.d;
              return (
                <li key={e.p}>
                  <Link href={e.p} className="rl-result">
                    <span className="rl-result-cat">{e.cl}</span>
                    <span className="rl-result-title">
                      <Highlight text={e.t} terms={result.terms} />
                    </span>
                    <span className="rl-result-text">
                      <Highlight text={text} terms={result.terms} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="rl-empty">
            No article mentions that yet. Try a shorter word, clear the filter, or{" "}
            <Link href="/contact/">ask us directly</Link>.
          </p>
        )
      ) : null}
      <div hidden={searching}>
        {active === "all" && featured ? <div className="rl-featured">{featured}</div> : null}
        <ul className="blog-grid rl-grid">
          {cards.map((c) => (
            <li
              key={c.key}
              hidden={active === "all" ? c.key === featuredKey && !!featured : c.group !== active}
            >
              {c.node}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
