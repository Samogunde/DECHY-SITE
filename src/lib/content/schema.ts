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
const base = { id: z.string().regex(/^[a-z0-9-]+$/), tone };

export const Block = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    id: z.string(),
    variant: z.enum(["home", "service"]),
    eyebrow: z.string().optional(),
    headline: z.string(),
    lead: z.string(),
    support: z.string().optional(),
    ctas: z.array(Cta).min(1),
    figure: FigureId,
    figureCaption: z.string(),
  }),
  z.object({ type: z.literal("statement"), ...base, factId: z.string(), label: z.string() }),
  z.object({
    type: z.literal("definition"),
    ...base,
    label: z.string(),
    heading: z.string(),
    answer: z.string(),
    paragraphs: z.array(z.string()).default([]),
  }),
  z.object({
    type: z.literal("prose"),
    ...base,
    label: z.string(),
    heading: z.string(),
    paragraphs: z.array(z.string()).min(1),
    aside: z.object({ title: z.string(), items: z.array(z.string()) }).optional(),
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
    items: z.array(z.object({ title: z.string(), body: z.string(), ref: z.string().optional() })),
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
      z.object({ title: z.string(), body: z.string(), artifacts: z.array(z.string()).default([]) }),
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
  }),
  z.object({
    type: z.literal("diagram"),
    ...base,
    label: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    figure: FigureId,
    caption: z.string(),
    points: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    photo: PhotoRef.optional(),
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

export const Page = z.object({
  id: z.string(),
  kind: z.enum(["home", "service", "contact", "legal"]),
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
  schemaTypes: z.array(z.enum(["WebPage", "Service", "ContactPage", "FAQPage", "AboutPage"])),
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
