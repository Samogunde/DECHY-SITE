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

  it("are all still planned, with no article page published yet", () => {
    const registry = buildRegistry();
    for (const b of briefs) expect(b.status).toBe("planned");
    // The Resources hub exists; no article or resource page beneath it does.
    expect(registry.pages.some((p) => /^\/(articles|insights|resources)\/./.test(p.path))).toBe(
      false,
    );
    expect(registry.pages.some((p) => p.kind === "article")).toBe(false);
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
