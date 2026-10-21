"use client";

import { useMemo, useState, type ReactNode } from "react";

type Card = { key: string; service: string; industry: string; node: ReactNode };
type Facet = { key: string; label: string; count: number };

const PAGE = 12;

/**
 * The Testimonials page: a filter bar (service tabs and an industry menu) above an even grid of
 * quote cards, twelve at a time with "Show more". Every quote is in the HTML; filters and paging
 * only hide cards.
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
    <div className="tw">
      <div className="tw-toolbar">
        <div className="tw-tabs" role="group" aria-label="Filter by service">
          <button
            type="button"
            className="tw-tab"
            aria-pressed={!service}
            onClick={() => pick(() => setService(""))}
          >
            All services
          </button>
          {services.map((f) => (
            <button
              key={f.key}
              type="button"
              className="tw-tab"
              aria-pressed={service === f.key}
              onClick={() => pick(() => setService(f.key))}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="tw-tools">
          <label className="tw-select">
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
          <p className="tw-result" aria-live="polite">
            {service || industry ? (
              <button
                type="button"
                className="tw-clear"
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
      <ul className="tw-grid">
        {cards.map((c) => (
          <li key={c.key} hidden={!shown.has(c.key)}>
            {c.node}
          </li>
        ))}
      </ul>
      {visible.length > limit ? (
        <div className="tw-more">
          <button type="button" className="tw-more-btn" onClick={() => setLimit(limit + PAGE)}>
            Show more stories
          </button>
        </div>
      ) : null}
      {visible.length === 0 ? (
        <p className="tw-empty">No stories match these filters yet. Try another industry.</p>
      ) : null}
    </div>
  );
}
