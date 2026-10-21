import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Block, Page } from "./schema";

/**
 * Sample proof for service pages: case studies and testimonials that show the layout until real
 * projects and quotes are supplied (owner direction, 20 October 2026). Read only in review builds
 * (DECHY_SHOW_DRAFTS=true); the live site never renders them.
 */
type Raw = {
  services: Record<
    string,
    {
      cases: {
        client: string;
        sector: string;
        title: string;
        summary: string;
        results: { value: string; label: string }[];
        services: string[];
        photo: string;
      }[];
      quotes: { quote: string; name: string; role: string; company: string; portrait: string }[];
    }
  >;
};

let cache: Raw | undefined;
function load(): Raw {
  cache ??= YAML.parse(
    fs.readFileSync(
      path.join(/*turbopackIgnore: true*/ process.cwd(), "data/samples/proof.yaml"),
      "utf8",
    ),
  ) as Raw;
  return cache;
}

/** The sample case-study and testimonial blocks for a service, or none. */
export function sampleProof(serviceSlug: string): Block[] {
  const s = load().services[serviceSlug];
  if (!s) return [];
  return [
    {
      type: "case-studies",
      id: "sample-work",
      tone: "ink",
      draft: true,
      label: "Selected work",
      heading: "Projects and what changed",
      intro: "A few of the systems we have built, with the problem, the solution, and the result.",
      items: s.cases.map(({ photo: _photo, ...c }) => ({ ...c, href: casePath(c.title) })),
    },
    {
      type: "testimonials",
      id: "sample-quotes",
      tone: "ink",
      draft: true,
      label: "What clients say",
      heading: "In our clients' words",
      items: s.quotes.map((q) => ({
        quote: q.quote,
        name: q.name,
        role: q.role,
        company: q.company,
      })),
    },
  ] as Block[];
}

/** The Work page in a review build: sample cases and quotes from the three lead services. */
export function sampleWork(serviceNames: Record<string, string> = {}): Block[] {
  const raw = load();
  const grid: Block = {
    type: "case-grid",
    id: "case-studies",
    tone: "ink",
    draft: true,
    label: "Case studies",
    heading: "Recent projects and what changed",
    intro:
      "Custom software, websites, mobile apps, AI, and the systems around them. Filter by service to find work like yours.",
    items: cases().flatMap((c) => {
      const card = Object.values(raw.services)
        .flatMap((s) => s.cases)
        .find((x) => x.title === c.title);
      return card
        ? [
            {
              title: c.title,
              company: c.company,
              sector: card.sector,
              service: c.service,
              serviceLabel: serviceNames[c.service] ?? c.service,
              result: card.results[0]!,
              href: `/work/case-studies/${c.slug}/`,
            },
          ]
        : [];
    }),
  } as Block;
  return [grid, ...sampleWorkQuotes()];
}

function sampleWorkQuotes(): Block[] {
  const lead = ["software-development", "web-development", "mobile-app-development"];
  const blocks = lead.map((slug) => sampleProof(slug));
  const [cases, quotes] = [0, 1].map((k) => blocks.map((b) => b[k]).filter(Boolean)) as [
    Extract<Block, { type: "case-studies" }>[],
    Extract<Block, { type: "testimonials" }>[],
  ];
  if (!cases[0] || !quotes[0]) return [];
  return [
    {
      ...cases[0],
      id: "case-studies",
      label: "Case studies",
      heading: "Recent projects and what changed",
      intro:
        "Custom software, websites, and mobile apps, with the problem, what we built, and the result.",
      items: cases.flatMap((c) => c.items).slice(0, 6),
    },
    { ...quotes[0], id: "client-quotes", items: quotes.map((q) => q.items[0]!).slice(0, 3) },
  ] as Block[];
}

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

/** The pricing section for a service page (data/pricing/services.yaml), or none. */
export function servicePricing(serviceSlug: string): Block[] {
  prices ??= YAML.parse(
    fs.readFileSync(
      path.join(/*turbopackIgnore: true*/ process.cwd(), "data/pricing/services.yaml"),
      "utf8",
    ),
  ) as PriceFile;
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

type CaseFile = {
  cases: {
    slug: string;
    title: string;
    service: string;
    industry: string;
    company: string;
    duration: string;
    challenge: string;
    approach: string[];
    delivered: string[];
    stack: string[];
    quote: { text: string; name: string; role: string };
  }[];
};
let caseFile: CaseFile | undefined;
function cases(): CaseFile["cases"] {
  caseFile ??= YAML.parse(
    fs.readFileSync(
      path.join(/*turbopackIgnore: true*/ process.cwd(), "data/samples/case-studies.yaml"),
      "utf8",
    ),
  ) as CaseFile;
  return caseFile.cases;
}

/** The case study page path for a sample case title, if it has one. */
export function casePath(title: string): string | undefined {
  const c = cases().find((x) => x.title === title);
  return c ? `/work/case-studies/${c.slug}/` : undefined;
}

/**
 * Sample case study pages (review builds only): one per sample case, built from ordinary blocks.
 * They are noindex and never published; real case studies replace them.
 */
export function sampleCasePages(): Page[] {
  const raw = load();
  const cards = Object.entries(raw.services).flatMap(([service, s]) =>
    s.cases.map((c) => ({ ...c, service })),
  );
  return cases().flatMap((c) => {
    const card = cards.find((x) => x.title === c.title);
    if (!card) return [];
    const results = [...card.results];
    if (results.length < 4) results.push({ value: c.duration, label: "From kickoff to launch" });
    const description = `${card.summary} A ${card.sector.toLowerCase()} project by DECHY.`;
    const page: Page = {
      id: `sample.case.${c.slug}`,
      kind: "case-study",
      locale: "en",
      path: `/work/case-studies/${c.slug}/`,
      entityId: `svc.${c.service}`,
      title: `${c.company} case study | DECHY`.slice(0, 70),
      description: description.length > 165 ? description.slice(0, 162) + "..." : description,
      breadcrumbLabel: c.company,
      intent: { primary: `${c.company} case study`, secondary: [] },
      indexing: "noindex",
      claims: [],
      datePublished: "2026-10-20",
      dateModified: "2026-10-20",
      parent: "/work/",
      schemaTypes: ["WebPage"],
      sections: [
        {
          type: "hero",
          id: "hero",
          variant: "service",
          eyebrow: `Case study: ${card.sector}`,
          headline: c.title,
          lead: card.summary,
          ctas: [
            { label: "Start a similar project", href: "/contact/" },
            { label: "See the service", href: `/${c.service}/` },
          ],
          stats: [],
          slides: [],
        },
        {
          type: "stats",
          id: "results",
          tone: "ink",
          label: "Results",
          heading: `What changed for ${c.company}`,
          items: results.slice(0, 4),
        },
        {
          type: "prose",
          id: "challenge",
          tone: "paper",
          label: "The challenge",
          heading: `Where ${c.company} started`,
          paragraphs: [c.challenge],
        },
        {
          type: "columns",
          id: "approach",
          tone: "white",
          label: "Our approach",
          heading: "How we delivered it",
          columns: [
            { title: "How we worked", items: c.approach },
            { title: "What we delivered", items: c.delivered },
          ],
        },
        {
          type: "entities",
          id: "stack",
          tone: "paper",
          label: "Technology",
          heading: "Built with",
          style: "chips",
          groups: [{ title: "Stack", entityIds: c.stack }],
        },
        {
          type: "testimonials",
          id: "quote",
          tone: "ink",
          label: "Client",
          heading: "In their words",
          items: [
            { quote: c.quote.text, name: c.quote.name, role: c.quote.role, company: c.company },
          ],
        },
        {
          type: "related",
          id: "related",
          tone: "white",
          label: "Related",
          heading: "Related service and industry",
          groups: [
            { title: "Service", entityIds: [`svc.${c.service}`] },
            { title: "Industry", entityIds: [c.industry] },
          ],
        },
        {
          type: "cta",
          id: "contact-cta",
          heading: "Have a project like this?",
          body: "Tell us what you need. We reply with a plan, a fixed quote, and a timeline.",
          primary: { label: "Start a similar project", href: "/contact/" },
          secondary: { label: "See all case studies", href: "/work/#case-studies" },
        },
      ] as Block[],
    };
    return [page];
  });
}

/** The industry of each sample client company (sample quotes on the service pages). */
const INDUSTRY_OF_COMPANY: Record<string, string> = {
  "Northpeak Facilities": "ind.property-management",
  "Vantix Group": "ind.professional-services",
  "Lumora Health": "ind.healthcare",
  "Brightwell Trade": "ind.logistics",
  "Corvana Logistics": "ind.logistics",
  "Stratus Labs": "ind.saas",
  "Brightwell Retail": "ind.retail",
  "Kinetica Home": "ind.retail",
  Helixa: "ind.saas",
  "Stratus Cover": "ind.insurance",
  "Northpeak Build": "ind.construction",
  "Vantix Retail": "ind.retail",
  "Corvana Distribution": "ind.logistics",
  "Lumora Group": "ind.healthcare",
  "Kinetica Brands": "ind.ecommerce",
  "Kinetica Finance": "ind.finance",
  "Vantix Travel": "ind.travel",
  "Northpeak Advisory": "ind.professional-services",
  "Corvana Group": "ind.logistics",
  "Vantix Studio": "ind.media",
  "Kinetica Services": "ind.professional-services",
  "Lumora Care": "ind.healthcare",
  "Northpeak Manufacturing": "ind.manufacturing",
};

export type SampleTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  service: string;
  industry: string;
  href?: string;
};

/** Every sample testimonial, tagged by service and industry (one per person). */
export function sampleTestimonials(): SampleTestimonial[] {
  const out = new Map<string, SampleTestimonial>();
  for (const c of cases())
    out.set(c.quote.name, {
      quote: c.quote.text,
      name: c.quote.name,
      role: c.quote.role,
      company: c.company,
      service: c.service,
      industry: c.industry,
      href: `/work/case-studies/${c.slug}/`,
    });
  for (const [service, s] of Object.entries(load().services))
    for (const q of s.quotes)
      if (!out.has(q.name))
        out.set(q.name, {
          quote: q.quote,
          name: q.name,
          role: q.role,
          company: q.company,
          service,
          industry: INDUSTRY_OF_COMPANY[q.company] ?? "ind.professional-services",
        });
  return [...out.values()];
}

/** Labels for the wall's filters: service slug or industry id to its name. */
export type Labels = { services: Record<string, string>; industries: Record<string, string> };

/** The Testimonials page (review builds only, noindex): every sample quote with filters. */
export function sampleTestimonialsPage(labels: Labels): Page {
  const all = sampleTestimonials();
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
          { label: "See case studies", href: "/work/#case-studies" },
        ],
        stats: [],
        slides: [],
      },
      {
        type: "testimonial-wall",
        id: "testimonials",
        tone: "ink",
        label: "Client stories",
        heading: `${all.length} clients, in their own words`,
        items: all.map((t) => ({
          ...t,
          serviceLabel: labels.services[t.service] ?? t.service,
          industryLabel: labels.industries[t.industry] ?? t.industry,
        })),
      },
      {
        type: "cta",
        id: "contact-cta",
        heading: "Want results like these?",
        body: "Tell us what you need. We reply with a plan, a fixed quote, and a timeline.",
        primary: { label: "Start a project", href: "/contact/" },
        secondary: { label: "See case studies", href: "/work/#case-studies" },
      },
    ] as Block[],
  };
}

/** Testimonials for an industry page: that industry first, then its related services. */
export function industryTestimonials(industryId: string, services: string[]): Block[] {
  const all = sampleTestimonials();
  const own = all.filter((t) => t.industry === industryId);
  const near = all.filter((t) => t.industry !== industryId && services.includes(t.service));
  const items = [...own, ...near].slice(0, 3);
  if (items.length === 0) return [];
  return [
    {
      type: "testimonials",
      id: "client-quotes",
      tone: "ink",
      draft: true,
      label: "What clients say",
      heading: "Teams like yours, in their own words",
      items: items.map(({ quote, name, role, company }) => ({ quote, name, role, company })),
    },
  ] as Block[];
}
