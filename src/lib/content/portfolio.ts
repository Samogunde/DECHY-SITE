import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Block, Page, PhotoRef } from "./schema";

/**
 * The DECHY portfolio: real client projects supplied by the owner (data/portfolio/projects.yaml).
 * Each project is a case study page; its cards appear on the Work page, its service pages, its
 * industry page, and the home page. Results show on the live site only once the owner confirms them.
 */
export type Project = {
  slug: string;
  title: string;
  headline: string;
  service: string;
  services: string[];
  industry: string;
  client: string;
  images: string[];
  duration: string;
  goal: string;
  problem: string;
  solution: string;
  delivered: string[];
  stack: string[];
  results: { value: string; label: string }[];
  resultsConfirmed?: boolean;
  /**
   * The client's own words about the project, exactly as supplied (owner). Shown between the
   * results and the related projects; absent until the owner supplies it.
   */
  quote?: { text: string; name: string; role: string };
};

let cache: Project[] | undefined;
export function projects(): Project[] {
  cache ??= (
    YAML.parse(
      fs.readFileSync(
        path.join(/*turbopackIgnore: true*/ process.cwd(), "data/portfolio/projects.yaml"),
        "utf8",
      ),
    ) as { projects: Project[] }
  ).projects;
  return cache;
}

export const projectPath = (p: Project) => `/work/case-studies/${p.slug}/`;
export const projectPhoto = (image: string, position = "50% 50%"): PhotoRef => ({
  asset: `asset.photo-portfolio-${image}`,
  layout: "aside",
  position,
});

/** Results are public once confirmed; review builds always show them. */
export const showResults = (p: Project, drafts: boolean) => drafts || p.resultsConfirmed === true;

export type Labels = { services: Record<string, string>; industries: Record<string, string> };

/** A portfolio card for the case-grid block. */
export function projectCard(p: Project, labels: Labels, drafts: boolean) {
  const r = showResults(p, drafts) ? p.results[0] : undefined;
  return {
    title: p.headline,
    company: p.title,
    sector: labels.industries[p.industry] ?? "",
    service: p.service,
    serviceLabel: labels.services[p.service] ?? p.service,
    industry: p.industry,
    industryLabel: labels.industries[p.industry] ?? "",
    result: r ?? { value: p.duration, label: "From kickoff to launch" },
    href: projectPath(p),
    photo: projectPhoto(p.images[0]!),
  };
}

/** The portfolio grid for the Work page (every project, filterable by service and industry). */
export function portfolioGrid(labels: Labels, drafts: boolean): Block {
  return {
    type: "case-grid",
    id: "case-studies",
    tone: "ink",
    label: "Case studies",
    heading: "Real projects, real results",
    intro:
      "Custom software, websites, mobile apps, AI, automation, cloud, and security we have designed, built, and launched for clients. Filter by service or industry to find work like yours.",
    items: projects().map((p) => projectCard(p, labels, drafts)),
  } as Block;
}

/** Selected work for a service or industry page: the given projects, at most three. */
export function selectedWork(
  list: Project[],
  labels: Labels,
  drafts: boolean,
  heading: string,
): Block[] {
  if (list.length === 0) return [];
  return [
    {
      type: "case-grid",
      id: "selected-work",
      tone: "ink",
      label: "Selected work",
      heading,
      items: list.slice(0, 3).map((p) => projectCard(p, labels, drafts)),
    } as Block,
  ];
}

/** One case study page per project. The page view renders from the project itself. */
export function portfolioPages(labels: Labels): Page[] {
  return projects().map((p) => {
    const industry = labels.industries[p.industry] ?? "";
    const description = `${p.headline}. A ${industry.toLowerCase()} case study by DECHY: the problem, what we built, and the results.`;
    return {
      id: `page.case-${p.slug}`,
      kind: "case-study",
      locale: "en",
      path: projectPath(p),
      title: `${p.title} Case Study | DECHY Tech`,
      description: description.length > 160 ? `${p.headline}. A DECHY case study.` : description,
      breadcrumbLabel: p.title,
      intent: { primary: `${p.title.toLowerCase()} case study`, secondary: [] },
      indexing: "index",
      claims: ["company.name"],
      datePublished: "2026-10-21",
      dateModified: "2026-10-21",
      parent: "/work/",
      schemaTypes: ["WebPage"],
      sections: [
        {
          type: "hero",
          id: "hero",
          variant: "service",
          eyebrow: `Case study: ${industry}`,
          headline: p.headline,
          lead: `${p.client}. ${p.goal}`,
          ctas: [{ label: "Start a similar project", href: "/contact/" }],
          photo: projectPhoto(p.images[0]!),
          stats: [],
          slides: [],
        },
        {
          type: "prose",
          id: "story",
          tone: "paper",
          label: "The project",
          heading: `How we built ${p.title}`,
          paragraphs: [p.problem, p.solution],
        },
        {
          type: "cta",
          id: "contact-cta",
          heading: "Have a project like this?",
          body: "Tell us what you need. We reply with a plan, a fixed quote, and a timeline.",
          primary: { label: "Start a similar project", href: "/contact/" },
        },
      ] as Block[],
    };
  });
}
