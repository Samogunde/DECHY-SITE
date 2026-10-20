import { afterEach, describe, expect, it, vi } from "vitest";
import { expandFacts, linkTargets, parseInline, toPlainText } from "@/lib/content/inline";
import { buildRegistry } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo/metadata";
import { buildGraph } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, indexingEnabled, siteOrigin } from "@/lib/site";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const registry = buildRegistry();

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("inline markup", () => {
  it("parses bold, entity links, path links, and external links", () => {
    const t = parseInline(
      "A **bold** [one](ref:svc.ai) and [two](/contact/) and [three](https://example.org/).",
    );
    expect(t.filter((x) => x.kind === "bold")).toHaveLength(1);
    expect(linkTargets("[one](ref:svc.ai) [two](/contact/) {{fact:company.statement}}")).toEqual([
      "ref:svc.ai",
      "/contact/",
    ]);
  });

  it("expands approved facts and rejects unknown ones", () => {
    expect(expandFacts("{{fact:company.descriptor}}", registry.facts)).toBe(
      "Technology, Software, AI & Digital Solutions",
    );
    expect(() => expandFacts("{{fact:nope.nope}}", registry.facts)).toThrow(/Unknown fact/);
  });

  it("produces plain text without markup", () => {
    expect(toPlainText("Use **this** [link](ref:svc.ai).", registry.facts)).toBe("Use this link.");
  });
});

describe("site configuration", () => {
  it("derives every absolute URL from SITE_ORIGIN", () => {
    vi.stubEnv("SITE_ORIGIN", "https://example.test/");
    expect(siteOrigin()).toBe("https://example.test");
    expect(absoluteUrl("/software-development/")).toBe(
      "https://example.test/software-development/",
    );
  });

  it("keeps indexing off unless explicitly enabled", () => {
    vi.stubEnv("SITE_INDEXING", "");
    expect(indexingEnabled()).toBe(false);
    vi.stubEnv("SITE_INDEXING", "true");
    expect(indexingEnabled()).toBe(true);
  });
});

describe("metadata", () => {
  const page = registry.pageByPath.get("/software-development/")!;

  it("emits a trailing-slash canonical and Open Graph/Twitter tags", () => {
    vi.stubEnv("SITE_ORIGIN", "https://example.test");
    const m = pageMetadata(page);
    expect((m.alternates as { canonical: string }).canonical).toBe(
      "https://example.test/software-development/",
    );
    expect(m.openGraph?.url).toBe("https://example.test/software-development/");
    expect(JSON.stringify(m.openGraph)).toContain(
      "/og/dechy-technology-solutions-social-image.png",
    );
    expect((m.twitter as { card: string }).card).toBe("summary_large_image");
  });

  it("is noindex in every environment where indexing is not enabled", () => {
    vi.stubEnv("SITE_INDEXING", "false");
    expect((pageMetadata(page).robots as { index: boolean }).index).toBe(false);
  });

  it("is indexable only when both the environment and the page allow it", () => {
    vi.stubEnv("SITE_INDEXING", "true");
    expect((pageMetadata(page).robots as { index: boolean }).index).toBe(true);
    const noindexPage = { ...page, indexing: "noindex" as const };
    expect((pageMetadata(noindexPage).robots as { index: boolean }).index).toBe(false);
  });
});

describe("robots.txt and sitemap", () => {
  it("disallows all crawlers until indexing is enabled", () => {
    vi.stubEnv("SITE_INDEXING", "false");
    const r = robots();
    expect(JSON.stringify(r.rules)).toContain('"disallow":"/"');
    expect(r.sitemap).toBeUndefined();
  });

  it("allows crawling, excludes the API, and links the sitemap once enabled", () => {
    vi.stubEnv("SITE_INDEXING", "true");
    vi.stubEnv("SITE_ORIGIN", "https://example.test");
    const r = robots();
    expect(JSON.stringify(r.rules)).toContain("/api/");
    expect(r.sitemap).toBe("https://example.test/sitemap.xml");
  });

  it("lists only indexable pages, with trailing slashes and true modification dates", () => {
    vi.stubEnv("SITE_ORIGIN", "https://example.test");
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    const expected = registry.pages
      .filter((p) => p.indexing === "index")
      .map((p) => `https://example.test${p.path}`);
    expect(urls.sort()).toEqual(expected.sort());
    expect(urls.length).toBeGreaterThanOrEqual(127);
    expect(urls.every((u) => u.endsWith("/"))).toBe(true);
    for (const e of entries) expect(e.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("structured data", () => {
  type GraphNode = Record<string, unknown> & { "@type": string; "@id"?: string };
  const graphOf = (path: string) =>
    (buildGraph(registry.pageByPath.get(path)!, registry) as unknown as { "@graph": GraphNode[] })[
      "@graph"
    ];
  const types = (path: string) => graphOf(path).map((n) => n["@type"]);

  it("emits Organization, WebSite, WebPage on every page, with stable ids", () => {
    vi.stubEnv("SITE_ORIGIN", "https://example.test");
    for (const p of ["/", "/software-development/", "/contact/", "/privacy/"]) {
      expect(types(p)).toEqual(expect.arrayContaining(["Organization", "WebSite"]));
    }
    const org = graphOf("/").find((n) => n["@type"] === "Organization")!;
    expect(org["@id"]).toBe("https://example.test/#organization");
    expect(org.description).toContain("Technology, Software, AI & Digital Solutions");
    expect(org.foundingDate).toBe("2010");
    expect(org.areaServed).toBe("Worldwide");
  });

  it("never emits properties DECHY has no evidence for", () => {
    for (const p of ["/", "/software-development/", "/contact/"]) {
      const s = JSON.stringify(graphOf(p));
      for (const banned of [
        "LocalBusiness",
        "aggregateRating",
        '"review"',
        '"address"',
        "sameAs",
        "numberOfEmployees",
        '"award"',
        "contactPoint",
        '"geo"',
      ]) {
        expect(s, `${p} ${banned}`).not.toContain(banned);
      }
    }
  });

  it("adds Service, FAQPage, and BreadcrumbList to the service page", () => {
    expect(types("/software-development/")).toEqual(
      expect.arrayContaining(["Service", "FAQPage", "BreadcrumbList", "WebPage"]),
    );
    const faq = graphOf("/software-development/").find((n) => n["@type"] === "FAQPage")!;
    expect((faq.mainEntity as unknown[]).length).toBeGreaterThanOrEqual(5);
  });

  it("marks the contact page as ContactPage and the home page without breadcrumbs", () => {
    expect(types("/contact/")).toContain("ContactPage");
    expect(types("/")).not.toContain("BreadcrumbList");
  });

  it("escapes characters that could end the script tag", () => {
    const s = serializeJsonLd({ a: "</script><b>&" });
    expect(s).not.toContain("</script>");
    expect(s).not.toContain("<");
    expect(JSON.parse(s)).toEqual({ a: "</script><b>&" });
  });
});
