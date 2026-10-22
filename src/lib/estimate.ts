/**
 * The cost estimator's arithmetic, shared by the page (server) and the tool (browser). Base
 * ranges are the approved service tiers and the add-ons are the estimator section, both in
 * data/pricing/prices.yaml. Pure functions, no I/O.
 *
 * How a total is worked out (owner's pricing review, 22 October 2026):
 *   low  = base low + the lows of every add-on; a proven template takes 10 percent off
 *   high = low + 0.6 x (the sum of every high minus that low), because add-ons are built
 *          alongside each other and a project rarely reaches the top of every item at once
 *   rounded to $500 under $20,000 and to $1,000 above; under $25,000 the high is at most twice
 *   the low; no tier shows a total above the top of the next tier's base range.
 * When the visitor wants to start never changes the price.
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
export type Feature = {
  id: string;
  label: string;
  cost: Range;
  weeks: Range;
  /** The smallest tier this feature belongs to; on a smaller tier the visitor may switch. */
  from?: string;
};
export type TierRule = { onlyFeatures?: string[]; maxFeatures?: number };
export type EstimatorService = {
  key: string;
  label: string;
  hint: string;
  /** The contact form's service name for leads from this estimate. */
  interest: string;
  tiers: Tier[];
  features: Feature[];
  platforms: boolean;
  /** Per tier name: the add-ons it allows and how many at once. */
  tierRules: Record<string, TierRule>;
  /** Dollars custom and premium design add over the template. */
  designAdd: { custom: Range; premium: Range };
  /** Shown when a chosen feature belongs to a bigger tier; {from} is that tier's starting price. */
  switchNote?: string;
};
export type Choice = { key: string; label: string; factor: number; weeks?: number; hint?: string };
export type EstimatorData = {
  services: EstimatorService[];
  sizes: { key: string; label: string; hint: string; share: Range }[];
  platforms: Choice[];
  webCompanion: { label: string; cost: Range; weeks: Range };
  designs: Choice[];
  integration: { cost: Range; weeks: Range };
  starts: { key: string; label: string }[];
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
  /** When the visitor wants to start. Sent with the lead; never changes the price. */
  start: string;
};

export type Estimate = {
  price: Range;
  open: boolean;
  /**
   * The choices went past the top of the next tier's base range, so the price stops there and
   * the visitor is offered that tier: the index of the tier to offer, or -1.
   */
  outgrown: number;
  weeks: Range;
  lines: { label: string; detail: string }[];
};

export const roundPrice = (n: number) =>
  n < 20000 ? Math.round(n / 500) * 500 : Math.round(n / 1000) * 1000;
export const money = (n: number) => `$${roundPrice(n).toLocaleString("en-US")}`;
export function weeksText([a, b]: Range): string {
  const lo = Math.max(1, Math.round(a));
  const hi = Math.max(lo, Math.round(b));
  if (hi > 12) return `${Math.max(1, Math.round(lo / 4.33))} to ${Math.round(hi / 4.33)} months`;
  return lo === hi ? `${lo} week${lo === 1 ? "" : "s"}` : `${lo} to ${hi} weeks`;
}
const span = ([a, b]: Range) => (a === b ? money(a) : `${money(a)} to ${money(b)}`);

/** The index of the tier a feature belongs to, or -1 when it fits every tier. */
export function featureTier(svc: EstimatorService, f: Feature): number {
  return f.from ? svc.tiers.findIndex((t) => t.name === f.from) : -1;
}

/**
 * How a feature stands on a tier: "ok" to choose; "bigger" when it belongs to a bigger tier (the
 * visitor may choose it and is offered the switch); "blocked" when this tier does not allow it.
 */
export function featureState(
  svc: EstimatorService,
  tier: number,
  f: Feature,
): "ok" | "bigger" | "blocked" {
  const rule = svc.tierRules[svc.tiers[tier]?.name ?? ""];
  if (rule?.onlyFeatures && !rule.onlyFeatures.includes(f.id)) return "blocked";
  const home = featureTier(svc, f);
  return home > tier ? "bigger" : "ok";
}

/** The most add-ons the tier takes at once, or Infinity. */
export function featureLimit(svc: EstimatorService, tier: number): number {
  return svc.tierRules[svc.tiers[tier]?.name ?? ""]?.maxFeatures ?? Infinity;
}

/**
 * The tier to offer when the chosen (or blocked and wanted) features belong to a bigger one:
 * the biggest "from" tier among them, or -1.
 */
export function switchTarget(svc: EstimatorService, tier: number, ids: string[]): number {
  let target = -1;
  for (const f of svc.features)
    if (ids.includes(f.id)) {
      const home = featureTier(svc, f);
      if (home > tier && home > target) target = home;
    }
  return target;
}

/** The note offering the switch, with the bigger tier's starting price filled in. */
export function switchText(svc: EstimatorService, target: number): string {
  const t = svc.tiers[target];
  if (!t) return "";
  const note =
    svc.switchNote ??
    `These features belong to ${t.name.toLowerCase()}. See that estimate, from {from}.`;
  return note.replace("{from}", money(t.price[0]));
}

/** The next tier up: the first later tier whose base range reaches higher, or undefined. */
function nextTier(svc: EstimatorService, i: number): Tier | undefined {
  const here = svc.tiers[i];
  if (!here) return undefined;
  return svc.tiers.slice(i + 1).find((t) => t.price[1] > here.price[1]);
}

/** The estimate for a selection: a price range, a timeline range, and what drives them. */
export function estimate(data: EstimatorData, s: Selection): Estimate | null {
  const svc = data.services.find((x) => x.key === s.service);
  const tier = svc?.tiers[s.tier];
  const size = data.sizes.find((x) => x.key === s.size);
  if (!svc || !tier || !size) return null;
  const lines: Estimate["lines"] = [];
  const [L, H] = tier.price;
  const [wL, wH] = tier.weeks;
  let base: Range = [L + size.share[0] * (H - L), L + size.share[1] * (H - L)];
  let weeks: Range = [wL + size.share[0] * (wH - wL), wL + size.share[1] * (wH - wL)];
  lines.push({ label: `${tier.name}, ${size.label.toLowerCase()}`, detail: span(base) });

  const add: Range = [0, 0];
  const plus = (r: Range, n = 1) => {
    add[0] += r[0] * n;
    add[1] += r[1] * n;
  };

  if (svc.platforms) {
    const p = data.platforms.find((x) => x.key === s.platform) ?? data.platforms[0]!;
    if (p.factor !== 1) {
      base = [base[0] * p.factor, base[1] * p.factor];
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
      plus(data.webCompanion.cost);
      weeks = [
        weeks[0] + data.webCompanion.weeks[0] / 2,
        weeks[1] + data.webCompanion.weeks[1] / 2,
      ];
      lines.push({ label: data.webCompanion.label, detail: `+${span(data.webCompanion.cost)}` });
    }
  }

  const chosen = svc.features.filter(
    (f) => s.features.includes(f.id) && featureState(svc, s.tier, f) !== "blocked",
  );
  if (chosen.length) {
    const sum: Range = [0, 0];
    for (const f of chosen) {
      sum[0] += f.cost[0];
      sum[1] += f.cost[1];
      // Features are built alongside each other, so they add about half their time.
      weeks = [weeks[0] + f.weeks[0] / 2, weeks[1] + f.weeks[1] / 2];
    }
    plus(sum);
    lines.push({
      label: `${chosen.length} feature${chosen.length === 1 ? "" : "s"}: ${chosen.map((f) => f.label.toLowerCase()).join(", ")}`,
      detail: `+${span(sum)}`,
    });
  }

  if (s.integrations > 0) {
    plus(data.integration.cost, s.integrations);
    weeks = [
      weeks[0] + (data.integration.weeks[0] * s.integrations) / 2,
      weeks[1] + (data.integration.weeks[1] * s.integrations) / 2,
    ];
    lines.push({
      label: `${s.integrations === 3 ? "3 or more" : s.integrations} system${s.integrations === 1 ? "" : "s"} to connect`,
      detail: `+${span([data.integration.cost[0] * s.integrations, data.integration.cost[1] * s.integrations])}`,
    });
  }

  const design = data.designs.find((x) => x.key === s.design);
  const designAdd =
    s.design === "premium"
      ? svc.designAdd.premium
      : s.design === "custom"
        ? svc.designAdd.custom
        : undefined;
  if (design && designAdd && designAdd[1] > 0) {
    plus(designAdd);
    lines.push({ label: design.label, detail: `+${span(designAdd)}` });
  }

  // A proven template takes 10 percent off the whole build.
  const t = design?.factor ?? 1;
  if (t !== 1)
    lines.push({
      label: design!.label,
      detail: `${Math.round((t - 1) * 100)}%`,
    });

  let low = (base[0] + add[0]) * t;
  const sumHigh = (base[1] + add[1]) * t;
  let high = low + 0.6 * Math.max(0, sumHigh - low);
  low = roundPrice(low);
  high = roundPrice(high);
  // Under $25,000 the top is never more than twice the bottom.
  if (low < 25000) high = Math.min(high, 2 * low);
  // No tier shows more than the top of the next tier's base range. When the choices go past
  // it, the range ends there and the bigger tier is offered instead.
  const next = nextTier(svc, s.tier);
  let outgrown = -1;
  if (next && high > next.price[1]) {
    high = next.price[1];
    if (low >= high * 0.8) {
      low = roundPrice(high * 0.8);
      outgrown = svc.tiers.indexOf(next);
    }
  }

  return {
    price: [low, high],
    open: tier.open && size.share[1] === 1,
    outgrown,
    weeks,
    lines,
  };
}
