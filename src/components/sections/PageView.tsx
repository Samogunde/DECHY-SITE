import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { JsonLd } from "@/components/primitives/JsonLd";
import { Inline } from "@/components/primitives/Inline";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { getPage, getRegistry } from "@/lib/content/load";
import { CONNECTS_KINDS } from "@/lib/connections";
import { buildGraph } from "@/lib/seo/structured-data";
import { Photo } from "@/components/primitives/Photo";
import { BlockRenderer } from "./BlockRenderer";
import { articlePages } from "./DiscoveryBlocks";
import { IndustryProfile, SolutionBlueprint, SystemFrame, TechProfile } from "./FamilyHero";
import { AtAGlance, SectionNav } from "./GuidanceBlocks";
import { DraftFrame } from "./HomeBlocks";
import { ArticleView } from "./ArticleView";
import { LinkButton } from "@/components/primitives/LinkButton";

const MID_CTA_KINDS = new Set([
  "service",
  "solution",
  "industry",
  "work-area",
  "technology",
  "location",
]);

const MID_CTA_LINE: Record<string, string> = {
  service: "Tell us what you need. We reply with a plan, a price range, and a timeline.",
  technology:
    "Tell us what you want to build. We will tell you whether this is the right tool for it.",
  industry: "Tell us how your business runs. We will show you what we would build first.",
  solution: "Tell us where the problem sits. We will map the fix and what it costs.",
  "work-area":
    "Tell us what the system has to do. We reply with a plan, a price range, and a timeline.",
  location: "Tell us what you need. We reply with a plan, a price range, and a timeline.",
};

/** A compact call to action band placed after the first third of a page. */
function MidCta({ cta, kind }: { cta: { label: string; href: string }; kind: string }) {
  return (
    <aside className="mid-cta" aria-label="Start a project">
      <div className="container-site">
        <div className="mid-cta-card" data-reveal="block">
          <div>
            <p className="mid-cta-kicker">Start a project</p>
            <p className="mid-cta-line">{MID_CTA_LINE[kind] ?? MID_CTA_LINE.service}</p>
          </div>
          <LinkButton href={cta.href} arrow>
            {cta.label}
          </LinkButton>
        </div>
      </div>
    </aside>
  );
}

/** Renders any page record: structured data, header (for pages without a hero), then its blocks. */
export function PageView({ path }: { path: string }) {
  const registry = getRegistry();
  const page = getPage(path);
  if (page.kind === "article")
    return (
      <>
        <JsonLd data={buildGraph(page, registry)} />
        <ArticleView page={page} registry={registry} />
      </>
    );
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
          ? "Related"
          : (b as { label: string }).label,
    }));
  const showNav = guided && navItems.length >= 6;
  const first = page.sections[0];
  const restBase = first?.type === "hero" ? page.sections.slice(1) : page.sections;
  const rest = restBase;
  // A call to action after the first third of the page (consultant brief, 20 October 2026).
  const midAt = MID_CTA_KINDS.has(page.kind) && rest.length >= 6 ? Math.floor(rest.length / 3) : -1;

  // Each page family opens differently. Technology and industry pages show a profile beside the
  // headline and move the hero's teaching diagram next to the opening text; solution pages show
  // the answer as a blueprint.
  const hero = first?.type === "hero" ? first : undefined;
  // The hero shows a photograph on every page except technology pages, which open with their
  // profile card (official mark and connections). The family card each page used to show beside the
  // headline (industry profile, solution blueprint, system frame) moves next to the opening text.
  const aside =
    hero && page.kind === "technology" ? (
      <TechProfile page={page} registry={registry} />
    ) : undefined;
  const opening = hero
    ? rest.find((b) => b.type === "definition" || b.type === "prose")
    : undefined;
  const familyCard =
    hero && page.kind === "industry" ? (
      <IndustryProfile page={page} registry={registry} />
    ) : hero && page.kind === "solution" && (hero.spec || hero.figure) ? (
      <SolutionBlueprint page={page} registry={registry} hero={hero} />
    ) : hero && hero.spec && page.kind === "work-area" ? (
      <SystemFrame page={page} registry={registry} hero={hero} />
    ) : undefined;
  const openingVisual =
    opening && hero
      ? (familyCard ??
        (page.kind === "technology" && hero.photo ? (
          <figure className="opening-photo">
            <Photo photo={hero.photo} />
          </figure>
        ) : undefined))
      : undefined;

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
      {rest.map((block, i) => {
        const band =
          i === midAt && glanceCta ? (
            <MidCta key="mid-cta" cta={glanceCta} kind={page.kind} />
          ) : null;
        const rendered = (
          <BlockRenderer
            key={block.id}
            block={block}
            page={page}
            visual={block === opening ? openingVisual : undefined}
          />
        );
        // Draft sections only exist in a review build (see showDrafts); they are always labeled.
        const out =
          "draft" in block && block.draft ? (
            <DraftFrame key={block.id}>{rendered}</DraftFrame>
          ) : (
            rendered
          );
        return band ? [band, out] : out;
      })}
    </>
  );
}
