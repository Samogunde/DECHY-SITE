"use client";

import { useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/**
 * Tabs for technical detail: a row of topics, one panel shown at a time. Follows the ARIA tabs
 * pattern (arrow keys, Home, End; automatic activation). Every panel is in the markup, closed ones
 * only hidden, so the text stays readable by search engines and assistive technology.
 */
export function Tabs({
  items,
  label,
}: {
  items: { label: string; body: ReactNode }[];
  label: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const n = items.length;

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist" aria-label={label}>
        {items.map((it, i) => (
          <button
            key={it.label}
            id={`${uid}-tab-${i}`}
            type="button"
            role="tab"
            className="tabs-tab"
            aria-selected={i === active}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="tabs-n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {it.label}
          </button>
        ))}
      </div>
      {items.map((it, i) => (
        <div
          key={it.label}
          id={`${uid}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${i}`}
          className="tabs-panel"
          hidden={i !== active}
          tabIndex={0}
        >
          {it.body}
        </div>
      ))}
    </div>
  );
}
