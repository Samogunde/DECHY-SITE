import { expect, test } from "@playwright/test";

/**
 * No page may scroll sideways or hold an element wider than the screen (owner, 25 October 2026).
 * Every page in the sitemap, at a phone, a tablet, and a desktop width.
 */
const WIDTHS = [360, 768, 1440];

test.describe.configure({ mode: "parallel" });

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page, request, baseURL }) => {
    test.setTimeout(15 * 60 * 1000);
    const xml = await (await request.get(`${baseURL}/sitemap.xml`)).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
    await page.setViewportSize({ width, height: 900 });
    const failures: string[] = [];
    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const wide = await page.evaluate(() => {
        const doc = document.documentElement;
        if (doc.scrollWidth <= doc.clientWidth + 1) return null;
        const el = [...document.querySelectorAll("body *")].find((e) => {
          const r = e.getBoundingClientRect();
          return (
            r.right > doc.clientWidth + 1 && r.width > 0 && getComputedStyle(e).position !== "fixed"
          );
        });
        return `${doc.scrollWidth - doc.clientWidth}px (${el ? `${el.tagName}.${el.className}` : "unknown"})`;
      });
      if (wide) failures.push(`${path}: ${wide}`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
