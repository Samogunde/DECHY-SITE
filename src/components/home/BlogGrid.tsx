"use client";

import { useState, type ReactNode } from "react";

type Card = { key: string; category: string; node: ReactNode };

/** The blog's article cards with category filters. Every card is in the HTML; filters only hide. */
export function BlogGrid({
  categories,
  cards,
  total,
}: {
  total: number;
  categories: { key: string; label: string; count: number }[];
  cards: Card[];
}) {
  const [active, setActive] = useState("all");
  return (
    <div className="blog">
      <div className="blog-filters" role="group" aria-label="Filter articles">
        <button
          type="button"
          className="blog-filter"
          aria-pressed={active === "all"}
          onClick={() => setActive("all")}
        >
          All <span className="explorer-count">{total}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            className="blog-filter"
            aria-pressed={active === c.key}
            onClick={() => setActive(c.key)}
          >
            {c.label} <span className="explorer-count">{c.count}</span>
          </button>
        ))}
      </div>
      <ul className="blog-grid">
        {cards.map((c) => (
          <li key={c.key} hidden={active !== "all" && c.category !== active}>
            {c.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
