// Imports the owner's content pack (DECHY_Content_Data_Pack_v2) into data/.
// Usage: node scripts/import-content-pack.mjs <pack folder>
// Copies the testimonial, team, technology, glossary, and partner reference datasets, in US
// English (site rule) and without wrapping quote marks. Names, roles, companies, and meaning are
// kept as supplied. The editorial authors and concept case studies are not imported (owner).
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("Pass the pack folder");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, `DECHY_${name}.json`), "utf8"));

// British to US spelling, whole words only.
const US = {
  programme: "program",
  programmes: "programs",
  organised: "organized",
  organising: "organizing",
  organisation: "organization",
  organisations: "organizations",
  enquiries: "inquiries",
  enquiry: "inquiry",
  colour: "color",
  colours: "colors",
  behaviour: "behavior",
  behaviours: "behaviors",
  prioritised: "prioritized",
  prioritise: "prioritize",
  recognised: "recognized",
  recognise: "recognize",
  catalogue: "catalog",
  catalogues: "catalogs",
  emphasises: "emphasizes",
  optimisation: "optimization",
  optimise: "optimize",
  optimised: "optimized",
  standardised: "standardized",
  authorisation: "authorization",
  visualisation: "visualization",
  centre: "center",
  favour: "favor",
  labour: "labor",
  analyse: "analyze",
  analysed: "analyzed",
  modelling: "modeling",
  travelling: "traveling",
  cancelled: "canceled",
  licence: "license",
  personalised: "personalized",
  customised: "customized",
  utilise: "utilize",
  minimise: "minimize",
  maximise: "maximize",
  summarise: "summarize",
  summarised: "summarized",
  digitised: "digitized",
  centralised: "centralized",
  categorised: "categorized",
  realise: "realize",
  realised: "realized",
  organisers: "organizers",
  organiser: "organizer",
  recognisable: "recognizable",
};
const us = (s) =>
  s
    .replace(/\b[A-Za-z]+\b/g, (w) => {
      const r = US[w.toLowerCase()];
      if (!r) return w;
      return w[0] === w[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r;
    })
    .replace(/\s*[–—]\s*/g, ", ")
    .replace(/[‘’]/g, "'")
    .trim();
const unquote = (s) => s.replace(/^[“"]+|[”"]+$/g, "").trim();

const out = (file, data) => {
  const to = path.join("data", file);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.writeFileSync(to, JSON.stringify(data, null, 2) + "\n");
  console.log(`${to}: ${Array.isArray(data.records) ? data.records.length : ""}`);
};

const note =
  "Imported from DECHY_Content_Data_Pack_v2 by scripts/import-content-pack.mjs. Illustrative examples, not verified client endorsements: shown only in review builds (DECHY_SHOW_DRAFTS=true).";

out("samples/testimonials.json", {
  note,
  records: read("Testimonial_Examples_300").records.map((r) => ({
    id: r.id,
    name: r.person_name,
    role: us(r.job_title),
    company: r.company_name,
    industry: r.industry,
    service: r.primary_service,
    quote: us(unquote(r.quote)),
  })),
});

out("team/profiles.json", {
  note,
  records: read("Team_Profile_Examples_12").records.map((r) => ({
    name: r.name,
    role: us(r.role),
    bio: us(r.bio),
  })),
});

out("technology/ecosystem.json", {
  note: "Imported from DECHY_Content_Data_Pack_v2. Tools and platforms DECHY works with; no entry is a formal partnership.",
  records: read("Technology_Ecosystem_52").records.map((r) => ({
    category: r.category,
    name: r.technology_name,
    usage: us(r.usage_area ?? ""),
  })),
});

out("glossary/terms.json", {
  note: "Imported from DECHY_Content_Data_Pack_v2. Shown on the Resources page.",
  records: read("Glossary_30").records.map((r) => ({ term: r.term, definition: us(r.definition) })),
});

const ref = read("Partner_Certification_Reference");
out("partners/programs.json", {
  note: "Reference only, never published as a claim: no program is confirmed for DECHY and no certification holder has been supplied. Technologies, integrations, partner programs, and certifications are kept apart.",
  programs: ref.programs.map((p) => ({ ...p, program: us(p.program ?? "") })),
  certificationPathways: ref.certification_pathways,
});
