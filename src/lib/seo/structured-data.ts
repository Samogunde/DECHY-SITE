/**
 * JSON-LD generated from the content model. Nothing is hand-typed per page.
 * Only evidenced properties are emitted: no LocalBusiness, address, ratings, reviews, awards,
 * employee counts, or sameAs entries (no external profiles are confirmed). The Organization
 * description uses the exact descriptor; foundingDate comes from the approved facts register.
 */
import type { Graph, Thing } from "schema-dts";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { toPlainText } from "@/lib/content/inline";
import type { Registry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { entityPath } from "@/lib/content/urls";
import {
  DESCRIPTOR,
  ORG_ID_FRAGMENT,
  SITE_NAME,
  WEBSITE_ID_FRAGMENT,
  absoluteUrl,
  siteOrigin,
} from "@/lib/site";

export const orgId = () => `${siteOrigin()}/${ORG_ID_FRAGMENT}`;
export const websiteId = () => `${siteOrigin()}/${WEBSITE_ID_FRAGMENT}`;

function fact(registry: Registry, id: string): string {
  const f = registry.facts.get(id);
  if (!f) throw new Error(`Missing fact ${id}`);
  return f.value;
}

export function organizationNode(registry: Registry): Thing {
  return {
    "@type": "Organization",
    "@id": orgId(),
    name: SITE_NAME,
    url: `${siteOrigin()}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/dechy-logo-primary.png"),
      width: "1536",
      height: "676",
    },
    description: `${DESCRIPTOR}. ${fact(registry, "company.breadth")}`,
    foundingDate: fact(registry, "company.founded"),
    areaServed: "Worldwide",
    knowsAbout: registry.services.map((s) => s.name),
  } as Thing;
}

export function websiteNode(): Thing {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    url: `${siteOrigin()}/`,
    name: SITE_NAME,
    description: DESCRIPTOR,
    inLanguage: "en",
    publisher: { "@id": orgId() },
  } as Thing;
}

export function buildGraph(page: Page, registry: Registry): Graph {
  const url = absoluteUrl(page.path);
  const crumbs = breadcrumbsFor(page, registry);
  const pageType = page.schemaTypes.includes("ContactPage")
    ? "ContactPage"
    : page.schemaTypes.includes("AboutPage")
      ? "AboutPage"
      : page.schemaTypes.includes("CollectionPage")
        ? "CollectionPage"
        : "WebPage";
  const nodes: Thing[] = [organizationNode(registry), websiteNode()];

  nodes.push({
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId() },
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    ...(page.kind === "home" ? { about: { "@id": orgId() } } : {}),
    ...(crumbs.length > 1 ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  } as Thing);

  if (crumbs.length > 1) {
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        item: absoluteUrl(c.path),
      })),
    } as Thing);
  }

  if (page.schemaTypes.includes("Service") && page.entityId) {
    const entity = registry.nodes.get(page.entityId);
    const svc = registry.services.find((s) => s.id === page.entityId);
    if (entity && svc) {
      nodes.push({
        "@type": "Service",
        "@id": `${url}#service`,
        name: entity.name,
        serviceType: entity.name,
        description: svc.short,
        url,
        provider: { "@id": orgId() },
        areaServed: "Worldwide",
        mainEntityOfPage: { "@id": `${url}#webpage` },
      } as Thing);
    }
  }

  if (page.schemaTypes.includes("CollectionPage")) {
    const items = listedPages(page, registry);
    if (items.length > 0) {
      nodes.push({
        "@type": "ItemList",
        "@id": `${url}#list`,
        isPartOf: { "@id": `${url}#webpage` },
        numberOfItems: items.length,
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          url: absoluteUrl(it.path),
        })),
      } as Thing);
    }
  }

  if (page.schemaTypes.includes("FAQPage")) {
    for (const block of page.sections) {
      if (block.type !== "faq") continue;
      nodes.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: block.items.map((item) => ({
          "@type": "Question",
          name: toPlainText(item.q, registry.facts),
          acceptedAnswer: {
            "@type": "Answer",
            text: toPlainText(item.a.replace(/\n\n/g, " "), registry.facts),
          },
        })),
      } as Thing);
    }
  }

  return { "@context": "https://schema.org", "@graph": nodes } as Graph;
}

/** The built pages a hub page points to, in the order the page lists them (for ItemList). */
export function listedPages(page: Page, registry: Registry): { name: string; path: string }[] {
  const out = new Map<string, string>();
  const add = (path: string | null | undefined, name: string) => {
    if (!path || path === page.path) return;
    const target = registry.pageByPath.get(path.split(/[?#]/)[0] ?? "");
    if (target && !out.has(target.path)) out.set(target.path, name);
  };
  for (const b of page.sections) {
    if (b.type === "pathfinder") for (const p of b.paths) add(p.href, p.need);
    if (b.type === "index")
      for (const i of b.items) {
        if (i.href) add(i.href, i.title);
        else if (i.ref) {
          const node = registry.nodes.get(i.ref);
          if (node) add(entityPath(node, registry), node.name);
        }
      }
    if (b.type === "service-index")
      for (const svc of registry.services) {
        const node = registry.nodes.get(svc.id);
        if (node) add(entityPath(node, registry), svc.name);
      }
  }
  return [...out].map(([path, name]) => ({ path, name }));
}
