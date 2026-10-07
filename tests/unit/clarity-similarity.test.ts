import { describe, expect, it } from "vitest";
import {
  MAX_AVERAGE_WORDS,
  diagramIssues,
  glossaryIssues,
  readabilityIssues,
} from "@/lib/content/clarity";
import { buildRegistry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import {
  SERVICE_SIMILARITY,
  WORK_SIMILARITY,
  jaccard,
  sequenceSimilarity,
  similarityIssues,
} from "@/lib/content/similarity";

const registry = buildRegistry();
const clone = <T>(v: T): T => structuredClone(v);
const service = (path: string) => registry.pageByPath.get(path)!;

describe("similarity primitives", () => {
  it("scores identical sequences as 1 and disjoint ones as 0", () => {
    expect(sequenceSimilarity(["a", "b", "c"], ["a", "b", "c"])).toBe(1);
    expect(sequenceSimilarity(["a", "b"], ["x", "y"])).toBe(0);
  });

  it("scores a single substitution as a partial match", () => {
    const s = sequenceSimilarity(["a", "b", "c", "d"], ["a", "b", "c", "x"]);
    expect(s).toBeGreaterThan(0.5);
    expect(s).toBeLessThan(1);
  });

  it("measures set overlap", () => {
    expect(jaccard(new Set(["a", "b"]), new Set(["a", "b"]))).toBe(1);
    expect(jaccard(new Set(["a"]), new Set(["b"]))).toBe(0);
  });
});

describe("similarity control on the shipped pages", () => {
  const services = registry.pages.filter((p) => p.kind === "service");
  const areas = registry.pages.filter((p) => p.kind === "work-area");

  it("finds no cloned service pages", () => {
    expect(services.length).toBe(15);
    expect(similarityIssues(services, registry.facts, SERVICE_SIMILARITY)).toEqual([]);
  });

  it("finds no cloned Work Area pages", () => {
    expect(areas.length).toBe(25);
    expect(similarityIssues(areas, registry.facts, WORK_SIMILARITY)).toEqual([]);
  });

  it("flags a service page copied under another path", () => {
    const a = service("/ai/");
    const b = clone(a);
    b.path = "/ai-copy/";
    const issues = similarityIssues([a, b], registry.facts, SERVICE_SIMILARITY);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.map((i) => i.message).join(" ")).toMatch(/alike|overlaps|identical|shares/);
  });

  it("flags two service pages that reuse the same diagram and takeaway", () => {
    const a = service("/ai/");
    const b = clone(service("/cloud/"));
    const heroA = a.sections.find((s) => s.type === "hero");
    const heroB = b.sections.find((s) => s.type === "hero");
    if (heroA?.type !== "hero" || heroB?.type !== "hero") throw new Error("hero expected");
    heroB.spec = clone(heroA.spec);
    heroB.takeaway = heroA.takeaway;
    const issues = similarityIssues([a, b], registry.facts, SERVICE_SIMILARITY);
    expect(issues.map((i) => i.message)).toContain("uses an identical diagram");
    expect(issues.map((i) => i.message)).toContain("identical diagram takeaway");
  });
});

describe("clarity standard on the shipped pages", () => {
  const guided = registry.pages.filter((p) =>
    [
      "service",
      "hub",
      "company",
      "work-hub",
      "work-area",
      "technology",
      "solution",
      "industry",
      "location",
    ].includes(p.kind),
  );

  it("covers every commercial page with a comprehension record and a next step", () => {
    expect(guided.length).toBe(121);
    for (const p of guided) {
      expect(p.comprehension, p.path).toBeDefined();
      expect(
        p.sections.some((s) => s.type === "cta"),
        p.path,
      ).toBe(true);
    }
  });

  it("explains jargon where it is first used, on every page", () => {
    for (const p of registry.pages.filter((x) => x.kind !== "legal"))
      expect(glossaryIssues(p, registry.facts), p.path).toEqual([]);
  });

  it("keeps sentences short and the average readable, on every page", () => {
    for (const p of registry.pages.filter((x) => x.kind !== "legal")) {
      const { errors, average } = readabilityIssues(p, registry.facts);
      expect(errors, p.path).toEqual([]);
      expect(average, p.path).toBeLessThanOrEqual(MAX_AVERAGE_WORDS);
    }
  });

  it("gives every diagram a purpose, a takeaway, and an explanatory caption", () => {
    for (const p of registry.pages) expect(diagramIssues(p), p.path).toEqual([]);
  });

  it("rejects unexplained jargon", () => {
    const page = clone(service("/ai/")) as Page;
    const hero = page.sections.find((s) => s.type === "hero");
    if (hero?.type !== "hero") throw new Error("hero expected");
    hero.lead = "We build an API for your CRM, then connect it to the ERP.";
    page.comprehension = undefined;
    const issues = glossaryIssues(page, registry.facts);
    expect(issues.join(" ")).toMatch(/API|CRM|ERP/);
  });

  it("rejects a sentence that is far too long", () => {
    const page = clone(service("/ai/")) as Page;
    const hero = page.sections.find((s) => s.type === "hero");
    if (hero?.type !== "hero") throw new Error("hero expected");
    hero.lead = Array.from({ length: 60 }, () => "word").join(" ") + ".";
    expect(readabilityIssues(page, registry.facts).errors.length).toBeGreaterThan(0);
  });
});

describe("scope control", () => {
  it("builds no pages outside the approved families", () => {
    const allowed = [
      /^\/$/,
      /^\/(contact|privacy|cookies|terms|accessibility|services|solutions|technologies|industries|locations|resources|work|company)\/$/,
      /^\/company\/(how-we-work|who-we-work-with)\/$/,
      /^\/work\/areas\/[a-z0-9-]+\/$/,
      /^\/(software-development|ai|automation|api-integration|data-analytics|cloud|cybersecurity|web-development|mobile-app-development|ecommerce|ui-ux|branding|seo-aeo-geo|digital-marketing|consulting)\/$/,
      // Phase 3: one page per approved technology, under its canonical service
      /^\/(software-development|ai|automation|api-integration|data-analytics|cloud|web-development|mobile-app-development|ecommerce)\/[a-z0-9-]+\/$/,
      // Phase 4: Solution pages, the first industry pages, and the first-wave country pages
      /^\/(solutions|industries|locations)\/[a-z0-9-]+\/$/,
    ];
    for (const p of registry.pages)
      expect(
        allowed.some((r) => r.test(p.path)),
        p.path,
      ).toBe(true);
  });

  it("does not create article, resource, problem, or city pages", () => {
    const forbidden = /^\/(resources|insights|articles|countries|problems|cities)\/./;
    for (const p of registry.pages) expect(forbidden.test(p.path), p.path).toBe(false);
    expect(registry.pages.some((p) => p.kind === "article")).toBe(false);
  });

  it("builds only the approved Solution pages, and none for deferred or represented concepts", () => {
    const solutions = registry.pages.filter((p) => p.kind === "solution").map((p) => p.entityId);
    expect(solutions.sort()).toEqual(
      [
        "sol.ai-customer-support",
        "sol.business-dashboards",
        "sol.business-process-automation",
        "sol.cloud-migration",
        "sol.crm-integration",
        "sol.legacy-system-modernization",
      ].sort(),
    );
  });

  it("builds country pages only for the first wave, and never claims a physical presence", () => {
    const countries = registry.pages.filter((p) => p.kind === "location").map((p) => p.entityId);
    expect(countries.sort()).toEqual(
      [
        "loc.australia",
        "loc.canada",
        "loc.ireland",
        "loc.united-kingdom",
        "loc.united-states",
      ].sort(),
    );
  });

  it("states no client, metric, award, or office on a Work Area page", () => {
    const risky =
      /\b(clients? such as|case study|award|certified|\d+%|offices? in|headquarter|testimonial)\b/i;
    for (const p of registry.pages.filter((x) => x.kind === "work-area")) {
      const text = JSON.stringify(p.sections);
      expect(risky.test(text), p.path).toBe(false);
      const illustrative = p.sections.filter(
        (s) => s.type === "callout" && s.variant === "illustrative",
      );
      expect(illustrative.length, p.path).toBeGreaterThan(0);
    }
  });
});
