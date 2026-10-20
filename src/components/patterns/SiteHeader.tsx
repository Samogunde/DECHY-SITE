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
      text: "What we have delivered since we started",
      ok: has("numbers"),
    },
    {
      label: "Our work",
      href: "/work/",
      text: "The kinds of system we design and build",
      ok: true,
    },
    { label: "Clients", href: "/#clients", text: "Teams we work with", ok: has("clients") },
    {
      label: "Testimonials",
      href: "/#testimonials",
      text: "What clients say about working with us",
      ok: has("testimonials"),
    },
    {
      label: "How we work",
      href: "/company/how-we-work/",
      text: "Our process, from first call to support",
      ok: true,
    },
    {
      label: "Insights",
      href: "/resources/",
      text: "Guides and articles for better technology decisions",
      ok: true,
    },
    { label: "Company", href: "/company/", text: "Who we are and who we help", ok: true },
    { label: "Contact", href: "/contact/", text: "Tell us what you want to build", ok: true },
  ];
  return all
    .filter((l) => l.ok && (l.href.startsWith("/#") || registry.pageByPath.has(l.href)))
    .map(({ label, href, text }) => ({ label, href, text }));
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
        <Link
          href="/"
          aria-label="DECHY home"
          className="logo-pill flex min-h-11 shrink-0 items-center"
        >
          <Logo
            priority
            sizes="(min-width: 80rem) 190px, 170px"
            className="h-6 min-[30rem]:h-7 min-[80rem]:h-8"
          />
        </Link>
        <HeaderNav model={model} />
        <SiteDrawer links={drawerLinks()} cta={model.cta} />
      </div>
    </header>
  );
}
