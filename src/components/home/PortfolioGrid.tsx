"use client";

import { useState, type ReactNode } from "react";

type Card = { key: string; service: string; industry: string; node: ReactNode };
type Facet = { key: string; label: string; count: number };

/**
 * The portfolio grid: service chips and an industry menu filter the cards. Every card is in the
 * HTML; filters only hide. Small sets (selected work on a page) show no filters.
 */
export function PortfolioGrid({
  cards,
  services,
  industries,
}: {
  cards: Card[];
  services: Facet[];
  industries: Facet[];
}) {
  const [service, setService] = useState("");
  const [industry, setIndustry] = useState("");
  const filters = cards.length > 6;
  const shown = (c: Card) =>
    (!service || c.service === service) && (!industry || c.industry === industry);
  const count = cards.filter(shown).length;
  return (
    <div className="pf">
      {filters ? (
        <div className="pf-filters">
          <div className="pf-chips" role="group" aria-label="Filter by service">
            <button
              type="button"
              className="blog-filter"
              aria-pressed={!service}
              onClick={() => setService("")}
            >
              All services <span className="explorer-count">{cards.length}</span>
            </button>
            {services.map((f) => (
              <button
                key={f.key}
                type="button"
                className="blog-filter"
                aria-pressed={service === f.key}
                onClick={() => setService(f.key)}
              >
                {f.label} <span className="explorer-count">{f.count}</span>
              </button>
            ))}
          </div>
          <label className="pf-industry">
            <span>Industry</span>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">All industries</option>
              {industries.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label} ({f.count})
                </option>
              ))}
            </select>
          </label>
          <p className="pf-count" aria-live="polite">
            Showing <strong>{count}</strong> of {cards.length} projects
          </p>
        </div>
      ) : null}
      <ul className="pf-grid">
        {cards.map((c) => (
          <li key={c.key} hidden={!shown(c)}>
            {c.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
