import { expect, test, type Page } from "@playwright/test";
import { watchErrors } from "./helpers";

/** Scroll the whole page in steps so reveals and lazy images settle. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(1300);
}

const PHOTO_COUNTS: Record<string, number> = {
  "/": 3,
  "/software-development/": 1,
  "/contact/": 1,
};

test.describe("photography", () => {
  for (const [path, count] of Object.entries(PHOTO_COUNTS)) {
    test(`${path} shows ${count} photograph(s) with alt text, credit, and no layout shift`, async ({
      page,
    }) => {
      const errors = watchErrors(page);
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as {
            value: number;
            hadRecentInput: boolean;
          }[])
            if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await scrollThrough(page);
      const photos = page.locator("figure.photo");
      await expect(photos).toHaveCount(count);
      for (let i = 0; i < count; i++) {
        const fig = photos.nth(i);
        const img = fig.locator("img");
        expect(((await img.getAttribute("alt")) ?? "").length).toBeGreaterThan(20);
        expect(await img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(
          true,
        );
        // Source credits never appear on the page (covered in layout-alignment.spec.ts).
        // The frame reserves its space: the image never exceeds it.
        const [frame, image] = await Promise.all([
          fig.locator(".photo-frame").boundingBox(),
          img.boundingBox(),
        ]);
        expect(frame && image && image.width <= frame.width + 1).toBe(true);
      }
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls, "cumulative layout shift").toBeLessThan(0.02);
      expect(errors).toEqual([]);
    });
  }

  test("photographs are served optimized, not as the stored source file", async ({ page }) => {
    const sizes: number[] = [];
    page.on("response", async (r) => {
      if (r.url().includes("/_next/image") && r.url().includes("photos")) {
        sizes.push((await r.body()).length);
      }
    });
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await scrollThrough(page);
    expect(sizes.length).toBeGreaterThan(0);
    for (const s of sizes) expect(s).toBeLessThan(160 * 1024);
  });
});

test.describe("motion (no preference)", () => {
  test.use({ reducedMotion: "no-preference" });

  test("below-the-fold content reveals as it scrolls in, and nothing stays hidden", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await expect.poll(() => page.locator('[data-state="hidden"]').count()).toBeGreaterThan(0);
    // First-screen content is never hidden.
    const hiddenOnScreen = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-state="hidden"]')].filter(
          (e) => e.getBoundingClientRect().top < window.innerHeight * 0.9,
        ).length,
    );
    expect(hiddenOnScreen).toBe(0);
    await expect(page.locator("#hero h1")).toHaveCSS("opacity", "1");
    await scrollThrough(page);
    await expect(page.locator('[data-state="hidden"]')).toHaveCount(0);
    expect(await page.locator('[data-state="shown"]').count()).toBeGreaterThan(5);
  });

  test("a primary button lifts on hover and its arrow moves forward", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const btn = page.locator("#hero a.btn-primary");
    await expect(btn).toBeVisible();
    const before = await btn.evaluate((e) => getComputedStyle(e).transform);
    await btn.hover();
    await page.waitForTimeout(350);
    const after = await btn.evaluate((e) => getComputedStyle(e).transform);
    expect(before).toBe("none");
    expect(after).not.toBe("none");
    const arrow = btn.locator(".arrow");
    expect(await arrow.evaluate((e) => getComputedStyle(e).transform)).not.toBe("none");
    await page.mouse.move(5, 5);
    await page.waitForTimeout(350);
    expect(await btn.evaluate((e) => getComputedStyle(e).transform)).toBe("none");
  });

  test("the services menu opens and closes with a transition and manages focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Services" });
    const panel = page.locator(".nav-panel").first();
    await expect(panel).toHaveAttribute("data-open", "false");
    await toggle.click();
    await expect(panel).toHaveAttribute("data-open", "true");
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((e) => getComputedStyle(e).transitionDuration)).not.toBe("0s");
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("the diagram steps play in order when the figure appears", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const flow = page.locator("#connected-systems figure");
    await flow.scrollIntoViewIfNeeded();
    await expect(flow).toHaveAttribute("data-state", /shown|hidden/);
    await expect.poll(() => flow.getAttribute("data-state")).toBe("shown");
    const steps = flow.locator(".flow-steps .fx-step");
    expect(await steps.count()).toBe(6);
    await page.waitForTimeout(1200);
    for (let i = 0; i < 6; i++) await expect(steps.nth(i)).toHaveCSS("opacity", "1");
  });

  test("form fields show a visible focus state and animate their border", async ({ page }) => {
    await page.goto("/contact/");
    const name = page.getByLabel("Your name");
    await name.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(name).toBeFocused();
    const style = await name.evaluate((e) => {
      const cs = getComputedStyle(e);
      return { outline: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow };
    });
    expect(style.outline).not.toBe("none");
    expect(parseFloat(style.width)).toBeGreaterThanOrEqual(2);
    expect(style.shadow).not.toBe("none");
  });

  test("FAQ items open and close", async ({ page }) => {
    await page.goto("/software-development/");
    const first = page.locator(".faq details").first();
    await first.scrollIntoViewIfNeeded();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await first.locator("summary").click();
    await expect(first).not.toHaveAttribute("open", "");
  });
});

test.describe("motion (reduced)", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of ["/", "/software-development/", "/contact/"]) {
    test(`${path}: nothing is hidden, nothing animates, content is immediately visible`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.goto(path);
      await page.waitForTimeout(500);
      await expect(page.locator('[data-state="hidden"]')).toHaveCount(0);
      const state = await page.evaluate(() => {
        const animated = [...document.querySelectorAll("*")].filter((e) => {
          const cs = getComputedStyle(e);
          return cs.animationName !== "none" && cs.animationDuration !== "0s";
        }).length;
        const slowTransitions = [...document.querySelectorAll("a, button, input, details")].filter(
          (e) => parseFloat(getComputedStyle(e).transitionDuration) > 0,
        ).length;
        const lowOpacity = [...document.querySelectorAll("main *")].filter((e) => {
          const cs = getComputedStyle(e);
          // The looping bus packet is deliberately hidden under reduced motion.
          return (
            cs.opacity !== "1" &&
            !e.closest("svg") &&
            !e.closest(".photo-frame") &&
            !e.classList.contains("bus-packet")
          );
        }).length;
        return { animated, slowTransitions, lowOpacity };
      });
      expect(state.animated).toBe(0);
      expect(state.slowTransitions).toBe(0);
      expect(state.lowOpacity).toBe(0);
    });
  }

  test("buttons do not move on hover and diagrams do not loop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const btn = page.locator("#hero a.btn-primary");
    await btn.hover();
    await page.waitForTimeout(200);
    expect(await btn.evaluate((e) => getComputedStyle(e).transform)).toBe("none");
    expect(
      await page.locator("#hero .bus-packet").evaluate((e) => getComputedStyle(e).animationName),
    ).toBe("none");
  });

  test("menus and the FAQ still work without transitions", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/software-development/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
    const first = page.locator(".faq details").first();
    await first.scrollIntoViewIfNeeded();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
  });
});
