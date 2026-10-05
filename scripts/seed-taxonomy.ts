/**
 * One-time bootstrap: seeds data/taxonomy/*.yaml from the approved capability lists in AGENTS.md
 * (sections 3 to 23), one-for-one, so no approved capability is lost (DEC-36).
 *
 * After the first run the generated YAML files are the source of truth and are edited directly.
 * This script is kept for reproducibility and as documentation of the canonical-home rules.
 * Run: npx tsx scripts/seed-taxonomy.ts
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

type EntityType =
  | "capability"
  | "technology"
  | "platform"
  | "language"
  | "framework"
  | "provider"
  | "tool"
  | "integration"
  | "concept"
  | "ecosystem"
  | "industry"
  | "business-type"
  | "problem"
  | "solution";

const root = process.cwd();
const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8").split(/\r?\n/);

/** Specialist services win canonical-home conflicts over generalist ones (lower rank wins). */
const RANK = {
  cybersecurity: 1,
  "api-integration": 1,
  "data-analytics": 1,
  ai: 1,
  "mobile-app-development": 2,
  "ui-ux": 2,
  ecommerce: 2,
  "seo-aeo-geo": 2,
  branding: 2,
  "digital-marketing": 2,
  consulting: 2,
  automation: 3,
  cloud: 3,
  "web-development": 4,
  "software-development": 5,
} as const;
type Svc = keyof typeof RANK;

/** Explicit canonical homes (audit D-9) where the rank rule alone is not the approved answer. */
const OVERRIDES: Record<string, Svc> = {
  "Marketplace Development": "software-development",
  "Marketing Automation": "automation",
  "AI Chatbots": "ai",
  Firebase: "cloud",
  Supabase: "cloud",
};

const PROBLEM_SERVICE: Record<string, Svc> = {
  "need custom software": "software-development",
  "need business automation": "automation",
  "need workflow automation": "automation",
  "too many spreadsheets": "automation",
  "manual data entry": "automation",
  "manual reporting": "data-analytics",
  "disconnected systems": "api-integration",
  "legacy software": "software-development",
  "outdated software": "software-development",
  "slow business processes": "automation",
  "poor customer experience": "ui-ux",
  "poor lead management": "automation",
  "slow customer support": "ai",
  "website not converting": "web-development",
  "outdated website": "web-development",
  "need mobile application": "mobile-app-development",
  "need ai implementation": "ai",
  "need ai integration": "ai",
  "need ai chatbot": "ai",
  "need ai agent": "ai",
  "need ai automation": "automation",
  "need cloud migration": "cloud",
  "need api integration": "api-integration",
  "need software integration": "api-integration",
  "need crm integration": "api-integration",
  "need ecommerce automation": "ecommerce",
  "need to connect business tools": "api-integration",
  "need to replace legacy systems": "software-development",
  "need to automate repetitive work": "automation",
  "need to adopt ai": "ai",
};

const SOLUTION_SERVICE: Record<string, Svc> = {
  "business process automation": "automation",
  "workflow automation": "automation",
  "legacy system modernization": "software-development",
  "cloud migration": "cloud",
  "api integration": "api-integration",
  "crm integration": "api-integration",
  "customer portal development": "software-development",
  "internal business software": "software-development",
  "ai customer support": "ai",
  "ai automation": "automation",
  "ai agents": "ai",
  "ai knowledge systems": "ai",
  "payment integration": "api-integration",
  "booking platforms": "software-development",
  "marketplace platforms": "software-development",
  "subscription platforms": "software-development",
  "saas platforms": "software-development",
  "business dashboards": "data-analytics",
  "data systems": "data-analytics",
  "digital transformation": "consulting",
  "ecommerce systems": "ecommerce",
  "customer experience systems": "ui-ux",
};

const SHORTLIST = new Set(
  [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "PHP",
    "Java",
    "WordPress",
    "Shopify",
    "Webflow",
    "Airtable",
    "Zapier",
    "Make",
    "n8n",
    "OpenAI",
    "Anthropic Claude",
    "Google Gemini",
    "LangChain",
    "AWS",
    "Azure",
    "Google Cloud",
    "Flutter",
    "React Native",
    "Swift",
    "Kotlin",
    "PostgreSQL",
    "MongoDB",
    "Salesforce",
    "HubSpot",
    "Stripe",
    "Docker",
    "Kubernetes",
    "Terraform",
  ].map((s) => s.toLowerCase()),
);

const FIRST_WAVE_INDUSTRIES = new Set(
  [
    "Healthcare",
    "Finance",
    "Banking",
    "Insurance",
    "Real Estate",
    "Property Management",
    "Logistics",
    "Transportation",
    "Retail",
    "Ecommerce",
    "Education",
    "Professional Services",
    "Manufacturing",
  ].map((s) => s.toLowerCase()),
);

const FIRST_WAVE_SOLUTIONS = new Set(
  [
    "Business Process Automation",
    "Workflow Automation",
    "Legacy System Modernization",
    "Cloud Migration",
    "API Integration",
    "CRM Integration",
    "Customer Portal Development",
    "Internal Business Software",
    "AI Customer Support",
    "AI Agents",
    "AI Knowledge Systems",
    "Business Dashboards",
  ].map((s) => s.toLowerCase()),
);

type Mapping = { type: EntityType; svc: Svc } | null;

function map(section: number, group: string | undefined, name: string): Mapping {
  const g = (group ?? "").toLowerCase();
  switch (section) {
    case 3:
      return g === "services" ? { type: "capability", svc: "software-development" } : null;
    case 4:
      if (g === "services") return { type: "capability", svc: "web-development" };
      if (g === "platforms") return { type: "platform", svc: "web-development" };
      if (g === "frontend technologies") return { type: "framework", svc: "web-development" };
      if (g.startsWith("frontend tools")) return { type: "tool", svc: "web-development" };
      return null;
    case 5:
      if (g === "services") return { type: "capability", svc: "mobile-app-development" };
      return { type: "technology", svc: "mobile-app-development" };
    case 6:
      if (g === "ai providers") return { type: "provider", svc: "ai" };
      if (g === "ai frameworks") return { type: "framework", svc: "ai" };
      if (g.startsWith("ai/vector")) return { type: "technology", svc: "ai" };
      return { type: "capability", svc: "ai" };
    case 7:
      if (g === "workflow/business platforms") return { type: "platform", svc: "automation" };
      if (g === "automation platforms and technologies")
        return { type: "technology", svc: "automation" };
      return { type: "capability", svc: "automation" };
    case 8:
      if (g === "cloud platforms") return { type: "platform", svc: "cloud" };
      if (g === "devops") return { type: "tool", svc: "cloud" };
      return { type: "technology", svc: "cloud" };
    case 9:
      if (g === "services") return { type: "capability", svc: "cybersecurity" };
      return { type: "concept", svc: "cybersecurity" };
    case 10:
      if (g === "services") return { type: "capability", svc: "data-analytics" };
      if (g.includes("platforms")) return { type: "platform", svc: "data-analytics" };
      return { type: "technology", svc: "data-analytics" };
    case 11:
      if (g === "api technologies") return { type: "technology", svc: "api-integration" };
      if (g === "integration services") return { type: "capability", svc: "api-integration" };
      return { type: "integration", svc: "api-integration" };
    case 12:
      if (g === "platforms") return { type: "platform", svc: "ecommerce" };
      return { type: "capability", svc: "ecommerce" };
    case 13:
      if (g === "tools") return { type: "tool", svc: "ui-ux" };
      return { type: "capability", svc: "ui-ux" };
    case 14:
      return { type: "capability", svc: "branding" };
    case 15:
      if (g.startsWith("target search")) return { type: "ecosystem", svc: "seo-aeo-geo" };
      return { type: "capability", svc: "seo-aeo-geo" };
    case 16:
      return { type: "capability", svc: "digital-marketing" };
    case 17:
      return { type: "capability", svc: "consulting" };
    case 18: {
      const mobile = ["kotlin", "swift", "dart", "objective-c"];
      const web = ["javascript", "typescript", "php"];
      const n = name.toLowerCase();
      const svc: Svc = mobile.includes(n)
        ? "mobile-app-development"
        : web.includes(n)
          ? "web-development"
          : "software-development";
      return { type: "language", svc };
    }
    case 19:
      return { type: "concept", svc: "software-development" };
    case 20:
      return { type: "industry", svc: "consulting" };
    case 21:
      return { type: "business-type", svc: "consulting" };
    case 22:
      return { type: "problem", svc: "consulting" };
    case 23:
      return { type: "solution", svc: "consulting" };
    default:
      return null;
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/c\+\+/g, "c-plus-plus")
    .replace(/c#/g, "c-sharp")
    .replace(/\.net/g, "dotnet")
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]+/g, "");

type Raw = {
  name: string;
  type: EntityType;
  svc: Svc;
  section: number;
  group: string | undefined;
  sub: string | undefined;
};

const raws: Raw[] = [];
let section = 0;
let group: string | undefined;
let sub: string | undefined;
for (const line of agents) {
  const sec = /^# (\d+)\. /.exec(line);
  if (sec) {
    section = Number(sec[1]);
    group = undefined;
    sub = undefined;
    continue;
  }
  if (/^# /.test(line)) {
    section = 0;
    continue;
  }
  const h2 = /^## (.+?)\s*$/.exec(line);
  if (h2) {
    group = h2[1];
    sub = undefined;
    continue;
  }
  const h3 = /^### (.+?)\s*$/.exec(line);
  if (h3) {
    sub = h3[1];
    continue;
  }
  if (section < 3 || section > 23) continue;
  const b = /^\s*-\s{1,4}(\S.*?)\s*$/.exec(line);
  if (!b || !b[1]) continue;
  const name = b[1].trim();
  if (name.length > 70 || / - /.test(name) || name.endsWith(":")) continue;
  // Catch-all phrases in the source lists ("and other legitimate industries") are not entities.
  if (/^(and )?other /i.test(name)) continue;
  const m = map(section, group, name);
  if (!m) continue;
  raws.push({ name, ...m, section, group, sub });
}

// Merge duplicates by normalized name; choose the canonical home by explicit override, then rank.
type Merged = Raw & { alsoListedUnder: Svc[] };
const byKey = new Map<string, Merged>();
for (const r of raws) {
  const space = ["industry", "business-type", "problem", "solution"].includes(r.type)
    ? r.type
    : "service-space";
  const key = `${space}:${norm(r.name)}`;
  const existing = byKey.get(key);
  if (!existing) {
    byKey.set(key, { ...r, alsoListedUnder: [] });
    continue;
  }
  const incoming = r.svc;
  const keepRank = RANK[existing.svc];
  const inRank = RANK[incoming];
  if (!OVERRIDES[r.name] && inRank < keepRank) {
    existing.alsoListedUnder.push(existing.svc);
    existing.svc = incoming;
    existing.group = r.group ?? existing.group;
    existing.sub = r.sub ?? existing.sub;
  } else if (incoming !== existing.svc && !existing.alsoListedUnder.includes(incoming)) {
    existing.alsoListedUnder.push(incoming);
  }
}
for (const [, e] of byKey) {
  const o = OVERRIDES[e.name];
  if (o && e.svc !== o) {
    if (!e.alsoListedUnder.includes(e.svc)) e.alsoListedUnder.push(e.svc);
    e.svc = o;
  }
  e.alsoListedUnder = e.alsoListedUnder.filter((s) => s !== e.svc);
}

const PREFIX: Record<EntityType, string> = {
  capability: "cap",
  technology: "tech",
  platform: "plat",
  language: "lang",
  framework: "fw",
  provider: "prov",
  tool: "tool",
  integration: "int",
  concept: "con",
  ecosystem: "eco",
  industry: "ind",
  "business-type": "bt",
  problem: "prob",
  solution: "sol",
};

const FILE: Record<EntityType, string> = {
  capability: "capabilities",
  technology: "technologies",
  platform: "technologies",
  language: "technologies",
  framework: "technologies",
  provider: "technologies",
  tool: "technologies",
  integration: "technologies",
  ecosystem: "technologies",
  concept: "concepts",
  industry: "industries",
  "business-type": "business-types",
  problem: "problems",
  solution: "solutions",
};

type Out = Record<string, unknown>;
const out: Record<string, Out[]> = {};
const usedIds = new Set<string>();
let collisions = 0;
for (const [, e] of byKey) {
  const slug = slugify(e.name);
  let id = `${PREFIX[e.type]}.${slug}`;
  if (usedIds.has(id)) {
    id = `${id}-${e.svc}`;
    collisions++;
  }
  usedIds.add(id);
  const lower = e.name.toLowerCase();
  const strategic =
    SHORTLIST.has(lower) &&
    ["technology", "platform", "language", "framework", "provider", "integration"].includes(e.type);
  let pagePolicy = "REVIEW";
  let prominence = "reference";
  if (strategic) {
    pagePolicy = "CREATE LATER";
    prominence = "feature";
  }
  if (e.type === "capability") prominence = "standard";
  if (e.type === "industry" && FIRST_WAVE_INDUSTRIES.has(lower)) pagePolicy = "CREATE LATER";
  if (e.type === "solution") {
    pagePolicy = FIRST_WAVE_SOLUTIONS.has(lower) ? "CREATE LATER" : "REVIEW";
    prominence = "standard";
  }
  if (e.type === "problem") pagePolicy = "MERGE / CONSOLIDATE";
  if (e.type === "industry" || e.type === "business-type") prominence = "standard";
  const row: Out = {
    id,
    type: e.type,
    name: e.name,
    slug,
    ...(e.type === "industry" || e.type === "business-type"
      ? {}
      : {
          primaryService: `svc.${
            e.type === "problem"
              ? (PROBLEM_SERVICE[lower] ?? e.svc)
              : e.type === "solution"
                ? (SOLUTION_SERVICE[lower] ?? e.svc)
                : e.svc
          }`,
        }),
    ...(e.group ? { group: e.sub ? `${e.group} / ${e.sub}` : e.group } : {}),
    ...(e.alsoListedUnder.length
      ? { alsoListedUnder: e.alsoListedUnder.map((s) => `svc.${s}`) }
      : {}),
    prominence,
    pagePolicy,
    evidenceLevel: "none",
    sourceSection: e.section,
  };
  const f = FILE[e.type];
  (out[f] ??= []).push(row);
}

const dir = path.join(root, "data", "taxonomy");
fs.mkdirSync(dir, { recursive: true });
const header = (name: string) =>
  `# ${name}\n# Seeded one-for-one from the approved capability lists in AGENTS.md (sections 3 to 23)\n# by scripts/seed-taxonomy.ts on first bootstrap. From now on this file is edited directly.\n# Internal classification only: it organizes the entity graph and is never shown as a disclaimer.\n# Fields: role is the entity type; prominence feature|standard|reference; pagePolicy uses the five\n# exact statuses; evidenceLevel none|work-area|work-entry|case-study (internal).\n`;
let total = 0;
for (const [file, rows] of Object.entries(out)) {
  rows.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  fs.writeFileSync(
    path.join(dir, `${file}.yaml`),
    header(file) + YAML.stringify({ entities: rows }, { lineWidth: 0 }),
  );
  total += rows.length;
  console.log(file.padEnd(16), rows.length);
}
console.log(
  "total entities:",
  total,
  "| raw bullets:",
  raws.length,
  "| id collisions:",
  collisions,
);
