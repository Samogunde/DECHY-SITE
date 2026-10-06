import { expect, test } from "@playwright/test";
import { watchErrors } from "./helpers";

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows the approved items; unbuilt ones are plain text, not links", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of [
      "Services",
      "Solutions",
      "Technologies",
      "Industries",
      "Work",
      "Resources",
      "Company",
    ]) {
      await expect(nav.getByText(label, { exact: true })).toBeVisible();
    }
    // Built hubs are links; Industries and Resources have no page yet, so they stay plain text.
    expect(
      await nav.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
    ).toEqual(["/solutions/", "/technologies/", "/work/", "/company/"]);
    for (const label of ["Industries", "Resources"])
      await expect(nav.getByRole("link", { name: label })).toHaveCount(0);
    const cta = page.locator("header").getByRole("link", { name: "Talk to DECHY" });
    await expect(cta).toHaveAttribute("href", "/contact/");
  });

  test("Services menu lists all 15 services in five families, each a link to its page", async ({
    page,
  }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Services" });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`#${await btn.getAttribute("aria-controls")}`);
    await expect(panel).toBeVisible();
    for (const fam of [
      "Build",
      "Intelligence and Automation",
      "Infrastructure and Security",
      "Design and Growth",
      "Advisory",
    ]) {
      await expect(panel.getByText(fam, { exact: true })).toBeVisible();
    }
    expect(await panel.locator("li").count()).toBe(15);
    const links = await panel
      .locator("a")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(links).toEqual([
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
      "/services/",
    ]);
  });

  test("Escape closes the Services menu and returns focus to its button", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Services" });
    await btn.focus();
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(btn).toBeFocused();
  });

  test("clicking outside closes the menu; navigating through it works", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Services" });
    await btn.click();
    await page.mouse.click(40, 600);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await page.getByRole("link", { name: "Software Development" }).first().click();
    await expect(page).toHaveURL(/\/software-development\/$/);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("desktop nav is hidden; the menu button and CTA are reachable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    const menu = page.getByRole("button", { name: "Open menu" });
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(43.5);
    expect(box!.height).toBeGreaterThanOrEqual(43.5);
    await expect(page.locator("header").getByRole("link", { name: "Talk to DECHY" })).toBeVisible();
  });

  test("opens as a modal dialog, traps focus, closes with Escape, and restores focus", async ({
    page,
  }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // Focus starts inside the dialog and never leaves it while tabbing
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"]');
        const a = document.activeElement;
        return (
          !!d &&
          !!a &&
          (d.contains(a) ||
            a.getAttribute("aria-controls") !== null ||
            a.getAttribute("aria-label")?.includes("menu") === true)
        );
      });
      expect(inside, `focus escaped the menu after ${i + 1} tabs`).toBe(true);
    }
    // page behind does not scroll
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  });

  test("Services expands to all 15 services; navigation closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("button", { name: "Services" }).click();
    await expect(dialog.getByText("Cybersecurity")).toBeVisible();
    expect(
      await dialog.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
    ).toEqual([
      ...[
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
      ],
      "/solutions/",
      "/technologies/",
      "/work/",
      "/company/",
      "/services/",
      "/contact/",
    ]);
    await dialog.getByRole("link", { name: "Software Development" }).click();
    await expect(page).toHaveURL(/\/software-development\/$/);
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });

  test("the CTA works from the narrowest phone width", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("dialog", { name: "Site menu" })
      .getByRole("link", { name: "Talk to DECHY" })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
  });
});
