"use client";

import { useMemo, useState, type ReactNode } from "react";

type Card = { key: string; service: string; industry: string; node: ReactNode };
type Facet = { key: string; label: string };

const PAGE = 9;

/**
 * The Testimonials page grid: service tabs and an industry menu above an even grid of quote
 * cards, nine at a time with "Show more". No counts are shown (owner, 21 October 2026). Every
 * quote is in the HTML; filters and paging only hide cards.
 */
export function TestimonialWall({
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
  const [limit, setLimit] = useState(PAGE);
  const visible = useMemo(
    () =>
      cards.filter(
        (c) => (!service || c.service === service) && (!industry || c.industry === industry),
      ),
    [cards, service, industry],
  );
  const shown = new Set(visible.slice(0, limit).map((c) => c.key));
  const pick = (next: () => void) => {
    next();
    setLimit(PAGE);
  };
  return (
    <div className="tqw">
      <div className="tqw-bar">
        <div className="tqw-tabs" role="group" aria-label="Filter by service">
          <button
            type="button"
            className="tqw-tab"
            aria-pressed={!service}
            onClick={() => pick(() => setService(""))}
          >
            All services
          </button>
          {services.map((f) => (
            <button
              key={f.key}
              type="button"
              className="tqw-tab"
              aria-pressed={service === f.key}
              onClick={() => pick(() => setService(f.key))}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="tqw-tools">
          <label className="tqw-select">
            <span>Industry</span>
            <select value={industry} onChange={(e) => pick(() => setIndustry(e.target.value))}>
              <option value="">All industries</option>
              {industries.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <p className="tqw-result" aria-live="polite">
            {service || industry ? (
              <button
                type="button"
                className="tqw-clear"
                onClick={() =>
                  pick(() => {
                    setService("");
                    setIndustry("");
                  })
                }
              >
                Clear filters
              </button>
            ) : null}
          </p>
        </div>
      </div>
      <ul className="tq-grid" data-count="9">
        {cards.map((c) => (
          <li key={c.key} hidden={!shown.has(c.key)}>
            {c.node}
          </li>
        ))}
      </ul>
      {visible.length > limit ? (
        <div className="tqw-more">
          <button type="button" className="tqw-more-btn" onClick={() => setLimit(limit + PAGE)}>
            Show more testimonials
          </button>
        </div>
      ) : null}
      {visible.length === 0 ? (
        <p className="tqw-empty">
          No testimonials match both filters. Try another industry or service.
        </p>
      ) : null}
    </div>
  );
}
