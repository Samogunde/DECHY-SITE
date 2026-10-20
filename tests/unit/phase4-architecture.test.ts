import { describe, expect, it } from "vitest";
import { buildRegistry, type Registry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { validateRegistry } from "@/lib/content/validate";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { buildGraph } from "@/lib/seo/structured-data";

const registry = buildRegistry();

function withPages(mutate: (pages: Page[]) => void): Registry {
  const pages = structuredClone(registry.pages) as Page[];
  mutate(pages);
  return { ...registry, pages, pageByPath: new Map(pages.map((p) => [p.path, p])) };
}
const codes = (r: Registry) =>
  validateRegistry(r)
    .filter((i) => i.level === "error")
    .map((i) => i.code);

const graphOf = (path: string) => {
  const g = buildGraph(registry.pageByPath.get(path)!, registry) as unknown as {
    "@graph": Record<string, unknown>[];
  };
  return g["@graph"];
};

const SIX = [
  "business-process-automation",
  "legacy-system-modernization",
  "cloud-migration",
  "crm-integration",
  "business-dashboards",
  "ai-customer-support",
];

describe("Solutions layer", () => {
  const solutions = registry.pages.filter((p) => p.kind === "solution");

  it("is the six approved pages, at canonical URLs under the Solutions hub", () => {
    expect(solutions.map((p) => p.path.split("/")[2]).sort()).toEqual([...SIX].sort());
    for (const p of solutions) {
      expect(p.parent).toBe("/solutions/");
      expect(registry.nodes.get(p.entityId!)?.pagePolicy).toBe("CREATE / INDEX");
      expect(breadcrumbsFor(p, registry).map((c) => c.path)).toEqual(["/", "/solutions/", p.path]);
    }
  });

  it("carries Service structured data from the DECHY organization, never a local business", () => {
    for (const p of solutions) {
      const graph = graphOf(p.path);
      const service = graph.find((n) => n["@type"] === "Service");
      expect(service, p.path).toBeDefined();
      expect(service!.areaServed).toBe("Worldwide");
      expect(JSON.stringify(graph)).not.toMatch(/LocalBusiness|PostalAddress|geo/);
    }
  });

  it("connects each Solution to services, Work Areas, technologies, and problems in the graph", () => {
    for (const p of solutions) {
      const id = p.entityId!;
      const others = registry.relations
        .filter((r) => r.from === id || r.to === id)
        .map((r) => registry.nodes.get(r.from === id ? r.to : r.from)!.type);
      expect(others, p.path).toContain("service");
      expect(others, p.path).toContain("work-area");
      expect(
        others.some((t) =>
          [
            "technology",
            "platform",
            "language",
            "framework",
            "provider",
            "tool",
            "integration",
          ].includes(t),
        ),
        p.path,
      ).toBe(true);
      expect(others, p.path).toContain("problem");
    }
  });

  it("never gives a Solution an industry relation (Solution to Industry mapping is deferred)", () => {
    for (const r of registry.relations)
      if (r.type === "appliesToIndustry")
        expect(registry.nodes.get(r.from)?.type, `${r.from} ${r.to}`).not.toBe("solution");
  });

  it("keeps deferred, represented, merged, and graph-only Solutions out of pages, the hub, and the menu", () => {
    const hub = JSON.stringify(registry.pageByPath.get("/solutions/")!.sections);
    for (const name of [
      "AI Knowledge Systems",
      "Booking Platforms",
      "Marketplace Platforms",
      "Payment Integration",
      "SaaS Platforms",
      "Customer Experience Systems",
      "AI Automation",
    ])
      expect(hub, name).not.toContain(name);
    const hrefs = registry.pageByPath
      .get("/solutions/")!
      .sections.flatMap((b) => (b.type === "index" ? b.items.map((i) => i.href) : []));
    expect(hrefs.sort()).toEqual(SIX.map((s) => `/solutions/${s}/`).sort());
  });

  it("routes the represented needs from the hub to the Work Area that answers them", () => {
    const hub = registry.pageByPath.get("/solutions/")!;
    const finder = hub.sections.find((b) => b.type === "pathfinder");
    if (finder?.type !== "pathfinder") throw new Error("pathfinder expected");
    for (const path of finder.paths)
      expect(registry.pageByPath.get(path.href)?.kind, path.href).toBe("work-area");
  });
});

describe("Industries and locations", () => {
  it("publishes the thirty industries and five first-wave countries", () => {
    expect(registry.pages.filter((p) => p.kind === "industry")).toHaveLength(30);
    expect(registry.pages.filter((p) => p.kind === "location")).toHaveLength(5);
  });

  it("describes countries as markets served remotely, never as a physical presence", () => {
    for (const p of registry.pages.filter((x) => x.kind === "location")) {
      const text = JSON.stringify(p.sections);
      expect(text, p.path).toMatch(/remote/i);
      expect(text, p.path).not.toMatch(
        /our (local |regional )(office|branch|team)|our (office|branch)|visit us|headquarter/i,
      );
      const service = graphOf(p.path).find((n) => n["@type"] === "Service");
      expect(service!.areaServed, p.path).toMatchObject({ "@type": "Country" });
    }
  });

  it("rejects a presence claim on a location, industry, or solution page", () => {
    for (const path of [
      "/locations/canada/",
      "/industries/retail/",
      "/solutions/cloud-migration/",
    ]) {
      const bad = withPages((pages) => {
        const page = pages.find((p) => p.path === path)!;
        const faq = page.sections.find((s) => s.type === "faq");
        if (faq?.type !== "faq") throw new Error("faq expected");
        faq.items[0]!.a += " Our local team in the city will visit you.";
      });
      expect(codes(bad), path).toContain("presence-claim");
    }
  });

  it("never names a product whose capability awaits the owner's confirmation", () => {
    const bad = withPages((pages) => {
      const page = pages.find((p) => p.path === "/solutions/business-dashboards/")!;
      const faq = page.sections.find((s) => s.type === "faq");
      if (faq?.type !== "faq") throw new Error("faq expected");
      faq.items[0]!.a += " We build these in Power BI.";
    });
    expect(codes(bad)).toContain("unconfirmed-capability");
  });

  it("does not relate industries to Solutions, only to services, Work Areas, and technologies", () => {
    for (const p of registry.pages.filter((x) => x.kind === "industry")) {
      const groups = p.sections.flatMap((b) => (b.type === "related" ? b.groups : []));
      for (const id of groups.flatMap((g) => g.entityIds))
        expect(registry.nodes.get(id)?.type, `${p.path} ${id}`).not.toBe("solution");
    }
  });
});

describe("Resources architecture", () => {
  it("has a Resources hub that lists every published article", () => {
    expect(registry.pageByPath.get("/resources/")?.kind).toBe("hub");
    for (const p of registry.pages.filter((x) => x.kind === "article"))
      expect(p.parent, p.path).toBe("/resources/");
  });

  it("requires an article to declare its record, its parent, and the Article schema", () => {
    const bad = withPages((pages) => {
      const source = pages.find((p) => p.path === "/solutions/cloud-migration/")!;
      pages.push({
        ...structuredClone(source),
        id: "page.article-test",
        kind: "article",
        path: "/resources/test-article/",
        parent: "/solutions/",
        entityId: undefined,
        schemaTypes: ["WebPage"],
        article: undefined,
      } as Page);
    });
    const found = codes(bad);
    expect(found).toContain("article-meta");
    expect(found).toContain("article-parent");
    expect(found).toContain("article-schema");
  });

  it("emits Article structured data authored by the DECHY organization, with no invented author", () => {
    const source = registry.pages.find((p) => p.path === "/solutions/cloud-migration/")!;
    const article = {
      ...structuredClone(source),
      id: "page.article-test",
      kind: "article",
      path: "/resources/test-article/",
      parent: "/resources/",
      entityId: undefined,
      schemaTypes: ["WebPage", "Article"],
      article: {
        category: "guide",
        summary: "A guide used only to test the article structured data.",
      },
    } as Page;
    const graph = (
      buildGraph(article, {
        ...registry,
        pageByPath: new Map([...registry.pageByPath, [article.path, article]]),
      }) as unknown as { "@graph": Record<string, unknown>[] }
    )["@graph"];
    const node = graph.find((n) => n["@type"] === "Article");
    expect(node).toBeDefined();
    expect(node!.author).toEqual({ "@id": expect.stringContaining("#organization") });
    expect(JSON.stringify(graph)).not.toMatch(/"Person"/);
  });
});
