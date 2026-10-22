/**
 * The cost estimator's arithmetic, shared by the page (server) and the tool (browser). Base
 * ranges are the approved service ranges (data/pricing/services.yaml); the choices in
 * data/pricing/estimator.yaml add to them or scale them. Pure functions, no I/O.
 */

export type Range = [number, number];
export type Tier = {
  name: string;
  summary: string;
  price: Range;
  /** The top of the range is open ("$100,000+"). */
  open: boolean;
  weeks: Range;
};
export type Feature = { id: string; label: string; cost: Range; weeks: Range };
export type EstimatorService = {
  key: string;
  label: string;
  hint: string;
  /** The contact form's service name for leads from this estimate. */
  interest: string;
  tiers: Tier[];
  features: Feature[];
  platforms: boolean;
};
export type Choice = { key: string; label: string; factor: number; weeks?: number; hint?: string };
export type EstimatorData = {
  services: EstimatorService[];
  sizes: { key: string; label: string; hint: string; share: Range }[];
  platforms: Choice[];
  webCompanion: { label: string; cost: Range; weeks: Range };
  designs: Choice[];
  integration: { cost: Range; weeks: Range };
  timelines: Choice[];
  excludes: string[];
};

/** "$15,000 to $30,000" -> [15000, 30000]; "$100,000+" -> [100000, 100000] and open. */
export function parsePrice(text: string): { price: Range; open: boolean } {
  const nums = [...text.matchAll(/\$([\d,]+)/g)].map((m) => Number(m[1]!.replace(/,/g, "")));
  const low = nums[0] ?? 0;
  const high = nums[1] ?? low;
  return { price: [low, high], open: /\+/.test(text) };
}

/** "4 to 6 weeks" -> [4, 6]; "2 to 3 months" -> [8.7, 13]; "1 week" -> [1, 1]. */
export function parseWeeks(text: string): Range {
  const nums = [...text.matchAll(/(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
  const factor = /month/.test(text) ? 4.33 : 1;
  const low = (nums[0] ?? 1) * factor;
  return [low, (nums[1] ?? nums[0] ?? 1) * factor];
}

export type Selection = {
  service: string;
  tier: number;
  size: string;
  features: string[];
  platform: string;
  web: boolean;
  design: string;
  integrations: number;
  timeline: string;
};

export type Estimate = {
  price: Range;
  open: boolean;
  weeks: Range;
  lines: { label: string; detail: string }[];
};

const roundPrice = (n: number) =>
  n < 20000 ? Math.round(n / 500) * 500 : Math.round(n / 1000) * 1000;
export const money = (n: number) => `$${roundPrice(n).toLocaleString("en-US")}`;
export function weeksText([a, b]: Range): string {
  const lo = Math.max(1, Math.round(a));
  const hi = Math.max(lo, Math.round(b));
  if (hi > 12) return `${Math.max(1, Math.round(lo / 4.33))} to ${Math.round(hi / 4.33)} months`;
  return lo === hi ? `${lo} week${lo === 1 ? "" : "s"}` : `${lo} to ${hi} weeks`;
}
const span = ([a, b]: Range) => (a === b ? money(a) : `${money(a)} to ${money(b)}`);

/** The estimate for a selection: a price range, a timeline range, and what drives them. */
export function estimate(data: EstimatorData, s: Selection): Estimate | null {
  const svc = data.services.find((x) => x.key === s.service);
  const tier = svc?.tiers[s.tier];
  const size = data.sizes.find((x) => x.key === s.size);
  if (!svc || !tier || !size) return null;
  const lines: Estimate["lines"] = [];
  const [L, H] = tier.price;
  const [wL, wH] = tier.weeks;
  let price: Range = [L + size.share[0] * (H - L), L + size.share[1] * (H - L)];
  let weeks: Range = [wL + size.share[0] * (wH - wL), wL + size.share[1] * (wH - wL)];
  lines.push({ label: `${tier.name}, ${size.label.toLowerCase()}`, detail: span(price) });

  if (svc.platforms) {
    const p = data.platforms.find((x) => x.key === s.platform) ?? data.platforms[0]!;
    if (p.factor !== 1) {
      price = [price[0] * p.factor, price[1] * p.factor];
      weeks = [weeks[0] * (p.weeks ?? 1), weeks[1] * (p.weeks ?? 1)];
      lines.push({
        label: p.label,
        detail:
          p.factor > 1
            ? `+${Math.round((p.factor - 1) * 100)}%`
            : `${Math.round((p.factor - 1) * 100)}%`,
      });
    }
    if (s.web) {
      price = [price[0] + data.webCompanion.cost[0], price[1] + data.webCompanion.cost[1]];
      weeks = [
        weeks[0] + data.webCompanion.weeks[0] / 2,
        weeks[1] + data.webCompanion.weeks[1] / 2,
      ];
      lines.push({ label: data.webCompanion.label, detail: `+${span(data.webCompanion.cost)}` });
    }
  }

  const chosen = svc.features.filter((f) => s.features.includes(f.id));
  if (chosen.length) {
    const add: Range = [0, 0];
    for (const f of chosen) {
      add[0] += f.cost[0];
      add[1] += f.cost[1];
      // Features are built alongside each other, so they add about half their time.
      weeks = [weeks[0] + f.weeks[0] / 2, weeks[1] + f.weeks[1] / 2];
    }
    price = [price[0] + add[0], price[1] + add[1]];
    lines.push({
      label: `${chosen.length} feature${chosen.length === 1 ? "" : "s"}: ${chosen.map((f) => f.label.toLowerCase()).join(", ")}`,
      detail: `+${span(add)}`,
    });
  }

  if (s.integrations > 0) {
    const add: Range = [
      data.integration.cost[0] * s.integrations,
      data.integration.cost[1] * s.integrations,
    ];
    price = [price[0] + add[0], price[1] + add[1]];
    weeks = [
      weeks[0] + (data.integration.weeks[0] * s.integrations) / 2,
      weeks[1] + (data.integration.weeks[1] * s.integrations) / 2,
    ];
    lines.push({
      label: `${s.integrations === 3 ? "3 or more" : s.integrations} system${s.integrations === 1 ? "" : "s"} to connect`,
      detail: `+${span(add)}`,
    });
  }

  const design = data.designs.find((x) => x.key === s.design);
  if (design && design.factor !== 1) {
    price = [price[0] * design.factor, price[1] * design.factor];
    lines.push({
      label: design.label,
      detail: `${design.factor > 1 ? "+" : ""}${Math.round((design.factor - 1) * 100)}%`,
    });
  }

  const time = data.timelines.find((x) => x.key === s.timeline);
  if (time && time.factor !== 1) {
    price = [price[0] * time.factor, price[1] * time.factor];
    weeks = [weeks[0] * (time.weeks ?? 1), weeks[1] * (time.weeks ?? 1)];
    lines.push({
      label: `${time.label} timeline`,
      detail: `${time.factor > 1 ? "+" : ""}${Math.round((time.factor - 1) * 100)}%`,
    });
  }

  return {
    price: [roundPrice(price[0]), roundPrice(price[1])],
    open: tier.open && size.share[1] === 1,
    weeks,
    lines,
  };
}
