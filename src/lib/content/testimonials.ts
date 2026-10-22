import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";

/**
 * Client testimonials supplied by the owner (data/testimonials/testimonials.yaml, 21 October 2026).
 * Each names the service it is about and the client's industry, so the same file fills the
 * Testimonials page, the home page, and every service and industry page.
 */
const Testimonial = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  service: z.string().min(1),
  industry: z.string().regex(/^ind\./),
  home: z.boolean().default(false),
  /** The client's own rating out of 5, shown only when the client gave one. */
  rating: z.number().min(1).max(5).optional(),
  quote: z.string().min(1),
});
export type Testimonial = z.infer<typeof Testimonial> & { id: string };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let cache: Testimonial[] | undefined;
export function testimonials(): Testimonial[] {
  cache ??= z
    .object({ testimonials: z.array(Testimonial).min(1) })
    .parse(
      YAML.parse(
        fs.readFileSync(
          path.join(/*turbopackIgnore: true*/ process.cwd(), "data/testimonials/testimonials.yaml"),
          "utf8",
        ),
      ),
    )
    .testimonials.map((t) => ({ ...t, id: slug(t.name) }));
  return cache;
}

/** The quotes about one service, in file order. */
export function forService(serviceSlug: string): Testimonial[] {
  return testimonials().filter((t) => t.service === serviceSlug);
}

/**
 * Quotes for an industry page: clients in that industry first, then clients of the services the
 * page relates to, so every industry page speaks with voices close to its readers. Three in a
 * row, or six when the industry has more than three of its own. `used` counts how often each
 * borrowed quote has been placed, so the least used go first and pages do not all repeat one.
 */
export function forIndustry(
  industryId: string,
  services: string[],
  used: Map<string, number> = new Map(),
): Testimonial[] {
  const all = testimonials();
  const own = all.filter((t) => t.industry === industryId);
  const n = own.length > 3 ? 6 : 3;
  const near = all
    .filter((t) => services.includes(t.service) && !own.includes(t))
    .map((t) => ({ t, rank: services.indexOf(t.service) }))
    .sort((a, b) => (used.get(a.t.id) ?? 0) - (used.get(b.t.id) ?? 0) || a.rank - b.rank)
    .map((x) => x.t);
  const picked = [...own.slice(0, n), ...near].slice(0, n);
  for (const t of picked) if (!own.includes(t)) used.set(t.id, (used.get(t.id) ?? 0) + 1);
  return picked;
}

/** The six quotes the home page shows. */
export function homeTestimonials(): Testimonial[] {
  return testimonials().filter((t) => t.home);
}
