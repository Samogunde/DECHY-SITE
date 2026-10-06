import { describe, expect, it } from "vitest";
import { buildRegistry } from "@/lib/content/load";
import { TECH_SIMILARITY, similarityIssues } from "@/lib/content/similarity";
import { entityPath, publishedPath } from "@/lib/content/urls";

const registry = buildRegistry();
const techPages = registry.pages.filter((p) => p.kind === "technology");

/** The approved Phase 3 set: one canonical page per strategic technology (plan section 7). */
const APPROVED = [
  "fw.nextjs",
  "fw.react",
  "lang.typescript",
  "lang.php",
  "plat.wordpress",
  "plat.webflow",
  "lang.python",
  "lang.java",
  "fw.langchain",
  "prov.openai",
  "prov.anthropic-claude",
  "prov.google-gemini",
  "int.stripe",
  "plat.airtable",
  "plat.hubspot",
  "plat.salesforce",
  "tech.zapier",
  "tech.make",
  "tech.n8n",
  "plat.aws",
  "plat.azure",
  "plat.google-cloud",
  "tool.docker",
  "tool.kubernetes",
  "tool.terraform",
  "plat.shopify",
  "tech.flutter",
  "tech.kotlin",
  "tech.react-native",
  "tech.swift",
  "tech.postgresql",
  "tech.mongodb",
];

describe("phase 3 technology pages", () => {
  it("are exactly the 32 approved technologies, each at its canonical URL", () => {
    expect(techPages).toHaveLength(32);
    expect(techPages.map((p) => p.entityId).sort()).toEqual([...APPROVED].sort());
    for (const p of techPages) {
      const node = registry.nodes.get(p.entityId!)!;
      expect(p.path, p.entityId).toBe(entityPath(node, registry));
      expect(publishedPath(node, registry), p.entityId).toBe(p.path);
    }
  });

  it("sit under their canonical service, and breadcrumbs reach it", () => {
    for (const p of techPages) {
      const node = registry.nodes.get(p.entityId!)!;
      const svc = registry.nodes.get(node.primaryService!)!;
      expect(p.parent, p.path).toBe(`/${svc.slug}/`);
      expect(p.path.startsWith(`/${svc.slug}/`), p.path).toBe(true);
    }
  });

  it("link back to the service, forward to related technologies, and to solutions and Work Areas", () => {
    for (const p of techPages) {
      const groups = p.sections.flatMap((b) => (b.type === "related" ? b.groups : []));
      const ids = groups.flatMap((g) => g.entityIds);
      const node = registry.nodes.get(p.entityId!)!;
      expect(ids, p.path).toContain(node.primaryService);
      const types = new Set(ids.map((id) => registry.nodes.get(id)?.type));
      expect(types.has("work-area"), `${p.path} has Work Areas`).toBe(true);
      expect(types.has("solution"), `${p.path} has solutions`).toBe(true);
      expect(types.has("industry"), `${p.path} has industries`).toBe(true);
    }
  });

  it("are substantial and differentiated, not renamed copies", () => {
    expect(similarityIssues(techPages, registry.facts, TECH_SIMILARITY)).toEqual([]);
    const takeaways = new Set<string>();
    const ctas = new Set<string>();
    for (const p of techPages) {
      const hero = p.sections.find((s) => s.type === "hero");
      if (hero?.type !== "hero") throw new Error("hero expected");
      expect(takeaways.has(hero.takeaway ?? ""), `${p.path} repeats a takeaway`).toBe(false);
      takeaways.add(hero.takeaway ?? "");
      const cta = p.sections.find((s) => s.type === "cta");
      if (cta?.type !== "cta") throw new Error("cta expected");
      expect(ctas.has(cta.heading), `${p.path} repeats a CTA heading`).toBe(false);
      ctas.add(cta.heading);
    }
  });

  it("answer what it is, where it fits, the options, what DECHY does, and what next", () => {
    for (const p of techPages) {
      const ids = p.sections.map((s) => s.id);
      expect(ids, p.path).toEqual(
        expect.arrayContaining(["what", "technology", "faq", "contact-cta"]),
      );
      const types = new Set(p.sections.map((s) => s.type));
      expect(types.has("columns"), `${p.path} says what DECHY can do`).toBe(true);
      // options are shown as a comparison table or a chooser
      expect(types.has("table") || types.has("chooser"), `${p.path} shows options`).toBe(true);
      expect(p.comprehension, p.path).toBeDefined();
    }
  });

  it("use natural wording: no thin 'DECHY uses X' pages and no disclaimer boxes", () => {
    for (const p of techPages) {
      const text = JSON.stringify(p.sections);
      expect(text, p.path).not.toMatch(/made-up|not a client project|not a real client/i);
      expect(
        p.sections.some((s) => s.type === "callout" && s.variant === "illustrative"),
        p.path,
      ).toBe(false);
      expect(p.sections.length, p.path).toBeGreaterThanOrEqual(9);
    }
  });

  it("every integration page shows a data flow", () => {
    const integrations = techPages.filter(
      (p) => registry.nodes.get(p.entityId!)?.type === "integration",
    );
    expect(integrations.length).toBeGreaterThan(0);
    for (const p of integrations) {
      const flows = p.sections.filter(
        (s) => (s.type === "hero" || s.type === "diagram") && s.spec?.kind === "flow",
      );
      expect(flows.length, p.path).toBeGreaterThan(0);
    }
  });

  it("keeps the rest of the entity graph without forcing it onto pages", () => {
    // Technology entities without a page stay entities; nothing requires them to appear in copy.
    const technologyEntities = [...registry.nodes.values()].filter((n) =>
      [
        "technology",
        "platform",
        "language",
        "framework",
        "provider",
        "tool",
        "integration",
      ].includes(n.type),
    );
    expect(technologyEntities.length).toBeGreaterThan(150);
    const unbuilt = technologyEntities.filter((n) => !publishedPath(n, registry));
    expect(unbuilt.length).toBeGreaterThan(100);
    // Deferred entities have no page, and so no link target.
    for (const id of ["lang.go", "tech.mysql", "plat.vercel", "fw.vue"])
      expect(publishedPath(registry.nodes.get(id), registry), id).toBeNull();
  });

  it("are all reachable from the Technologies hub and from their service page", () => {
    const hub = registry.pageByPath.get("/technologies/")!;
    // The hub carries one directory generated from the navigation data, so the menu and the
    // directory list exactly the same pages.
    expect(
      hub.sections.filter((b) => b.type === "directory" && b.source === "technologies"),
    ).toHaveLength(1);
    expect(hub.sections.some((b) => b.type === "entities")).toBe(false);
    const hubIds = registry.nav.technologies.categories.flatMap((c) => c.items);
    for (const p of techPages) {
      expect(hubIds, `hub lists ${p.entityId}`).toContain(p.entityId);
      const node = registry.nodes.get(p.entityId!)!;
      const svcPage = registry.pages.find((x) => x.entityId === node.primaryService)!;
      expect(JSON.stringify(svcPage.sections), `${svcPage.path} links ${p.entityId}`).toContain(
        p.entityId!,
      );
    }
  });

  it("do not pull in later phases: no solution, industry, resource, or country pages", () => {
    for (const p of registry.pages)
      expect(p.path, p.path).not.toMatch(/^\/(solutions|industries|resources|locations)\/./);
  });
});
