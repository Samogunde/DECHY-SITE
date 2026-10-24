"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { highlight, snippet } from "@/lib/search-engine";
import { siteIndex, type SearchEntry } from "@/lib/search-indexes";

/** Text with the words that matched the query marked. */
export function Highlight({ text, terms }: { text: string; terms: Set<string> }) {
  return (
    <>
      {highlight(text, terms).map((s, i) =>
        s.hit ? <mark key={i}>{s.text}</mark> : <Fragment key={i}>{s.text}</Fragment>,
      )}
    </>
  );
}

let sitePromise: Promise<SearchEntry[]> | null = null;

/** The site index, fetched once per page load and shared by every search box. */
export function useSiteIndex(enabled: boolean) {
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || entries) return;
    sitePromise ??= fetch("/search-index.json").then((r) =>
      r.ok ? (r.json() as Promise<SearchEntry[]>) : Promise.reject(new Error(String(r.status))),
    );
    sitePromise.then(setEntries).catch(() => {
      sitePromise = null;
      setFailed(true);
    });
  }, [enabled, entries]);
  const index = useMemo(() => (entries ? siteIndex(entries) : null), [entries]);
  return { entries, index, failed };
}

/** What a result shows: the description, or the passage of the page text that matched. */
export function resultText(e: SearchEntry, terms: Set<string>) {
  const inDesc = highlight(e.d, terms).some((s) => s.hit);
  return inDesc || !e.x ? snippet(e.d, terms, 190) : snippet(e.x, terms, 190);
}

export const POPULAR_SEARCHES = [
  "custom software",
  "mobile app cost",
  "AI chatbot",
  "automation",
  "Shopify",
  "cloud migration",
];

export const SUGGESTED_LINKS = [
  { label: "Services", href: "/services/", note: "Everything we design, build, and support" },
  { label: "Industries", href: "/industries/", note: "How we help in your sector" },
  { label: "Cost estimator", href: "/tools/cost-estimator/", note: "A price range in two minutes" },
  { label: "Guides and articles", href: "/resources/", note: "Costs, comparisons, how-tos" },
  { label: "About us", href: "/company/", note: "Who we are and how we work" },
  { label: "Contact", href: "/contact/", note: "Talk to the team" },
];

/** Suggested searches and destinations, for an empty box or a search with no results. */
export function SearchSuggestions({
  onPick,
  onNavigate,
}: {
  onPick: (q: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="search-suggest">
      <p className="search-suggest-label">Popular searches</p>
      <ul className="search-chips">
        {POPULAR_SEARCHES.map((q) => (
          <li key={q}>
            <button type="button" onClick={() => onPick(q)}>
              {q}
            </button>
          </li>
        ))}
      </ul>
      <p className="search-suggest-label">Or go straight to</p>
      <ul className="search-links">
        {SUGGESTED_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={onNavigate}>
              <span className="search-links-title">{l.label}</span>
              <span className="search-links-note">{l.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
