import type { Registry } from "./load";
import type { Page } from "./schema";

export type Crumb = { label: string; path: string };

/** Breadcrumbs mirror the information architecture: Home, optional parent chain, current page. */
export function breadcrumbsFor(page: Page, registry: Registry): Crumb[] {
  const chain: Crumb[] = [];
  let current: Page | undefined = page;
  const seen = new Set<string>();
  while (current) {
    if (seen.has(current.path)) throw new Error(`Breadcrumb cycle at ${current.path}`);
    seen.add(current.path);
    chain.unshift({ label: current.breadcrumbLabel, path: current.path });
    current = current.parent ? registry.pageByPath.get(current.parent) : undefined;
  }
  if (chain[0]?.path !== "/") {
    const home = registry.pageByPath.get("/");
    chain.unshift({ label: home?.breadcrumbLabel ?? "Home", path: "/" });
  }
  return chain;
}
