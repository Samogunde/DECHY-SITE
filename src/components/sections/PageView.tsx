import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { JsonLd } from "@/components/primitives/JsonLd";
import { Inline } from "@/components/primitives/Inline";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { getPage, getRegistry } from "@/lib/content/load";
import { buildGraph } from "@/lib/seo/structured-data";
import { BlockRenderer } from "./BlockRenderer";

/** Renders any page record: structured data, header (for pages without a hero), then its blocks. */
export function PageView({ path }: { path: string }) {
  const registry = getRegistry();
  const page = getPage(path);
  const crumbs = breadcrumbsFor(page, registry);
  const hasHero = page.sections.some((b) => b.type === "hero");
  const graph = buildGraph(page, registry);

  return (
    <>
      <JsonLd data={graph} />
      {!hasHero ? (
        <header className="tone-paper pb-10 pt-6 min-[48rem]:pb-14">
          <div className="container-site">
            <div className="mb-8 min-[48rem]:mb-12">
              <Breadcrumbs crumbs={crumbs} />
            </div>
            <h1 className="t-h1 max-w-[20ch]">{page.h1 ?? page.title}</h1>
            {page.lead ? (
              <p className="t-lead mt-5">
                <Inline text={page.lead} />
              </p>
            ) : null}
          </div>
        </header>
      ) : null}
      {page.sections.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          breadcrumbs={
            block.type === "hero" && block.variant === "service" ? (
              <Breadcrumbs crumbs={crumbs} />
            ) : undefined
          }
        />
      ))}
    </>
  );
}
