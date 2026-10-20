import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { buildRegistry } from "@/lib/content/load";

const file = path.join(process.cwd(), "data/articles/briefs.yaml");
const { briefs } = parse(fs.readFileSync(file, "utf8")) as {
  briefs: { number: number; canonicalHome: string; status: string; batch: number }[];
};

describe("the 53 launch article briefs", () => {
  it("are kept as data, all 53, numbered 1 to 53", () => {
    expect(briefs.map((b) => b.number)).toEqual(Array.from({ length: 53 }, (_, i) => i + 1));
  });

  it("are published only as articles that match a planned brief (owner, 20 October 2026)", () => {
    const registry = buildRegistry();
    const numbers = new Set(briefs.map((b) => b.number));
    for (const p of registry.pages.filter((x) => x.kind === "article")) {
      expect(p.path).toMatch(
        /^\/resources\/(guides|comparisons|definitions|articles)\/[a-z0-9-]+\/$/,
      );
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
