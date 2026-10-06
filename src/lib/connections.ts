/**
 * "Where this connects": one consistent set of rails for service, technology, and Work Area pages,
 * built from the page's authored related groups plus the entity graph, so every direction a visitor
 * might take (services, technologies, systems we build, problems and solutions, industries) is
 * offered the same way on every page. A published page is a link; an unbuilt solution, industry, or
 * technology is plain text. Nothing is duplicated as a page.
 */
import type { Registry } from "./content/load";
import type { Page } from "./content/schema";
import { publishedPath } from "./content/urls";

export type ConnectionItem = { id: string; label: string; href: string | null };
export type ConnectionRail = { id: string; title: string; items: ConnectionItem[] };

const TECH_TYPES = new Set([
  "technology",
  "platform",
  "language",
  "framework",
  "provider",
  "tool",
  "integration",
]);

const RAILS: { id: string; title: string; match: (type: string) => boolean }[] = [
  { id: "services", title: "Services", match: (t) => t === "service" },
  { id: "technologies", title: "Technologies", match: (t) => TECH_TYPES.has(t) },
  { id: "systems", title: "Systems we build", match: (t) => t === "work-area" },
  { id: "solutions", title: "Business problems and solutions", match: (t) => t === "solution" },
  { id: "industries", title: "Where it applies", match: (t) => t === "industry" },
];

export const CONNECTION_RAIL_LIMIT = 8;

export function connectionsFor(page: Page, registry: Registry): ConnectionRail[] {
  const self = page.entityId;
  const authored: string[] = [];
  for (const b of page.sections)
    if (b.type === "related") for (const g of b.groups) authored.push(...g.entityIds);

  const inbound: string[] = [];
  if (self)
    for (const r of registry.relations) {
      if (r.from === self) inbound.push(r.to);
      else if (r.to === self) inbound.push(r.from);
    }

  const seen = new Set<string>(self ? [self] : []);
  const ordered: string[] = [];
  for (const id of [...authored, ...inbound]) {
    if (seen.has(id) || !registry.nodes.has(id)) continue;
    seen.add(id);
    ordered.push(id);
  }

  const rails: ConnectionRail[] = [];
  for (const rail of RAILS) {
    const items: ConnectionItem[] = ordered
      .filter((id) => rail.match(registry.nodes.get(id)!.type))
      .map((id) => {
        const node = registry.nodes.get(id)!;
        return { id, label: node.name, href: publishedPath(node, registry) };
      });
    // Destinations first, then names that have no page yet, each in authored order.
    const linked = items.filter((i) => i.href);
    const plain = items.filter((i) => !i.href);
    const all = [...linked, ...plain].slice(0, CONNECTION_RAIL_LIMIT);
    if (all.length) rails.push({ id: rail.id, title: rail.title, items: all });
  }
  return rails;
}

export const CONNECTS_KINDS = new Set(["service", "technology", "work-area"]);
