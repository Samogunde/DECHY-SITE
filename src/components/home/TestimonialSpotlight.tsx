"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

type Item = { id: string; name: string; company: string; avatar: ReactNode; panel: ReactNode };

/**
 * One large testimonial at a time, chosen from a row of people (a tab list). Every quote is in
 * the HTML; the tabs only choose which panel shows. Arrow keys move between people.
 */
export function TestimonialSpotlight({ label, items }: { label: string; items: Item[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const move = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  };
  return (
    <div className="tqs">
      <div className="tqs-panels">
        {items.map((it, i) => (
          <div
            key={it.id}
            id={`${base}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${i}`}
            hidden={i !== active}
            className="tqs-panel"
          >
            {it.panel}
          </div>
        ))}
      </div>
      <div className="tqs-people" role="tablist" aria-label={label} aria-orientation="vertical">
        {items.map((it, i) => (
          <button
            key={it.id}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="tqs-person"
            onClick={() => setActive(i)}
            onKeyDown={move}
          >
            {it.avatar}
            <span>
              <strong>{it.name}</strong>
              <span>{it.company}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
