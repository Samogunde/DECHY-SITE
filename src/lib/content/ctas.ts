import { callHref } from "../contact/channels";
import { pricingFor } from "./samples";
import type { Block, Page } from "./schema";

/**
 * Calls to action placed through each page (owner, 21 October 2026). Two kinds: primary (a quote
 * or a call) ends a section; soft (the cost, the estimator, similar work) sits mid-page. Each band
 * is written from the page's own facts: its service, its real price range, its projects, so the
 * wording fits where it appears. Bands always follow testimonials, work, and the questions; the
 * rest fill every second section until the page reaches its target.
 *
 * Targets: home and service pages at least 6, industry pages at least 4.
 */

type Band = Extract<Block, { type: "cta-band" }>;
export type CtaContext = {
  estimator: string | undefined;
  costHub: string | undefined;
  /** The cost guide that covers a service, by service slug. */
  costGuide: (slug: string) => string | undefined;
  /** A service's name, by slug. */
  serviceName: (slug: string) => string | undefined;
  /** Project titles and paths for a service or industry. */
  work: (page: Page) => { title: string; path: string }[];
};

const CONTENT_SKIP = new Set(["hero", "proof-strip", "cta", "cta-band", "logos"]);
const lower = (s: string) => (/^[A-Z]{2}/.test(s) ? s : s[0]!.toLowerCase() + s.slice(1));
const upper = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** How each service reads inside a sentence ("your mobile app project"). */
const NOUN: Record<string, string> = {
  "software-development": "custom software",
  "web-development": "website or web app",
  "mobile-app-development": "mobile app",
  ai: "AI",
  automation: "automation",
  cloud: "cloud",
  cybersecurity: "security",
  "data-analytics": "data and reporting",
  "api-integration": "integration",
  ecommerce: "online store",
  "ui-ux": "product design",
  branding: "brand",
  "seo-aeo-geo": "search visibility",
  "digital-marketing": "marketing",
  consulting: "digital transformation",
};

function band(
  id: string,
  variant: "primary" | "soft",
  text: string,
  primary: { label: string; href: string },
  secondary?: { label: string; href: string },
): Band {
  // Quote and call bands offer the sales address as well (owner, 24 October 2026).
  const email = variant === "primary" ? ("sales" as const) : undefined;
  return { type: "cta-band", id, tone: "ink", variant, text, primary, secondary, email } as Band;
}

/** The bands a page can use, in the order they are tried, written for that page. */
function bandsFor(page: Page, ctx: CtaContext): { after?: string; band: Band }[] {
  const slug = page.kind === "service" ? page.path.replace(/\//g, "") : undefined;
  const svc = slug ? (NOUN[slug] ?? ctx.serviceName(slug)) : undefined;
  const quote = `/contact/${slug ? `?service=${slug}` : ""}`;
  const call = callHref();
  const estimator = ctx.estimator ? `${ctx.estimator}${slug ? `?service=${slug}` : ""}` : undefined;
  const cost = (slug && ctx.costGuide(slug)) || ctx.costHub;
  const projects = ctx.work(page);
  const price = slug ? pricingFor(slug) : undefined;
  const low = price?.plans[0]?.range.split(" to ")[0];
  const out: { after?: string; band: Band }[] = [];

  if (page.kind === "home") {
    out.push(
      {
        after: "case-grid",
        band: band(
          "cta-work",
          "soft",
          "Every project above started as a short call and a written plan.",
          { label: "See how we built them", href: "/work/" },
          { label: "See similar projects", href: "/work/#case-studies" },
        ),
      },
      {
        after: "testimonials",
        band: band(
          "cta-quotes",
          "primary",
          "Ready to be the next team that stops fighting its software?",
          { label: "Book a call", href: call },
          estimator ? { label: "Try the cost estimator", href: estimator } : undefined,
        ),
      },
      {
        after: "faq",
        band: band(
          "cta-faq",
          "primary",
          "Did we miss your question? Ask it directly and get an answer from an engineer, not a salesperson.",
          { label: "Ask us on a call", href: call },
        ),
      },
      {
        after: "pricing",
        band: band(
          "cta-price",
          "primary",
          "Every quote is fixed and in writing before any work starts.",
          { label: "Get a quote for your project", href: "/contact/?intent=quote" },
          estimator ? { label: "Try the estimator first", href: estimator } : undefined,
        ),
      },
    );
    if (estimator)
      out.push({
        band: band(
          "cta-estimate",
          "soft",
          "Want a number before you talk to anyone? The estimator gives you a price and timeline range in two minutes.",
          { label: "Try the cost estimator", href: estimator },
        ),
      });
    if (ctx.costHub)
      out.push({
        band: band(
          "cta-cost",
          "soft",
          "Software, websites, apps, AI, and integration: see what each really costs, with ranges and worked examples.",
          { label: "See the cost guides", href: ctx.costHub },
        ),
      });
    out.push(
      {
        band: band(
          "cta-plan",
          "primary",
          "Tell us what you are building. You get a plan, a fixed quote, and a timeline, free.",
          { label: "Get a quote", href: "/contact/?intent=quote" },
        ),
      },
      {
        band: band(
          "cta-certified",
          "soft",
          "Partners of AWS, Microsoft, Google Cloud, and Salesforce, with a certified team behind every build.",
          { label: "See our certifications", href: "/company/certifications/" },
        ),
      },
    );
    return out;
  }

  const name = svc ?? page.breadcrumbLabel;
  const first = projects[0];
  if (first)
    out.push({
      after: "case-grid",
      band: band(
        "cta-work",
        "soft",
        projects.length > 1
          ? `See how we delivered ${first.title} and ${projects[1]!.title}, step by step.`
          : `See how we delivered ${first.title}, from the problem to the results.`,
        { label: "See how we built it", href: first.path },
        { label: "See similar projects", href: "/work/" },
      ),
    });
  out.push(
    {
      after: "testimonials",
      band: band(
        "cta-quotes",
        "primary",
        svc
          ? `Want results like these from your ${svc} project?`
          : `Want results like these for your ${lower(name)} business?`,
        { label: "Book a call", href: call },
      ),
    },
    {
      after: "faq",
      band: band(
        "cta-faq",
        "primary",
        svc
          ? `Still weighing up your ${svc} project? Talk it through with one of our leads for 30 minutes.`
          : `Still have questions about ${lower(name)} software? Ask them on a 30-minute call.`,
        { label: "Book a call", href: call },
      ),
    },
  );
  if (price && low)
    out.push({
      after: "pricing",
      band: band(
        "cta-price",
        "primary",
        `${upper(svc!)} projects start from ${low}. Your quote is fixed and in writing before work starts.`,
        { label: "Get a quote for your project", href: quote },
        estimator ? { label: "Try the estimator", href: estimator } : undefined,
      ),
    });
  if (estimator)
    out.push({
      band: band(
        "cta-estimate",
        "soft",
        svc
          ? `Get a price and timeline range for your ${svc} project in two minutes, before you speak to anyone.`
          : `Estimate what a ${lower(name)} project would cost, in two minutes.`,
        { label: "Try the estimator", href: estimator },
      ),
    });
  if (cost)
    out.push({
      band: band(
        "cta-cost",
        "soft",
        svc
          ? `See what ${svc} work costs line by line, with a worked example.`
          : `See what software for ${lower(name)} costs, and why.`,
        { label: "See the cost", href: cost },
      ),
    });
  out.push({
    band: band(
      "cta-plan",
      "primary",
      svc
        ? `Tell us about your ${svc} project. You get a written plan, a fixed quote, and a timeline.`
        : `Tell us how your ${lower(name)} business runs. We reply with what we would build first, and what it costs.`,
      { label: svc ? "Get a quote" : "Get a plan and a quote", href: quote },
    ),
  });
  if (first)
    out.push({
      band: band(
        "cta-similar",
        "soft",
        `${first.title} is one of the projects we have delivered. See what changed for the client.`,
        { label: "Read the case study", href: first.path },
      ),
    });
  return out;
}

/** Adds bands to a page until it reaches its target, never two bands in a row. */
export function placeCtas(page: Page, ctx: CtaContext, target: number) {
  const pool = bandsFor(page, ctx);
  const used = new Set<string>();
  const sections = page.sections;
  const isCta = (b: Block | undefined) => !!b && (b.type === "cta-band" || b.type === "cta");
  const count = () => sections.filter((b) => isCta(b)).length;
  const insertAfter = (i: number, b: Band) => {
    if (isCta(sections[i]) || isCta(sections[i + 1])) return false;
    sections.splice(i + 1, 0, b);
    used.add(b.id);
    return true;
  };
  // 1. Bands that belong after a particular section (pricing, work, testimonials, questions).
  for (const { after, band: b } of pool) {
    if (!after) continue;
    const i = sections.findIndex((s) => s.type === after);
    if (i >= 0) insertAfter(i, b);
  }
  // 2. Fill every second content section until the target is reached.
  const rest = pool.filter((p) => !p.after && !used.has(p.band.id));
  let run = 0;
  for (let i = 0; i < sections.length && count() < target && rest.length; i++) {
    const s = sections[i]!;
    if (CONTENT_SKIP.has(s.type)) {
      run = 0;
      continue;
    }
    run++;
    if (run >= 2) {
      const next = rest[0]!;
      if (insertAfter(i, next.band)) {
        rest.shift();
        run = 0;
        i++;
      }
    }
  }
}
