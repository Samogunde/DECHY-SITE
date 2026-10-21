/**
 * The navigation model: one pure function from the registry to everything the header, the mobile
 * menu, the directory, and the tests need. Menus list only destinations that exist (a published
 * page), in editorial order, so a menu can never contain a dead end and a new page appears the
 * moment it is published and placed in a category.
 */
import type { Registry } from "./content/load";
import { publishedPath } from "./content/urls";

export type NavLinkModel = { id: string; label: string; href: string };

export type TechCategoryModel = {
  id: string;
  label: string;
  summary: string;
  /** The items shown in the menu (at most the menu limit). */
  items: NavLinkModel[];
  /** Every published technology in the category, in editorial order. */
  all: NavLinkModel[];
  /** Published pages in the category beyond the menu limit. */
  more: number;
  /** Where "All technologies in this category" goes. */
  directoryHref: string;
};

export type NavSummaryLink = NavLinkModel & { summary: string };

export type WorkGroupModel = { id: string; label: string; items: NavLinkModel[] };

export type NavItemModel =
  | {
      kind: "services";
      label: string;
      href: string | null;
      families: {
        id: string;
        label: string;
        services: { name: string; href: string | null; micro: string }[];
      }[];
    }
  | {
      kind: "technologies";
      label: string;
      href: string | null;
      categories: TechCategoryModel[];
    }
  | {
      kind: "work";
      label: string;
      href: string | null;
      heading: string;
      groups: WorkGroupModel[];
      /** Proof pages that exist (case studies, testimonials), linked at the foot of the menu. */
      extra: NavLinkModel[];
    }
  | {
      kind: "solutions" | "industries" | "resources";
      label: string;
      href: string | null;
      heading: string;
      allLabel: string;
      items: NavSummaryLink[];
    }
  | { kind: "link"; label: string; href: string | null };

export type NavModel = {
  items: NavItemModel[];
  cta: { label: string; href: string };
  /** Approved company facts shown in the menus. */
  proof: { clients: string; founded: string };
};

export function buildNavModel(registry: Registry): NavModel {
  const published = (id: string): NavLinkModel | null => {
    const node = registry.nodes.get(id);
    const href = publishedPath(node, registry);
    return node && href ? { id, label: node.name, href } : null;
  };
  const hub = (path: string) => (registry.pageByPath.has(path) ? path : null);

  const items: NavItemModel[] = registry.nav.primary.map((item): NavItemModel => {
    const href = hub(item.path);
    if (item.kind === "services") {
      return {
        kind: "services",
        label: item.label,
        href,
        families: registry.families.map((f) => ({
          id: f.id,
          label: f.label,
          services: registry.services
            .filter((s) => s.family === f.id)
            .map((s) => ({
              name: s.name,
              micro: s.micro,
              href: publishedPath(registry.nodes.get(s.id), registry),
            })),
        })),
      };
    }
    if (item.kind === "technologies") {
      const limit = registry.nav.technologies.menuLimit;
      const categories = registry.nav.technologies.categories
        .map((c): TechCategoryModel => {
          const all = c.items.map(published).filter((x): x is NavLinkModel => !!x);
          return {
            id: c.id,
            label: c.label,
            summary: c.summary,
            items: all.slice(0, limit),
            all,
            more: Math.max(0, all.length - limit),
            directoryHref: `/technologies/#cat-${c.id}`,
          };
        })
        .filter((c) => c.all.length > 0);
      return { kind: "technologies", label: item.label, href, categories };
    }
    if (item.kind === "work") {
      const groups = registry.nav.work.groups
        .map((g) => ({
          id: g.id,
          label: g.label,
          items: g.items.map(published).filter((x): x is NavLinkModel => !!x),
        }))
        .filter((g) => g.items.length > 0);
      // Proof pages that exist (case studies, testimonials), linked at the foot of the menu.
      const extra: NavLinkModel[] = [
        ...(registry.pages.some((p) => p.kind === "case-study")
          ? [{ id: "case-studies", label: "Case studies", href: "/work/#case-studies" }]
          : []),
        ...(registry.pageByPath.has("/testimonials/")
          ? [{ id: "testimonials", label: "Testimonials", href: "/testimonials/" }]
          : []),
      ];
      return {
        kind: "work",
        label: item.label,
        href,
        heading: registry.nav.work.heading,
        groups,
        extra,
      };
    }
    if (item.kind === "solutions" || item.kind === "industries") {
      const list = registry.nav[item.kind];
      const items = list.items
        .map((i): NavSummaryLink | null => {
          const link = published(i.id);
          return link ? { ...link, summary: i.summary } : null;
        })
        .filter((x): x is NavSummaryLink => !!x);
      return {
        kind: item.kind,
        label: item.label,
        href,
        heading: list.heading,
        allLabel: list.allLabel,
        items,
      };
    }
    if (item.kind === "resources") {
      const list = registry.nav.resources;
      const has = (category: string) =>
        registry.pages.some((p) => p.kind === "article" && p.article?.category === category);
      const items = list.links
        .filter((l) => (!l.when || has(l.when)) && hub(l.path.split("#")[0] ?? ""))
        .map((l) => ({ id: l.path, label: l.label, href: l.path, summary: l.summary }));
      return {
        kind: "resources",
        label: item.label,
        href,
        heading: list.heading,
        allLabel: list.allLabel,
        items,
      };
    }
    return { kind: "link", label: item.label, href };
  });

  return {
    items,
    cta: { label: registry.nav.cta.label, href: registry.nav.cta.path },
    proof: {
      clients: registry.facts.get("company.clients")?.value ?? "",
      founded: registry.facts.get("company.founded")?.value ?? "",
    },
  };
}

/** Every destination a menu can contain, for tests and link checks. */
export function navDestinations(model: NavModel): string[] {
  const out: string[] = [model.cta.href];
  for (const item of model.items) {
    if (item.href) out.push(item.href);
    if (item.kind === "services")
      for (const f of item.families) for (const s of f.services) if (s.href) out.push(s.href);
    if (item.kind === "technologies")
      for (const c of item.categories) for (const i of c.all) out.push(i.href);
    if (item.kind === "work")
      for (const g of item.groups) for (const i of g.items) out.push(i.href);
    if (item.kind === "solutions" || item.kind === "industries" || item.kind === "resources")
      for (const i of item.items) out.push(i.href);
  }
  return out;
}
