import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { JsonLd } from "@/components/primitives/JsonLd";
import { Inline } from "@/components/primitives/Inline";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { getPage, getRegistry } from "@/lib/content/load";
import { buildGraph } from "@/lib/seo/structured-data";
import { BlockRenderer } from "./BlockRenderer";
import { AtAGlance, SectionNav } from "./GuidanceBlocks";

/** Renders any page record: structured data, header (for pages without a hero), then its blocks. */
export function PageView({ path }: { path: string }) {
  const registry = getRegistry();
  const page = getPage(path);
  const crumbs = breadcrumbsFor(page, registry);
  const hasHero = page.sections.some((b) => b.type === "hero");
  const graph = buildGraph(page, registry);
  const guided = page.kind !== "home" && page.kind !== "contact" && page.kind !== "legal";
  const primaryCta = page.sections.find((b) => b.type === "cta");
  const glanceCta = primaryCta && primaryCta.type === "cta" ? primaryCta.primary : undefined;
  const navItems = page.sections
    .filter((b) => b.type !== "hero" && b.type !== "cta" && "label" in b && b.label)
    .map((b) => ({ id: b.id, label: (b as { label: string }).label }));
  const showNav = guided && navItems.length >= 6;
  const first = page.sections[0];
  const rest = first?.type === "hero" ? page.sections.slice(1) : page.sections;

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
      {first?.type === "hero" ? (
        <BlockRenderer
          block={first}
          breadcrumbs={first.variant !== "home" ? <Breadcrumbs crumbs={crumbs} /> : undefined}
        />
      ) : null}
      {guided && page.comprehension ? (
        <AtAGlance comprehension={page.comprehension} cta={glanceCta} />
      ) : null}
      {showNav ? <SectionNav items={navItems} /> : null}
      {rest.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
