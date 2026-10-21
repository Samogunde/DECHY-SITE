"use client";

import { useMemo, useState, type ReactNode } from "react";

type Card = { key: string; service: string; industry: string; node: ReactNode };
type Facet = { key: string; label: string; count: number };

/**
 * The Testimonials page: a sticky filter rail (by service, by industry) beside a masonry wall of
 * quotes. Every quote is in the HTML; filters only hide cards. On phones the rail becomes two
 * select menus above the wall.
 */
export function TestimonialWall({
  cards,
  services,
  industries,
  featured,
}: {
  cards: Card[];
  services: Facet[];
  industries: Facet[];
  featured?: ReactNode;
}) {
  const [filter, setFilter] = useState<{ kind: "all" | "service" | "industry"; key: string }>({
    kind: "all",
    key: "",
  });
  const visible = useMemo(
    () =>
      cards.filter((c) =>
        filter.kind === "all"
          ? true
          : filter.kind === "service"
            ? c.service === filter.key
            : c.industry === filter.key,
      ),
    [cards, filter],
  );
  const activeLabel =
    filter.kind === "service"
      ? services.find((s) => s.key === filter.key)?.label
      : filter.kind === "industry"
        ? industries.find((s) => s.key === filter.key)?.label
        : undefined;
  const group = (title: string, kind: "service" | "industry", facets: Facet[]) => (
    <div className="tw-group">
      <p className="tw-group-title">{title}</p>
      <ul>
        {facets.map((f) => (
          <li key={f.key}>
            <button
              type="button"
              className="tw-facet"
              aria-pressed={filter.kind === kind && filter.key === f.key}
              onClick={() => setFilter({ kind, key: f.key })}
            >
              <span>{f.label}</span>
              <span className="tw-count">{f.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="tw">
      <aside className="tw-side" aria-label="Filter testimonials">
        <button
          type="button"
          className="tw-facet tw-all"
          aria-pressed={filter.kind === "all"}
          onClick={() => setFilter({ kind: "all", key: "" })}
        >
          <span>All testimonials</span>
          <span className="tw-count">{cards.length}</span>
        </button>
        {group("By service", "service", services)}
        {group("By industry", "industry", industries)}
      </aside>
      <div className="tw-main">
        <div className="tw-mobile">
          <label>
            <span>Service</span>
            <select
              value={filter.kind === "service" ? filter.key : ""}
              onChange={(e) =>
                setFilter(
                  e.target.value
                    ? { kind: "service", key: e.target.value }
                    : { kind: "all", key: "" },
                )
              }
            >
              <option value="">All services</option>
              {services.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label} ({f.count})
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Industry</span>
            <select
              value={filter.kind === "industry" ? filter.key : ""}
              onChange={(e) =>
                setFilter(
                  e.target.value
                    ? { kind: "industry", key: e.target.value }
                    : { kind: "all", key: "" },
                )
              }
            >
              <option value="">All industries</option>
              {industries.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label} ({f.count})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="tw-bar" aria-live="polite">
          <span>
            Showing <strong>{visible.length}</strong> of {cards.length}
            {activeLabel ? (
              <>
                {" "}
                for <strong>{activeLabel}</strong>
              </>
            ) : null}
          </span>
          {filter.kind !== "all" ? (
            <button
              type="button"
              className="tw-clear"
              onClick={() => setFilter({ kind: "all", key: "" })}
            >
              Clear filter
            </button>
          ) : null}
        </div>
        {filter.kind === "all" && featured ? featured : null}
        <ul className="tw-grid">
          {cards.map((c, i) => (
            <li
              key={c.key}
              hidden={!visible.includes(c) || (filter.kind === "all" && !!featured && i === 0)}
            >
              {c.node}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
