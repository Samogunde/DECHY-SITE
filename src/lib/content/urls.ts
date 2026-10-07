/**
 * URL architecture (approved rules, plan section 20).
 * Lowercase, hyphenated, trailing slash. Technologies, platforms, integrations, and
 * sub-capabilities live under their primary service. Hubs are flat.
 */
import type { Node, Registry } from "./load";

const HUB: Partial<Record<Node["type"], string>> = {
  industry: "industries",
  solution: "solutions",
  country: "locations",
};

/** The path an entity would have if its page existed, or null if its type never has a page. */
export function entityPath(node: Node, registry: Registry): string | null {
  if (node.type === "service") return `/${node.slug}/`;
  if (node.type === "work-area") return `/work/areas/${node.slug}/`;
  const hub = HUB[node.type];
  if (hub) return `/${hub}/${node.slug}/`;
  // Business types and problems never get their own page family (DEC-07).
  if (node.type === "business-type" || node.type === "problem") return null;
  const parent = node.primaryService ? registry.nodes.get(node.primaryService) : undefined;
  if (!parent) return null;
  return `/${parent.slug}/${node.slug}/`;
}

/** Whether a real page exists for the entity right now. Unbuilt references render as plain text. */
export function publishedPath(node: Node | undefined, registry: Registry): string | null {
  if (!node) return null;
  const p = entityPath(node, registry);
  return p && registry.pageByPath.has(p) ? p : null;
}

/**
 * Where an entity without a page of its own is represented by its canonical home: business types
 * on Who we work with (they never get pages, DEC-07), and the ecommerce sector on the Ecommerce
 * service. Null when no page represents it, in which case it stays plain text.
 */
export function representedPath(node: Node | undefined, registry: Registry): string | null {
  if (!node) return null;
  let p: string | null = null;
  if (node.type === "business-type") p = "/company/who-we-work-with/";
  else if (node.id === "ind.ecommerce") p = "/ecommerce/";
  return p && registry.pageByPath.has(p) ? p : null;
}

export function pathExists(pathname: string, registry: Registry): boolean {
  return registry.pageByPath.has(pathname);
}
