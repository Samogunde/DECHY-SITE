import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { JsonLd } from "@/components/primitives/JsonLd";
import { Inline } from "@/components/primitives/Inline";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { getPage, getRegistry } from "@/lib/content/load";
import { CONNECTS_KINDS } from "@/lib/connections";
import { buildGraph } from "@/lib/seo/structured-data";
import { Figure } from "@/components/figures/Figure";
import { BlockRenderer } from "./BlockRenderer";
import { articlePages } from "./DiscoveryBlocks";
import { IndustryProfile, SolutionBlueprint, SystemFrame, TechProfile } from "./FamilyHero";
import { AtAGlance, SectionNav } from "./GuidanceBlocks";
import { DraftFrame } from "./HomeBlocks";

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
    .filter(
      (b) =>
        b.type !== "hero" &&
        b.type !== "cta" &&
        "label" in b &&
        b.label &&
        (b.type !== "articles" || articlePages(registry).length > 0),
    )
    .map((b) => ({
      id: b.id,
      label:
        b.type === "related" && CONNECTS_KINDS.has(page.kind)
          ? "Where this connects"
          : (b as { label: string }).label,
    }));
  const showNav = guided && navItems.length >= 6;
  const first = page.sections[0];
  const rest = first?.type === "hero" ? page.sections.slice(1) : page.sections;

  // Each page family opens differently. Technology and industry pages show a profile beside the
  // headline and move the hero's teaching diagram next to the opening text; solution pages show
  // the answer as a blueprint.
  const hero = first?.type === "hero" ? first : undefined;
  const heroVisual = Boolean(hero && (hero.spec || hero.figure));
  const aside =
    hero && page.kind === "technology" ? (
      <TechProfile page={page} registry={registry} />
    ) : hero && page.kind === "industry" ? (
      <IndustryProfile page={page} registry={registry} />
    ) : hero && heroVisual && page.kind === "solution" ? (
      <SolutionBlueprint page={page} registry={registry} hero={hero} />
    ) : hero && hero.spec && page.kind === "work-area" ? (
      <SystemFrame page={page} registry={registry} hero={hero} />
    ) : undefined;
  const opening =
    hero && heroVisual && (page.kind === "technology" || page.kind === "industry")
      ? rest.find((b) => b.type === "definition" || b.type === "prose")
      : undefined;
  const openingVisual =
    opening && hero ? (
      <Figure
        id={hero.figure}
        spec={hero.spec}
        title={hero.visualTitle ?? hero.headline}
        uid={`${hero.id}-open`}
        caption={hero.figureCaption ?? ""}
      />
    ) : undefined;

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
          aside={aside}
        />
      ) : null}
      {guided && page.comprehension ? (
        <AtAGlance comprehension={page.comprehension} cta={glanceCta} kind={page.kind} />
      ) : null}
      {showNav ? <SectionNav items={navItems} /> : null}
      {page.kind === "home" ? <div className="home-dark-start" aria-hidden="true" /> : null}
      {rest.map((block) => {
        const rendered = (
          <BlockRenderer
            key={block.id}
            block={block}
            page={page}
            visual={block === opening ? openingVisual : undefined}
          />
        );
        // Draft sections only exist in a review build (see showDrafts); they are always labeled.
        return "draft" in block && block.draft ? (
          <DraftFrame key={block.id}>{rendered}</DraftFrame>
        ) : (
          rendered
        );
      })}
    </>
  );
}
