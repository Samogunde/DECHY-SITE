import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";
import { parsePrice, parseWeeks, type EstimatorData } from "../estimate";
import { allPricing } from "./samples";

const Pair = z.tuple([z.number(), z.number()]);
const Choice = z.object({
  key: z.string(),
  label: z.string(),
  factor: z.number(),
  weeks: z.number().optional(),
  hint: z.string().optional(),
});
const File = z.object({
  services: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      hint: z.string(),
      pricing: z.array(z.string()).min(1),
      platforms: z.boolean().optional(),
      features: z.array(z.object({ id: z.string(), label: z.string(), cost: Pair, weeks: Pair })),
    }),
  ),
  sizes: z.array(z.object({ key: z.string(), label: z.string(), hint: z.string(), share: Pair })),
  platforms: z.array(Choice),
  webCompanion: z.object({ label: z.string(), cost: Pair, weeks: Pair }),
  designs: z.array(Choice),
  integration: z.object({ cost: Pair, weeks: Pair }),
  timelines: z.array(Choice),
  excludes: z.array(z.string()).min(1),
});

/**
 * The estimator's data: the choices in data/pricing/estimator.yaml with base tiers read from the
 * approved service ranges, so the tool and the cost guides always agree.
 */
export function estimatorData(serviceNames: Record<string, string>): EstimatorData {
  const raw = File.parse(
    YAML.parse(
      fs.readFileSync(
        path.join(/*turbopackIgnore: true*/ process.cwd(), "data/pricing/estimator.yaml"),
        "utf8",
      ),
    ),
  );
  const pricing = new Map(allPricing());
  return {
    ...raw,
    services: raw.services.map((s) => ({
      key: s.key,
      label: s.label,
      hint: s.hint,
      interest: serviceNames[s.pricing[0]!] ?? s.label,
      platforms: Boolean(s.platforms),
      features: s.features,
      tiers: s.pricing.flatMap((slug) =>
        (pricing.get(slug)?.plans ?? [])
          // Monthly retainers are not projects, so they are not estimated here.
          .filter((p) => !/month/.test(p.range))
          .map((p) => ({
            name: p.name,
            summary: p.summary,
            ...parsePrice(p.range),
            weeks: parseWeeks(p.timeline),
          })),
      ),
    })),
  };
}

/** Which estimator service a service page's slug opens on. */
export const ESTIMATOR_FOR_SERVICE: Record<string, string> = {
  "software-development": "software",
  "web-development": "web",
  "mobile-app-development": "mobile",
  ecommerce: "ecommerce",
  ai: "ai",
  automation: "ai",
  "api-integration": "integration",
};
