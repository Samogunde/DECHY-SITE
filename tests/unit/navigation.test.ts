import { describe, expect, it } from "vitest";
import { buildRegistry } from "@/lib/content/load";
import { CONNECTION_RAIL_LIMIT, connectionsFor } from "@/lib/connections";
import { buildNavModel, navDestinations } from "@/lib/nav";
import { buildSearchEntries, normalize, searchEntries } from "@/lib/search";
import { publishedPath } from "@/lib/content/urls";

const registry = buildRegistry();
const model = buildNavModel(registry);
const paths = new Set(registry.pages.map((p) => p.path));
const item = (kind: string) => model.items.find((i) => i.kind === kind)!;

describe("navigation model", () => {
  it("keeps the approved seven top-level items in order, plus the call to action", () => {
    expect(model.items.map((i) => i.label)).toEqual([
      "Services",
      "Industries",
      "Our Work",
      "Solutions",
      "Technologies",
      "Resources",
      "About us",
    ]);
    expect(model.cta.label).toBe("Talk to DECHY");
  });

  it("links a hub only when it exists; unbuilt sections are plain text", () => {
    for (const i of model.items) {
      if (i.href) expect(paths.has(i.href), i.label).toBe(true);
    }
    expect(model.items.find((i) => i.label === "Industries")!.href).toBe("/industries/");
    expect(model.items.find((i) => i.label === "Resources")!.href).toBe("/resources/");
    expect(model.items.find((i) => i.label === "Solutions")!.kind).toBe("solutions");
    expect(model.items.find((i) => i.label === "About us")!.kind).toBe("about");
    expect(model.items.find((i) => i.label === "About us")!.href).toBe("/company/");
  });

  it("every destination in every menu is a built page: no dead ends", () => {
    for (const d of navDestinations(model)) expect(paths.has(d.split("#")[0]!), d).toBe(true);
  });

  it("Technologies: eight categories, only published pages, editorial order, within the limit", () => {
    const t = item("technologies");
    if (t.kind !== "technologies") throw new Error("technologies expected");
    expect(t.categories.map((c) => c.label)).toEqual([
      "Web & CMS",
      "Languages & Backend",
      "Mobile",
      "AI & Machine Learning",
      "Automation & Business Platforms",
      "Cloud & DevOps",
      "Data & Databases",
      "Commerce & Payments",
    ]);
    const limit = registry.nav.technologies.menuLimit;
    let total = 0;
    for (const c of t.categories) {
      expect(c.items.length, c.id).toBeLessThanOrEqual(limit);
      for (const i of c.all) {
        total += 1;
        expect(publishedPath(registry.nodes.get(i.id), registry), i.id).toBe(i.href);
      }
      expect(c.directoryHref).toBe(`/technologies/#cat-${c.id}`);
    }
    // every technology page is placed once, and entity-only technologies are never listed
    const pages = registry.pages.filter((p) => p.kind === "technology");
    expect(total).toBe(pages.length);
    const listed = new Set(t.categories.flatMap((c) => c.all.map((i) => i.id)));
    for (const p of pages) expect(listed.has(p.entityId!), p.path).toBe(true);
    expect(listed.has("tech.nodejs")).toBe(true);
    expect(listed.has("plat.vercel")).toBe(false);
    expect(listed.has("fw.rails")).toBe(false);
  });

  it("Technologies ordering is editorial, not alphabetical", () => {
    const t = item("technologies");
    if (t.kind !== "technologies") throw new Error("technologies expected");
    const web = t.categories.find((c) => c.id === "web")!;
    expect(web.all.map((i) => i.label).slice(0, 3)).toEqual(["Next.js", "React", "TypeScript"]);
    const names = web.all.map((i) => i.label);
    expect(names).not.toEqual([...names].sort());
  });

  it("the menu limit caps what a category shows while the directory keeps the rest", () => {
    const small = structuredClone(registry);
    small.nav.technologies.menuLimit = 3;
    const t = buildNavModel(small).items.find((i) => i.kind === "technologies")!;
    if (t.kind !== "technologies") throw new Error("technologies expected");
    const cloud = t.categories.find((c) => c.id === "cloud")!;
    expect(cloud.items).toHaveLength(3);
    expect(cloud.all).toHaveLength(9);
    expect(cloud.more).toBe(6);
  });

  it("a technology that loses its page disappears from the menu instead of becoming a dead link", () => {
    const r2 = structuredClone(registry);
    r2.pages = r2.pages.filter((p) => p.path !== "/cloud/kubernetes/");
    r2.pageByPath = new Map(r2.pages.map((p) => [p.path, p]));
    const t = buildNavModel(r2).items.find((i) => i.kind === "technologies")!;
    if (t.kind !== "technologies") throw new Error("technologies expected");
    expect(t.categories.flatMap((c) => c.all).some((i) => i.id === "tool.kubernetes")).toBe(false);
  });

  it("Work: five groups, all 25 Work Areas, the canonical names", () => {
    const w = item("work");
    if (w.kind !== "work") throw new Error("work expected");
    expect(w.heading).toBe("What we build");
    expect(w.groups.map((g) => g.label)).toEqual([
      "Software & Products",
      "Web, Apps & Commerce",
      "AI, Automation & Data",
      "Connect & Run",
      "Design, Growth & Change",
    ]);
    const ids = w.groups.flatMap((g) => g.items.map((i) => i.id));
    expect(ids).toHaveLength(25);
    expect(new Set(ids).size).toBe(25);
    for (const g of w.groups)
      for (const i of g.items) expect(i.label).toBe(registry.nodes.get(i.id)!.name);
  });

  it("Services: all 15 in five families, with the hub as the label's destination", () => {
    const s = item("services");
    if (s.kind !== "services") throw new Error("services expected");
    expect(s.href).toBe("/services/");
    expect(s.families).toHaveLength(5);
    expect(s.families.flatMap((f) => f.services)).toHaveLength(15);
  });

  it("has menus for every primary item except Locations, which has none", () => {
    expect(registry.nav.primary.filter((i) => i.kind !== "link").map((i) => i.label)).toEqual([
      "Services",
      "Industries",
      "Our Work",
      "Solutions",
      "Technologies",
      "Resources",
      "About us",
    ]);
    expect(registry.nav.primary.map((i) => i.label)).not.toContain("Locations");
  });

  it("Solutions and Industries menus list only published pages, led by the problem", () => {
    const s = item("solutions");
    const i = item("industries");
    if (s.kind !== "solutions" || i.kind !== "industries") throw new Error("lists expected");
    expect(s.items.map((x) => x.id)).toEqual([
      "sol.business-process-automation",
      "sol.legacy-system-modernization",
      "sol.cloud-migration",
      "sol.crm-integration",
      "sol.business-dashboards",
      "sol.ai-customer-support",
    ]);
    expect(i.items).toHaveLength(30);
    for (const x of [...s.items, ...i.items]) {
      expect(paths.has(x.href), x.href).toBe(true);
      expect(x.summary.length, x.id).toBeGreaterThan(10);
    }
  });

  it("never lists a Solution that is represented by a Work Area, deferred, or graph-only", () => {
    const s = item("solutions");
    if (s.kind !== "solutions") throw new Error("solutions expected");
    const listed = new Set(s.items.map((x) => x.id));
    for (const id of [
      "sol.customer-portal-development",
      "sol.workflow-automation",
      "sol.ai-automation",
      "sol.saas-platforms",
      "sol.customer-experience-systems",
    ])
      expect(listed.has(id), id).toBe(false);
  });
});

describe("technology graph completion (ADR 0005)", () => {
  it("adds the missing entities without adding pages", () => {
    // Node.js and .NET were added as entities in ADR 0005 and are published in Phase 4.
    for (const id of ["tech.nodejs", "tech.dotnet"]) {
      expect(registry.nodes.has(id), id).toBe(true);
      expect(publishedPath(registry.nodes.get(id), registry), id).not.toBeNull();
    }
    for (const id of [
      "fw.django",
      "fw.laravel",
      "plat.power-bi",
      "tech.kafka",
      "tech.elasticsearch",
      "plat.datadog",
    ]) {
      expect(registry.nodes.has(id), id).toBe(true);
      expect(publishedPath(registry.nodes.get(id), registry), id).toBeNull();
    }
    expect(registry.nodes.size).toBeGreaterThan(800);
  });

  it("keeps ENTITY != PAGE: most technology entities have no page", () => {
    const tech = [...registry.nodes.values()].filter((n) =>
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
    const withPage = tech.filter((n) => publishedPath(n, registry));
    expect(withPage).toHaveLength(52);
    expect(tech.length).toBeGreaterThan(280);
  });
});

describe("Where this connects", () => {
  const rails = (path: string) => connectionsFor(registry.pageByPath.get(path)!, registry);

  it("gives service, technology, and Work Area pages the same rails", () => {
    const ids = (path: string) => rails(path).map((r) => r.id);
    expect(ids("/cloud/")).toEqual(
      expect.arrayContaining(["technologies", "systems", "solutions"]),
    );
    expect(ids("/cloud/kubernetes/")).toEqual(
      expect.arrayContaining(["services", "technologies", "systems"]),
    );
    expect(ids("/work/areas/cloud-platforms/")).toEqual(
      expect.arrayContaining(["services", "technologies"]),
    );
  });

  it("links built pages, never lists a Solution without a page, and leaves unbuilt industries as plain text", () => {
    const r = rails("/cloud/kubernetes/");
    const solutions = r.find((x) => x.id === "solutions");
    for (const i of solutions?.items ?? []) expect(i.href && paths.has(i.href), i.id).toBeTruthy();
    const systems = r.find((x) => x.id === "systems")!;
    expect(systems.items.every((i) => i.href && paths.has(i.href))).toBe(true);
  });

  it("shows every Work Area of a service on that service page", () => {
    for (const s of registry.services) {
      const page = registry.pages.find((p) => p.entityId === s.id)!;
      const want = [...registry.nodes.values()].filter(
        (n) => n.type === "work-area" && n.primaryService === s.id,
      );
      const shown = new Set(
        (rails(page.path).find((r) => r.id === "systems")?.items ?? []).map((i) => i.id),
      );
      for (const w of want) expect(shown.has(w.id), `${page.path} shows ${w.id}`).toBe(true);
    }
  });

  it("caps each rail and never repeats an entity within a page", () => {
    for (const p of registry.pages.filter((x) =>
      ["service", "technology", "work-area"].includes(x.kind),
    )) {
      const seen = new Set<string>();
      // A service page always offers every technology page that belongs to it, even beyond the cap.
      const home = [...registry.nodes.values()].filter(
        (n) => n.primaryService === p.entityId && publishedPath(n, registry),
      ).length;
      for (const r of rails(p.path)) {
        const cap =
          p.kind === "service" && r.id === "technologies"
            ? Math.max(CONNECTION_RAIL_LIMIT, home)
            : CONNECTION_RAIL_LIMIT;
        expect(r.items.length, `${p.path} ${r.id}`).toBeLessThanOrEqual(cap);
        for (const i of r.items) {
          expect(seen.has(i.id), `${p.path} repeats ${i.id}`).toBe(false);
          seen.add(i.id);
        }
      }
    }
  });
});

describe("site search", () => {
  const entries = buildSearchEntries(registry);
  const top = (q: string) => searchEntries(entries, q, 5).map((e) => e.t);

  it("indexes exactly the published, indexable pages", () => {
    expect(entries).toHaveLength(registry.pages.filter((p) => p.indexing === "index").length);
    for (const e of entries) expect(paths.has(e.p), e.p).toBe(true);
  });

  it("finds technologies however they are typed", () => {
    expect(top("next.js")[0]).toBe("Next.js");
    expect(top("nextjs")[0]).toBe("Next.js");
    expect(top("kubernetes")[0]).toBe("Kubernetes");
    expect(top("react native")[0]).toBe("React Native");
    expect(normalize("Next.js")).toBe("nextjs");
  });

  it("finds services, Work Areas, and company pages by plain words", () => {
    expect(top("customer portal")).toContain("Customer Portals");
    expect(top("how we work")[0]).toBe("How we work");
    expect(searchEntries(entries, "automation", 5).map((e) => e.p)).toContain("/automation/");
  });

  it("matches by category and service, so a visitor can search by kind", () => {
    // The search box shows eight results; guides about mobile apps rank alongside the technologies.
    const mobile = searchEntries(entries, "mobile", 8).map((e) => e.t);
    expect(mobile).toEqual(expect.arrayContaining(["Flutter", "Swift"]));
  });

  it("returns nothing for gibberish and never an unbuilt entity", () => {
    expect(top("zzzzqq")).toEqual([]);
    expect(top("django")).toEqual([]);
  });
});
