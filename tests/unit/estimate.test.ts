import { describe, expect, it } from "vitest";
import { estimatorData } from "../../src/lib/content/estimator-data";
import {
  estimate,
  featureLimit,
  featureState,
  switchTarget,
  switchText,
  type Selection,
} from "../../src/lib/estimate";

// The owner's pricing review (22 October 2026): the estimator's test cases and rules.
const data = estimatorData({});
const web = data.services.find((s) => s.key === "web")!;
const base: Selection = {
  service: "web",
  tier: 0,
  size: "medium",
  features: [],
  platform: "both-cross",
  web: false,
  design: "template",
  integrations: 0,
  start: "asap",
};

describe("cost estimator", () => {
  it("prices a medium landing page on a template near $4,000 to $6,000", () => {
    const r = estimate(data, { ...base, features: ["cms", "booking", "seo"] })!;
    expect(r.price[0]).toBeGreaterThanOrEqual(3500);
    expect(r.price[1]).toBeLessThanOrEqual(6500);
    expect(r.price[0]).toBeLessThan(r.price[1]);
  });

  it("never changes the price for when the visitor wants to start", () => {
    const choices = { ...base, features: ["cms", "copy"], design: "custom" };
    const prices = data.starts.map((s) => estimate(data, { ...choices, start: s.key })!.price);
    for (const p of prices) expect(p).toEqual(prices[0]);
  });

  it("offers the web app estimate instead of accounts or payments on a landing page", () => {
    const accounts = web.features.find((f) => f.id === "accounts")!;
    expect(featureState(web, 0, accounts)).toBe("blocked");
    const target = switchTarget(web, 0, ["accounts"]);
    expect(web.tiers[target]?.name).toBe("Web app");
    expect(switchText(web, target)).toMatch(/make this a web app.*from \$5,000/);
    expect(featureLimit(web, 0)).toBe(4);
  });

  it("keeps the top under twice the bottom below $25,000, and under the next tier's top", () => {
    for (const s of data.services)
      s.tiers.forEach((t, tier) => {
        const r = estimate(data, {
          ...base,
          service: s.key,
          tier,
          size: "large",
          design: "premium",
          features: s.features.map((f) => f.id),
          integrations: 3,
          web: true,
        })!;
        if (r.price[0] < 25000) expect(r.price[1]).toBeLessThanOrEqual(2 * r.price[0]);
        const next = s.tiers.slice(tier + 1).find((n) => n.price[1] > t.price[1]);
        if (next) expect(r.price[1]).toBeLessThanOrEqual(next.price[1]);
      });
  });

  it("keeps every add-on outside the web flow within 1.6 times its bottom", () => {
    for (const s of data.services.filter((x) => x.key !== "web"))
      for (const f of s.features)
        expect(f.cost[1], `${s.key} ${f.id}`).toBeLessThanOrEqual(f.cost[0] * 1.6);
  });
});
