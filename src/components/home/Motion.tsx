"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that counts up from 1 when it scrolls into view ("1,500+"). The server renders the
 * final value, so search engines, screen readers, and visitors without JavaScript always see the
 * real figure; the count only plays as an enhancement, once, and never under reduced motion.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)([\d,]+)(.*)$/);
    if (!el || !m || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    const [, pre = "", digits = "", post = ""] = m;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target) || target < 2) return;
    const format = (n: number) => `${pre}${n.toLocaleString("en-US")}${post}`;
    el.textContent = format(1);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1700;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(Math.max(1, Math.round(eased * target)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);
  return (
    <span ref={ref} className="count-up">
      {value}
    </span>
  );
}

/**
 * A statement that lights up word by word as it scrolls through the screen. The words are real
 * text; only their opacity changes. Under reduced motion the whole statement is lit.
 */
export function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);
  const [lit, setLit] = useState(words.length);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top of the text reaches 85% of the screen, 1 when its bottom passes 45%.
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.4);
      setLit(Math.round(Math.min(1, Math.max(0, p)) * words.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [words.length]);
  return (
    <p ref={ref} className={`reveal-text ${className}`.trim()}>
      {words.map((w, i) => (
        <span key={i} data-lit={i < lit}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/**
 * Project phases: on wide screens the photograph column stays in view and changes as each phase
 * scrolls past; on phones every phase shows its own photograph inline.
 */
export function PhaseScroller({
  photos,
  children,
}: {
  photos: ReactNode[];
  children: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-phase]") ?? []);
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.phase));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="phases">
      <div className="phases-media" aria-hidden="true">
        <div className="phases-sticky">
          {photos.map((p, i) => (
            <div key={i} className="phase-photo" data-active={i === active}>
              {p}
            </div>
          ))}
          <div className="phase-dots">
            {photos.map((_, i) => (
              <span key={i} data-active={i === active} />
            ))}
          </div>
        </div>
      </div>
      <ol ref={list} className="phases-list">
        {children.map((c, i) => (
          <li key={i} data-phase={i} data-active={i === active} className="phase">
            {c}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Selected projects: one at a time, chosen by name. */
export function CaseViewer({ labels, panels }: { labels: string[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="case-viewer">
      <div className="case-tabs" role="tablist" aria-label="Projects">
        {labels.map((l, i) => (
          <button
            key={l}
            id={`case-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`case-panel-${i}`}
            className="case-tab"
            onClick={() => setActive(i)}
          >
            {l}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={i}
          id={`case-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`case-tab-${i}`}
          hidden={i !== active}
          className="case-panel"
        >
          {p}
        </div>
      ))}
    </div>
  );
}

/**
 * All services by family: a row of family tabs, and one panel at a time with the family's
 * photograph and its services. Arrow keys move between tabs (WAI-ARIA tabs pattern).
 */
export function ServiceExplorer({
  tabs,
  panels,
}: {
  tabs: { label: string; count: number }[];
  panels: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <div className="explorer">
      <div className="explorer-tabs" role="tablist" aria-label="Service families">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`svc-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`svc-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="explorer-tab"
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") move(i + 1);
              else if (e.key === "ArrowLeft") move(i - 1);
            }}
          >
            <span>{t.label}</span>
            <span className="explorer-count">{t.count}</span>
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={i}
          id={`svc-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`svc-tab-${i}`}
          hidden={i !== active}
        >
          {p}
        </div>
      ))}
    </div>
  );
}
