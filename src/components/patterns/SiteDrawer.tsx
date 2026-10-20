"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};

export type DrawerLink = { label: string; href: string; text: string };

/**
 * The menu button at the right of the header opens a side panel of quick links (impact, work,
 * clients, testimonials, insights, company, contact), as on the reference site. Escape, the close
 * button, a click outside, or following a link closes it; focus returns to the button.
 */
export function SiteDrawer({
  links,
  cta,
}: {
  links: DrawerLink[];
  cta: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);
  // The panel renders into <body>: the header's blur would otherwise clip a fixed panel.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [last, setLast] = useState(pathname);
  if (last !== pathname) {
    setLast(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      <button
        ref={btn}
        type="button"
        className="drawer-btn"
        aria-expanded={open}
        aria-controls="site-drawer"
        aria-label="Open the menu"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
          <path d="M1 2h18M7 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {mounted
        ? createPortal(
            <>
              <div
                className="drawer-scrim"
                data-open={open}
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <div
                ref={panel}
                id="site-drawer"
                className="drawer"
                data-open={open}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                inert={!open}
              >
                <div className="drawer-head">
                  <p className="drawer-kicker">Explore DECHY</p>
                  <button
                    type="button"
                    className="drawer-close"
                    aria-label="Close the menu"
                    onClick={() => {
                      setOpen(false);
                      btn.current?.focus();
                    }}
                  >
                    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
                      <path
                        d="M3 3l10 10M13 3L3 13"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <ul className="drawer-links">
                  {links.map((l, i) => (
                    <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                      <Link href={l.href} className="drawer-link" onClick={() => setOpen(false)}>
                        <span className="drawer-label">{l.label}</span>
                        <span className="drawer-text">{l.text}</span>
                        <svg
                          className="drawer-arrow"
                          viewBox="0 0 16 16"
                          width="16"
                          height="16"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 12L12 4M6 4h6v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={cta.href}
                  className="btn btn-primary drawer-cta"
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                </Link>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
