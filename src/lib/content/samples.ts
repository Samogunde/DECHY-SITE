import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Block } from "./schema";

const readFile = (file: string) =>
  fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), file), "utf8");

type PriceFile = {
  services: Record<
    string,
    {
      heading: string;
      plans: { name: string; range: string; timeline: string; summary: string }[];
      factors: string[];
    }
  >;
};
let prices: PriceFile | undefined;

/** A service's price tiers and cost drivers (data/pricing/prices.yaml), for cost guides. */
export function pricingFor(serviceSlug: string): PriceFile["services"][string] | undefined {
  prices ??= YAML.parse(readFile("data/pricing/prices.yaml")) as PriceFile;
  return prices.services[serviceSlug];
}

/** Every service's price tiers, in file order (the "How we price" guide). */
export function allPricing(): [string, PriceFile["services"][string]][] {
  prices ??= YAML.parse(readFile("data/pricing/prices.yaml")) as PriceFile;
  return Object.entries(prices.services);
}

/** The pricing section for a service page (data/pricing/prices.yaml), or none. */
export function servicePricing(serviceSlug: string): Block[] {
  prices ??= YAML.parse(readFile("data/pricing/prices.yaml")) as PriceFile;
  const p = prices.services[serviceSlug];
  if (!p) return [];
  return [
    {
      type: "pricing",
      id: "pricing",
      tone: "ink",
      label: "Pricing and timelines",
      heading: p.heading,
      intro:
        "Every project is quoted in writing after a short call. These ranges show where most projects land, so you can plan before you talk to us.",
      plans: p.plans.map((x) => ({ ...x, includes: [] })),
      factors: { title: "What moves the price", items: p.factors },
      note: "Not sure which fits? Tell us what you need and we will send a fixed quote and timeline for your project.",
      cta: { label: "Get a quote", href: "/contact/" },
    },
  ] as Block[];
}

type ModelsFile = {
  rates: { role: string; range: string }[];
  teams: { name: string; range: string; who: string }[];
  maintenance: { name: string; range: string; for: string; includes: string }[];
  mvp: { name: string; range: string; timeline: string }[];
};
let models: ModelsFile | undefined;

/** Rates, dedicated teams, care plans, and MVP prices (data/pricing/prices.yaml) as tables. */
export function modelTable(key: keyof ModelsFile): {
  heading: string;
  columns: string[];
  rows: string[][];
  note?: string;
} {
  models ??= YAML.parse(readFile("data/pricing/prices.yaml")) as ModelsFile;
  const m = models;
  switch (key) {
    case "rates":
      return {
        heading: "Hourly rates by role",
        columns: ["Role", "Rate"],
        rows: m.rates.map((r) => [r.role, r.range]),
      };
    case "teams":
      return {
        heading: "Dedicated team pricing",
        columns: ["Team", "Who is on it", "Monthly cost"],
        rows: m.teams.map((t) => [t.name, t.who, t.range]),
      };
    case "maintenance":
      return {
        heading: "Care plans after launch",
        columns: ["Plan", "Best for", "What it covers", "Monthly cost"],
        rows: m.maintenance.map((p) => [p.name, p.for, p.includes, p.range]),
      };
    case "mvp":
      return {
        heading: "What an MVP costs",
        columns: ["Type of MVP", "Typical cost", "Typical timeline from approved scope"],
        rows: m.mvp.map((p) => [p.name, p.range, p.timeline]),
      };
  }
}
