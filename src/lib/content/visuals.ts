import fs from "node:fs";
import path from "node:path";
import type { Block, Page, PhotoRef } from "./schema";

/**
 * The topic photo library (owner direction, 20 October 2026: real photographs instead of
 * illustrations on every page). Each page resolves to a topic (its service, industry, country, or
 * company area) and takes photographs from that topic's pool. Interface mockups and drawn
 * illustrations are replaced by these photographs when the content loads, so every page follows
 * the same rule without hand-editing 127 files. Pages can still set their own photographs.
 */
const TOPICS: Record<string, string[]> = {
  "software-development": [
    "service-software-developers",
    "hero-software-developer-monitors",
    "developers-coding-monitors",
    "laptop-code-dark",
    "business-software-laptop",
  ],
  "web-development": [
    "web-workspace-desk",
    "mockup-website-laptop",
    "web-dev-dark-desk",
    "hero-website-laptop",
    "mockup-website-tablet",
    "service-web-analytics-laptop",
  ],
  "mobile-app-development": [
    "hero-mobile-app-hands",
    "mobile-app-design-mockup",
    "service-mobile-app-code",
    "mobile-app-in-hand",
  ],
  ecommerce: [
    "ecommerce-card-laptop",
    "service-ecommerce-phone-payment",
    "ecommerce-phone-shopping",
  ],
  ai: ["service-ai-tablet", "ai-chip-board"],
  automation: ["service-automation-workflow-whiteboard", "consulting-process-mapping-review"],
  "data-analytics": [
    "service-data-analytics-charts",
    "data-presentation-screen",
    "mockup-dashboard-ui",
    "analytics-dashboard-screen",
    "data-team-reviewing-reports",
  ],
  "api-integration": ["api-cable-network", "service-api-network-cables", "hero-web-app-dashboard"],
  cloud: ["cloud-server-rack", "service-cloud-data-center"],
  cybersecurity: ["security-padlock-keyboard", "family-security-padlock"],
  "ui-ux": [
    "service-ui-design-system",
    "design-workshop-color-swatches",
    "website-wireframe-sketch",
  ],
  branding: ["branding-tablet-sketch", "service-branding-color-book"],
  "seo-aeo-geo": ["service-seo-search-console", "seo-analytics-screen"],
  "digital-marketing": ["marketing-social-phone", "service-digital-marketing-social"],
  consulting: [
    "service-consulting-conversation",
    "consulting-process-mapping-review",
    "contact-consultation-conversation",
    "discovery-sticky-notes-glass",
  ],
  company: [
    "team-planning-whiteboard-office",
    "team-support-laptop-review",
    "team-reviewing-release-screen",
  ],
  healthcare: ["industry-healthcare-doctors", "industry-healthcare-scans"],
  finance: ["industry-finance-trading", "industry-finance-app"],
  "real-estate": ["industry-real-estate-keys", "industry-real-estate-listing"],
  logistics: ["industry-logistics-warehouse", "industry-logistics-truck"],
  manufacturing: ["industry-manufacturing-line", "industry-manufacturing-tablet"],
  retail: ["industry-retail-store", "industry-retail-checkout"],
  education: ["industry-education-online", "industry-education-laptop"],
  "professional-services": ["industry-professional-documents", "industry-professional-calculator"],
  "united-states": ["location-new-york"],
  "united-kingdom": ["location-london"],
  canada: ["location-toronto"],
  australia: ["location-sydney"],
  ireland: ["location-dublin"],
};

const SOLUTION_TOPIC: Record<string, string> = {
  "ai-customer-support": "ai",
  "business-dashboards": "data-analytics",
  "business-process-automation": "automation",
  "cloud-migration": "cloud",
  "crm-integration": "api-integration",
  "legacy-system-modernization": "software-development",
};

const HUB_TOPIC: Record<string, string> = {
  "/services/": "company",
  "/solutions/": "consulting",
  "/technologies/": "software-development",
  "/industries/": "company",
  "/locations/": "company",
  "/resources/": "consulting",
  "/work/": "software-development",
};

/** The topic a page draws its photographs from. */
export function pageTopic(page: Page, serviceOfEntity: (id: string) => string | undefined): string {
  const seg = page.path.split("/").filter(Boolean);
  const last = seg[seg.length - 1] ?? "";
  switch (page.kind) {
    case "service":
      return TOPICS[last] ? last : "company";
    case "technology":
      return TOPICS[seg[0] ?? ""] ? (seg[0] as string) : "software-development";
    case "solution":
      return SOLUTION_TOPIC[last] ?? "consulting";
    case "industry":
      return TOPICS[last] || LIBRARY[last] ? last : "company";
    case "location":
      return TOPICS[last] ? last : "company";
    case "work-area": {
      const svc = page.entityId ? serviceOfEntity(page.entityId) : undefined;
      return svc && TOPICS[svc] ? svc : "software-development";
    }
    case "case-study": {
      const svc = page.entityId?.replace(/^svc\./, "");
      return svc && TOPICS[svc] ? svc : "software-development";
    }
    case "article": {
      const svc = page.article?.service;
      return svc && TOPICS[svc] ? svc : "consulting";
    }
    default:
      return HUB_TOPIC[page.path] ?? "company";
  }
}

/** Screens: an interface illustration is replaced by a photograph of that kind of screen. */
const SCREEN_PHOTOS: Record<string, string[]> = {
  "site-builder": ["mockup-website-laptop", "mockup-website-tablet", "web-workspace-desk"],
  "store-ui": [
    "ecommerce-phone-shopping",
    "ecommerce-card-laptop",
    "service-ecommerce-phone-payment",
  ],
  "dashboard-ui": ["mockup-dashboard-ui", "hero-web-app-dashboard", "analytics-dashboard-screen"],
  "analytics-ui": ["analytics-dashboard-screen", "seo-analytics-screen", "mockup-dashboard-ui"],
  "mobile-app-ui": ["mobile-app-design-mockup", "hero-mobile-app-hands", "mobile-app-in-hand"],
  "crm-ui": ["mockup-dashboard-ui", "business-software-laptop", "hero-web-app-dashboard"],
  "assistant-ui": ["service-ai-tablet", "hero-mobile-app-hands"],
  "workflow-ui": ["service-automation-workflow-whiteboard", "business-software-laptop"],
  "portal-wireframe": [
    "hero-web-app-dashboard",
    "mockup-website-laptop",
    "business-software-laptop",
  ],
  "platform-ui": ["mockup-dashboard-ui", "hero-web-app-dashboard"],
  "interface-set": ["mockup-website-tablet", "mobile-app-design-mockup"],
};

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/** The photo library (data/assets/library.json): extra photographs per topic, plus portraits. */
const LIBRARY: Record<string, string[]> = JSON.parse(
  fs.readFileSync(
    path.join(/*turbopackIgnore: true*/ process.cwd(), "data/assets/library.json"),
    "utf8",
  ),
);

/** Pools a topic may borrow from when its own photographs are all in use. */
const SHARED_FALLBACK = [
  "company",
  "software-development",
  "web-development",
  "consulting",
  "automation",
  "data-analytics",
].flatMap((t) => LIBRARY[t] ?? []);

/** Every photograph a topic may use: its curated photographs first, then its library. */
function poolFor(topic: string): string[] {
  return [...(TOPICS[topic] ?? []), ...(LIBRARY[topic] ?? [])];
}

/**
 * Pick a photograph no other placement on the site has used (owner direction, 20 October 2026:
 * no photograph appears twice). Rotation starts at a stable point per page; when a pool is fully
 * used, the least-used photograph of the pool is shown again rather than nothing.
 */
function pick(pool: string[], page: Page, n: number, used: Map<string, number>): PhotoRef {
  const start = page.kind === "service" ? 0 : hash(page.path) + n;
  let id: string | undefined;
  for (let i = 0; i < pool.length; i++) {
    const c = pool[(start + i) % pool.length] as string;
    if (!used.has(c)) {
      id = c;
      break;
    }
  }
  // A topic that has run out borrows an unused photograph from the shared pools before repeating.
  id ??=
    SHARED_FALLBACK.find((c) => !used.has(c)) ??
    [...pool].sort((x, y) => (used.get(x) ?? 0) - (used.get(y) ?? 0))[0] ??
    "company-team-working-session";
  used.set(id, (used.get(id) ?? 0) + 1);
  return { asset: `asset.photo-${id}`, layout: "split", position: "50% 50%" };
}

/** One face per person: a name always shows the same portrait wherever it appears. */
const PEOPLE = new Map<string, PhotoRef>();

/** Photographs set by hand in the content (the home page) are counted as used first. */
export function reservePhotographs(
  pages: Page[],
  used: Map<string, number>,
  collect: (b: Block) => PhotoRef[],
) {
  PEOPLE.clear();
  for (const p of pages)
    for (const b of p.sections)
      if (b.type === "testimonials")
        for (const q of b.items) if (q.photo) PEOPLE.set(q.name, q.photo);
  for (const p of pages)
    for (const b of p.sections)
      for (const ph of collect(b)) {
        const id = ph.asset.replace(/^asset.photo-/, "");
        used.set(id, (used.get(id) ?? 0) + 1);
      }
}

/**
 * Replace illustrations with photographs: the hero gets a photograph, every diagram block that
 * shows an interface mockup or a drawn illustration shows a photograph instead (its points stay),
 * and sample case studies and testimonials get photographs and portraits. No photograph repeats.
 */
export function applyPhotographs(
  page: Page,
  serviceOfEntity: (id: string) => string | undefined,
  used: Map<string, number>,
) {
  let n = 0;
  const person = (name: string, position: string): PhotoRef => {
    const known = PEOPLE.get(name);
    if (known) return known;
    const photo = {
      ...pick(portraitPool(name), page, n++, used),
      layout: "rail" as const,
      position,
    };
    PEOPLE.set(name, photo);
    return photo;
  };
  if (page.kind === "home") return;
  const topic = poolFor(pageTopic(page, serviceOfEntity));
  if (page.kind === "article" && page.article && !page.article.photo) {
    page.article.photo = pick(topic, page, n++, used);
  }
  for (const b of page.sections as Block[]) {
    if (b.type === "hero" && !b.photo && b.slides.length === 0) {
      b.photo = pick(topic, page, n++, used);
    } else if (b.type === "diagram" && b.figure && !b.photo) {
      const screens = SCREEN_PHOTOS[b.figure];
      b.photo = pick(screens ? [...screens, ...topic] : topic, page, n++, used);
      b.figure = undefined;
    } else if (b.type === "case-studies") {
      for (const c of b.items) c.photo ??= pick(topic, page, n++, used);
    } else if (b.type === "team") {
      for (const m of b.members) m.photo ??= person(m.name, "50% 22%");
    }
    // Testimonials show initials: a real client is never shown with a stock face.
  }
}

/** First names used in the sample people, so each portrait matches the name beside it. */
const FEMALE = new Set(
  "Grace Helen Laura Sarah Emma Rachel Claire Nina Victoria Sophie Megan Anna Lucy Karen Natalie Sofia Olivia Hannah Charlotte Amelia Isabel Julia Rebecca Alice Emily Kate Maria Elena Priya Mia Leah Zoe Ruth Jane Ellen Fiona Tessa Ingrid Freya Alina Isadora Claudia Mira Clara Naomi Chloe Margaret Diana Paula Lisa Julia Nora".split(
    " ",
  ),
);

/** Portraits for a person: the matching pool first (women or men), then the older shared set. */
export function portraitPool(name: string): string[] {
  const first = name.split(" ")[0] ?? "";
  const own = FEMALE.has(first) ? LIBRARY["portraits-f"] : LIBRARY["portraits-m"];
  return own?.length ? own : (LIBRARY.portraits ?? []);
}

/** Every photograph id in the curated pools and the library, for the registry check. */
export const TOPIC_PHOTO_IDS = new Set(
  [...Object.values(TOPICS), ...Object.values(SCREEN_PHOTOS), ...Object.values(LIBRARY)].flat(),
);
