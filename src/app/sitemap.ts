import type { MetadataRoute } from "next";
import { getRegistry } from "@/lib/content/load";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Generated only from approved indexable page records (AGENTS 54). */
export default function sitemap(): MetadataRoute.Sitemap {
  const { pages } = getRegistry();
  return pages
    .filter((p) => p.indexing === "index")
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((p) => ({ url: absoluteUrl(p.path), lastModified: p.dateModified }));
}
