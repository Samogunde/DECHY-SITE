import { describe, expect, it } from "vitest";
import { buildRegistry } from "@/lib/content/load";
import { entityPath, publishedPath } from "@/lib/content/urls";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { outgoing } from "@/lib/content/graph";

const registry = buildRegistry();

describe("content loader", () => {
  it("loads the 15 approved service pillars in master order", () => {
    expect(registry.services).toHaveLength(15);
    expect(registry.services.map((s) => s.order)).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1),
    );
    expect(registry.services[0]?.name).toBe("Software Development");
    expect(registry.services[14]?.name).toBe("Consulting & Digital Transformation");
  });

  it("groups all 15 services into the five approved navigation families", () => {
    const counts = Object.fromEntries(
      registry.families.map((f) => [
        f.id,
        registry.services.filter((s) => s.family === f.id).length,
      ]),
    );
    expect(counts).toEqual({
      build: 4,
      "intelligence-automation": 4,
      "infrastructure-security": 2,
      "design-growth": 4,
      advisory: 1,
    });
  });

  it("keeps the full seeded capability architecture in the graph", () => {
    expect(registry.nodes.size).toBeGreaterThanOrEqual(700);
    for (const id of [
      "lang.python",
      "fw.nextjs",
      "tech.n8n",
      "plat.airtable",
      "int.stripe",
      "prov.anthropic-claude",
      "ind.healthcare",
      "bt.startups",
      "prob.too-many-spreadsheets",
      "sol.workflow-automation",
    ]) {
      expect(registry.nodes.has(id), id).toBe(true);
    }
  });

  it("models 15 countries, all with no physical presence, and no cities", () => {
    const countries = [...registry.nodes.values()].filter((n) => n.type === "country");
    expect(countries).toHaveLength(15);
    expect([...registry.nodes.values()].some((n) => (n.type as string) === "city")).toBe(false);
  });

  it("resolves canonical-home duplicates to the approved service", () => {
    const home = (id: string) => registry.nodes.get(id)?.primaryService;
    expect(home("cap.web-design")).toBe("svc.ui-ux");
    expect(home("cap.marketplace-development")).toBe("svc.software-development");
    expect(home("cap.marketing-automation")).toBe("svc.automation");
    expect(home("plat.firebase")).toBe("svc.cloud");
    expect(home("tech.kotlin")).toBe("svc.mobile-app-development");
    expect(home("tech.iam")).toBe("svc.cybersecurity");
    expect(home("cap.cybersecurity-consulting")).toBe("svc.cybersecurity");
    expect(home("cap.payment-integration")).toBe("svc.api-integration");
    expect(home("cap.solution-architecture")).toBe("svc.consulting");
  });
});

describe("URL architecture", () => {
  const node = (id: string) => registry.nodes.get(id)!;

  it("builds the approved example URLs", () => {
    expect(entityPath(node("svc.software-development"), registry)).toBe("/software-development/");
    expect(entityPath(node("lang.python"), registry)).toBe("/software-development/python/");
    expect(entityPath(node("fw.nextjs"), registry)).toBe("/web-development/nextjs/");
    expect(entityPath(node("tech.n8n"), registry)).toBe("/automation/n8n/");
    expect(entityPath(node("plat.airtable"), registry)).toBe("/automation/airtable/");
    expect(entityPath(node("plat.aws"), registry)).toBe("/cloud/aws/");
    expect(entityPath(node("int.stripe"), registry)).toBe("/api-integration/stripe/");
    expect(entityPath(node("svc.ai"), registry)).toBe("/ai/");
    expect(entityPath(node("svc.cloud"), registry)).toBe("/cloud/");
  });

  it("uses flat hubs for industries, solutions, and countries, and no pages for problems or business types", () => {
    expect(entityPath(node("ind.healthcare"), registry)).toBe("/industries/healthcare/");
    expect(entityPath(node("sol.workflow-automation"), registry)).toBe(
      "/solutions/workflow-automation/",
    );
    expect(entityPath(node("loc.germany"), registry)).toBe("/locations/germany/");
    expect(entityPath(node("prob.too-many-spreadsheets"), registry)).toBeNull();
    expect(entityPath(node("bt.startups"), registry)).toBeNull();
  });

  it("only treats an entity as published when its page exists", () => {
    expect(publishedPath(node("svc.software-development"), registry)).toBe(
      "/software-development/",
    );
    expect(publishedPath(node("svc.web-development"), registry)).toBe("/web-development/");
    expect(publishedPath(node("workarea.mobile-apps"), registry)).toBe("/work/areas/mobile-apps/");
    expect(publishedPath(node("lang.python"), registry)).toBe("/software-development/python/");
    expect(publishedPath(node("lang.rust"), registry)).toBeNull();
    expect(publishedPath(node("sol.ai-agents"), registry)).toBeNull();
  });

  it("every URL is lowercase, hyphenated, and ends with a slash", () => {
    for (const n of registry.nodes.values()) {
      const p = entityPath(n, registry);
      if (p) expect(p, n.id).toMatch(/^\/([a-z0-9]+(-[a-z0-9]+)*\/)+$/);
    }
  });

  it("no two entities share a URL", () => {
    const seen = new Map<string, string>();
    for (const n of registry.nodes.values()) {
      const p = entityPath(n, registry);
      if (!p) continue;
      expect(seen.get(p), `${n.id} vs ${seen.get(p)}`).toBeUndefined();
      seen.set(p, n.id);
    }
  });
});

describe("pages and graph", () => {
  it("has the 149 pages of Phases 1 to 5 and the 30 industries, the 31 case studies, plus the blog articles", () => {
    const paths = registry.pages.filter((p) => p.kind !== "article").map((p) => p.path);
    expect(paths).toHaveLength(185);
    for (const p of [
      "/",
      "/contact/",
      "/cookies/",
      "/privacy/",
      "/terms/",
      "/accessibility/",
      "/services/",
      "/solutions/",
      "/technologies/",
      "/work/",
      "/company/",
      "/company/how-we-work/",
      "/company/who-we-work-with/",
    ])
      expect(paths).toContain(p);
  });

  it("publishes all fifteen service pages", () => {
    expect(registry.services).toHaveLength(15);
    for (const s of registry.services)
      expect(publishedPath(registry.nodes.get(s.id), registry), s.id).not.toBeNull();
  });

  it("publishes one page for each of the 25 Work Areas, at the owner's slugs", () => {
    const areas = [...registry.nodes.values()].filter((n) => n.type === "work-area");
    expect(areas).toHaveLength(25);
    for (const a of areas) {
      const path = `/work/areas/${a.slug}/`;
      expect(registry.pageByPath.get(path)?.entityId, path).toBe(a.id);
    }
  });

  it("builds breadcrumbs that mirror the information architecture", () => {
    const page = registry.pageByPath.get("/software-development/")!;
    expect(breadcrumbsFor(page, registry).map((c) => c.label)).toEqual([
      "Home",
      "Software Development",
    ]);
  });

  it("derives inverse edges for solutions and problems", () => {
    const solvedBy = outgoing(registry, "prob.too-many-spreadsheets", "solvedBy").map((n) => n.id);
    expect(solvedBy).toContain("sol.internal-business-software");
  });
});

describe("plain-text fields carry no raw tokens (24 October 2026)", () => {
  it("fills in prices in every title, description, lead, and guide summary", () => {
    for (const p of registry.pages)
      for (const text of [
        p.title,
        p.description,
        p.h1 ?? "",
        p.lead ?? "",
        p.article?.summary ?? "",
      ])
        expect(text, p.path).not.toMatch(/\{\{(fact|email):/);
  });
});
