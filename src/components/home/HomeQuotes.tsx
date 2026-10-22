"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Tag = { label: string; href?: string; live: boolean };
type Quote = {
  name: string;
  role: string;
  company: string;
  quote: string;
  initials: string;
  hue: number;
  tags: Tag[];
};

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** How long each quote shows before the next one (owner, 22 October 2026). */
const DWELL = 7000;

/**
 * The home page's client quotes: one large quote at a time beside the list of clients. It moves
 * on by itself, a line under the active client shows the time left, and it pauses while the
 * pointer is over it. Hovering, focusing, or tapping a client shows their quote. Every quote is
 * in the HTML; motion only changes which one shows.
 */
export function HomeQuotes({ label, items }: { label: string; items: Quote[] }) {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || reduced()) return;
    const t = window.setTimeout(() => setAt((a) => (a + 1) % items.length), DWELL);
    return () => window.clearTimeout(t);
  }, [at, paused, items.length]);
  const tag = (t: Tag, className: string) =>
    t.href && t.live ? (
      <Link href={t.href} className={className}>
        {t.label}
      </Link>
    ) : (
      <span className={className}>{t.label}</span>
    );

  return (
    <div
      className="hq"
      data-paused={paused ? "true" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hq-stage">
        {items.map((q, i) => (
          <figure
            key={q.name}
            id={`hq-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`hq-tab-${i}`}
            hidden={i !== at}
            className="hq-fig"
          >
            <svg className="hq-mark" viewBox="0 0 48 36" aria-hidden="true">
              <path d="M0 36V22.4Q0 12 5.3 6T20 0v7.6q-5.8 1.1-8.6 4.6T8.7 21H18v15H0Zm28 0V22.4q0-10.4 5.3-16.4T48 0v7.6q-5.8 1.1-8.6 4.6T36.7 21H46v15H28Z" />
            </svg>
            <blockquote className="hq-quote">
              <p>{q.quote}</p>
            </blockquote>
            <figcaption className="hq-who">
              <span className="tq-av tq-av-lg" data-hue={q.hue} aria-hidden="true">
                {q.initials}
              </span>
              <span className="hq-id">
                <span className="hq-name">{q.name}</span>
                <span className="hq-role">
                  {q.role}, {q.company}
                </span>
              </span>
              <span className="hq-tags">
                {q.tags.map((t, k) => (
                  <span key={t.label}>{tag(t, k === 0 ? "hq-svc" : "hq-ind")}</span>
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="hq-list" role="tablist" aria-label={label} aria-orientation="vertical">
        {items.map((q, i) => (
          <button
            key={q.name}
            id={`hq-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === at}
            aria-controls={`hq-panel-${i}`}
            tabIndex={i === at ? 0 : -1}
            className="hq-person"
            onMouseEnter={() => setAt(i)}
            onFocus={() => setAt(i)}
            onClick={() => setAt(i)}
            onKeyDown={(e) => {
              const step =
                e.key === "ArrowDown" || e.key === "ArrowRight"
                  ? 1
                  : e.key === "ArrowUp" || e.key === "ArrowLeft"
                    ? -1
                    : 0;
              if (!step) return;
              e.preventDefault();
              const next = (i + step + items.length) % items.length;
              setAt(next);
              document.getElementById(`hq-tab-${next}`)?.focus();
            }}
          >
            <span className="tq-av tq-av-sm" data-hue={q.hue} aria-hidden="true">
              {q.initials}
            </span>
            <span className="hq-person-id">
              <strong>{q.name}</strong>
              <span>{q.company}</span>
            </span>
            <span className="hq-person-svc">{q.tags[0]?.label}</span>
            {i === at ? <span key={`bar-${at}`} className="hq-bar" aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
