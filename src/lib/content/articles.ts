import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";
import { Page } from "./schema";

/**
 * Blog articles (the 53 launch articles, docs/planning/06-article-plan-53.md) are written as
 * markdown in content/articles/*.md and become ordinary page records here, so every validator rule
 * (titles, claims, plain language, links, readability) applies to them exactly as to other pages.
 *
 * Front matter carries the page metadata. The body uses:
 *   - paragraphs separated by a blank line;
 *   - "## Heading" to start a section;
 *   - "- item" lines for a list, shown as a "Key points" panel beside that section;
 *   - "## Common questions" followed by "### Question" and its answer, for the FAQ.
 */
const Front = z.object({
  number: z.number().int().min(1).max(53),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(["guides", "comparisons", "definitions", "articles"]),
  category: z.enum(["guide", "comparison", "decision", "explainer", "industry"]),
  service: z.string(),
  title: z.string(),
  description: z.string(),
  h1: z.string(),
  summary: z.string(),
  intent: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cta: z.string().optional(),
});

const CATEGORY_LABEL: Record<string, string> = {
  guide: "Guide",
  comparison: "Comparison",
  decision: "Decision guide",
  explainer: "Explainer",
  industry: "Industry note",
};

function parse(file: string, raw: string): Page {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const front = Front.parse(YAML.parse(m[1] ?? ""));
  const body = (m[2] ?? "").replace(/\r\n/g, "\n");

  type Sec = { heading: string; paragraphs: string[]; items: string[] };
  const sections: Sec[] = [];
  const faq: { q: string; a: string }[] = [];
  let inFaq = false;
  let current: Sec | undefined;
  for (const chunk of body
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean)) {
    if (chunk.startsWith("## ")) {
      const heading = chunk.slice(3).trim();
      inFaq = /^common questions$/i.test(heading);
      current = inFaq ? undefined : { heading, paragraphs: [], items: [] };
      if (current) sections.push(current);
      continue;
    }
    if (inFaq) {
      if (chunk.startsWith("### ")) {
        const [q, ...rest] = chunk.split("\n");
        faq.push({ q: (q ?? "").slice(4).trim(), a: rest.join(" ").trim() });
      } else if (faq.length) {
        const last = faq[faq.length - 1]!;
        last.a = `${last.a}${last.a ? "\n\n" : ""}${chunk}`;
      }
      continue;
    }
    if (!current) {
      current = { heading: front.h1, paragraphs: [], items: [] };
      sections.push(current);
    }
    if (chunk.split("\n").every((l) => l.startsWith("- "))) {
      current.items.push(...chunk.split("\n").map((l) => l.slice(2).trim()));
    } else {
      current.paragraphs.push(chunk.replace(/\n/g, " "));
    }
  }

  const blocks: unknown[] = sections.map((s, i) => ({
    type: "prose",
    id: `s${i + 1}`,
    tone: "paper",
    label: i === 0 ? CATEGORY_LABEL[front.category] : `Part ${i + 1}`,
    heading: s.heading,
    paragraphs: s.paragraphs.length ? s.paragraphs : [s.items.join(". ")],
    ...(s.items.length && s.paragraphs.length
      ? { aside: { title: "Key points", items: s.items } }
      : {}),
  }));
  if (faq.length >= 2)
    blocks.push({
      type: "faq",
      id: "questions",
      tone: "ink",
      label: "Common questions",
      heading: "Questions people ask",
      items: faq,
    });
  blocks.push({
    type: "cta",
    id: "next-step",
    heading: front.cta ?? "Talk it through with us.",
    body: "Tell us what you are weighing up. We will give you a straight answer and, if it helps, a sensible first step.",
    primary: { label: "Talk to DECHY", href: "/contact/" },
    secondary: { label: "See how we help", href: `/${front.service}/` },
  });

  return Page.parse({
    id: `page.article-${front.slug}`,
    kind: "article",
    locale: "en",
    path: `/resources/${front.type}/${front.slug}/`,
    title: front.title,
    description: front.description,
    breadcrumbLabel: front.h1,
    h1: front.h1,
    lead: front.summary,
    intent: { primary: front.intent, secondary: [] },
    indexing: "index",
    claims: [],
    datePublished: front.date,
    dateModified: front.date,
    parent: "/resources/",
    schemaTypes: faq.length >= 2 ? ["WebPage", "Article", "FAQPage"] : ["WebPage", "Article"],
    article: {
      category: front.category,
      summary: front.summary,
      service: front.service,
      number: front.number,
    },
    sections: blocks,
  });
}

/** Every article page, read from content/articles. */
export function loadArticles(root: string): Page[] {
  const dir = path.join(/*turbopackIgnore: true*/ root, "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parse(f, fs.readFileSync(path.join(/*turbopackIgnore: true*/ dir, f), "utf8")));
}

/** Rough reading time in minutes for an article page. */
export function readingMinutes(page: Page): number {
  const text = JSON.stringify(page.sections);
  return Math.max(3, Math.round(text.split(/\s+/).length / 230));
}
