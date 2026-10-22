import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Block, Page } from "./schema";

const readFile = (file: string) =>
  fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), file), "utf8");

type PriceFile = {
  services: Record<
    string,
    {
      heading: string;
      plans: { name: string; range: string; timeline: string; summary: string }[];
      factors: string[];
    }
  >;
};
let prices: PriceFile | undefined;

/** A service's price tiers and cost drivers (data/pricing/services.yaml), for cost guides. */
export function pricingFor(serviceSlug: string): PriceFile["services"][string] | undefined {
  prices ??= YAML.parse(readFile("data/pricing/services.yaml")) as PriceFile;
  return prices.services[serviceSlug];
}

/** Every service's price tiers, in file order (the "How we price" guide). */
export function allPricing(): [string, PriceFile["services"][string]][] {
  prices ??= YAML.parse(readFile("data/pricing/services.yaml")) as PriceFile;
  return Object.entries(prices.services);
}

/** The pricing section for a service page (data/pricing/services.yaml), or none. */
export function servicePricing(serviceSlug: string): Block[] {
  prices ??= YAML.parse(readFile("data/pricing/services.yaml")) as PriceFile;
  const p = prices.services[serviceSlug];
  if (!p) return [];
  return [
    {
      type: "pricing",
      id: "pricing",
      tone: "ink",
      label: "Pricing and timelines",
      heading: p.heading,
      intro:
        "Every project is quoted in writing after a short call. These ranges show where most projects land, so you can plan before you talk to us.",
      plans: p.plans.map((x) => ({ ...x, includes: [] })),
      factors: { title: "What moves the price", items: p.factors },
      note: "Not sure which fits? Tell us what you need and we will send a fixed quote and timeline for your project.",
      cta: { label: "Get a quote", href: "/contact/" },
    },
  ] as Block[];
}

/**
 * Testimonials from the owner's content pack (data/samples/testimonials.json, 300 illustrative
 * examples). They are not verified client endorsements, so they render only in review builds
 * (DECHY_SHOW_DRAFTS=true) until real quotes replace them.
 */
export type PackQuote = {
  id: string;
  name: string;
  role: string;
  company: string;
  /** The pack's industry name, e.g. "Healthcare & Life Sciences". */
  industry: string;
  /** The service's display name, e.g. "Web Development". */
  service: string;
  quote: string;
};

let quotes: PackQuote[] | undefined;
export function packQuotes(): PackQuote[] {
  quotes ??= (JSON.parse(readFile("data/samples/testimonials.json")) as { records: PackQuote[] })
    .records;
  return quotes;
}

/** Which pack industries speak for each industry page, closest first. */
const PACK_INDUSTRIES: Record<string, string[]> = {
  "ind.agriculture": ["Agriculture & Agritech", "Environmental & Sustainability"],
  "ind.automotive": ["Automotive & Mobility"],
  "ind.banking": ["Financial Services & Fintech", "Insurance"],
  "ind.beauty": ["Beauty & Personal Care", "Fashion & Apparel"],
  "ind.construction": ["Construction & Engineering"],
  "ind.education": ["Education & EdTech"],
  "ind.energy": ["Energy & Utilities", "Environmental & Sustainability"],
  "ind.field-services": ["Home Services"],
  "ind.finance": ["Financial Services & Fintech", "Insurance"],
  "ind.fintech": ["Financial Services & Fintech"],
  "ind.fitness": ["Fitness & Wellness", "Sports & Recreation"],
  "ind.government": ["Government & Public Sector"],
  "ind.healthcare": ["Healthcare & Life Sciences"],
  "ind.hospitality": ["Hospitality & Travel", "Events & Experiences", "Food & Beverage"],
  "ind.insurance": ["Insurance"],
  "ind.legal": ["Legal & Professional Services"],
  "ind.logistics": ["Logistics & Transportation", "Wholesale & Distribution"],
  "ind.manufacturing": ["Manufacturing & Industrial", "Consumer Electronics"],
  "ind.marketplaces": ["Retail & Ecommerce", "Events & Experiences", "Home Services"],
  "ind.media": ["Media & Entertainment", "Events & Experiences"],
  "ind.nonprofits": ["Nonprofit & Social Impact"],
  "ind.professional-services": ["Legal & Professional Services", "Human Resources & Recruiting"],
  "ind.real-estate": ["Real Estate & Property"],
  "ind.recruitment": ["Human Resources & Recruiting"],
  "ind.restaurants": ["Food & Beverage"],
  "ind.retail": ["Retail & Ecommerce", "Fashion & Apparel", "Consumer Electronics"],
  "ind.saas": ["SaaS & Technology"],
  "ind.telecommunications": ["Telecom & Connectivity"],
  "ind.transportation": ["Logistics & Transportation", "Automotive & Mobility"],
  "ind.travel": ["Hospitality & Travel", "Events & Experiences"],
};

const PER_PAGE = 6;
/** Pages that share a pack industry choose in this order, the most specific first. */
const FIRST = ["ind.fintech", "ind.banking", "ind.insurance", "ind.finance"];

/**
 * Six testimonials for every industry page and every service page, with no quote shown on two
 * pages. Industry pages choose first (their pool is smaller): quotes from the matching pack
 * industries, then from the page's related services. Service pages then take quotes for their
 * own service. Within a pool, quotes whose service has the most left are taken first, so every
 * service keeps enough for its own page.
 */
export function assignQuotes(
  industryPages: { id: string; services: string[] }[],
  serviceNames: Record<string, string>,
): { industries: Map<string, PackQuote[]>; services: Map<string, PackQuote[]> } {
  const all = packQuotes();
  const slugOf = new Map(Object.entries(serviceNames).map(([slug, name]) => [name, slug]));
  const used = new Set<string>();
  const left = new Map<string, number>();
  for (const q of all) left.set(q.service, (left.get(q.service) ?? 0) + 1);
  // Industry pages leave six quotes of every service for that service's own page.
  const take = (pool: PackQuote[], n: number, out: PackQuote[], reserve = 0) => {
    const free = pool.filter((q) => !used.has(q.id) && (left.get(q.service) ?? 0) > reserve);
    while (out.length < n && free.length) {
      free.sort((a, b) => (left.get(b.service) ?? 0) - (left.get(a.service) ?? 0));
      const q = free.shift()!;
      if ((left.get(q.service) ?? 0) <= reserve) continue;
      used.add(q.id);
      left.set(q.service, (left.get(q.service) ?? 0) - 1);
      out.push(q);
    }
  };
  const industries = new Map<string, PackQuote[]>();
  const rank = (id: string) => (FIRST.includes(id) ? FIRST.indexOf(id) : FIRST.length);
  for (const page of [...industryPages].sort((a, b) => rank(a.id) - rank(b.id))) {
    const out: PackQuote[] = [];
    for (const name of PACK_INDUSTRIES[page.id] ?? [])
      take(
        all.filter((q) => q.industry === name),
        PER_PAGE,
        out,
        PER_PAGE,
      );
    take(
      all.filter((q) => page.services.includes(slugOf.get(q.service) ?? "")),
      PER_PAGE,
      out,
      PER_PAGE,
    );
    take(all, PER_PAGE, out, PER_PAGE);
    industries.set(page.id, out);
  }
  const services = new Map<string, PackQuote[]>();
  for (const [slug, name] of Object.entries(serviceNames)) {
    const out: PackQuote[] = [];
    take(
      all.filter((q) => q.service === name),
      PER_PAGE,
      out,
    );
    services.set(slug, out);
  }
  return { industries, services };
}

/** A testimonials section (draft) for a service or industry page. */
export function quoteBlock(items: PackQuote[], heading: string): Block[] {
  if (items.length === 0) return [];
  return [
    {
      type: "testimonials",
      id: "client-quotes",
      tone: "ink",
      draft: true,
      label: "What clients say",
      heading,
      items: items.map(({ quote, name, role, company }) => ({ quote, name, role, company })),
    },
  ] as Block[];
}

const key = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Labels for the wall's service filter: service slug to its name. */
export type Labels = { services: Record<string, string> };

/** The Testimonials page (review builds only, noindex): every pack quote with filters. */
export function sampleTestimonialsPage(labels: Labels): Page {
  const all = packQuotes();
  const slugOf = new Map(Object.entries(labels.services).map(([slug, name]) => [name, slug]));
  return {
    id: "sample.testimonials",
    kind: "hub",
    locale: "en",
    path: "/testimonials/",
    title: "Client Testimonials and Reviews | DECHY",
    description:
      "What clients say about working with DECHY on software, websites, mobile apps, AI, and more, by service and by industry.",
    breadcrumbLabel: "Testimonials",
    intent: { primary: "dechy testimonials", secondary: [] },
    indexing: "noindex",
    claims: [],
    datePublished: "2026-10-20",
    dateModified: "2026-10-20",
    schemaTypes: ["WebPage"],
    sections: [
      {
        type: "hero",
        id: "hero",
        variant: "hub",
        eyebrow: "Testimonials",
        headline: "What our clients say about working with us",
        lead: "Founders, operations leaders, and product teams on what we built, how we worked, and what changed for their business. Filter by service or industry to find teams like yours.",
        ctas: [
          { label: "Start a project", href: "/contact/" },
          { label: "See our work", href: "/work/" },
        ],
        stats: [],
        slides: [],
      },
      {
        type: "testimonial-wall",
        id: "testimonials",
        tone: "ink",
        label: "Client stories",
        heading: "In our clients' own words",
        items: all.map((q) => ({
          quote: q.quote,
          name: q.name,
          role: q.role,
          company: q.company,
          service: slugOf.get(q.service) ?? key(q.service),
          serviceLabel: q.service,
          industry: key(q.industry),
          industryLabel: q.industry,
        })),
      },
      {
        type: "cta",
        id: "contact-cta",
        heading: "Want results like these?",
        body: "Tell us what you need. We reply with a plan, a fixed quote, and a timeline.",
        primary: { label: "Start a project", href: "/contact/" },
        secondary: { label: "See our work", href: "/work/" },
      },
    ] as Block[],
  };
}

type ModelsFile = {
  rates: { role: string; range: string }[];
  teams: { name: string; range: string; who: string }[];
  maintenance: { name: string; range: string; for: string; includes: string }[];
  mvp: { name: string; range: string; timeline: string }[];
};
let models: ModelsFile | undefined;

/** Rates, dedicated teams, care plans, and MVP prices (data/pricing/models.yaml) as tables. */
export function modelTable(key: keyof ModelsFile): {
  heading: string;
  columns: string[];
  rows: string[][];
  note?: string;
} {
  models ??= YAML.parse(readFile("data/pricing/models.yaml")) as ModelsFile;
  const m = models;
  switch (key) {
    case "rates":
      return {
        heading: "Hourly rates by role",
        columns: ["Role", "Rate"],
        rows: m.rates.map((r) => [r.role, r.range]),
      };
    case "teams":
      return {
        heading: "Dedicated team pricing",
        columns: ["Team", "Who is on it", "Monthly cost"],
        rows: m.teams.map((t) => [t.name, t.who, t.range]),
      };
    case "maintenance":
      return {
        heading: "Care plans after launch",
        columns: ["Plan", "Best for", "What it covers", "Monthly cost"],
        rows: m.maintenance.map((p) => [p.name, p.for, p.includes, p.range]),
      };
    case "mvp":
      return {
        heading: "What an MVP costs",
        columns: ["Type of MVP", "Typical cost", "Timeline"],
        rows: m.mvp.map((p) => [p.name, p.range, p.timeline]),
      };
  }
}
