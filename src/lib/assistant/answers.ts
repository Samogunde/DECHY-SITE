/**
 * Answers the assistant gives straight from the site (owner, 24 October 2026). Server-only.
 *
 *   menu topics     what we build, what projects cost, how long they take
 *   prices          DECHY's published prices and timelines (data/pricing/prices.yaml)
 *   questions       the questions already answered on the site's pages (each page's FAQ)
 *
 * Nothing is invented: every figure and answer is quoted from the content, with links to the pages
 * it came from. Anything not covered here is left to the guided matching or to a person.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { getRegistry } from "@/lib/content/load";
import { toPlainText } from "@/lib/content/inline";
import { SearchIndex, tokenize } from "@/lib/search-engine";

export type AnswerLink = { name: string; path: string };
export type SiteAnswer = { reply: string; links: AnswerLink[]; suggestions: string[] };

/** The starting questions shown when the assistant opens. */
export const MENU = {
  build: "What do you build?",
  cost: "How much does a project cost?",
  time: "How long does it take?",
  person: "Talk to a person",
} as const;

type Plan = { name: string; range: string; timeline?: string };
type PriceFile = {
  services: Record<string, { plans: Plan[] }>;
  mvp: Plan[];
  summaries: { id: string; range: string; from: string }[];
};

let prices: PriceFile | undefined;
function priceFile(): PriceFile {
  prices ??= YAML.parse(
    fs.readFileSync(
      path.join(/*turbopackIgnore: true*/ process.cwd(), "data/pricing/prices.yaml"),
      "utf8",
    ),
  ) as PriceFile;
  return prices;
}

/** The kinds of project a visitor can ask about, mapped to their prices and pages. */
const KINDS: {
  id: string;
  label: string;
  plural: string;
  words: RegExp;
  service?: string;
  plans?: number[];
  summary?: string;
  /** How the "from" figure reads for this kind. */
  fromLabel?: string;
  guide: string;
  page: string;
}[] = [
  {
    id: "website",
    label: "Website",
    plural: "websites",
    words: /\b(web ?sites?|landing pages?|business sites?|cms|wordpress|webflow)\b/i,
    service: "web-development",
    plans: [0, 1, 2],
    summary: "website",
    guide: "/resources/cost-guides/how-much-does-a-website-cost/",
    page: "/web-development/",
  },
  {
    id: "web-app",
    label: "Web app",
    plural: "web apps",
    words: /\b(web ?apps?|web applications?|portals?|dashboards?|saas)\b/i,
    service: "web-development",
    plans: [3, 4],
    summary: "web-app",
    guide: "/resources/cost-guides/how-much-does-web-app-development-cost/",
    page: "/web-development/",
  },
  {
    id: "mobile-app",
    label: "Mobile app",
    plural: "mobile apps",
    words: /\b(mobile|apps?|iphone|ios|android|flutter|react native)\b/i,
    service: "mobile-app-development",
    summary: "mobile-app",
    guide: "/resources/cost-guides/how-much-does-a-mobile-app-cost/",
    page: "/mobile-app-development/",
  },
  {
    id: "custom-software",
    label: "Custom software",
    plural: "custom software projects",
    words: /\b(custom software|software|internal tools?|platforms?|systems?|erp|crm)\b/i,
    service: "software-development",
    summary: "custom-software",
    guide: "/resources/cost-guides/how-much-does-custom-software-cost/",
    page: "/software-development/",
  },
  {
    id: "online-store",
    label: "Online store",
    plural: "online stores",
    words: /\b(online stores?|e-?commerce|shops?|shopify|woocommerce|stores?|marketplaces?)\b/i,
    service: "ecommerce",
    summary: "online-store",
    fromLabel: "marketplaces start from",
    guide: "/resources/cost-guides/how-much-does-an-ecommerce-store-cost/",
    page: "/ecommerce/",
  },
  {
    id: "ai",
    label: "AI features",
    plural: "AI projects",
    words: /\b(ai|chatbots?|assistants?|agents?|machine learning|gpt|llm)\b/i,
    service: "ai",
    summary: "ai",
    guide: "/resources/cost-guides/how-much-does-ai-integration-cost/",
    page: "/ai/",
  },
  {
    id: "automation",
    label: "Automation",
    plural: "automation projects",
    words: /\b(automat\w*|workflows?|zapier|make\.com|n8n)\b/i,
    service: "automation",
    guide: "/resources/cost-guides/business-automation-cost/",
    page: "/automation/",
  },
  {
    id: "integration",
    label: "Connecting systems",
    plural: "integration projects",
    words: /\b(integrat\w*|apis?|connect\w*|sync\w*)\b/i,
    service: "api-integration",
    summary: "integration",
    guide: "/resources/cost-guides/how-much-does-api-integration-cost/",
    page: "/api-integration/",
  },
  {
    id: "mvp",
    label: "First version (MVP)",
    plural: "first versions (MVPs)",
    words: /\b(mvps?|prototypes?|first versions?|proof of concept|poc)\b/i,
    summary: "mvp",
    guide: "/resources/cost-guides/how-much-does-it-cost-to-build-an-mvp/",
    page: "/resources/cost-guides/how-much-does-it-cost-to-build-an-mvp/",
  },
];

const ESTIMATOR: AnswerLink = { name: "Cost estimator", path: "/tools/cost-estimator/" };
const priceChip = (k: (typeof KINDS)[number]) => `${k.label} prices`;
const timeChip = (k: (typeof KINDS)[number]) => `${k.label} timelines`;

const titleOf = (p: string) => getRegistry().pageByPath.get(p)?.breadcrumbLabel ?? p;
const link = (p: string): AnswerLink => ({ name: titleOf(p), path: p });

function plansOf(k: (typeof KINDS)[number]): Plan[] {
  const file = priceFile();
  if (!k.service) return file.mvp;
  const all = file.services[k.service]?.plans ?? [];
  return k.plans ? k.plans.map((i) => all[i]!).filter(Boolean) : all;
}

/** "1 week" + "3 months" style bounds from a list of plan timelines. */
function span(plans: Plan[]): string {
  const parsed = plans
    .map((p) => p.timeline ?? "")
    .filter((t) => /\d/.test(t))
    .map((t) => {
      const nums = [...t.matchAll(/\d+/g)].map((m) => Number(m[0]));
      const unit = /month/.test(t) ? "month" : "week";
      return { lo: nums[0]!, hi: nums.at(-1)!, unit };
    });
  if (!parsed.length) return "";
  const first = parsed[0]!;
  const last = parsed.at(-1)!;
  const fmt = (n: number, u: string) => `${n} ${u}${n === 1 ? "" : "s"}`;
  return first.unit === last.unit
    ? `${first.lo} to ${fmt(last.hi, last.unit)}`
    : `${fmt(first.lo, first.unit)} to ${fmt(last.hi, last.unit)}`;
}

function summaryOf(id?: string) {
  return id ? priceFile().summaries.find((s) => s.id === id) : undefined;
}

function costAnswer(k: (typeof KINDS)[number]): SiteAnswer {
  const s = summaryOf(k.summary);
  const plans = plansOf(k);
  const lead = s
    ? `Most ${k.plural} with us cost ${s.range}, and ${k.fromLabel ?? "a first version starts from"} ${s.from}.`
    : `${k.label} with us is priced by size. Here are our typical ranges.`;
  const lines = plans.map((p) => `- ${p.name}: ${p.range}`).join("\n");
  return {
    reply: `${lead}\n${lines}\nThe price depends on scope. The cost estimator gives you your own range in about two minutes.`,
    links: [link(k.guide), ESTIMATOR],
    suggestions: [timeChip(k), MENU.person],
  };
}

function timeAnswer(k: (typeof KINDS)[number]): SiteAnswer {
  const plans = plansOf(k).filter((p) => /\d/.test(p.timeline ?? ""));
  const lines = plans.map((p) => `- ${p.name}: ${p.timeline}`).join("\n");
  return {
    reply: `Typical timelines for ${k.plural}, counted from the day the scope is approved:\n${lines}\nWe agree the timeline with you before work starts, and we keep you updated every week.`,
    links: [link(k.page), link(k.guide)],
    suggestions: [priceChip(k), MENU.person],
  };
}

function costOverview(): SiteAnswer {
  const lines = KINDS.filter((k) => k.summary)
    .map((k) => `- ${k.label}: ${summaryOf(k.summary)!.range}`)
    .join("\n");
  return {
    reply: `It depends on what you build. Here is what most projects cost with us:\n${lines}\nPick one for the details, or get your own range from the cost estimator.`,
    links: [link("/cost/"), ESTIMATOR],
    suggestions: KINDS.map(priceChip),
  };
}

function timeOverview(): SiteAnswer {
  const lines = KINDS.map((k) => `- ${k.label}: ${span(plansOf(k))}`)
    .filter((l) => !/: $/.test(l))
    .join("\n");
  return {
    reply: `Most projects take between one week and a few months. Typical timelines, from the day the scope is approved:\n${lines}\nPick one for the details.`,
    links: [link("/company/how-we-work/")].filter((l) => l.name !== l.path),
    suggestions: KINDS.map(timeChip),
  };
}

function buildOverview(): SiteAnswer {
  return {
    reply:
      "We design, build, and support software from first idea to long-term care:\n- Websites and web apps\n- Mobile apps for iPhone and Android\n- Custom software for your team or your customers\n- AI assistants and automation\n- Online stores\n- Connecting systems, cloud, security, data, design, and marketing\nWhich of these is closest to what you need?",
    links: [link("/services/")],
    suggestions: [
      "A website",
      "A mobile app",
      "Software for our team",
      "An online store",
      "Answer customer questions",
      "Automate a repeated task",
    ],
  };
}

const COST =
  /\b(cost|costs|price|prices|pricing|priced|how much|budget|quote|estimate|rates?|fees?|expensive|cheap|afford)\b/i;
const TIME =
  /\b(how long|timeline|timelines|time ?frame|how many (weeks|months)|how quickly|how fast|turnaround|deadline|when can you (start|deliver))\b/i;

/** A menu topic, a tapped chip, or a plain question about prices or timelines. */
export function menuAnswer(text: string): SiteAnswer | null {
  const t = text
    .trim()
    .replace(/[.!?]+$/, "")
    .toLowerCase();
  if (t === MENU.build.toLowerCase().replace(/\?$/, "")) return buildOverview();
  if (t === MENU.cost.toLowerCase().replace(/\?$/, "")) return costOverview();
  if (t === MENU.time.toLowerCase().replace(/\?$/, "")) return timeOverview();
  for (const k of KINDS) {
    if (t === priceChip(k).toLowerCase()) return costAnswer(k);
    if (t === timeChip(k).toLowerCase()) return timeAnswer(k);
  }
  const cost = COST.test(text);
  const time = TIME.test(text);
  if (!cost && !time) return null;
  // The most specific kind named wins: "web app" before "app", "online store" before "store".
  const kind =
    KINDS.find((k) => k.id === "web-app" && k.words.test(text)) ??
    KINDS.find((k) => k.id === "mvp" && k.words.test(text)) ??
    KINDS.find((k) => k.words.test(text));
  if (time && !cost) return kind ? timeAnswer(kind) : timeOverview();
  return kind ? costAnswer(kind) : costOverview();
}

/* ---------------- the site's own questions and answers ---------------- */

type Faq = { q: string; a: string; path: string; page: string };
let faqCache: { list: Faq[]; index: SearchIndex<Faq> } | undefined;

function faqs() {
  if (faqCache) return faqCache;
  const registry = getRegistry();
  const plain = (s: string) => toPlainText(s, registry.facts);
  const seen = new Set<string>();
  const list: Faq[] = [];
  for (const p of registry.pages) {
    if (p.indexing !== "index") continue;
    for (const b of p.sections) {
      if (b.type !== "faq") continue;
      for (const item of b.items) {
        const q = plain(item.q);
        if (seen.has(q.toLowerCase())) continue;
        seen.add(q.toLowerCase());
        list.push({ q, a: plain(item.a), path: `${p.path}#${b.id}`, page: p.breadcrumbLabel });
      }
    }
  }
  faqCache = { list, index: new SearchIndex(list, (f) => [f.q, f.a, f.page], [10, 2, 2]) };
  return faqCache;
}

/**
 * The closest question already answered on the site, when it is a confident match: every word of
 * the visitor's question appears in it, and it scores well on the question itself.
 */
export function faqAnswer(text: string): SiteAnswer | null {
  const words = tokenize(text).filter((w) => w.length > 2);
  if (words.length < 2) return null;
  const { list, index } = faqs();
  const { hits } = index.search(text);
  const best = hits[0];
  if (!best || !best.full || best.score < 7 * Math.min(words.length, 4)) return null;
  const f = list[best.doc]!;
  return {
    reply: f.a,
    links: [{ name: f.page, path: f.path }],
    suggestions: [],
  };
}

/** Warms the caches (called when the content registry is warmed). */
export function warmAnswers() {
  priceFile();
  faqs();
}
