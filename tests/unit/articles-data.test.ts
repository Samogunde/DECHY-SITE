import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { buildRegistry } from "@/lib/content/load";

const file = path.join(process.cwd(), "data/articles/briefs.yaml");
const { briefs } = parse(fs.readFileSync(file, "utf8")) as {
  briefs: { number: number; canonicalHome: string; status: string; batch: number }[];
};

const OWNER_ADDED = new Set([
  "/resources/cost-guides/how-much-does-custom-software-cost/",
  "/resources/cost-guides/how-much-does-a-website-cost/",
  "/resources/cost-guides/how-much-does-a-mobile-app-cost/",
  "/resources/cost-guides/how-we-price/",
  "/resources/comparisons/custom-software-vs-off-the-shelf/",
  "/resources/comparisons/in-house-team-vs-agency/",
]);

describe("the 53 launch article briefs", () => {
  it("are kept as data, all 53, numbered 1 to 53", () => {
    expect(briefs.map((b) => b.number)).toEqual(Array.from({ length: 53 }, (_, i) => i + 1));
  });

  it("are published only as articles that match a planned brief (owner, 20 October 2026)", () => {
    const registry = buildRegistry();
    const numbers = new Set(briefs.map((b) => b.number));
    for (const p of registry.pages.filter((x) => x.kind === "article")) {
      expect(p.path).toMatch(
        /^\/resources\/(guides|comparisons|cost-guides|definitions|articles)\/[a-z0-9-]+\/$/,
      );
      // Cost guides and comparisons the owner asked for on 21 October 2026 may sit outside the
      // 53-article plan; a numbered article must match its brief.
      // Every cost guide was added at the owner's direction (21 October 2026), outside the plan.
      const ownerAdded = OWNER_ADDED.has(p.path) || p.path.startsWith("/resources/cost-guides/");
      if (p.article?.number !== undefined || !ownerAdded)
        expect(numbers.has(p.article?.number ?? 0), p.path).toBe(true);
    }
  });

  it("report to an existing service and fall in batches 1 to 6", () => {
    const slugs = new Set(buildRegistry().services.map((s) => s.slug));
    for (const b of briefs) {
      expect(slugs.has(b.canonicalHome), `#${b.number} ${b.canonicalHome}`).toBe(true);
      expect(b.batch).toBeGreaterThanOrEqual(1);
      expect(b.batch).toBeLessThanOrEqual(6);
    }
  });
});
