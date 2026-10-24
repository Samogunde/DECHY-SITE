/**
 * Site-wide constants and environment-derived configuration.
 *
 * The public origin is one setting (SITE_ORIGIN) because the final domain is undecided
 * (decision DEC-02, deferred). Nothing else in the codebase hard-codes a domain.
 */

export const SITE_NAME = "DECHY";
/** Exact official descriptor. Never shorten or alter (AGENTS 1A.2). */
export const DESCRIPTOR = "Technology, Software, AI & Digital Solutions";
export const DEFAULT_LOCALE = "en";
export const ORG_ID_FRAGMENT = "#organization";
export const WEBSITE_ID_FRAGMENT = "#website";

export function siteOrigin(): string {
  const raw = (process.env.SITE_ORIGIN ?? "http://localhost:3000").trim();
  return raw.replace(/\/+$/, "");
}

/** Search indexing is off unless explicitly enabled (previews and pre-domain environments). */
export function indexingEnabled(): boolean {
  if ((process.env.SITE_INDEXING ?? "false").trim().toLowerCase() !== "true") return false;
  // Only the production deploy of the main address is indexed (owner, 25 October 2026): deploy
  // previews, branch deploys, and the netlify.app address stay noindex.
  const context = process.env.CONTEXT;
  if (context && context !== "production") return false;
  return /^https:\/\/www\.dechytech\.com\/?$/.test((process.env.SITE_ORIGIN ?? "").trim());
}

/** Absolute URL for a site path. Paths always carry a leading and trailing slash. */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${p}`;
}
