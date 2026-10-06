import Link from "next/link";
import { getRegistry } from "@/lib/content/load";
import { publishedPath } from "@/lib/content/urls";
import { HeaderNav, type NavFamily, type NavPrimary } from "./HeaderNav";
import { Logo } from "./Logo";

export function SiteHeader() {
  const registry = getRegistry();
  const primary: NavPrimary[] = registry.nav.primary.map((item) =>
    item.kind === "menu"
      ? { label: item.label, kind: "menu", href: null }
      : {
          label: item.label,
          kind: "link",
          href: registry.pageByPath.has(item.path) ? item.path : null,
        },
  );
  const families: NavFamily[] = registry.families.map((f) => ({
    id: f.id,
    label: f.label,
    services: registry.services
      .filter((s) => s.family === f.id)
      .map((s) => ({
        name: s.name,
        micro: s.micro,
        href: publishedPath(registry.nodes.get(s.id), registry),
      })),
  }));
  const cta = { label: registry.nav.cta.label, href: registry.nav.cta.path };
  const allServices = registry.pageByPath.has("/services/") ? "/services/" : null;
  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-line bg-paper"
      style={{ height: "var(--header-h)" }}
    >
      <div className="container-site flex h-full items-center gap-4">
        <Link href="/" aria-label="DECHY home" className="block shrink-0 py-1.5">
          <Logo
            priority
            sizes="(min-width: 74rem) 220px, 180px"
            className="h-9 min-[30rem]:h-10 min-[74rem]:h-[3.25rem]"
          />
        </Link>
        <HeaderNav primary={primary} families={families} cta={cta} allServices={allServices} />
      </div>
    </header>
  );
}
