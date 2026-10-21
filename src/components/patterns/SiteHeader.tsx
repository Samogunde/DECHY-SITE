import Link from "next/link";
import { getRegistry } from "@/lib/content/load";
import { buildNavModel } from "@/lib/nav";
import { HeaderNav } from "./HeaderNav";
import { Logo } from "./Logo";
import { SiteDrawer, type DrawerLink } from "./SiteDrawer";

/** Quick links for the menu drawer; a link to a home section appears only when that section exists. */
function drawerLinks(): DrawerLink[] {
  const registry = getRegistry();
  const home = registry.pageByPath.get("/");
  const has = (id: string) => Boolean(home?.sections.some((b) => "id" in b && b.id === id));
  const all: (DrawerLink & { ok: boolean })[] = [
    {
      label: "Our impact",
      href: "/#numbers",
      text: "What we have delivered",
      icon: "growth",
      ok: has("numbers"),
    },
    {
      label: "Our work",
      href: "/work/",
      text: "Systems we design and build",
      icon: "grid",
      ok: true,
    },
    {
      label: "Clients",
      href: "/#clients",
      text: "Teams we work with",
      icon: "users",
      ok: has("clients"),
    },
    {
      label: "Testimonials",
      href: registry.pageByPath.has("/testimonials/") ? "/testimonials/" : "/#testimonials",
      text: "What clients say",
      icon: "quote",
      ok: registry.pageByPath.has("/testimonials/") || has("testimonials"),
    },
    {
      label: "Partnership",
      href: "/#partners",
      text: "Platforms and partners",
      icon: "handshake",
      ok: has("partners"),
    },
    {
      label: "How we work",
      href: "/company/how-we-work/",
      text: "From first call to support",
      icon: "steps",
      ok: true,
    },
    { label: "Insights", href: "/resources/", text: "Guides and articles", icon: "book", ok: true },
    {
      label: "About us",
      href: "/company/",
      text: "Who we are and how we work",
      icon: "info",
      ok: true,
    },
    { label: "Contact", href: "/contact/", text: "Tell us what you need", icon: "mail", ok: true },
  ];
  return all
    .filter((l) => l.ok && (l.href.startsWith("/#") || registry.pageByPath.has(l.href)))
    .map(({ label, href, text, icon }) => ({ label, href, text, icon }));
}

/** The services most visitors come for, shown as quick chips in the drawer. */
function drawerServices(): { label: string; href: string }[] {
  const registry = getRegistry();
  const pick: [string, string][] = [
    ["/software-development/", "Custom software"],
    ["/web-development/", "Websites and web apps"],
    ["/mobile-app-development/", "Mobile apps"],
    ["/ai/", "AI"],
    ["/automation/", "Automation"],
    ["/ecommerce/", "Ecommerce"],
  ];
  return pick
    .filter(([href]) => registry.pageByPath.has(href))
    .map(([href, label]) => ({ href, label }));
}

export function SiteHeader() {
  const model = buildNavModel(getRegistry());
  return (
    <header
      data-site-header
      className="site-header-dark sticky top-0 z-50 border-b border-line bg-paper"
      style={{ height: "var(--header-h)" }}
    >
      <div className="container-site flex h-full items-center gap-4">
        <Link href="/" aria-label="DECHY home" className="flex min-h-11 shrink-0 items-center">
          <Logo
            tone="dark"
            priority
            sizes="(min-width: 80rem) 190px, 170px"
            className="h-6 min-[30rem]:h-7 min-[80rem]:h-8"
          />
        </Link>
        <HeaderNav model={model} />
        <SiteDrawer
          links={drawerLinks()}
          services={drawerServices()}
          cta={model.cta}
          proof={model.proof}
        />
      </div>
    </header>
  );
}
