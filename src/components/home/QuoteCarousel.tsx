"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Client quotes on service, industry, and home pages: a row of equal cards that slides sideways
 * (two at a time on wide screens, one on phones). Every quote is in the HTML; the buttons and
 * swiping only move the row.
 */
export function QuoteCarousel({ label, cards }: { label: string; cards: ReactNode[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      setAt(Math.round(el.scrollLeft / step));
      setPerView(Math.max(1, Math.round(el.clientWidth / step)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const last = Math.max(0, cards.length - perView);
  const go = (to: number) => {
    const el = track.current;
    const next = Math.min(Math.max(to, 0), last);
    const card = el?.children[next] as HTMLElement | undefined;
    if (!el || !card) return;
    setAt(next);
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };
  return (
    <div className="qcar">
      <ul ref={track} className="qcar-track" aria-label={label}>
        {cards.map((c, i) => (
          <li key={i} className="qcar-item">
            {c}
          </li>
        ))}
      </ul>
      {cards.length > perView ? (
        <div className="qcar-nav">
          <span className="qcar-bar" aria-hidden="true">
            <span style={{ width: `${((Math.min(at, last) + perView) / cards.length) * 100}%` }} />
          </span>
          <button
            type="button"
            className="qcar-btn"
            onClick={() => go(at - 1)}
            disabled={at <= 0}
            aria-label="Previous testimonials"
          >
            <CaretLeft aria-hidden="true" weight="bold" />
          </button>
          <button
            type="button"
            className="qcar-btn"
            onClick={() => go(at + 1)}
            disabled={at >= last}
            aria-label="Next testimonials"
          >
            <CaretRight aria-hidden="true" weight="bold" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
