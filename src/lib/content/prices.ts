import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Fact } from "./schema";

/**
 * Every price in data/pricing/prices.yaml as a fact, so copy anywhere on the site (pages, cost
 * guides, FAQ answers and their structured data, titles, and descriptions) can write
 * {{fact:price.<id>}} and always show the figure in that one file (owner, 22 October 2026).
 *
 *   price.<service>-<plan>   a service tier, e.g. price.web-development-landing-page
 *   price.care-<plan>        a care plan, e.g. price.care-essential
 *   price.mvp-<name>         an MVP, e.g. price.mvp-web-app-mvp
 *   price.rate-<role>        an hourly rate, e.g. price.rate-design-and-development
 *   price.team-<name>        a dedicated team, e.g. price.team-starter-squad
 *   price.summary-<kind>     what most projects of a kind cost, e.g. price.summary-mobile-app,
 *                            and price.summary-<kind>-start, where a first version starts
 *
 * Every price also has price.<id>-from (its starting figure) and price.<id>-to (its top), and a
 * care plan has price.care-<plan>-year (twelve months of it).
 */
type PriceFile = {
  services: Record<string, { plans: { name: string; range: string }[] }>;
  maintenance: { name: string; range: string }[];
  mvp: { name: string; range: string }[];
  rates: { role: string; range: string }[];
  teams: { name: string; range: string }[];
  summaries: { id: string; range: string; from: string }[];
};

export const priceSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let cache: Fact[] | undefined;
export function priceFacts(): Fact[] {
  if (cache) return cache;
  const file = YAML.parse(
    fs.readFileSync(
      path.join(/*turbopackIgnore: true*/ process.cwd(), "data/pricing/prices.yaml"),
      "utf8",
    ),
  ) as PriceFile;
  const fact = (id: string, label: string, value: string): Fact => ({
    id: `price.${id}`,
    label,
    value,
    status: "approved",
    source: "data/pricing/prices.yaml (owner's pricing review, 22 October 2026)",
  });
  const out: Fact[] = [];
  for (const [slug, svc] of Object.entries(file.services))
    for (const p of svc.plans)
      out.push(fact(`${slug}-${priceSlug(p.name)}`, `${p.name} (${slug})`, p.range));
  for (const p of file.maintenance)
    out.push(fact(`care-${priceSlug(p.name.replace(/ care$/i, ""))}`, p.name, p.range));
  for (const p of file.mvp) out.push(fact(`mvp-${priceSlug(p.name)}`, p.name, p.range));
  for (const p of file.rates) out.push(fact(`rate-${priceSlug(p.role)}`, p.role, p.range));
  for (const p of file.teams) out.push(fact(`team-${priceSlug(p.name)}`, p.name, p.range));
  for (const p of file.summaries) {
    out.push(fact(`summary-${p.id}`, `Most ${p.id} projects`, p.range));
    out.push(fact(`summary-${p.id}-start`, `First ${p.id} projects start`, p.from));
  }
  // Twelve months of each care plan, for yearly budgets.
  const dollars = (n: number) => `$${n.toLocaleString("en-US")}`;
  for (const p of file.maintenance) {
    const [lo = 0, hi = lo] = [...p.range.matchAll(/\$([\d,]+)/g)].map((m) =>
      Number(m[1]!.replace(/,/g, "")),
    );
    out.push(
      fact(
        `care-${priceSlug(p.name.replace(/ care$/i, ""))}-year`,
        `${p.name}, a year`,
        `${dollars(lo * 12)} to ${dollars(hi * 12)}`,
      ),
    );
  }
  // Every price also has its starting figure and its top, for copy such as "care plans from
  // $100 a month" or a range across two tiers: price.<id>-from and price.<id>-to.
  for (const f of [...out]) {
    if (f.id.startsWith("price.summary-")) continue;
    const nums = [...f.value.matchAll(/\$[\d,]+/g)].map((m) => m[0]);
    if (nums[0]) out.push({ ...f, id: `${f.id}-from`, label: `${f.label}, from`, value: nums[0] });
    if (nums[1])
      out.push({
        ...f,
        id: `${f.id}-to`,
        label: `${f.label}, to`,
        value: nums[1] + (/\+/.test(f.value) ? "+" : ""),
      });
  }
  cache = out;
  return out;
}
