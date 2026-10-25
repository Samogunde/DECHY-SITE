import { expect, test } from "@playwright/test";
import { PAGES, watchErrors } from "./helpers";

for (const p of PAGES) {
  test.describe(`page contract ${p.path}`, () => {
    test("renders cleanly with correct metadata, structure, and structured data", async ({
      page,
      baseURL,
    }) => {
      const errors = watchErrors(page);
      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState("networkidle");

      // Metadata
      await expect(page).toHaveTitle(p.title);
      const meta = (sel: string, attr = "content") => page.locator(sel).first().getAttribute(attr);
      expect(await meta('meta[name="description"]')).toBe(p.description);
      expect(await meta('link[rel="canonical"]', "href")).toBe(`${baseURL}${p.path}`);
      expect(await meta('meta[name="robots"]')).toContain("noindex"); // no indexing before the domain is approved
      expect(await meta('meta[property="og:title"]')).toBe(p.title);
      expect(await meta('meta[property="og:url"]')).toBe(`${baseURL}${p.path}`);
      expect(await meta('meta[property="og:image"]')).toBe(
        `${baseURL}/og/dechy-share-image.png`,
      );
      expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
      expect(await page.locator("html").getAttribute("lang")).toBe("en");

      // Structure
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header[data-site-header]")).toHaveCount(1);
      await expect(page.locator("footer[data-site-footer]")).toHaveCount(1);

      // Heading hierarchy never skips a level going down
      const levels = await page.$$eval("h1,h2,h3,h4,h5,h6", (hs) =>
        hs.map((h) => Number(h.tagName[1])),
      );
      for (let i = 1; i < levels.length; i++) {
        expect(
          levels[i]! - levels[i - 1]!,
          `heading jump at index ${i}: ${levels.join(",")}`,
        ).toBeLessThanOrEqual(1);
      }

      // Images have text alternatives
      const missingAlt = await page.$$eval(
        "img",
        (imgs) => imgs.filter((i) => !i.hasAttribute("alt")).length,
      );
      expect(missingAlt).toBe(0);

      // Structured data parses and contains the expected entities
      const blobs = await page.$$eval('script[type="application/ld+json"]', (s) =>
        s.map((x) => x.textContent ?? ""),
      );
      expect(blobs.length).toBeGreaterThan(0);
      const graph = blobs.flatMap(
        (b) => (JSON.parse(b) as { "@graph": { "@type": string }[] })["@graph"],
      );
      const types = graph.map((n) => n["@type"]);
      expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite"]));

      // Every internal link resolves to a built page (no dead links)
      const hrefs = await page.$$eval("a[href]", (as) =>
        as.map((a) => a.getAttribute("href") ?? ""),
      );
      for (const h of hrefs) {
        if (h.startsWith("#") || h.startsWith("http")) continue;
        const path = h.split(/[?#]/)[0]!;
        expect(
          PAGES.map((x) => x.path),
          `dead link ${h}`,
        ).toContain(path);
      }

      expect(errors, errors.join("\n")).toEqual([]);
    });
  });
}

test("software development page has Service, FAQPage, and BreadcrumbList structured data", async ({
  page,
}) => {
  await page.goto("/software-development/");
  const blobs = await page.$$eval('script[type="application/ld+json"]', (s) =>
    s.map((x) => x.textContent ?? ""),
  );
  const types = blobs
    .flatMap((b) => (JSON.parse(b) as { "@graph": { "@type": string }[] })["@graph"])
    .map((n) => n["@type"]);
  expect(types).toEqual(
    expect.arrayContaining(["Service", "FAQPage", "BreadcrumbList", "WebPage"]),
  );
});

test("the homepage hero carries the exact descriptor and the approved company statement", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Technology, Software, AI & Digital Solutions", { exact: false }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Since 2010, DECHY has helped over 1,500 organizations, companies, firms, brands, businesses, individuals, professionals, teams, and other clients across a wide range of industries and business types.",
    ),
  ).toBeVisible();
});

test("the homepage shows all 15 service pillars, each a link to its page", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#services");
  const names = [
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "AI & Machine Learning",
    "Automation, Workflows & AI Solutions",
    "Cloud & DevOps",
    "Cybersecurity",
    "Data & Analytics",
    "API & Systems Integration",
    "Ecommerce Solutions",
    "UI/UX & Product Design",
    "Branding & Creative",
    "SEO, AEO & GEO",
    "Digital Marketing",
    "Consulting & Digital Transformation",
  ];
  for (const n of names) await expect(section.getByText(n, { exact: false }).first()).toBeVisible();
  const links = await section
    .locator("a")
    .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect([...links].sort()).toEqual(
    [
      "/software-development/",
      "/web-development/",
      "/mobile-app-development/",
      "/ecommerce/",
      "/ai/",
      "/automation/",
      "/data-analytics/",
      "/api-integration/",
      "/cloud/",
      "/cybersecurity/",
      "/ui-ux/",
      "/branding/",
      "/seo-aeo-geo/",
      "/digital-marketing/",
      "/consulting/",
    ].sort(),
  );
});

test("unknown URLs return a real 404 with noindex", async ({ page }) => {
  const res = await page.goto("/industries/aerospace/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("That page does not exist.");
  expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toContain(
    "noindex",
  );
});

test("URLs without a trailing slash redirect to the canonical slash form", async ({ request }) => {
  const res = await request.get("/software-development", { maxRedirects: 0 });
  expect([301, 308]).toContain(res.status());
  expect(res.headers()["location"]).toMatch(/\/software-development\/$/);
});
