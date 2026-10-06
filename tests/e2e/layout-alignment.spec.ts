import { expect, test } from "@playwright/test";
import { HEIGHT_FOR, PAGES, WIDTHS } from "./helpers";

/**
 * Layout and visual-quality guardrails (docs/design/layout-and-visual-quality-rules.md).
 * Every figure, photograph and diagram must keep its caption and parts on one grid at every width.
 * These tests exist because alignment drift looks fine at one viewport and wrong at another.
 */
const EPS = 1.5; // sub-pixel rounding only

test.describe("alignment at every width", () => {
  for (const w of WIDTHS) {
    for (const { path } of PAGES) {
      test(`${w}px ${path}`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: HEIGHT_FOR(w) });
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);

        const report = await page.evaluate(() => {
          const rect = (e: Element) => e.getBoundingClientRect();
          const issues: string[] = [];
          const where = (e: Element) =>
            (e.closest("section")?.id ?? "?") + " " + (e.className?.toString().slice(0, 40) ?? "");

          // 1. A figure's frame, diagram and caption share one left edge, and the caption never
          //    extends past the frame on the right.
          for (const fig of document.querySelectorAll("figure.figure")) {
            const frame = fig.querySelector(".figure-frame");
            const cap = fig.querySelector("figcaption");
            if (!frame || !cap) continue;
            const f = rect(frame);
            const c = rect(cap);
            const content = frame.firstElementChild
              ? [...frame.children].find((el) => rect(el).width > 0)
              : null;
            if (Math.abs(c.left - f.left) > 1.5) issues.push(`caption left drift ${where(fig)}`);
            if (c.right > f.right + 1.5) issues.push(`caption wider than frame ${where(fig)}`);
            if (content && Math.abs(rect(content).left - f.left) > 1.5)
              issues.push(`diagram left drift ${where(fig)}`);
            if (content && rect(content).right > f.right + 1.5)
              issues.push(`diagram overflows its frame ${where(fig)}`);
          }

          // 2. Photographs: caption (when present) sits on the photo's own left edge.
          for (const fig of document.querySelectorAll("figure.photo")) {
            const frame = fig.querySelector(".photo-frame");
            const cap = fig.querySelector("figcaption");
            if (!frame || !cap) continue;
            if (Math.abs(rect(cap).left - rect(frame).left) > 1.5)
              issues.push(`photo caption drift ${where(fig)}`);
          }

          // 3. Supporting systems share rows with the layer they support.
          for (const row of document.querySelectorAll(".anatomy-row.has-support")) {
            const link = row.querySelector(".anatomy-link");
            if (!link || getComputedStyle(link).display === "none") continue; // stacked layout
            const stage = row.querySelector(".anatomy-stage .dgm-box");
            const boxes = [...row.querySelectorAll(".anatomy-support .dgm-box")];
            if (!stage || boxes.length === 0) continue;
            const s = rect(stage);
            const top = Math.min(...boxes.map((b) => rect(b).top));
            const bottom = Math.max(...boxes.map((b) => rect(b).bottom));
            if (Math.abs(s.top - top) > 1.5 || Math.abs(s.bottom - bottom) > 1.5)
              issues.push(`supporting systems not aligned to their layer ${where(row)}`);
          }

          // 4. Integration bus junctions line up with their layer (vertical centers).
          for (const li of document.querySelectorAll(".sysmap-rows > li")) {
            const box = li.querySelector(".dgm-box");
            const bus = li.querySelector(".sysmap-bus");
            if (!box || !bus) continue;
            const bc = rect(box).top + rect(box).height / 2;
            const jc = rect(bus).top + rect(bus).height / 2;
            if (Math.abs(bc - jc) > 1.5) issues.push("bus junction off its layer");
          }

          // 5. Diagram text is real type: nothing under 14px inside an HTML diagram.
          for (const el of document.querySelectorAll(".dgm *")) {
            if (
              !el.childNodes.length ||
              ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())
            )
              continue;
            const px = parseFloat(getComputedStyle(el).fontSize);
            // Eyebrow labels are 13px by the type system; everything else in a diagram is 14px+.
            const floor = el.classList.contains("dgm-label") ? 12.99 : 13.99;
            if (px < floor)
              issues.push(`diagram text ${px}px ${(el.textContent ?? "").slice(0, 24)}`);
          }

          // 6. No accidental drift: block-level content in one section should not start 1 to 12 px
          //    away from another block's left edge (a near miss reads as a mistake).
          for (const section of document.querySelectorAll("main section")) {
            const lefts: { x: number; tag: string }[] = [];
            for (const el of section.querySelectorAll(
              "h1, h2, :scope > .container-site > p, .t-lead, .prose-service > p, .prose-service, figure.figure, figure.photo, .table-wrap, .rail",
            )) {
              if (el.closest("li, aside, .dgm, details, .visually-hidden")) continue;
              const r = rect(el);
              if (r.width === 0) continue;
              lefts.push({ x: Math.round(r.left), tag: el.tagName });
            }
            const xs = [...new Set(lefts.map((l) => l.x))];
            for (const a of xs)
              for (const b of xs)
                if (a < b && b - a <= 12)
                  issues.push(`near-miss left edges ${a} vs ${b} in #${section.id}`);
          }
          return issues;
        });

        expect(report, report.join("\n")).toEqual([]);
        expect(EPS).toBeGreaterThan(0);
      });
    }
  }
});

test.describe("no visible image credits", () => {
  for (const { path } of PAGES) {
    test(`${path} shows no source or credit text`, async ({ page }) => {
      await page.goto(path);
      const text = await page.evaluate(() => document.body.innerText);
      expect(text).not.toMatch(/unsplash|pexels|photo:|photo by|image credit/i);
      // No figcaption on a photograph may carry a creator name from the registry.
      for (const cap of await page.locator("figure.photo figcaption").allInnerTexts()) {
        expect(cap).not.toMatch(/\/|photo|credit/i);
      }
    });
  }
});

test.describe("photographs are sharp at their rendered size", () => {
  for (const [path, dpr] of [
    ["/", 1],
    ["/", 2],
    ["/software-development/", 2],
    ["/contact/", 2],
  ] as const) {
    test(`${path} at ${dpr}x: source has at least the pixels the layout displays`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: dpr,
      });
      const page = await ctx.newPage();
      await page.goto(path);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
      });
      await page.waitForFunction(() =>
        [...document.querySelectorAll<HTMLImageElement>("figure.photo img")].every(
          (i) => i.currentSrc && i.complete,
        ),
      );
      const imgs = await page.$$eval("figure.photo img", (els) =>
        (els as HTMLImageElement[]).map((i) => {
          const r = i.getBoundingClientRect();
          // Pixels needed: rendered CSS width x device scale. The pixels actually served are the
          // optimizer's requested width (w=...); naturalWidth is density-scaled by the browser.
          const served = Number(new URL(i.currentSrc).searchParams.get("w") ?? 0);
          return {
            served,
            needed: Math.round(r.width * window.devicePixelRatio),
            alt: i.alt,
          };
        }),
      );
      expect(imgs.length).toBeGreaterThan(0);
      for (const i of imgs) {
        // The optimizer serves the next configured size up; it must cover what the layout shows
        // (the registered source itself is 2880 px wide, so that is the ceiling).
        expect(
          i.served,
          `${i.alt.slice(0, 30)} served ${i.served} needed ${i.needed}`,
        ).toBeGreaterThanOrEqual(Math.min(i.needed, 2880));
      }
      await ctx.close();
    });
  }
});
