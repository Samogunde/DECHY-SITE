import { getRegistry } from "@/lib/content/load";
import { buildArticleEntries } from "@/lib/search";

export const dynamic = "force-static";

/** The Resources search index: the full text of every published article, one static file. */
export function GET() {
  return Response.json(buildArticleEntries(getRegistry()), {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
