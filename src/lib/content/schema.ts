/**
 * Typed content model (Zod). Single source of truth for the shape of data/ and content/ files.
 * The page-block union is intentionally a small set of composable blocks; pages choose and order
 * them, so no two services need the same structure (Content Master 7).
 */
import { z } from "zod";

export const PAGE_STATUSES = [
  "CREATE / INDEX",
  "CREATE LATER",
  "MERGE / CONSOLIDATE",
  "REVIEW",
  "DO NOT CREATE",
] as const;
export const PageStatus = z.enum(PAGE_STATUSES);

export const ENTITY_TYPES = [
  "service",
  "capability",
  "technology",
  "platform",
  "language",
  "framework",
  "provider",
  "tool",
  "integration",
  "concept",
  "ecosystem",
  "industry",
  "business-type",
  "problem",
  "solution",
  "country",
  "work-area",
] as const;
export const EntityType = z.enum(ENTITY_TYPES);
export type EntityTypeName = z.infer<typeof EntityType>;

const id = z.string().regex(/^[a-z]+\.[a-z0-9-]+$/, "id must look like prefix.slug");
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be lowercase and hyphenated");

export const Entity = z.object({
  id,
  type: EntityType,
  name: z.string().min(1),
  slug,
  primaryService: id.optional(),
  alsoListedUnder: z.array(id).optional(),
  group: z.string().optional(),
  prominence: z.enum(["feature", "standard", "reference"]),
  pagePolicy: PageStatus,
  evidenceLevel: z.enum(["none", "work-area", "work-entry", "case-study"]),
  sourceSection: z.number().optional(),
  synonyms: z.array(z.string()).optional(),
});
export type Entity = z.infer<typeof Entity>;

export const EntityFile = z.object({ entities: z.array(Entity) });

export const SERVICE_FAMILIES = [
  "build",
  "intelligence-automation",
  "infrastructure-security",
  "design-growth",
  "advisory",
] as const;
export const ServiceFamily = z.enum(SERVICE_FAMILIES);
export type ServiceFamily = z.infer<typeof ServiceFamily>;

export const Service = z.object({
  id,
  slug,
  name: z.string(),
  family: ServiceFamily,
  order: z.number().int().positive(),
  micro: z.string().min(20).max(160),
  short: z.string().min(40),
  pagePolicy: PageStatus,
});
export type Service = z.infer<typeof Service>;
export const ServiceFile = z.object({
  families: z.array(z.object({ id: ServiceFamily, label: z.string() })),
  services: z.array(Service),
});

export const Fact = z.object({
  id: z.string().regex(/^[a-z]+\.[a-z0-9-]+$/),
  label: z.string(),
  value: z.string(),
  status: z.enum(["approved"]),
  source: z.string(),
});
export type Fact = z.infer<typeof Fact>;
export const FactFile = z.object({ facts: z.array(Fact) });

export const RELATION_TYPES = [
  "relatedService",
  "offersSolution",
  "addressesProblem",
  "usesTechnology",
  "appliesToIndustry",
  "solves",
  "solvedBy",
  "integratesWith",
  "furtherReading",
  "alternativeTo",
  "hasWorkArea",
  "relatedWork",
  // Grouping inside the technology graph: a child technology is part of a parent technology or
  // stack (Express partOf Node.js). It is stored once as partOf; hasPart is its derived inverse.
  // It is semantic only: it never implies a page, a URL, a menu entry, or a public capability claim.
  "partOf",
  "hasPart",
] as const;
export const Relation = z.object({
  from: z.string(),
  type: z.enum(RELATION_TYPES),
  to: z.string(),
});
export type Relation = z.infer<typeof Relation>;
export const RelationFile = z.object({ relations: z.array(Relation) });

export const Country = z.object({
  id,
  type: z.literal("country"),
  name: z.string(),
  slug,
  iso: z.string().length(2),
  wave: z.number().int().min(1).max(3),
  presence: z.literal("none"),
  pagePolicy: PageStatus,
});
export type Country = z.infer<typeof Country>;
export const CountryFile = z.object({ countries: z.array(Country) });

/* ---------- page blocks ---------- */

export const Cta = z.object({ label: z.string(), href: z.string() });
export type Cta = z.infer<typeof Cta>;

export const FigureId = z.enum([
  "system-map",
  "connected-flow",
  "software-anatomy",
  "quality-layers",
  "modernization-path",
  "portal-wireframe",
  "site-builder",
  "store-ui",
  "dashboard-ui",
  "mobile-app-ui",
  "crm-ui",
  "analytics-ui",
  "assistant-ui",
  "workflow-ui",
  "interface-set",
  "platform-ui",
]);
export type FigureId = z.infer<typeof FigureId>;

/** A registered photograph placed in a block. Alt text and credit come from the asset registry. */
export const PhotoRef = z.object({
  asset: z.string().regex(/^asset\.photo-[a-z0-9-]+$/),
  layout: z.enum(["rail", "band", "split", "aside"]).default("rail"),
  /** CSS object-position for the crop, e.g. "30% 40%". Framing only; the file is never cropped. */
  position: z
    .string()
    .regex(/^\d{1,3}% \d{1,3}%$/)
    .default("50% 50%"),
});
export type PhotoRef = z.infer<typeof PhotoRef>;

const tone = z.enum(["paper", "white", "ink"]).default("paper");
/**
 * `draft` marks a section whose facts the owner has not supplied yet (prices, projects, quotes,
 * logos). Draft sections are removed when the registry loads, unless DECHY_SHOW_DRAFTS=true for a
 * local review build, so they can never reach production, search, structured data, or the assistant.
 */
const base = { id: z.string().regex(/^[a-z0-9-]+$/), tone, draft: z.boolean().optional() };

/** The icon set used by cards and tiles (lucide, rendered by components/primitives/Icon.tsx). */
export const IconName = z.enum([
  "code",
  "globe",
  "phone",
  "sparkles",
  "workflow",
  "plug",
  "cloud",
  "shield",
  "chart",
  "cart",
  "pen",
  "palette",
  "search",
  "megaphone",
  "compass",
  "health",
  "finance",
  "building",
  "truck",
  "factory",
  "bag",
  "education",
  "briefcase",
  "quote",
  "handshake",
  "users",
  "book",
  "mail",
  "info",
  "steps",
  "growth",
  "grid",
  "fitness",
  "beauty",
  "wallet",
  "umbrella",
  "hardhat",
  "energy",
  "wrench",
  "food",
  "hotel",
  "travel",
  "store",
  "car",
  "bus",
  "plant",
  "legal",
  "media",
  "charity",
  "flag",
  "app",
  "tower",
  "hire",
]);
export type IconName = z.infer<typeof IconName>;

const Stat = z.object({ value: z.string(), label: z.string() });

/* ---------- teaching diagrams (data-driven; see docs/design/clarity-and-comprehension-standard.md) ---------- */

/** What the visitor should understand from a diagram (clarity standard, section 6). */
export const DIAGRAM_PURPOSES = [
  "process",
  "system",
  "relationship",
  "workflow",
  "comparison",
  "sequence",
  "architecture",
  "decision",
  "transformation",
  "before-after",
] as const;
export const DiagramPurpose = z.enum(DIAGRAM_PURPOSES);
export type DiagramPurpose = z.infer<typeof DiagramPurpose>;

const Part = z.object({ title: z.string().min(1), text: z.string().optional() });

export const DiagramSpec = z.discriminatedUnion("kind", [
  /** Ordered steps. Horizontal when there is room, vertical otherwise. */
  z.object({
    kind: z.literal("flow"),
    steps: z.array(Part).min(3).max(7),
    note: z.string().optional(),
  }),
  /** A stack of layers, each optionally with the supporting parts that sit beside it. */
  z.object({
    kind: z.literal("layers"),
    layers: z
      .array(Part.extend({ support: z.array(Part).default([]) }))
      .min(2)
      .max(6),
    supportLabel: z.string().default("Supporting parts"),
    layerLabel: z.string().default("Layers"),
    /** A foundation under every layer; `steps` draws it as a short pipeline (A then B then C). */
    base: Part.extend({ steps: z.array(z.string()).max(5).optional() }).optional(),
  }),
  /** The same situation without and with the solution. */
  z.object({
    kind: z.literal("before-after"),
    before: z.object({
      title: z.string(),
      text: z.string().optional(),
      nodes: z.array(Part).min(2).max(6),
    }),
    after: z.object({
      title: z.string(),
      text: z.string().optional(),
      nodes: z.array(Part).min(2).max(6),
    }),
    hubLabel: z.string().optional(),
  }),
  /** One thing in the middle connected to the parts around it. */
  z.object({
    kind: z.literal("hub"),
    center: Part,
    spokes: z.array(Part).min(3).max(8),
  }),
  /** Stages that narrow, each a smaller group than the last. */
  z.object({ kind: z.literal("funnel"), stages: z.array(Part).min(3).max(6) }),
  /** A question with the answer that fits each situation. */
  z.object({
    kind: z.literal("decision"),
    question: z.string(),
    branches: z
      .array(z.object({ when: z.string(), choose: z.string(), text: z.string().optional() }))
      .min(2)
      .max(6),
  }),
]);
export type DiagramSpec = z.infer<typeof DiagramSpec>;

/** Visitor-first summary of a page: the answers the page must make obvious (clarity standard). */
export const Comprehension = z.object({
  what: z.string().min(20),
  problem: z.string().min(20),
  audience: z.string().min(20),
  choose: z.string().min(20),
  next: z.string().min(10),
});
export type Comprehension = z.infer<typeof Comprehension>;

export const Block = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    id: z.string(),
    variant: z.enum(["home", "service", "hub", "plain"]),
    eyebrow: z.string().optional(),
    headline: z.string(),
    lead: z.string(),
    support: z.string().optional(),
    ctas: z.array(Cta).min(1),
    figure: FigureId.optional(),
    spec: DiagramSpec.optional(),
    purpose: DiagramPurpose.optional(),
    takeaway: z.string().optional(),
    visualTitle: z.string().optional(),
    figureCaption: z.string().optional(),
    /** A photograph for the hero visual (assigned from the topic library when not set). */
    photo: PhotoRef.optional(),
    /** Home only: proof figures under the buttons. Values may use {{fact:...}} macros. */
    stats: z.array(Stat).max(4).default([]),
    /** Home only: the offers the headline cycles through, each with its own line and screen. */
    slides: z
      .array(
        z.object({
          label: z.string(),
          word: z.string(),
          lead: z.string(),
          href: z.string(),
          figure: FigureId.optional(),
          photo: PhotoRef.optional(),
          chips: z.array(z.string()).max(3).default([]),
        }),
      )
      .max(5)
      .default([]),
  }),
  /** Every service, grouped by family: choose a family to see its services beside a photograph. */
  z.object({
    type: z.literal("service-explorer"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    families: z.array(z.object({ id: z.string(), blurb: z.string() })).min(2),
    /** One photograph per service slug; hovering or focusing a service shows its photograph. */
    servicePhotos: z.record(z.string(), PhotoRef),
    more: Cta.optional(),
  }),
  /** Figures that count up when they come into view, beside a photograph. */
  z.object({
    type: z.literal("stats"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(Stat.extend({ detail: z.string().optional() }))
      .min(2)
      .max(4),
    photo: PhotoRef.optional(),
    photoNote: z.string().optional(),
  }),
  /** A statement in large type that lights up word by word as it scrolls past. */
  z.object({
    type: z.literal("reveal"),
    ...base,
    label: z.string(),
    text: z.string(),
    note: z.string().optional(),
  }),
  /** Technology logos in groups, each linking to its page where one exists. */
  z.object({
    type: z.literal("stack"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    groups: z.array(z.object({ title: z.string(), entityIds: z.array(z.string()).min(2) })).min(2),
    more: Cta.optional(),
  }),
  /** Project phases: a photograph that stays in view while each phase scrolls past. */
  z.object({
    type: z.literal("phases"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    steps: z
      .array(
        z.object({
          title: z.string(),
          summary: z.string(),
          tags: z.array(z.string()).max(4).default([]),
          activities: z.array(z.string()).min(2).max(4),
          deliverables: z.array(z.string()).min(2).max(4),
          photo: PhotoRef,
        }),
      )
      .min(3)
      .max(6),
  }),
  /** Guides and decision pages, as photo cards. */
  z.object({
    type: z.literal("insights"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({
          category: z.string(),
          title: z.string(),
          summary: z.string(),
          href: z.string(),
          photo: PhotoRef,
        }),
      )
      .min(2)
      .max(4),
    more: Cta.optional(),
  }),
  /** The services a page leads with, as large tiles with an interface visual each. */
  z.object({
    type: z.literal("lead-services"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({
          title: z.string(),
          kicker: z.string(),
          body: z.string(),
          href: z.string(),
          action: z.string(),
          /** The large word the row opens with ("Software"). */
          word: z.string().optional(),
          includes: z.array(z.string()).min(3).max(5),
          figure: FigureId.optional(),
          photo: PhotoRef.optional(),
        }),
      )
      .min(2)
      .max(4),
  }),
  /** Icon cards: capabilities, industries, or commitments. */
  z.object({
    type: z.literal("feature-grid"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    style: z.enum(["cards", "tiles", "panels"]).default("cards"),
    items: z
      .array(
        z.object({
          icon: IconName,
          title: z.string(),
          body: z.string().optional(),
          href: z.string().optional(),
        }),
      )
      .min(3),
    more: Cta.optional(),
  }),
  /** A compact row of further services, each a link with its icon. */
  z.object({
    type: z.literal("service-strip"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z.array(z.object({ icon: IconName, title: z.string(), href: z.string() })).min(3),
    more: Cta.optional(),
  }),
  /** Typical price ranges and what moves them. Figures are the owner's, never estimated. */
  z.object({
    type: z.literal("pricing"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    plans: z
      .array(
        z.object({
          name: z.string(),
          range: z.string(),
          timeline: z.string(),
          summary: z.string(),
          includes: z.array(z.string()).max(6).default([]),
          featured: z.boolean().optional(),
        }),
      )
      .min(2)
      .max(6),
    factors: z.object({ title: z.string(), items: z.array(z.string()).min(2) }),
    note: z.string().optional(),
    cta: Cta,
  }),
  /** Selected projects. Only real, supplied Work Entries (AGENTS: no invented evidence). */
  z.object({
    type: z.literal("case-studies"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({
          client: z.string(),
          sector: z.string(),
          title: z.string(),
          summary: z.string(),
          results: z.array(Stat).min(1).max(3),
          services: z.array(z.string()).default([]),
          href: z.string().optional(),
          photo: PhotoRef.optional(),
        }),
      )
      .min(1)
      .max(6),
  }),
  /** Client quotes, with the person's real name, role, and organization. */
  z.object({
    type: z.literal("testimonials"),
    ...base,
    label: z.string(),
    heading: z.string(),
    items: z
      .array(
        z.object({
          quote: z.string(),
          name: z.string(),
          role: z.string(),
          company: z.string(),
          photo: PhotoRef.optional(),
        }),
      )
      .min(1)
      .max(6),
  }),
  /** Client, partner, or press names as a logo wall or a slow strip. */
  z.object({
    type: z.literal("logos"),
    ...base,
    label: z.string(),
    heading: z.string().optional(),
    style: z.enum(["strip", "grid"]).default("strip"),
    items: z
      .array(
        z.object({ name: z.string(), icon: IconName.optional(), asset: z.string().optional() }),
      )
      .min(4),
  }),
  /** Every testimonial with service and industry filters (the Testimonials page). */
  z.object({
    type: z.literal("testimonial-wall"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({
          quote: z.string(),
          name: z.string(),
          role: z.string(),
          company: z.string(),
          service: z.string(),
          serviceLabel: z.string(),
          industry: z.string(),
          industryLabel: z.string(),
          href: z.string().optional(),
          photo: PhotoRef.optional(),
        }),
      )
      .min(2),
  }),
  /** A photo gallery: one large photograph and smaller ones beside it, each with a short note. */
  z.object({
    type: z.literal("gallery"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({ photo: PhotoRef, title: z.string().optional(), text: z.string().optional() }),
      )
      .min(2)
      .max(4),
  }),
  /** The team: portrait, name, and role, with a short bio that opens in place. */
  z.object({
    type: z.literal("team"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    members: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          bio: z.string(),
          focus: z.array(z.string()).max(4).default([]),
          photo: PhotoRef.optional(),
        }),
      )
      .min(3),
  }),
  /** Case study cards in a grid with service filters (the Work page). */
  z.object({
    type: z.literal("case-grid"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({
          title: z.string(),
          company: z.string(),
          sector: z.string(),
          service: z.string(),
          serviceLabel: z.string(),
          industry: z.string().optional(),
          industryLabel: z.string().optional(),
          result: Stat,
          href: z.string(),
          photo: PhotoRef.optional(),
        }),
      )
      .min(2),
  }),
  /** Partners and platforms: a mark, the kind of partnership, and one line each, plus an invitation. */
  z.object({
    type: z.literal("partners"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({ entityId: z.string(), name: z.string(), kind: z.string(), text: z.string() }),
      )
      .min(4),
    invite: z.object({ title: z.string(), body: z.string(), cta: Cta }).optional(),
  }),
  /** A short commitment in large type, with what it means in practice. */
  z.object({
    type: z.literal("promise"),
    ...base,
    label: z.string(),
    heading: z.string(),
    body: z.string(),
    items: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .min(2)
      .max(4),
  }),
  z.object({
    type: z.literal("pathfinder"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    paths: z
      .array(
        z.object({
          need: z.string(),
          text: z.string(),
          href: z.string(),
          action: z.string().optional(),
        }),
      )
      .min(3),
  }),
  z.object({
    type: z.literal("chooser"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    question: z.string(),
    options: z
      .array(
        z.object({
          label: z.string(),
          when: z.string(),
          get: z.string(),
          watch: z.string().optional(),
          cta: Cta.optional(),
        }),
      )
      .min(2)
      .max(6),
  }),
  z.object({
    type: z.literal("technical"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string(),
    panels: z
      .array(
        z.object({
          title: z.string(),
          paragraphs: z.array(z.string()).default([]),
          items: z.array(z.string()).default([]),
        }),
      )
      .min(2),
  }),
  /** A glossary: plain definitions, A to Z (terms come from data/glossary/terms.json). */
  z.object({
    type: z.literal("glossary"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z.array(z.object({ term: z.string(), definition: z.string() })).default([]),
  }),
  z.object({
    type: z.literal("callout"),
    ...base,
    variant: z.enum(["limits", "illustrative", "note"]),
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    items: z.array(z.string()).default([]),
  }),
  z.object({ type: z.literal("statement"), ...base, factId: z.string(), label: z.string() }),
  z.object({
    type: z.literal("definition"),
    ...base,
    label: z.string(),
    heading: z.string(),
    answer: z.string(),
    paragraphs: z.array(z.string()).default([]),
    /** A photograph set beside the opening text (layout "aside"). */
    photo: PhotoRef.optional(),
  }),
  z.object({
    type: z.literal("prose"),
    ...base,
    label: z.string(),
    heading: z.string(),
    paragraphs: z.array(z.string()).min(1),
    aside: z.object({ title: z.string(), items: z.array(z.string()) }).optional(),
    /** A photograph set beside the opening text (layout "aside"). */
    photo: PhotoRef.optional(),
  }),
  z.object({
    type: z.literal("index"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    numbered: z.boolean().default(false),
    columns: z.union([z.literal(1), z.literal(2)]).default(1),
    photo: PhotoRef.optional(),
    items: z.array(
      z.object({
        title: z.string(),
        body: z.string(),
        ref: z.string().optional(),
        /** Internal path to a built page; the row becomes a link. */
        href: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("browse"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    /** The hub this block sits on, shown as "You are here". */
    current: z.enum(["problem", "system", "technology", "discipline"]),
  }),
  z.object({
    type: z.literal("directory"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    /** Generated from the navigation data, so the menu and the directory cannot disagree. */
    source: z.enum(["technologies", "work"]),
  }),
  z.object({
    type: z.literal("articles"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
  }),
  /** The Resources library: tabs, the featured article, the latest, cost and comparison rows. */
  z.object({
    type: z.literal("library"),
    ...base,
    label: z.string(),
    heading: z.string(),
  }),
  /** A row of certification badges linking to the Certifications page (home, About us). */
  z.object({
    type: z.literal("certification-strip"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    limit: z.number().int().min(4).max(12).default(8),
  }),
  /** Every certification, grouped by area (data/certifications/certifications.yaml). */
  z.object({
    type: z.literal("certification-list"),
    ...base,
    heading: z.string(),
  }),
  /** The Certifications page figures: badges, issuers, areas, and the platforms certified on. */
  z.object({
    type: z.literal("certification-figures"),
    ...base,
    heading: z.string(),
  }),
  /** One short line of text, centered (a promise or a note at the end of a page). */
  z.object({
    type: z.literal("note"),
    ...base,
    text: z.string(),
  }),
  z.object({
    type: z.literal("service-index"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
  }),
  z.object({
    type: z.literal("entities"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    style: z.enum(["lists", "chips"]).default("lists"),
    groups: z.array(
      z.object({ title: z.string(), note: z.string().optional(), entityIds: z.array(z.string()) }),
    ),
  }),
  z.object({
    type: z.literal("process"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    steps: z.array(
      z.object({
        title: z.string(),
        body: z.string(),
        artifacts: z.array(z.string()).default([]),
        /** Typical length of the stage, shown on timelines. */
        duration: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("table"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    caption: z.string(),
    columns: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(1),
    note: z.string().optional(),
    /** "compare" shows two options side by side, the last one emphasized. */
    display: z.enum(["table", "compare"]).optional(),
  }),
  z.object({
    type: z.literal("diagram"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    figure: FigureId.optional(),
    spec: DiagramSpec.optional(),
    purpose: DiagramPurpose,
    takeaway: z.string().min(20),
    visualTitle: z.string().optional(),
    caption: z.string(),
    points: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    photo: PhotoRef.optional(),
    /** "split" sets the visual beside the heading and points instead of below them. */
    layout: z.enum(["stack", "split"]).optional(),
  }),
  z.object({
    type: z.literal("columns"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    columns: z.array(z.object({ title: z.string(), items: z.array(z.string()) })).min(2),
  }),
  z.object({
    type: z.literal("faq"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    items: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
  }),
  z.object({
    type: z.literal("related"),
    ...base,
    label: z.string(),
    heading: z.string(),
    groups: z.array(z.object({ title: z.string(), entityIds: z.array(z.string()) })),
  }),
  z.object({
    type: z.literal("cta"),
    id: z.string(),
    heading: z.string(),
    body: z.string(),
    primary: Cta,
    secondary: Cta.optional(),
  }),
  z.object({
    type: z.literal("legal"),
    ...base,
    sections: z.array(
      z.object({
        heading: z.string(),
        paragraphs: z.array(z.string()).default([]),
        items: z.array(z.string()).default([]),
      }),
    ),
  }),
  z.object({
    type: z.literal("contact-form"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string(),
    photo: PhotoRef.optional(),
  }),
]);
export type Block = z.infer<typeof Block>;
export type BlockType = Block["type"];

/** A comparison article: two or more options, compared row by row. */
export const ArticleCompare = z.object({
  options: z.array(z.string()).min(2).max(3),
  rows: z.array(z.object({ label: z.string(), values: z.array(z.string()) })).min(2),
  choose: z.array(z.object({ option: z.string(), when: z.array(z.string()).min(1) })).min(2),
  recommendation: z.string(),
});

export const Page = z.object({
  id: z.string(),
  kind: z.enum([
    "home",
    "service",
    "hub",
    "company",
    "work-hub",
    "work-area",
    "technology",
    "solution",
    "industry",
    "location",
    "article",
    "case-study",
    "contact",
    "legal",
  ]),
  locale: z.literal("en"),
  path: z.string().regex(/^\/([a-z0-9-]+\/)*$/, "path needs leading and trailing slash"),
  entityId: z.string().optional(),
  title: z.string().min(10).max(70),
  description: z.string().min(70).max(165),
  breadcrumbLabel: z.string(),
  /** H1 and lead for pages without a hero block (contact, legal). */
  h1: z.string().optional(),
  lead: z.string().optional(),
  intent: z.object({ primary: z.string(), secondary: z.array(z.string()).default([]) }),
  indexing: z.enum(["index", "noindex"]),
  claims: z.array(z.string()).default([]),
  datePublished: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  parent: z.string().optional(),
  schemaTypes: z.array(
    z.enum([
      "WebPage",
      "Service",
      "ContactPage",
      "FAQPage",
      "AboutPage",
      "CollectionPage",
      "Article",
    ]),
  ),
  /** The five visitor answers the page must make obvious (required for commercial pages). */
  comprehension: Comprehension.optional(),
  /** Resource and article pages only: how the piece is classified. The author is always DECHY. */
  article: z
    .object({
      category: z.enum(["guide", "comparison", "decision", "explainer", "industry", "cost"]),
      summary: z.string().min(40),
      /** The writer's name as supplied; DECHY's team when none is given. */
      author: z.string().optional(),
      /** Last reviewed date (ISO), shown beside the published date. */
      reviewed: z.string().optional(),
      /** The short answer shown in a box at the top. */
      answer: z.string().optional(),
      /** Comparisons: the options side by side, when to choose each, and our recommendation. */
      compare: ArticleCompare.optional(),
      /** Cost guides: the service whose price ranges (data/pricing) are shown as a table. */
      pricing: z.string().optional(),
      /** Hand-picked related links; related articles on the same service are added after them. */
      related: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      /** The service the article reports to (its canonical home). */
      service: z.string().optional(),
      /** Its number in the 53-article plan. */
      number: z.number().int().optional(),
      /** The cover photograph (assigned from the topic library). */
      photo: PhotoRef.optional(),
    })
    .optional(),
  sections: z.array(Block).min(1),
});
export type Page = z.infer<typeof Page>;

/* ---------- asset registry ---------- */

export const Asset = z.object({
  id: z.string().regex(/^asset\.[a-z0-9-]+$/),
  kind: z.enum(["file", "component"]),
  file: z.string(),
  role: z.enum(["logo", "open-graph", "diagram", "interface-visual", "photograph", "icon"]),
  source: z.enum(["owner-supplied", "original", "licensed-stock", "client-supplied"]),
  creator: z.string(),
  license: z.string().min(10),
  originalFilename: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  licenseUrl: z.string().url().optional(),
  sha256: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().min(5),
  caption: z.string().optional(),
  usage: z.array(z.string()).min(1),
  approval: z.enum(["approved", "pending"]),
  acquired: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Asset = z.infer<typeof Asset>;
export const AssetFile = z.object({ assets: z.array(Asset) });
