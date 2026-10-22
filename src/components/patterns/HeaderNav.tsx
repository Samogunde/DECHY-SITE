"use client";

import Link from "next/link";
import { ClientFaces } from "@/components/primitives/ClientFaces";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Arrow } from "@/components/primitives/Arrow";
import { Icon } from "@/components/primitives/Icon";
import type { IconName } from "@/lib/content/schema";
import type { NavItemModel, NavModel } from "@/lib/nav";
import { OPEN_SEARCH_EVENT, SiteSearch } from "./SiteSearch";

type Props = { model: NavModel };
type MenuItem = Exclude<NavItemModel, { kind: "link" }>;

const HOVER_OPEN_MS = 100;
// Owner direction, 20 October 2026: a menu closes as soon as the pointer leaves it.
const HOVER_CLOSE_MS = 40;

/** Items without a page render as plain text, never as links or placeholders. */
function Entry({
  label,
  href,
  onNavigate,
  className = "",
}: {
  label: string;
  href: string | null;
  onNavigate?: () => void;
  className?: string;
}) {
  if (!href) return <span className="text-slate-text">{label}</span>;
  return (
    <Link
      prefetch={false}
      href={href}
      onClick={onNavigate}
      className={`menu-link text-ink ${className}`}
    >
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

const FIND_SERVICE = "Not sure which service you need? Find your service";

/** What each menu covers, shown in the menu's left column. */
const MENU_INTRO: Record<string, { title: string; text: string; cta: string }> = {
  services: {
    title: "Fifteen services, one team",
    text: "Custom software, websites, web apps, and mobile apps, with AI, automation, cloud, security, design, and growth around them.",
    cta: "Explore all services",
  },
  solutions: {
    title: "Start from the problem",
    text: "Manual work, old systems, disconnected tools, unclear numbers. Pick the problem and see how we solve it.",
    cta: "Browse solutions",
  },
  technologies: {
    title: "Any stack, chosen for the job",
    text: "The languages, frameworks, and platforms we build with, and how we choose between them.",
    cta: "See all technologies",
  },
  industries: {
    title: "Built for your sector",
    text: "How each sector's data, rules, and customers shape the systems we build.",
    cta: "See all industries",
  },
  about: {
    title: "A certified, partnered team",
    text: "Partners of AWS, Microsoft, Google Cloud, Salesforce, Shopify, Adobe, and more, with certified engineers and one team from first call to support.",
    cta: "About DECHY",
  },
  resources: {
    title: "Decide with the facts",
    text: "Guides, cost guides, comparisons, and a glossary, written in plain language so you can plan and choose with confidence.",
    cta: "See all resources",
  },
  work: {
    title: "Our work",
    text: "Case studies, client testimonials, and the kinds of system we design and build, from portals and internal tools to platforms and AI agents.",
    cta: "See our work",
  },
};

function MegaIntro({
  item,
  proof,
  onNavigate,
}: {
  item: MenuItem;
  proof: NavModel["proof"];
  onNavigate: () => void;
}) {
  const intro = MENU_INTRO[item.kind];
  if (!intro) return null;
  return (
    <div className="mega-intro">
      <p className="mega-intro-title">{intro.title}</p>
      <p className="mega-intro-text">{intro.text}</p>
      <dl className="mega-intro-stats">
        <div>
          <dt>Clients helped</dt>
          <dd className="faces-dd">
            <ClientFaces size="sm" />
            {proof.clients}
          </dd>
        </div>
        <div>
          <dt>Building since</dt>
          <dd>{proof.founded}</dd>
        </div>
      </dl>
      {item.href ? (
        <Link prefetch={false} href={item.href} onClick={onNavigate} className="mega-intro-link">
          {intro.cta}
          <Arrow />
        </Link>
      ) : null}
    </div>
  );
}

/* ------------------------------ desktop panels ------------------------------ */

/** One line per service in the menu: what the visitor gets, in a few words. */
const SERVICE_LINE: Record<string, [IconName, string]> = {
  "software-development": ["code", "Custom platforms, portals, internal tools"],
  "web-development": ["globe", "Websites and web apps that load fast"],
  "mobile-app-development": ["phone", "iOS, Android, and cross-platform apps"],
  ecommerce: ["cart", "Online stores, checkout, and payments"],
  ai: ["sparkles", "Assistants, agents, and AI features"],
  automation: ["workflow", "Workflows that run without the busywork"],
  "data-analytics": ["chart", "Dashboards, reporting, and data pipelines"],
  "api-integration": ["plug", "Connect the tools you already use"],
  cloud: ["cloud", "Hosting, deployment, and scaling"],
  cybersecurity: ["shield", "Security reviews and hardening"],
  "ui-ux": ["pen", "Product design people understand"],
  branding: ["palette", "Identity, voice, and visual systems"],
  "seo-aeo-geo": ["search", "Be found in search and AI answers"],
  "digital-marketing": ["megaphone", "Campaigns that bring qualified leads"],
  consulting: ["compass", "Strategy, audits, and roadmaps"],
};

const LIST_ICON: Record<string, IconName> = {
  healthcare: "health",
  finance: "finance",
  "real-estate": "building",
  logistics: "truck",
  manufacturing: "factory",
  retail: "bag",
  education: "education",
  "professional-services": "briefcase",
  fitness: "fitness",
  beauty: "beauty",
  fintech: "wallet",
  banking: "finance",
  insurance: "umbrella",
  construction: "hardhat",
  energy: "energy",
  "field-services": "wrench",
  restaurants: "food",
  hospitality: "hotel",
  travel: "travel",
  marketplaces: "store",
  automotive: "car",
  transportation: "bus",
  agriculture: "plant",
  recruitment: "hire",
  legal: "legal",
  media: "media",
  nonprofits: "charity",
  government: "flag",
  saas: "app",
  telecommunications: "tower",
  "business-process-automation": "workflow",
  "legacy-system-modernization": "code",
  "cloud-migration": "cloud",
  "crm-integration": "plug",
  "business-dashboards": "chart",
  "ai-customer-support": "sparkles",
};

const slugOf = (href: string | null) => (href ?? "").split("/").filter(Boolean).pop() ?? "";

/** A menu row: icon tile, name, and one short line. */
function MenuRow({
  label,
  href,
  icon,
  line,
  onNavigate,
}: {
  label: string;
  href: string | null;
  icon?: IconName;
  line?: string;
  onNavigate: () => void;
}) {
  const body = (
    <>
      {icon ? (
        <span className="mrow-icon" aria-hidden="true">
          <Icon name={icon} weight="regular" />
        </span>
      ) : null}
      <span className="mrow-text">
        <span className="mrow-label">{label}</span>
        {line ? <span className="mrow-line">{line}</span> : null}
      </span>
    </>
  );
  if (!href) return <span className="mrow mrow-plain">{body}</span>;
  return (
    <Link prefetch={false} href={href} onClick={onNavigate} className="mrow">
      {body}
    </Link>
  );
}

function MegaFoot({
  href,
  label,
  onNavigate,
  extra,
}: {
  href: string | null;
  label: string;
  onNavigate: () => void;
  extra?: React.ReactNode;
}) {
  if (!href && !extra) return null;
  return (
    <div className="mega-foot">
      {href ? (
        <Link prefetch={false} href={href} onClick={onNavigate} className="mega-foot-link">
          {label}
          <Arrow />
        </Link>
      ) : null}
      {extra}
    </div>
  );
}

function ServicesPanel({
  item,
  onNavigate,
}: {
  item: Extract<MenuItem, { kind: "services" }>;
  onNavigate: () => void;
}) {
  return (
    <div className="mega-pad">
      <div className="mega-cols">
        {item.families.map((f) => (
          <div key={f.id} className="mega-group">
            <p className="mega-group-label">{f.label}</p>
            <ul className="mega-list">
              {f.services.map((s) => {
                const [icon, line] = SERVICE_LINE[slugOf(s.href)] ?? ["code", undefined];
                return (
                  <li key={s.name}>
                    <MenuRow
                      label={s.name}
                      href={s.href}
                      icon={icon}
                      line={line}
                      onNavigate={onNavigate}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <MegaFoot href={item.href} label={FIND_SERVICE} onNavigate={onNavigate} />
    </div>
  );
}

function TechnologiesPanel({
  item,
  uid,
  onNavigate,
}: {
  item: Extract<MenuItem, { kind: "technologies" }>;
  uid: string;
  onNavigate: () => void;
}) {
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<number | undefined>(undefined);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = item.categories.length;
  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % count;
    else if (e.key === "ArrowUp") next = (i - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next >= 0) {
      e.preventDefault();
      e.stopPropagation();
      select(next, true);
    }
  };
  const cat = item.categories[active] ?? item.categories[0]!;
  return (
    <div className="mega-pad">
      <div className="grid grid-cols-[15rem_minmax(0,1fr)] gap-8">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Technology categories"
          className="tech-rail"
        >
          {item.categories.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${c.id}`}
              aria-selected={i === active}
              aria-controls={`${uid}-pane`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                window.clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => select(i), 60);
              }}
              onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
              className="tech-tab"
            >
              <span>{c.label}</span>
              <span className="tech-count" aria-hidden="true">
                {c.all.length}
              </span>
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`${uid}-pane`}
          aria-labelledby={`${uid}-tab-${cat.id}`}
          className="min-w-0"
        >
          <p className="mega-cat-summary">{cat.summary}</p>
          <ul className="mega-list mega-grid-3">
            {cat.items.map((i) => (
              <li key={i.id}>
                <MenuRow label={i.label} href={i.href} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
          <div className="mega-foot">
            <Link
              prefetch={false}
              href={cat.directoryHref}
              onClick={onNavigate}
              className="mega-foot-link"
            >
              {cat.more > 0
                ? `All technologies in this category (${cat.all.length})`
                : "All technologies in this category"}
              <Arrow />
            </Link>
            {item.href ? (
              <Link
                prefetch={false}
                href={item.href}
                onClick={onNavigate}
                className="mega-foot-link"
              >
                View all technologies
                <Arrow />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkPanel({
  item,
  onNavigate,
}: {
  item: Extract<MenuItem, { kind: "work" }>;
  onNavigate: () => void;
}) {
  return (
    <div className="mega-pad">
      <div className="mega-cols mega-cols-work">
        {item.groups.map((g) => (
          <div key={g.id} className="mega-group">
            <p className="mega-group-label">{g.label}</p>
            <ul className="mega-list">
              {g.items.map((i) => (
                <li key={i.id}>
                  <MenuRow label={i.label} href={i.href} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <MegaFoot
        href={item.href}
        label="Our work"
        onNavigate={onNavigate}
        extra={item.extra.map((x) => (
          <Link
            key={x.id}
            prefetch={false}
            href={x.href}
            onClick={onNavigate}
            className="mega-foot-link"
          >
            {x.label}
            <Arrow />
          </Link>
        ))}
      />
    </div>
  );
}

function ListPanel({
  item,
  onNavigate,
}: {
  item: Extract<MenuItem, { kind: "solutions" | "industries" | "resources" | "about" }>;
  onNavigate: () => void;
}) {
  // Long lists (thirty industries) show names only, three to a row.
  const compact = item.items.length > 12;
  return (
    <div className="mega-pad">
      <p className="mega-group-label">{item.heading}</p>
      <ul className={`mega-list ${compact ? "mega-grid-3" : "mega-grid-2"}`}>
        {item.items.map((i) => (
          <li key={i.id}>
            <MenuRow
              label={i.label}
              href={i.href}
              icon={LIST_ICON[slugOf(i.href)]}
              line={compact ? undefined : i.summary}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
      <MegaFoot href={item.href} label={item.allLabel} onNavigate={onNavigate} />
    </div>
  );
}

/* ------------------------------ mobile sections ------------------------------ */

function MobileLinks({
  links,
  onNavigate,
}: {
  links: { id: string; label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <ul className="m-0 list-none p-0">
      {links.map((l) => (
        <li key={l.id} className="py-0 text-[length:var(--fs-body)] leading-snug">
          <Link
            prefetch={false}
            href={l.href}
            onClick={onNavigate}
            className="menu-link inline-flex min-h-11 items-center text-ink"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileSection({
  item,
  open,
  onToggle,
  onNavigate,
  uid,
}: {
  item: MenuItem;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  uid: string;
}) {
  const [cat, setCat] = useState<string | null>(null);
  const bodyId = `${uid}-m-${item.kind}`;
  return (
    <li className="border-b border-line">
      <div className="flex min-h-14 items-center justify-between">
        <span className="font-[family-name:var(--font-heading)] text-[length:var(--fs-nav-mobile)] font-semibold">
          <Entry label={item.label} href={item.href} onNavigate={onNavigate} />
        </span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={`${item.label} sections`}
          onClick={onToggle}
          className="inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center border-0 bg-transparent text-ink"
        >
          <ChevronIcon open={open} />
        </button>
      </div>
      <div id={bodyId} className="nav-expand" data-open={open} inert={!open}>
        <div>
          <div className="pb-4">
            {item.kind === "services" ? (
              <>
                {item.families.map((f) => (
                  <div key={f.id} className="mb-4">
                    <p className="t-eyebrow m-0 mb-1.5">{f.label}</p>
                    <ul className="m-0 list-none p-0">
                      {f.services.map((s) => (
                        <li
                          key={s.name}
                          className="py-1.5 text-[length:var(--fs-body)] leading-snug"
                        >
                          <Entry label={s.name} href={s.href} onNavigate={onNavigate} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {item.href ? (
                  <Link
                    prefetch={false}
                    href={item.href}
                    onClick={onNavigate}
                    className="menu-link inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-heading)] text-[length:var(--fs-body)] font-semibold text-ink"
                  >
                    Not sure? Find your service
                    <Arrow />
                  </Link>
                ) : null}
              </>
            ) : null}
            {item.kind === "technologies" ? (
              <>
                <ul className="m-0 list-none p-0">
                  {item.categories.map((c) => {
                    const id = `${uid}-m-cat-${c.id}`;
                    const isOpen = cat === c.id;
                    return (
                      <li key={c.id} className="border-t border-line first:border-t-0">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={id}
                          onClick={() => setCat(isOpen ? null : c.id)}
                          className="flex min-h-12 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-start font-[family-name:var(--font-heading)] text-[length:var(--fs-body)] font-semibold text-ink"
                        >
                          <span>
                            {c.label}
                            <span className="ml-2 font-normal text-slate-text">{c.all.length}</span>
                          </span>
                          <ChevronIcon open={isOpen} />
                        </button>
                        <div id={id} className="nav-expand" data-open={isOpen} inert={!isOpen}>
                          <div>
                            <div className="pb-2 pl-3">
                              <MobileLinks links={c.items} onNavigate={onNavigate} />
                              <Link
                                prefetch={false}
                                href={c.directoryHref}
                                onClick={onNavigate}
                                className="menu-link inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-heading)] text-[length:var(--fs-body)] font-semibold text-ink"
                              >
                                All technologies in this category
                                <Arrow />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {item.href ? (
                  <Link
                    prefetch={false}
                    href={item.href}
                    onClick={onNavigate}
                    className="menu-link mt-2 inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-heading)] text-[length:var(--fs-body)] font-semibold text-ink"
                  >
                    View all technologies
                    <Arrow />
                  </Link>
                ) : null}
              </>
            ) : null}
            {item.kind === "solutions" ||
            item.kind === "industries" ||
            item.kind === "resources" ||
            item.kind === "about" ? (
              <>
                <p className="t-eyebrow eyebrow-accent m-0 mb-3 uppercase">{item.heading}</p>
                <MobileLinks links={item.items} onNavigate={onNavigate} />
                {item.href ? (
                  <Link
                    prefetch={false}
                    href={item.href}
                    onClick={onNavigate}
                    className="menu-link inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-heading)] text-[length:var(--fs-body)] font-semibold text-ink"
                  >
                    {item.allLabel}
                    <Arrow />
                  </Link>
                ) : null}
              </>
            ) : null}
            {item.kind === "work" ? (
              <>
                <p className="t-eyebrow eyebrow-accent m-0 mb-3 uppercase">{item.heading}</p>
                {item.groups.map((g) => (
                  <div key={g.id} className="mb-3">
                    <p className="t-eyebrow m-0 mb-0.5">{g.label}</p>
                    <MobileLinks links={g.items} onNavigate={onNavigate} />
                  </div>
                ))}
                {item.href ? (
                  <Link
                    prefetch={false}
                    href={item.href}
                    onClick={onNavigate}
                    className="menu-link inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-heading)] text-[length:var(--fs-body)] font-semibold text-ink"
                  >
                    All Work Areas
                    <Arrow />
                  </Link>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------ the header navigation ------------------------------ */

type OpenState = { id: string | null; pinned: boolean };

export function HeaderNav({ model }: Props) {
  const pathname = usePathname();
  const [menu, setMenu] = useState<OpenState>({ id: null, pinned: false });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const mobileBtn = useRef<HTMLButtonElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const timers = useRef<{ open?: number; close?: number }>({});
  const uid = useId();
  const mobilePanelId = `${uid}-mobile`;
  const { items, cta } = model;

  const clearTimers = () => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
  };
  const closeMenus = useCallback(() => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
    setMenu({ id: null, pinned: false });
  }, []);
  const closeAll = useCallback(() => {
    closeMenus();
    setMobileOpen(false);
  }, [closeMenus]);

  // Close menus on navigation: adjust state while rendering when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu({ id: null, pinned: false });
    setMobileOpen(false);
  }

  useEffect(() => () => clearTimers(), []);

  // Clicking or tapping outside an open menu closes it.
  useEffect(() => {
    if (!menu.id) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest("[data-menu-item]")) closeMenus();
    };
    // A safety net for missed leave events (fast exits, leaving the window): any mouse movement
    // outside the open menu item closes it.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      if (!t?.closest("[data-menu-item]")) closeMenus();
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) closeMenus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, [menu.id, closeMenus]);

  const onEnter = (id: string, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timers.current.close);
    if (menu.id === id) return;
    window.clearTimeout(timers.current.open);
    timers.current.open = window.setTimeout(
      () => setMenu({ id, pinned: false }),
      menu.id ? 0 : HOVER_OPEN_MS,
    );
  };
  const onLeave = (id: string, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
    timers.current.close = window.setTimeout(
      () => setMenu((s) => (s.id === id ? { id: null, pinned: false } : s)),
      HOVER_CLOSE_MS,
    );
  };
  const toggle = (id: string) => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
    setMenu((s) => {
      if (s.id !== id) return { id, pinned: true };
      // A menu opened by hover is pinned open by a click; a pinned menu closes.
      return s.pinned ? { id: null, pinned: false } : { id, pinned: true };
    });
  };
  const focusFirst = (li: HTMLElement | null) => {
    window.setTimeout(() => {
      li?.querySelector<HTMLElement>(
        ".nav-panel a[href], .nav-panel [role=tab][tabindex='0']",
      )?.focus();
    }, 30);
  };

  // Mobile menu: focus trap, Escape, scroll lock, focus return.
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = mobilePanel.current;
    const focusables = () => [
      ...(mobileBtn.current ? [mobileBtn.current] : []),
      ...Array.from(
        panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      ).filter((el) => !el.closest("[inert]")),
    ];
    const background = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer[data-site-footer], .skip-link"),
    );
    background.forEach((el) => el.setAttribute("inert", ""));
    panel?.querySelector<HTMLElement>("a[href], button")?.focus();
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
      if (window.matchMedia("(min-width: 80rem)").matches) setMobileOpen(false);
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
  const hasMenu = (item: NavItemModel): item is MenuItem =>
    item.kind !== "link" &&
    !(item.kind === "technologies" && item.categories.length === 0) &&
    !(item.kind === "work" && item.groups.length === 0) &&
    !(
      (item.kind === "solutions" ||
        item.kind === "industries" ||
        item.kind === "resources" ||
        item.kind === "about") &&
      item.items.length === 0
    );

  return (
    <>
      <div className="ml-auto flex h-full items-center">
        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden h-full min-[80rem]:block">
          <ul
            className="m-0 flex h-full list-none items-stretch gap-4 p-0 font-[family-name:var(--font-heading)] font-semibold"
            style={{ fontSize: "var(--fs-nav)" }}
          >
            {items.map((item) => {
              if (!hasMenu(item)) {
                return (
                  <li key={item.label} className="flex items-center">
                    {item.href ? (
                      <Link
                        prefetch={false}
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="nav-link inline-flex min-h-11 items-center text-ink"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center text-slate-text">
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              }
              const id = item.kind;
              const open = menu.id === id;
              const panelId = `${uid}-panel-${id}`;
              return (
                <li
                  key={item.label}
                  data-menu-item={id}
                  className="flex items-center"
                  onPointerEnter={(e) => onEnter(id, e)}
                  onPointerLeave={(e) => onLeave(id, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && open) {
                      e.stopPropagation();
                      const inside = e.currentTarget.contains(document.activeElement);
                      closeMenus();
                      if (inside)
                        e.currentTarget.querySelector<HTMLElement>("[data-chevron]")?.focus();
                    }
                  }}
                  onBlur={(e) => {
                    if (
                      menu.pinned &&
                      open &&
                      !e.currentTarget.contains(e.relatedTarget as Node | null)
                    )
                      closeMenus();
                  }}
                >
                  <div className="inline-flex items-center">
                    {item.href ? (
                      <Link
                        prefetch={false}
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="nav-link inline-flex min-h-11 items-center text-ink"
                        data-open={open}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center">{item.label}</span>
                    )}
                    <button
                      type="button"
                      data-chevron
                      aria-expanded={open}
                      aria-controls={panelId}
                      aria-label={`${item.label} menu`}
                      onClick={() => toggle(id)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          window.clearTimeout(timers.current.close);
                          setMenu({ id, pinned: true });
                          focusFirst(e.currentTarget.closest("li"));
                        }
                      }}
                      className="nav-chevron"
                    >
                      <ChevronIcon open={open} />
                    </button>
                  </div>
                  <div
                    id={panelId}
                    data-open={open}
                    inert={!open}
                    className="nav-panel nav-mega absolute inset-x-0 top-full border-b border-line bg-white shadow-[0_18px_40px_-24px_rgba(17,24,39,0.35)]"
                  >
                    <div className="mega-wrap">
                      <MegaIntro item={item} proof={model.proof} onNavigate={closeAll} />
                      <div className="mega-body">
                        {item.kind === "services" ? (
                          <ServicesPanel item={item} onNavigate={closeAll} />
                        ) : item.kind === "technologies" ? (
                          <TechnologiesPanel item={item} uid={panelId} onNavigate={closeAll} />
                        ) : item.kind === "work" ? (
                          <WorkPanel item={item} onNavigate={closeAll} />
                        ) : (
                          <ListPanel item={item} onNavigate={closeAll} />
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 min-[80rem]:gap-0 min-[80rem]:pl-4">
          <SiteSearch className="max-[29.99rem]:hidden" />
          <Link
            prefetch={false}
            href={cta.href}
            className="btn btn-primary hidden min-h-11 whitespace-nowrap px-4 min-[23rem]:inline-flex min-[80rem]:ml-4 min-[80rem]:px-[1.25rem]"
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
            className="ml-1 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink bg-transparent px-3 font-[family-name:var(--font-heading)] text-[length:var(--fs-label)] font-semibold text-ink min-[80rem]:hidden"
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

      {/* Mobile and tablet sheet */}
      <div
        ref={mobilePanel}
        id={mobilePanelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-open={mobileOpen}
        inert={!mobileOpen}
        className="nav-panel fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col bg-paper min-[80rem]:hidden"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="container-site py-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                window.setTimeout(() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT)), 50);
              }}
              className="search-row"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m13 13 4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              Search services, technologies, and work
            </button>
            <ul className="m-0 mt-2 list-none p-0">
              {items.map((item) =>
                hasMenu(item) ? (
                  <MobileSection
                    key={item.label}
                    item={item}
                    uid={uid}
                    open={mobileSection === item.kind}
                    onToggle={() => setMobileSection((s) => (s === item.kind ? null : item.kind))}
                    onNavigate={closeAll}
                  />
                ) : (
                  <li key={item.label} className="border-b border-line">
                    <span className="flex min-h-14 items-center font-[family-name:var(--font-heading)] text-[length:var(--fs-nav-mobile)] font-semibold">
                      <Entry label={item.label} href={item.href} onNavigate={closeAll} />
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-line bg-paper pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="container-site">
            <Link
              prefetch={false}
              href={cta.href}
              onClick={closeAll}
              className="btn btn-primary w-full"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
