// Expands data/industries/*.yaml (one entry per industry, each with its own copy) into
// content/pages/en/industry-<slug>.yaml. Owner direction, 20 October 2026: thirty industry pages.
// This script only supplies the page frame (ids, schema types, block order); every sentence comes
// from the data file. Run: node scripts/build-industry-pages.mjs
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")),
  "..",
);
const dir = path.join(root, "data", "industries");

/** Every ordering of the five middle sections; each industry takes a different one. */
const perms = (xs) =>
  xs.length <= 1
    ? [xs]
    : xs.flatMap((x, k) => perms([...xs.slice(0, k), ...xs.slice(k + 1)]).map((p) => [x, ...p]));
const ORDERS = perms(["projects", "needs", "how", "help", "technology", "faq"]);

const page = (i) => ({
  id: `page.industry-${i.slug}`,
  kind: "industry",
  locale: "en",
  path: `/industries/${i.slug}/`,
  parent: "/industries/",
  entityId: i.entity,
  title: i.title,
  description: i.description,
  breadcrumbLabel: i.name,
  intent: { primary: i.intent[0], secondary: i.intent.slice(1) },
  indexing: "index",
  claims: ["company.name", "company.descriptor"],
  datePublished: "2026-10-20",
  dateModified: "2026-10-20",
  schemaTypes: ["WebPage", "FAQPage"],
  comprehension: i.comprehension,
  sections: [
    {
      type: "hero",
      id: "hero",
      variant: "service",
      eyebrow: "Industry",
      headline: i.hero.headline,
      lead: i.hero.lead,
      ctas: [
        { label: i.cta.label, href: `/contact/?service=${i.service}` },
        { label: "See what we build", href: "#needs" },
      ],
      spec: {
        kind: "hub",
        center: { title: i.hero.center[0], text: i.hero.center.slice(1).join(", ") },
        spokes: i.hero.spokes.map((s) => ({ title: s[0], text: s.slice(1).join(", ") })),
      },
      purpose: "relationship",
      takeaway: i.hero.takeaway,
      visualTitle: i.hero.visual,
      figureCaption: i.hero.caption,
    },
    {
      type: "prose",
      id: "different",
      tone: "white",
      label: "What is different",
      heading: i.why.heading,
      paragraphs: i.why.paragraphs,
    },
    {
      type: "table",
      id: "projects",
      tone: "white",
      label: "Typical projects",
      heading: `${i.name} projects, costs, and timelines`,
      intro: i.projects.intro,
      caption: `Typical ${i.name.toLowerCase()} projects with what they include, what they cost, and how long they take`,
      columns: ["Project", "What it includes", "Typical cost", "Timeline"],
      rows: i.projects.rows,
      note: "Every project is quoted in writing after a short call. The top of each range covers larger builds and more integrations.",
    },
    {
      type: "index",
      id: "needs",
      tone: "paper",
      columns: 2,
      label: "What we build",
      heading: i.needs.heading,
      intro: i.needs.intro,
      items: i.needs.items.map(([title, body]) => ({ title, body })),
    },
    {
      type: "process",
      id: "how",
      tone: "white",
      label: "How we deliver",
      heading: i.steps.heading,
      intro: i.steps.intro,
      steps: i.steps.items.map(([title, body, artifacts]) => ({ title, body, artifacts })),
    },
    {
      type: "columns",
      id: "help",
      tone: "paper",
      label: "What you get",
      heading: i.help.heading,
      intro: i.help.intro,
      columns: i.help.cols.map(([title, items]) => ({ title, items })),
    },
    {
      type: "technical",
      id: "technology",
      tone: "paper",
      label: "Technical depth",
      heading: i.tech.heading,
      intro: i.tech.intro,
      panels: i.tech.panels.map(([title, items]) => ({ title, items })),
    },
    {
      type: "faq",
      id: "faq",
      tone: "paper",
      label: "Common questions",
      heading: i.faq.heading,
      items: i.faq.items.map(([q, a]) => ({ q, a })),
    },
    {
      type: "related",
      id: "related",
      tone: "white",
      label: "Related",
      heading: `${i.name} across DECHY`,
      groups: [
        { title: "Services", entityIds: i.related.services },
        { title: "Systems we build", entityIds: i.related.work },
        { title: "Technologies", entityIds: i.related.tech },
      ],
    },
    {
      type: "cta",
      id: "contact-cta",
      heading: i.cta.heading,
      body: i.cta.body,
      primary: { label: i.cta.label, href: `/contact/?service=${i.service}` },
    },
  ],
});

let n = 0;
for (const f of fs
  .readdirSync(dir)
  .filter((x) => x.endsWith(".yaml"))
  .sort()) {
  for (const i of YAML.parse(fs.readFileSync(path.join(dir, f), "utf8")).industries) {
    const out = path.join(root, "content", "pages", "en", `industry-${i.slug}.yaml`);
    const p = page(i);
    // Section order varies by industry so no two pages share a layout.
    const order = ORDERS[(n++ * 17 + 3) % ORDERS.length];
    const [hero, prose, ...rest] = p.sections;
    const tail = rest.filter((b) => !order.includes(b.id));
    p.sections = [hero, prose, ...order.map((id) => rest.find((b) => b.id === id)), ...tail];
    fs.writeFileSync(
      out,
      "# Generated from data/industries by scripts/build-industry-pages.mjs. Edit the data file.\n" +
        YAML.stringify(p, { lineWidth: 100 }),
    );
    console.log("wrote", path.basename(out));
  }
}
