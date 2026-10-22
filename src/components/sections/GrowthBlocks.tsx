import Link from "next/link";
import { CostEstimator } from "@/components/home/CostEstimator";
import { estimatorData, ESTIMATOR_FOR_SERVICE } from "@/lib/content/estimator-data";
import { HoverArrow } from "./HomeBlocks";
import { CountUp } from "@/components/home/Motion";
import { Arrow } from "@/components/primitives/Arrow";
import { ClientFaces } from "@/components/primitives/ClientFaces";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import { proofCounters, proofTeamLine } from "@/lib/content/proof";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/**
 * The proof strip: animated counters, each linking to the page that backs it up, and one line on
 * the team behind every project. The same numbers and wording appear on the home page, About us,
 * and every service page (data/proof/counters.yaml).
 */
export function ProofStripBlock({ block }: { block: Of<"proof-strip"> }) {
  const registry = getRegistry();
  const counters = proofCounters(registry);
  if (counters.length === 0) return null;
  return (
    <section
      id={block.id}
      aria-label="DECHY in numbers"
      className={`proof-strip tone-${block.tone}`}
    >
      <div className="container-site">
        <ul className="proof-counters" data-count={counters.length}>
          {counters.map((c) => (
            <li key={c.id}>
              <Link href={c.href} className="proof-counter">
                <span className="proof-value">
                  {c.faces ? <ClientFaces size="sm" /> : null}
                  <CountUp value={c.value} />
                </span>
                <span className="proof-label">
                  {c.label} <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="proof-team">
          <Inline text={proofTeamLine(registry)} />
        </p>
      </div>
    </section>
  );
}

/**
 * A call to action band. "primary" ends a section (quote or call); "soft" sits mid-page and
 * points somewhere useful first (the cost, the estimator, similar work).
 */
export function CtaBandBlock({ block }: { block: Of<"cta-band"> }) {
  const registry = getRegistry();
  const live = (href: string) =>
    href.startsWith("#") ||
    /^https:\/\//.test(href) ||
    pathExists(href.split(/[?#]/)[0] ?? "", registry);
  if (!live(block.primary.href)) return null;
  return (
    <aside
      id={block.id}
      aria-label={block.text}
      className={`cta-band-x cta-band-${block.variant} tone-${block.tone}`}
    >
      <div className="container-site">
        <div className="cta-band-x-card">
          <p className="cta-band-x-text">
            <Inline text={block.text} />
          </p>
          <div className="cta-band-x-actions">
            {block.variant === "primary" ? (
              <LinkButton href={block.primary.href} arrow>
                {block.primary.label}
              </LinkButton>
            ) : (
              <Link href={block.primary.href} className="cta-soft-link">
                {block.primary.label} <Arrow />
              </Link>
            )}
            {block.secondary && live(block.secondary.href) ? (
              <Link href={block.secondary.href} className="cta-soft-link">
                {block.secondary.label} <Arrow />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}

/** The cost estimator, with its data read on the server. */
export function CostEstimatorBlock({ block }: { block: Of<"cost-estimator"> }) {
  const registry = getRegistry();
  const names = Object.fromEntries(registry.services.map((s) => [s.slug, s.name]));
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-h`}
      className={`est-section tone-${block.tone}`}
    >
      <div className="container-site">
        <h2 id={`${block.id}-h`} className="sr-only">
          {block.heading}
        </h2>
        <CostEstimator data={estimatorData(names)} serviceBySlug={ESTIMATOR_FOR_SERVICE} />
      </div>
    </section>
  );
}

const COST_GROUPS = [
  { key: "build", label: "What it costs to build" },
  { key: "pricing", label: "How pricing works" },
  { key: "industry", label: "Cost by industry" },
] as const;

/** The cost hub: the estimator first, then every cost guide grouped by question. */
export function CostHubBlock({ block }: { block: Of<"cost-hub"> }) {
  const registry = getRegistry();
  const guides = registry.pages
    .filter((p) => p.kind === "article" && p.article?.category === "cost")
    .sort((a, b) => a.path.localeCompare(b.path));
  const estimator = registry.pageByPath.get("/tools/cost-estimator/");
  const groups = COST_GROUPS.map((g) => ({
    ...g,
    items: guides.filter((p) => (p.article?.group ?? "build") === g.key),
  }));
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-h`}
      className={`section cost-hub tone-${block.tone}`}
    >
      <div className="container-site">
        <p className="t-eyebrow eyebrow-accent m-0">{block.label}</p>
        <h2 id={`${block.id}-h`} className="home-h2 mt-4">
          {block.heading}
        </h2>
        {block.intro ? <p className="cost-hub-intro">{block.intro}</p> : null}
        {estimator ? (
          <Link href={estimator.path} className="cost-hub-tool link-card" data-spotlight>
            <span className="cost-hub-tool-tag">Free tool</span>
            <span className="cost-hub-tool-title">{estimator.h1 ?? estimator.breadcrumbLabel}</span>
            <span className="cost-hub-tool-text">{estimator.description}</span>
            <HoverArrow />
          </Link>
        ) : null}
        {groups.map((g) =>
          g.items.length ? (
            <div key={g.key} className="cost-hub-group">
              <h3 className="cost-hub-group-title">{g.label}</h3>
              <ul className="cost-hub-list">
                {g.items.map((p) => (
                  <li key={p.path}>
                    <Link href={p.path} className="cost-hub-card link-card" data-spotlight>
                      <span className="cost-hub-card-title">{p.h1 ?? p.breadcrumbLabel}</span>
                      <span className="cost-hub-card-text">
                        {p.article?.summary ?? p.description}
                      </span>
                      <HoverArrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}
