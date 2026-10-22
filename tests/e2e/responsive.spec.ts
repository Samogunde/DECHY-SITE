import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { HEIGHT_FOR, PAGES, WIDTHS, watchErrors } from "./helpers";

/**
 * Responsive quality gates at every width the owner listed. Each combination checks overflow,
 * type-size floors, reading measure, touch targets, and clipped content, and saves a full-page
 * screenshot to test-results/screens for human review.
 */
for (const width of WIDTHS) {
  for (const p of PAGES) {
    test(`responsive ${width}px ${p.path}`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.setViewportSize({ width, height: HEIGHT_FOR(width) });
      await page.goto(p.path);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      // 1. No horizontal overflow of the page, and no element poking past the right edge
      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const bad: string[] = [];
        for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
          // Tables and sliding rows scroll inside their own region.
          if (el.closest(".table-wrap, .tmc-track")) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const style = getComputedStyle(el);
          if (
            style.position === "fixed" ||
            style.visibility === "hidden" ||
            style.display === "none"
          )
            continue;
          if (r.right > vw + 1)
            bad.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)}`,
            );
        }
        return { scrollGap: document.documentElement.scrollWidth - vw, bad: bad.slice(0, 5) };
      });
      expect(overflow.scrollGap, "document wider than viewport").toBeLessThanOrEqual(0);
      expect(overflow.bad, "elements beyond the viewport").toEqual([]);

      // 2. Type-size floors: nothing readable under 13px (eyebrows) / 14px, body copy at least 16px
      const type = await page.evaluate(() => {
        const small: string[] = [];
        const bodyPx: number[] = [];
        const smallBody: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const text = n.textContent?.trim();
          const el = n.parentElement;
          if (
            !text ||
            !el ||
            el.closest("svg") ||
            el.closest(".visually-hidden") ||
            el.closest("script,style,noscript")
          )
            continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0) continue;
          const px = parseFloat(cs.fontSize);
          const floor = el.closest(".t-eyebrow, .dgm-label") ? 12.9 : 13.9;
          if (px < floor) small.push(`${text.slice(0, 30)} ${px}px`);
        }
        for (const el of Array.from(
          document.querySelectorAll<HTMLElement>(".prose-service > p, .t-lead, .t-body"),
        )) {
          if (el.getBoundingClientRect().width === 0 || el.closest(".t-small")) continue;
          const px = parseFloat(getComputedStyle(el).fontSize);
          bodyPx.push(px);
          if (px < 15.95)
            smallBody.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} ${px}px "${(el.textContent ?? "").trim().slice(0, 30)}"`,
            );
        }
        return {
          smallBody: smallBody.slice(0, 4),
          small: small.slice(0, 6),
          minBody: bodyPx.length ? Math.min(...bodyPx) : 99,
          maxBody: bodyPx.length ? Math.max(...bodyPx) : 0,
        };
      });
      expect(type.small, "text below the size floor").toEqual([]);
      // Owner direction, 7 October 2026: normal body 16 to 17px.
      expect(type.smallBody, "body text below 16px").toEqual([]);
      expect(type.minBody, "body text size").toBeGreaterThanOrEqual(15.95);
      // Mobile must not be unnecessarily large; large desktop must grow.
      if (width <= 430) expect(type.maxBody).toBeLessThanOrEqual(24);
      if (width >= 1920) expect(type.minBody).toBeGreaterThanOrEqual(18);

      // 3. Touch targets: controls are at least 44px tall (links in running text are exempt)
      const small = await page.evaluate(() => {
        const bad: string[] = [];
        const sel =
          "a.btn, button, summary, select, input:not([type=hidden]):not(.chooser-input):not(.dir-input):not(.hp-field input), textarea, .chooser-tab, .dir-tab, header a, nav a, footer a";
        for (const el of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
          const cs = getComputedStyle(el);
          if (
            cs.display === "none" ||
            cs.visibility === "hidden" ||
            el.closest(".hp-field") ||
            el.closest(".skip-link")
          )
            continue;
          if (el.classList.contains("skip-link")) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const isNavLink = !!el.closest("header, footer, nav");
          const min = isNavLink && window.innerWidth >= 1024 ? 31.5 : 43.5;
          if (r.height < min)
            bad.push(
              `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 24)}" h=${Math.round(r.height)}`,
            );
        }
        return bad.slice(0, 6);
      });
      expect(small, "controls below the touch-target size").toEqual([]);

      // 4. Reading measure: 55 to 80 average characters per line for long-form paragraphs (tablet and up)
      if (width >= 768 && p.kind !== "contact") {
        const cpl = await page.evaluate(() => {
          const el = document.querySelector<HTMLElement>(
            ".prose-service > p:not(.answer-lead), .prose-article > p",
          );
          if (!el) return null;
          const cs = getComputedStyle(el);
          const c = document.createElement("canvas").getContext("2d")!;
          c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const sample =
            "the quick brown fox jumps over a lazy dog while building software and systems ";
          const avg = c.measureText(sample).width / sample.length;
          return el.getBoundingClientRect().width / avg;
        });
        if (cpl !== null) {
          expect(cpl, `characters per line ${cpl}`).toBeGreaterThanOrEqual(55);
          expect(cpl).toBeLessThanOrEqual(80);
        }
      }

      // 5. Images and SVGs are not clipped or collapsed
      const media = await page.evaluate(
        () =>
          Array.from(
            document.querySelectorAll<SVGElement | HTMLImageElement>("svg[role=img], img"),
          ).filter((m) => {
            const r = m.getBoundingClientRect();
            const cs = getComputedStyle(m);
            return cs.display !== "none" && r.width > 0 && r.height < 20;
          }).length,
      );
      expect(media, "collapsed media elements").toBe(0);

      expect(errors, errors.join("\n")).toEqual([]);

      // Screenshots for human review (not an assertion)
      if (process.env.E2E_SCREENS && [320, 390, 768, 1280, 1920, 2560].includes(width)) {
        fs.mkdirSync("test-results/screens", { recursive: true });
        const name = p.path === "/" ? "home" : p.path.replace(/\//g, "");
        await page.screenshot({
          path: `test-results/screens/${name}-${width}.png`,
          fullPage: true,
        });
      }
    });
  }
}
