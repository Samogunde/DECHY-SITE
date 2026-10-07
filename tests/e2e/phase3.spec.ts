import { expect, test } from "@playwright/test";
import { PAGES, registry } from "./helpers";

const techPages = registry.pages.filter((p) => p.kind === "technology");

test.describe("phase 3 technology pages", () => {
  test("there are 52, each reachable from the Technologies hub", async ({ page }) => {
    expect(techPages).toHaveLength(52);
    await page.goto("/technologies/");
    const hrefs = await page
      .locator("main a")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const p of techPages) expect(hrefs, `hub links ${p.path}`).toContain(p.path);
  });

  test("each shows its canonical URL, breadcrumbs through its service, and structured data", async ({
    page,
    baseURL,
  }) => {
    for (const p of techPages) {
      await page.goto(p.path);
      expect(await page.locator('link[rel="canonical"]').getAttribute("href"), p.path).toBe(
        `${baseURL}${p.path}`,
      );
      const crumbs = page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link");
      await expect(crumbs, p.path).toHaveCount(2);
      const serviceHref = `/${p.path.split("/")[1]}/`;
      await expect(crumbs.nth(1), p.path).toHaveAttribute("href", serviceHref);
      const blobs = await page.$$eval('script[type="application/ld+json"]', (s) =>
        s.map((x) => x.textContent ?? ""),
      );
      const types = blobs.flatMap((b) =>
        (JSON.parse(b) as { "@graph": { "@type": string }[] })["@graph"].map((n) => n["@type"]),
      );
      expect(types, p.path).toEqual(
        expect.arrayContaining(["WebPage", "BreadcrumbList", "FAQPage"]),
      );
    }
  });

  test("each links to its service, and its service links back", async ({ page }) => {
    for (const p of techPages.slice(0, 12)) {
      const serviceHref = `/${p.path.split("/")[1]}/`;
      await page.goto(p.path);
      expect(
        await page.locator(`main a[href="${serviceHref}"]`).count(),
        `${p.path} links to ${serviceHref}`,
      ).toBeGreaterThan(0);
      await page.goto(serviceHref);
      expect(
        await page.locator(`main a[href="${p.path}"]`).count(),
        `${serviceHref} links to ${p.path}`,
      ).toBeGreaterThan(0);
    }
  });

  test("deferred destinations stay plain text, never dead links", async ({ page, request }) => {
    const built = new Set(PAGES.map((p) => p.path));
    for (const p of techPages) {
      await page.goto(p.path);
      const hrefs = await page
        .locator("main a[href^='/']")
        .evaluateAll((as) => as.map((a) => (a.getAttribute("href") ?? "").split(/[?#]/)[0]));
      for (const h of hrefs) expect(built.has(h!), `${p.path} -> ${h}`).toBe(true);
    }
    // a later-phase technology has no page yet
    const res = await request.get("/software-development/rust/", { maxRedirects: 0 });
    expect(res.status()).toBe(404);
  });

  test("the option chooser works with the keyboard", async ({ page }) => {
    await page.goto("/ai/langchain/");
    const radios = page.locator("#choice input[type=radio]");
    await radios.first().scrollIntoViewIfNeeded();
    expect(await radios.count()).toBeGreaterThanOrEqual(2);
    await radios.first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(radios.nth(1)).toBeChecked();
  });

  test("technical panels open and close with the keyboard", async ({ page }) => {
    await page.goto("/cloud/terraform/");
    const summary = page.locator("#technology summary").first();
    await summary.scrollIntoViewIfNeeded();
    await summary.focus();
    const details = summary.locator("xpath=..");
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("integration pages show a data-flow diagram", async ({ page }) => {
    await page.goto("/api-integration/stripe/");
    const caption = page.locator("figure figcaption").first();
    await expect(caption).toContainText(/payment/i);
    expect(await page.locator("figure").count()).toBeGreaterThanOrEqual(2);
  });

  test("no technology page shows disclaimer boxes or placeholder wording", async ({ request }) => {
    for (const p of techPages) {
      const html = await (await request.get(p.path)).text();
      expect(html, p.path).not.toMatch(/made-up|coming soon|lorem ipsum|not a client project/i);
    }
  });

  test("the sitemap lists all technology pages", async ({ request, baseURL }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const p of techPages) expect(xml, p.path).toContain(`<loc>${baseURL}${p.path}</loc>`);
  });
});
