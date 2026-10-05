import type { MetadataRoute } from "next";
import { absoluteUrl, indexingEnabled } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Until the final domain is chosen and indexing is approved (SITE_INDEXING=true), every crawler is
 * disallowed. Once enabled, search and AI retrieval crawlers are allowed; the API route is excluded.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
