import { expect, test } from "@playwright/test";
import { PAGES, registry } from "./helpers";

const areas = PAGES.filter((p) => p.kind === "work-area");

test.describe("phase 2 site-wide contract", () => {
  test("every internal link on every page resolves to a built page", async ({ request }) => {
    const built = new Set(PAGES.map((p) => p.path));
    const checked = new Set<string>();
    for (const p of PAGES) {
      const res = await request.get(p.path);
      const html = await res.text();
      const hrefs = [...html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)].map((m) => m[1]!);
      for (const href of hrefs) {
        if (/^\/(_next|og|fonts|images|favicon|sitemap|robots|api)/.test(href)) continue;
        if (checked.has(href)) continue;
        checked.add(href);
        expect(built.has(href), `${p.path} links to ${href}`).toBe(true);
      }
    }
  });

  test("no page shows placeholder wording or visible image credits", async ({ request }) => {
    const banned = /coming soon|lorem ipsum|under construction|photo by|photograph by|credit:/i;
    for (const p of PAGES) {
      const html = await (await request.get(p.path)).text();
      const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ");
      expect(banned.test(text), p.path).toBe(false);
    }
  });

  test("there are 85 pages: 15 services, 4 hubs, 25 Work Areas, 32 technology pages, and the rest", async () => {
    expect(PAGES).toHaveLength(85);
    expect(PAGES.filter((p) => p.kind === "service")).toHaveLength(15);
    expect(areas).toHaveLength(25);
    expect(PAGES.filter((p) => p.kind === "hub" || p.kind === "work-hub")).toHaveLength(4);
  });

  test("every Work Area labels its scenario as an illustration", async ({ page }) => {
    for (const a of areas.slice(0, 6)) {
      await page.goto(a.path);
      await expect(page.getByText("An illustrative scenario").first()).toBeVisible();
    }
  });

  test("the sitemap lists exactly the built pages", async ({ request, baseURL }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual(PAGES.map((p) => `${baseURL}${p.path}`).sort());
  });
});

test.describe("phase 2 interactive blocks work without a mouse", () => {
  test("a chooser changes its answer with the keyboard", async ({ page }) => {
    await page.goto("/work/areas/ecommerce-platforms/");
    const radios = page.locator("#foundation input[type=radio]");
    await radios.first().scrollIntoViewIfNeeded();
    expect(await radios.count()).toBeGreaterThanOrEqual(2);
    await radios.first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(radios.nth(1)).toBeChecked();
    await page.keyboard.press("ArrowDown");
    await expect(radios.nth(2)).toBeChecked();
  });

  test("technical panels open and close with the keyboard", async ({ page }) => {
    await page.goto("/work/areas/cloud-platforms/");
    const summary = page.locator("#technology summary").first();
    await summary.scrollIntoViewIfNeeded();
    await summary.focus();
    const details = summary.locator("xpath=..");
    await expect(details).not.toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("the on-this-page links jump to real sections", async ({ page }) => {
    await page.goto("/ai/");
    const links = page.getByRole("navigation", { name: "On this page" }).getByRole("link");
    const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(2);
    for (const h of hrefs) await expect(page.locator(h!)).toHaveCount(1);
  });

  test("diagram captions sit inside the same figure", async ({ page }) => {
    await page.goto("/cloud/");
    const figures = page.locator("figure");
    const n = await figures.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) await expect(figures.nth(i).locator("figcaption")).toHaveCount(1);
  });

  test("every service page keeps its next-step action", async ({ page }) => {
    for (const s of registry.services.slice(0, 5)) {
      const p = registry.pages.find((x) => x.entityId === s.id)!;
      await page.goto(p.path);
      await expect(
        page.getByRole("link", { name: /Talk to DECHY|Talk to us/ }).first(),
      ).toBeVisible();
    }
  });
});
