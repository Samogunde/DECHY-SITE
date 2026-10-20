import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Block } from "./schema";

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
      items: s.cases.map(({ photo: _photo, ...c }) => ({ ...c, href: undefined })),
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
export function sampleWork(): Block[] {
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
