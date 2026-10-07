"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/**
 * The tabbed form of "At a glance": four answers, one visible at a time, with the next step
 * kept beside them as an action. Every panel is in the page markup (inactive ones are only
 * hidden), so the content is readable by search engines and assistive technology, and keyboard
 * use follows the standard tabs pattern (arrows, Home, End).
 */
export function GlanceTabs({
  items,
  action,
}: {
  items: { label: string; body: ReactNode }[];
  action: ReactNode;
}) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = items.length - 1;
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="gt">
      <div className="gt-main">
        <div role="tablist" aria-label="At a glance" className="gt-list">
          {items.map((it, i) => (
            <button
              key={it.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              className="gt-tab"
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="gt-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
        <div className="gt-panels">
          {items.map((it, i) => (
            <div
              key={it.label}
              role="tabpanel"
              id={`${uid}-panel-${i}`}
              aria-labelledby={`${uid}-tab-${i}`}
              hidden={i !== active}
              className="gt-panel"
            >
              {it.body}
            </div>
          ))}
        </div>
      </div>
      <aside className="gt-action" aria-label="Next step">
        {action}
      </aside>
    </div>
  );
}
