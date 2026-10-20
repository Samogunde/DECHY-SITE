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
      return TOPICS[last] ? last : "company";
    case "location":
      return TOPICS[last] ? last : "company";
    case "work-area": {
      const svc = page.entityId ? serviceOfEntity(page.entityId) : undefined;
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

function pick(pool: string[], page: Page, n: number, used: Set<string>): PhotoRef {
  // A service page opens with its pool's first photograph; other pages rotate through the pool.
  // A photograph is never shown twice on one page while the pool still has an unused one.
  const start = page.kind === "service" ? 0 : hash(page.path);
  let id = pool[(start + n) % pool.length] as string;
  for (let i = 0; i < pool.length && used.has(id); i++)
    id = pool[(start + n + i + 1) % pool.length] as string;
  used.add(id);
  return { asset: `asset.photo-${id}`, layout: "split", position: "50% 50%" };
}

/**
 * Replace illustrations with photographs: the hero gets a photograph, and every diagram block that
 * shows an interface mockup or a drawn illustration shows a photograph instead (its points stay).
 * Teaching data (a block's `spec`) is kept and rendered as cards.
 */
export function applyPhotographs(page: Page, serviceOfEntity: (id: string) => string | undefined) {
  if (page.kind === "home") return;
  const topic = TOPICS[pageTopic(page, serviceOfEntity)] ?? TOPICS.company ?? [];
  const used = new Set<string>();
  let n = 0;
  if (page.kind === "article" && page.article && !page.article.photo) {
    page.article.photo = pick(topic, page, n++, used);
  }
  for (const b of page.sections as Block[]) {
    if (b.type === "hero" && !b.photo && b.slides.length === 0) {
      b.photo = pick(topic, page, n++, used);
    } else if (b.type === "diagram" && b.figure && !b.photo) {
      const screens = SCREEN_PHOTOS[b.figure];
      const pool = screens ? [...screens, ...topic] : topic;
      b.photo = pick(pool, page, screens ? 0 : n++, used);
      b.figure = undefined;
    }
  }
}

/** Every photograph id in the library, for the registry check. */
export const TOPIC_PHOTO_IDS = new Set(
  [...Object.values(TOPICS), ...Object.values(SCREEN_PHOTOS)].flat(),
);
