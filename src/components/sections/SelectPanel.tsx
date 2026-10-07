"use client";

import { useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/**
 * One interaction for every "choose one and see the answer" section: At a glance, route
 * choosers, and option comparisons. Each option is a real button that opens its panel.
 *
 * - Wide screens: options in a rail on the left, the selected answer in a panel on the right.
 *   Pointing at an option previews it; clicking, tapping, Enter, or Space selects it; the arrow
 *   keys move between options.
 * - Narrow screens: the same buttons work as an accordion, each answer opening under its option.
 *
 * Every panel is in the page markup (closed ones are only hidden), so the content is readable by
 * search engines and assistive technology. Nothing is reachable only by hover.
 */
export function SelectPanel({
  items,
  label,
  hint,
  numbered = true,
  className = "",
}: {
  items: { label: string; body: ReactNode }[];
  /** Accessible name for the group of options. */
  label: string;
  /** Short visible prompt above the options, so it is obvious they can be chosen. */
  hint?: string;
  numbered?: boolean;
  className?: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const n = items.length;

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-opt-${next}`)?.focus();
  }

  function preview(i: number) {
    // Hover previews only on wide screens with a real pointer; touch and narrow layouts use taps.
    if (window.matchMedia("(hover: hover) and (min-width: 64rem)").matches) setActive(i);
  }

  return (
    <div className={`sp ${className}`.trim()}>
      {hint ? (
        <p className="sp-hint" aria-hidden="true">
          {hint}
        </p>
      ) : null}
      <div
        className="sp-grid"
        role="group"
        aria-label={label}
        style={{ "--sp-n": n } as React.CSSProperties}
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <div key={it.label} className="sp-item" data-active={on ? "" : undefined}>
              <button
                type="button"
                id={`${uid}-opt-${i}`}
                className="sp-opt"
                aria-expanded={on}
                aria-controls={`${uid}-panel-${i}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => preview(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                {numbered ? (
                  <span className="sp-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ) : null}
                <span className="sp-label">{it.label}</span>
                <svg className="sp-chev" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path
                    d="M6 3.5 10.5 8 6 12.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div id={`${uid}-panel-${i}`} className="sp-panel" hidden={!on}>
                {it.body}
                {n > 1 ? (
                  <div className="sp-foot">
                    <span className="sp-steps" aria-hidden="true">
                      {items.map((_, k) => (
                        <span key={k} className="sp-step" data-on={k === i ? "" : undefined} />
                      ))}
                      <span className="sp-count">
                        {i + 1} of {n}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="sp-next"
                      onClick={() => {
                        const next = (i + 1) % n;
                        setActive(next);
                        document.getElementById(`${uid}-opt-${next}`)?.focus();
                      }}
                    >
                      Next: {items[(i + 1) % n]!.label}
                      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path
                          d="M2.5 8h10.5M9 4l4 4-4 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
