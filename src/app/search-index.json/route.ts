import { getRegistry } from "@/lib/content/load";
import { buildSearchEntries } from "@/lib/search";

export const dynamic = "force-static";

/** The site search index: published, indexable pages only, one cacheable static file. */
export function GET() {
  return Response.json(buildSearchEntries(getRegistry()), {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
