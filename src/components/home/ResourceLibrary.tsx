"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type Card = { key: string; group: string; node: ReactNode };

/**
 * The Resources library: filter tabs (All, Guides, Comparisons, Cost guides, and a link to the
 * Glossary), the featured article, then the latest articles. Every card is in the HTML; the tabs
 * only hide cards.
 */
export function ResourceLibrary({
  tabs,
  featured,
  cards,
  glossaryHref,
}: {
  tabs: { key: string; label: string; count: number }[];
  featured?: ReactNode;
  cards: Card[];
  glossaryHref?: string;
}) {
  const [active, setActive] = useState("all");
  return (
    <div className="rl">
      <div className="rl-tabs" role="group" aria-label="Filter resources">
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
      {active === "all" && featured ? <div className="rl-featured">{featured}</div> : null}
      <ul className="blog-grid rl-grid">
        {cards.map((c) => (
          <li key={c.key} hidden={active !== "all" && c.group !== active}>
            {c.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
