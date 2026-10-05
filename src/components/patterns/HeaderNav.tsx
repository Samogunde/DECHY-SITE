"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type NavService = { name: string; href: string | null; micro: string };
export type NavFamily = { id: string; label: string; services: NavService[] };
export type NavPrimary = { label: string; kind: "menu" | "link"; href: string | null };

type Props = {
  primary: NavPrimary[];
  families: NavFamily[];
  cta: { label: string; href: string };
};

/** Items without a page render as plain text, never as links or placeholders. */
function Entry({
  label,
  href,
  onNavigate,
}: {
  label: string;
  href: string | null;
  onNavigate?: () => void;
}) {
  if (!href) return <span className="text-slate-text">{label}</span>;
  return (
    <Link href={href} onClick={onNavigate} className="text-ink no-underline hover:underline">
      {label}
    </Link>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
      style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .15s" }}
    >
      <path
        d="M2.5 5 7 9.5 11.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeaderNav({ primary, families, cta }: Props) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const servicesPanel = useRef<HTMLDivElement>(null);
  const mobileBtn = useRef<HTMLButtonElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const uid = useId();
  const servicesPanelId = `${uid}-services`;
  const mobilePanelId = `${uid}-mobile`;

  const closeAll = useCallback(() => {
    setServicesOpen(false);
    setMobileOpen(false);
  }, []);

  // Close menus on navigation: adjust state while rendering when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  // Desktop services menu: Escape closes and returns focus; outside click closes.
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesBtn.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!servicesPanel.current?.contains(t) && !servicesBtn.current?.contains(t)) {
        setServicesOpen(false);
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && !servicesPanel.current?.contains(next) && !servicesBtn.current?.contains(next)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    const panel = servicesPanel.current;
    panel?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      panel?.removeEventListener("focusout", onFocusOut);
    };
  }, [servicesOpen]);

  // Mobile menu: focus trap, Escape, scroll lock, focus return.
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = mobilePanel.current;
    // The toggle precedes the panel in the DOM, so the cycle is: toggle, then the panel's controls.
    const focusables = () => [
      ...(mobileBtn.current ? [mobileBtn.current] : []),
      ...Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
    ];
    // Modal behavior: the page behind the menu cannot be reached by keyboard or assistive tech.
    const background = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer[data-site-footer], .skip-link"),
    );
    background.forEach((el) => el.setAttribute("inert", ""));
    const first = panel?.querySelector<HTMLElement>("a[href], button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileBtn.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const firstEl = list[0] as HTMLElement;
      const lastEl = list[list.length - 1] as HTMLElement;
      const active = document.activeElement;
      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 74rem)").matches) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      background.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  const isActive = (href: string | null) => !!href && pathname === href;

  return (
    <>
      <div className="ml-auto flex items-center">
        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden min-[74rem]:block">
          <ul
            className="m-0 flex list-none items-center gap-7 p-0 font-[family-name:var(--font-heading)] font-semibold"
            style={{ fontSize: "var(--fs-nav)" }}
          >
            {primary.map((item) =>
              item.kind === "menu" ? (
                <li key={item.label}>
                  <button
                    ref={servicesBtn}
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls={servicesPanelId}
                    onClick={() => setServicesOpen((v) => !v)}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-[inherit] text-[inherit] text-ink"
                  >
                    {item.label}
                    <ChevronIcon open={servicesOpen} />
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="inline-flex min-h-11 items-center text-ink no-underline hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-slate-text">
                      {item.label}
                    </span>
                  )}
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2 min-[74rem]:gap-0">
          <Link
            href={cta.href}
            className="btn btn-primary hidden min-h-11 px-4 min-[23rem]:inline-flex min-[74rem]:ml-8 min-[74rem]:px-[1.375rem]"
          >
            {cta.label}
          </Link>
          <button
            ref={mobileBtn}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobilePanelId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink bg-transparent px-3 font-[family-name:var(--font-heading)] text-[length:var(--fs-label)] font-semibold text-ink min-[74rem]:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              {mobileOpen ? (
                <path
                  d="M4 4l12 12M16 4 4 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <span className="hidden min-[30rem]:inline">{mobileOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Desktop services panel */}
      {servicesOpen ? (
        <div
          ref={servicesPanel}
          id={servicesPanelId}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_18px_40px_-24px_rgba(17,24,39,0.35)] min-[74rem]:block"
        >
          <div className="container-site py-9">
            <div className="grid grid-cols-5 gap-8">
              {families.map((f) => (
                <div key={f.id}>
                  <p className="t-eyebrow m-0 mb-3">{f.label}</p>
                  <ul className="m-0 list-none space-y-1 p-0">
                    {f.services.map((s) => (
                      <li key={s.name}>
                        <span className="block py-1.5 font-[family-name:var(--font-heading)] text-[length:var(--fs-nav)] font-semibold leading-snug">
                          <Entry label={s.name} href={s.href} onNavigate={closeAll} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile and tablet panel */}
      {mobileOpen ? (
        <div
          ref={mobilePanel}
          id={mobilePanelId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto overscroll-contain bg-paper min-[74rem]:hidden"
        >
          <div className="container-site py-6 pb-28">
            <ul className="m-0 list-none p-0">
              {primary.map((item) =>
                item.kind === "menu" ? (
                  <li key={item.label} className="border-b border-line">
                    <button
                      type="button"
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="flex min-h-14 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-start font-[family-name:var(--font-heading)] text-[length:var(--fs-nav-mobile)] font-semibold text-ink"
                    >
                      {item.label}
                      <ChevronIcon open={mobileServicesOpen} />
                    </button>
                    {mobileServicesOpen ? (
                      <div className="pb-4">
                        {families.map((f) => (
                          <div key={f.id} className="mb-4">
                            <p className="t-eyebrow m-0 mb-1.5">{f.label}</p>
                            <ul className="m-0 list-none p-0">
                              {f.services.map((s) => (
                                <li
                                  key={s.name}
                                  className="py-1.5 text-[length:var(--fs-body)] leading-snug"
                                >
                                  <Entry label={s.name} href={s.href} onNavigate={closeAll} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ) : (
                  <li key={item.label} className="border-b border-line">
                    <span className="flex min-h-14 items-center font-[family-name:var(--font-heading)] text-[length:var(--fs-nav-mobile)] font-semibold">
                      <Entry label={item.label} href={item.href} onNavigate={closeAll} />
                    </span>
                  </li>
                ),
              )}
            </ul>
            <div className="mt-8">
              <Link href={cta.href} onClick={closeAll} className="btn btn-primary w-full">
                {cta.label}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
