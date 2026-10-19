"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Slide = { label: string; word: string; lead: string; chips: string[] };

const INTERVAL = 5200;

/**
 * The home hero. The headline stays "We build ..." and the offer cycles: custom software,
 * websites, web apps, mobile apps, each with its own line and screen. It is not a carousel: the
 * text and the screen change in place. It pauses while hovered or focused, stops when the tab is
 * hidden, and never moves under prefers-reduced-motion. The service buttons choose a slide.
 * Every slide is in the HTML, and the heading carries the full list for search and screen readers.
 */
export function RotatingHero({
  eyebrow,
  title,
  slides,
  visuals,
  actions,
}: {
  eyebrow?: string;
  /** The full heading text for assistive technology and search. */
  title: string;
  slides: Slide[];
  visuals: ReactNode[];
  actions: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const t = window.setTimeout(() => {
      if (document.visibilityState === "visible") setActive((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => window.clearTimeout(t);
  }, [active, paused, reduced, slides.length]);

  // Cards marked data-spotlight get a glow that follows the pointer (home page only).
  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = (e.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      aria-labelledby="hero-h"
      className="tone-ink hero-home hero-rot"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="scroll-progress" aria-hidden="true" />
      <span className="beam beam-a" aria-hidden="true" />
      <span className="beam beam-b" aria-hidden="true" />
      <div className="container-site hero-rot-grid">
        <div className="hero-rot-copy">
          {eyebrow ? <p className="t-eyebrow hero-eyebrow m-0">{eyebrow}</p> : null}
          <h1 id="hero-h" className="hero-rot-title">
            <span className="visually-hidden">{title}</span>
            <span aria-hidden="true" className="hero-we">
              We build
            </span>
            <span aria-hidden="true" className="hero-words">
              {slides.map((s, i) => (
                <span key={s.word} className="hero-word" data-active={i === active}>
                  {s.word}
                </span>
              ))}
            </span>
          </h1>
          <div className="hero-leads">
            {slides.map((s, i) => (
              <p
                key={s.word}
                className="hero-lead"
                data-active={i === active}
                aria-hidden={i !== active}
              >
                {s.lead}
              </p>
            ))}
          </div>
          <div className="hero-actions">{actions}</div>
          <div className="hero-tabs" role="group" aria-label="What we build">
            {slides.map((s, i) => (
              <button
                key={s.label}
                type="button"
                className="hero-tab"
                aria-pressed={i === active}
                data-running={i === active && !paused && !reduced}
                onClick={() => setActive(i)}
              >
                <span>{s.label}</span>
                <span className="hero-tab-bar" aria-hidden="true">
                  <span />
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="hero-rot-visual" aria-live="off">
          {visuals.map((v, i) => (
            <div
              key={i}
              className="hero-screen"
              data-active={i === active}
              aria-hidden={i !== active}
            >
              {v}
              {slides[i]?.chips.length ? (
                <ul className="hero-chips" aria-hidden="true">
                  {slides[i].chips.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
