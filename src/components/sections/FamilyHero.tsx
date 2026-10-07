import type { ReactNode } from "react";
import { Figure } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import type { Registry } from "@/lib/content/load";
import type { Block, Page } from "@/lib/content/schema";
import { publishedPath } from "@/lib/content/urls";
import { EntityChip } from "./ListBlocks";

/**
 * The visual beside each page family's headline, so a technology, a solution, and an industry do
 * not open the same way a service does. Everything shown comes from the entity graph (relations
 * that are already published as "Where this connects"), never from invented facts.
 */

const TECH_TYPES = new Set([
  "technology",
  "platform",
  "language",
  "framework",
  "provider",
  "tool",
  "integration",
]);

type Edge = { other: string; type: string };

function edgesOf(self: string, registry: Registry): Edge[] {
  const out: Edge[] = [];
  for (const r of registry.relations) {
    if (r.type === "partOf" || r.type === "hasPart") continue;
    if (r.from === self) out.push({ other: r.to, type: r.type });
    else if (r.to === self) out.push({ other: r.from, type: r.type });
  }
  return out;
}

/** Related entity ids, linked pages first, without duplicates. */
function pick(
  edges: Edge[],
  registry: Registry,
  test: (type: string, rel: string) => boolean,
  limit: number,
): string[] {
  const ids: string[] = [];
  for (const e of edges) {
    const node = registry.nodes.get(e.other);
    if (!node || ids.includes(e.other) || !test(node.type, e.type)) continue;
    ids.push(e.other);
  }
  const linked = ids.filter((id) => publishedPath(registry.nodes.get(id), registry));
  const plain = ids.filter((id) => !linked.includes(id));
  return [...linked, ...plain].slice(0, limit);
}

function Row({ term, ids, here }: { term: string; ids: string[]; here: string }) {
  if (ids.length === 0) return null;
  return (
    <div className="profile-row">
      <dt>{term}</dt>
      <dd>
        {ids.map((id) => (
          <EntityChip key={id} id={id} here={here} chip />
        ))}
      </dd>
    </div>
  );
}

/** A neutral line icon for the kind of thing, never a logo or a letter that could read as one. */
const ICONS: Record<string, string> = {
  database:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  cloud: "M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 9.3 4.4 4.4 0 0 0 7 18Z",
  code: "M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15",
  ai: "M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9L12 3.5ZM18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z",
  flow: "M4 6.5h5v4H4zM15 13.5h5v4h-5zM9 8.5h3.5v7H15",
  card: "M3.5 6.5h17v11h-17zM3.5 10h17M7 14.5h3",
  bag: "M5.5 8h13l-1 12h-11l-1-12ZM9 8V6.5a3 3 0 0 1 6 0V8",
  chart: "M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6",
  window: "M3.5 5h17v14h-17zM3.5 9h17M8 9v10",
  edge: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-8.5 8.5h17M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z",
  box: "M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5ZM4 8l8 4.5L20 8M12 12.5v8",
  sector: "M4 20.5h16M6 20.5V8l6-4 6 4v12.5M10 20.5v-5h4v5M9.5 10.5h5",
};

function iconFor(kind: string): string {
  const k = kind.toLowerCase();
  if (k.includes("sector")) return ICONS.sector!;
  if (k.includes("database")) return ICONS.database!;
  if (k.includes("data")) return ICONS.chart!;
  if (k.includes("cloud")) return ICONS.cloud!;
  if (k.includes("edge")) return ICONS.edge!;
  if (k.includes("ai")) return ICONS.ai!;
  if (k.includes("automation")) return ICONS.flow!;
  if (k.includes("payment")) return ICONS.card!;
  if (k.includes("commerce")) return ICONS.bag!;
  if (k.includes("tool")) return ICONS.box!;
  if (/(language|framework|library|runtime|toolkit)/.test(k)) return ICONS.code!;
  return ICONS.window!;
}

function Profile({
  kind,
  name,
  summary,
  children,
}: {
  kind: string;
  name: string;
  summary?: string;
  children: ReactNode;
}) {
  return (
    <aside className="profile hero-layer" aria-label={`${name} at a glance`}>
      <div className="profile-head">
        <span className="profile-mark" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconFor(kind)} />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="profile-kind">{kind}</p>
          <p className="profile-name">{name}</p>
        </div>
      </div>
      {summary ? (
        <p className="profile-summary">
          <Inline text={summary} />
        </p>
      ) : null}
      <dl className="profile-rows">{children}</dl>
    </aside>
  );
}

/** Technology pages: what the technology is, the service it belongs to, and its neighbours. */
export function TechProfile({ page, registry }: { page: Page; registry: Registry }) {
  const self = page.entityId;
  const node = self ? registry.nodes.get(self) : undefined;
  if (!self || !node) return null;
  const hero = page.sections[0];
  const eyebrow = hero?.type === "hero" ? (hero.eyebrow ?? "Technology") : "Technology";
  const summary =
    hero?.type === "hero" && hero.spec?.kind === "hub" ? hero.spec.center.text : undefined;
  const edges = edgesOf(self, registry);
  const services = [
    ...(node.primaryService ? [node.primaryService] : []),
    ...pick(edges, registry, (t) => t === "service", 3),
  ].filter((id, i, a) => a.indexOf(id) === i);
  return (
    <Profile kind={eyebrow} name={node.name} summary={summary}>
      <Row term="Our service" ids={services.slice(0, 2)} here={page.path} />
      <Row
        term="Works with"
        ids={pick(edges, registry, (t, r) => TECH_TYPES.has(t) && r === "integratesWith", 4)}
        here={page.path}
      />
      <Row
        term="Alternatives"
        ids={pick(edges, registry, (t, r) => TECH_TYPES.has(t) && r === "alternativeTo", 3)}
        here={page.path}
      />
      <Row
        term="Systems we build"
        ids={pick(edges, registry, (t) => t === "work-area", 2)}
        here={page.path}
      />
    </Profile>
  );
}

/** Industry pages: the systems, solutions, and technologies that most often apply. */
export function IndustryProfile({ page, registry }: { page: Page; registry: Registry }) {
  const self = page.entityId;
  const node = self ? registry.nodes.get(self) : undefined;
  if (!self || !node) return null;
  const edges = edgesOf(self, registry);
  return (
    <Profile kind="Sector" name={node.name}>
      <Row
        term="Systems we build"
        ids={pick(edges, registry, (t) => t === "work-area", 4)}
        here={page.path}
      />
      <Row
        term="Solutions"
        ids={pick(edges, registry, (t) => t === "solution", 4)}
        here={page.path}
      />
      <Row
        term="Services"
        ids={pick(edges, registry, (t) => t === "service", 4)}
        here={page.path}
      />
      <Row
        term="Often built with"
        ids={pick(edges, registry, (t) => TECH_TYPES.has(t), 5)}
        here={page.path}
      />
    </Profile>
  );
}

/**
 * Solution pages: the answer drawn as a blueprint on a dark panel, with what it is usually built
 * with underneath. The diagram is the hero's own teaching diagram.
 */
export function SolutionBlueprint({
  page,
  registry,
  hero,
}: {
  page: Page;
  registry: Registry;
  hero: Extract<Block, { type: "hero" }>;
}) {
  const self = page.entityId;
  const edges = self ? edgesOf(self, registry) : [];
  const tech = pick(edges, registry, (t) => TECH_TYPES.has(t), 5);
  const systems = pick(edges, registry, (t) => t === "work-area", 3);
  return (
    <div className="blueprint tone-ink hero-layer">
      <p className="blueprint-label">How we solve it</p>
      <Figure
        id={hero.figure}
        spec={hero.spec}
        title={hero.visualTitle ?? hero.headline}
        uid={hero.id}
        caption={hero.figureCaption ?? ""}
      />
      {systems.length > 0 || tech.length > 0 ? (
        <dl className="blueprint-foot">
          {systems.length > 0 ? (
            <div>
              <dt>Systems we build</dt>
              <dd>
                {systems.map((id) => (
                  <EntityChip key={id} id={id} here={page.path} chip />
                ))}
              </dd>
            </div>
          ) : null}
          {tech.length > 0 ? (
            <div>
              <dt>Often built with</dt>
              <dd>
                {tech.map((id) => (
                  <EntityChip key={id} id={id} here={page.path} chip />
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  );
}

/**
 * Work Area pages: the system drawn inside a product window, so the opening reads as a system we
 * build rather than a topic, with what it is usually built with underneath.
 */
export function SystemFrame({
  page,
  registry,
  hero,
}: {
  page: Page;
  registry: Registry;
  hero: Extract<Block, { type: "hero" }>;
}) {
  const self = page.entityId;
  const node = self ? registry.nodes.get(self) : undefined;
  const edges = self ? edgesOf(self, registry) : [];
  const tech = pick(edges, registry, (t) => TECH_TYPES.has(t), 4);
  return (
    <div className="sysframe hero-layer">
      <div className="sysframe-bar" aria-hidden="true">
        <span className="sysframe-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="sysframe-title">{node?.name ?? hero.headline}</span>
        <span className="sysframe-live">System map</span>
      </div>
      <div className="sysframe-body">
        <Figure
          id={hero.figure}
          spec={hero.spec}
          title={hero.visualTitle ?? hero.headline}
          uid={hero.id}
          caption={hero.figureCaption ?? ""}
        />
      </div>
      {tech.length > 0 ? (
        <div className="sysframe-foot">
          <p className="sysframe-foot-label">Often built with</p>
          <div className="sysframe-chips">
            {tech.map((id) => (
              <EntityChip key={id} id={id} here={page.path} chip />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
