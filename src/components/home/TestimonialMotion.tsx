"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/*
 * Motion for the Testimonials page (owner direction, 21 and 22 October 2026, after the reference
 * page): rows that loop without end, stories that move on by themselves, a client journey whose
 * steps light up as they reach the middle of the screen, featured voices that change on hover,
 * and lists that open on hover. Everything is in the HTML from the start; motion only changes what
 * is shown, and it stops for people who ask for reduced motion.
 */

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Cards copied at each end of a looping row, enough to fill the widest view (three cards). */
const CLONES = 3;

/**
 * A row that loops without end: one card at a time slides in from the right, and after the last
 * card the first follows straight on, with no rewind (owner, 22 October 2026). A few cards are
 * copied at each end so the loop is seamless; the copies are hidden from assistive technology.
 * Dashes show where you are and move the row on hover or click; arrows and swipes move one card.
 * With `autoplay` it moves on by itself, pausing while the pointer or focus is on it.
 */
export function TmCarousel({
  label,
  children,
  autoplay = false,
  className = "",
}: {
  label: string;
  children: ReactNode;
  autoplay?: boolean;
  className?: string;
}) {
  const items = Children.toArray(children);
  const n = items.length;
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(CLONES);
  const [animate, setAnimate] = useState(true);
  const [step, setStep] = useState(0);
  const [perView, setPerView] = useState(1);
  const paused = useRef(false);
  const visible = useRef(false);
  const startX = useRef<number | null>(null);

  const measure = useCallback(() => {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = first.getBoundingClientRect().width + gap;
    setStep(width);
    setPerView(Math.max(1, Math.round((el.getBoundingClientRect().width + gap) / width)));
  }, []);

  useEffect(() => {
    const el = view.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible.current = !!e?.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [measure]);

  // After sliding onto a copy, jump without motion to the real card in the same place.
  const settle = () => {
    if (index >= n + CLONES) {
      setAnimate(false);
      setIndex(index - n);
    } else if (index < CLONES) {
      setAnimate(false);
      setIndex(index + n);
    }
  };
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  const move = useCallback(
    (by: number) => {
      // Under reduced motion there is no slide to finish, so land on the real card at once.
      const still = reduced();
      setAnimate(!still);
      setIndex((i) => {
        const next = i + by;
        if (!still) return next;
        return next >= n + CLONES ? next - n : next < CLONES ? next + n : next;
      });
    },
    [n],
  );

  useEffect(() => {
    if (!autoplay || reduced() || n <= perView) return;
    const t = window.setInterval(() => {
      if (!paused.current && visible.current && !document.hidden) move(1);
    }, 4500);
    return () => window.clearInterval(t);
  }, [autoplay, move, n, perView]);

  const real = (((index - CLONES) % n) + n) % n;
  const pages = Math.max(1, Math.ceil(n / perView));
  const page = Math.min(pages - 1, Math.floor(real / perView));
  const toPage = (p: number) => {
    setAnimate(!reduced());
    setIndex(CLONES + Math.min(p * perView, n - 1));
  };
  const cards = [
    ...items.slice(n - CLONES).map((c, i) => ({ c, key: `before-${i}`, copy: true })),
    ...items.map((c, i) => ({ c, key: `card-${i}`, copy: false })),
    ...items.slice(0, CLONES).map((c, i) => ({ c, key: `after-${i}`, copy: true })),
  ];

  return (
    <div
      className={`tmc ${className}`.trim()}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div className="tmc-bar">
        <div className="tmc-dashes" role="group" aria-label={`${label}: pages`}>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className="tmc-dash"
              aria-label={`Page ${i + 1} of ${pages}`}
              aria-current={i === page ? "true" : undefined}
              onMouseEnter={() => i !== page && toPage(i)}
              onClick={() => toPage(i)}
            />
          ))}
        </div>
        <div className="tmc-arrows">
          <button
            type="button"
            className="tmc-arrow"
            aria-label="Previous"
            onClick={() => move(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="tmc-arrow" aria-label="Next" onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={view}
        className="tmc-view"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          const from = startX.current;
          startX.current = null;
          if (from === null || Math.abs(e.clientX - from) < 40) return;
          move(e.clientX < from ? 1 : -1);
        }}
      >
        <ul
          ref={track}
          className="tmc-track"
          aria-label={label}
          data-animate={animate ? "true" : undefined}
          style={{ transform: `translate3d(${-index * step}px, 0, 0)` }}
          onTransitionEnd={(e) => e.target === e.currentTarget && settle()}
        >
          {cards.map(({ c, key, copy }) => (
            <li key={key} className="tmc-item" aria-hidden={copy || undefined} inert={copy}>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Client journey steps: the step nearest the middle of the screen is the active one. */
export function TmJourneySteps({ children }: { children: ReactNode }) {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  return (
    <ol ref={list} className="tmj-steps">
      {Children.map(children, (child, i) => (
        <li className="tmj-step" data-active={i === active ? "true" : undefined}>
          {child}
        </li>
      ))}
    </ol>
  );
}

type Voice = { id: string; thumb: ReactNode; label: string; panel: ReactNode };

/** Featured voices: hovering, focusing, or tapping a person shows their testimonial. */
export function TmFounders({
  label,
  visual,
  items,
}: {
  label: string;
  visual: ReactNode;
  items: Voice[];
}) {
  const [active, setActive] = useState(0);
  const move = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + items.length) % items.length;
    setActive(next);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="tmf">
      <div className="tmf-left">
        <div className="tmf-visual">{visual}</div>
        <div className="tmf-thumbs" role="tablist" aria-label={label}>
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              role="tab"
              id={`tmf-tab-${it.id}`}
              aria-selected={i === active}
              aria-controls={`tmf-panel-${it.id}`}
              aria-label={it.label}
              tabIndex={i === active ? 0 : -1}
              className="tmf-thumb"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => move(e, i)}
            >
              {it.thumb}
            </button>
          ))}
        </div>
      </div>
      <div className="tmf-right">
        {items.map((it, i) => (
          <div
            key={it.id}
            id={`tmf-panel-${it.id}`}
            role="tabpanel"
            aria-labelledby={`tmf-tab-${it.id}`}
            hidden={i !== active}
            className="tmf-panel"
          >
            {it.panel}
          </div>
        ))}
      </div>
    </div>
  );
}

type Row = { key: string; head: ReactNode; body: ReactNode };

/**
 * A list whose rows open on hover (and on focus or tap, so keyboards and phones work too). One row
 * is open at a time; the first starts open.
 */
export function TmHoverList({ rows, className = "" }: { rows: Row[]; className?: string }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className={`tmh ${className}`.trim()}>
      {rows.map((r, i) => (
        <li key={r.key} className="tmh-row" data-open={i === open ? "true" : undefined}>
          <button
            type="button"
            className="tmh-head"
            aria-expanded={i === open}
            aria-controls={`tmh-${r.key}`}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
          >
            {r.head}
            <svg className="tmh-chev" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div id={`tmh-${r.key}`} className="tmh-body">
            <div>{r.body}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Large stories one at a time. They move on by themselves, pausing only while the pointer is over
 * them; the dashes change the story on hover or click, and the arrows step through.
 */
export function TmStories({
  label,
  slides,
}: {
  label: string;
  slides: { key: string; node: ReactNode }[];
}) {
  const [at, setAt] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover || reduced()) return;
    const t = window.setTimeout(() => setAt((a) => (a + 1) % slides.length), 6500);
    return () => window.clearTimeout(t);
  }, [at, hover, slides.length]);
  const go = (n: number) => setAt((n + slides.length) % slides.length);
  return (
    <div className="tms">
      <div
        className="tms-stage"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {slides.map((s, i) => (
          <div
            key={s.key}
            className="tms-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${label}: ${i + 1} of ${slides.length}`}
            aria-hidden={i !== at}
            data-active={i === at ? "true" : undefined}
            inert={i !== at}
          >
            {s.node}
          </div>
        ))}
      </div>
      <div className="tms-nav">
        <button
          type="button"
          className="tmc-arrow"
          aria-label="Previous story"
          onClick={() => go(at - 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="tmc-dashes" role="group" aria-label="Stories">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className="tmc-dash"
              aria-label={`Story ${i + 1} of ${slides.length}`}
              aria-current={i === at ? "true" : undefined}
              onMouseEnter={() => go(i)}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="tmc-arrow"
          aria-label="Next story"
          onClick={() => go(at + 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
