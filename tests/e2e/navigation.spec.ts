import { expect, test, type Page } from "@playwright/test";
import { PAGES, registry, watchErrors } from "./helpers";

const published = new Set(PAGES.map((p) => p.path));
const SERVICES = registry.services.length;
const TECH_PAGES = registry.pages.filter((p) => p.kind === "technology").length;
const WORK_AREAS = registry.pages.filter((p) => p.kind === "work-area").length;

const primary = (page: Page) => page.getByRole("navigation", { name: "Primary" });
const labelLink = (page: Page, name: string) =>
  primary(page).getByRole("link", { name, exact: true });
const chevron = (page: Page, name: string) => page.getByRole("button", { name: `${name} menu` });
const panelOf = (page: Page, name: string) =>
  chevron(page, name).locator("xpath=ancestor::li[1]").locator(".nav-panel");

/** Every internal link inside an open or closed panel, without any hash. */
async function panelHrefs(page: Page, name: string): Promise<string[]> {
  return panelOf(page, name)
    .locator("a[href]")
    .evaluateAll((as) => as.map((a) => (a.getAttribute("href") ?? "").split("#")[0]!));
}

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("approved items: hubs are links, unbuilt sections are plain text", async ({ page }) => {
    await page.goto("/");
    for (const [label, href] of [
      ["Services", "/services/"],
      ["Solutions", "/solutions/"],
      ["Technologies", "/technologies/"],
      ["Work", "/work/"],
      ["Company", "/company/"],
    ] as const)
      await expect(labelLink(page, label), label).toHaveAttribute("href", href);
    for (const label of ["Industries", "Resources"]) {
      await expect(primary(page).getByText(label, { exact: true })).toBeVisible();
      await expect(primary(page).getByRole("link", { name: label, exact: true })).toHaveCount(0);
    }
    // Only the three sections with real children have a menu control
    await expect(page.locator("[data-chevron]")).toHaveCount(3);
    const cta = page.locator("header").getByRole("link", { name: "Talk to DECHY" });
    await expect(cta).toHaveAttribute("href", "/contact/");
  });

  test("hover opens the Services menu after a short delay; moving away closes it", async ({
    page,
  }) => {
    await page.goto("/");
    const panel = panelOf(page, "Services");
    await expect(panel).toHaveAttribute("data-open", "false");
    await labelLink(page, "Services").hover();
    await expect(panel).toHaveAttribute("data-open", "true");
    await expect(chevron(page, "Services")).toHaveAttribute("aria-expanded", "true");
    await page.mouse.move(40, 700);
    await expect(panel).toHaveAttribute("data-open", "false");
  });

  test("the Services menu lists all services in five families, each a link, plus the hub link", async ({
    page,
  }) => {
    await page.goto("/");
    await labelLink(page, "Services").hover();
    const panel = panelOf(page, "Services");
    await expect(panel).toHaveAttribute("data-open", "true");
    for (const fam of [
      "Build",
      "Intelligence and Automation",
      "Infrastructure and Security",
      "Design and Growth",
      "Advisory",
    ])
      await expect(panel.getByText(fam, { exact: true })).toBeVisible();
    const hrefs = await panelHrefs(page, "Services");
    expect(hrefs.filter((h) => h !== "/services/")).toHaveLength(SERVICES);
    expect(hrefs).toContain("/services/");
  });

  test("clicking the label goes to the hub; the chevron opens and closes the menu", async ({
    page,
  }) => {
    await page.goto("/");
    const btn = chevron(page, "Services");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await labelLink(page, "Services").click();
    await expect(page).toHaveURL(/\/services\/$/);
  });

  test("a click pins a hover-opened menu until Escape, a second click, or an outside click", async ({
    page,
  }) => {
    await page.goto("/");
    const btn = chevron(page, "Work");
    await labelLink(page, "Work").hover();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await btn.click(); // pins
    await page.mouse.move(40, 700);
    await page.waitForTimeout(500);
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.mouse.click(40, 700); // outside
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the menu and returns focus to the chevron", async ({ page }) => {
    await page.goto("/");
    const btn = chevron(page, "Services");
    await btn.focus();
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(btn).toBeFocused();
  });

  test("keyboard: Space toggles, ArrowDown opens and moves into the menu", async ({ page }) => {
    await page.goto("/");
    const btn = chevron(page, "Work");
    await btn.focus();
    await page.keyboard.press("Space");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Space");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("ArrowDown");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(panelOf(page, "Work").locator("a:focus")).toHaveCount(1);
  });

  test("tabbing across the header never opens a menu on its own", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip link
    for (let i = 0; i < 14; i++) await page.keyboard.press("Tab");
    for (const name of ["Services", "Technologies", "Work"])
      await expect(chevron(page, name)).toHaveAttribute("aria-expanded", "false");
  });

  test("moving diagonally from the label into the panel does not flicker it closed", async ({
    page,
  }) => {
    await page.goto("/");
    const label = await labelLink(page, "Technologies").boundingBox();
    await page.mouse.move(label!.x + 10, label!.y + 10);
    await expect(chevron(page, "Technologies")).toHaveAttribute("aria-expanded", "true");
    await page.mouse.move(label!.x + 60, label!.y + 160, { steps: 25 });
    await page.mouse.move(300, 300, { steps: 25 });
    await expect(chevron(page, "Technologies")).toHaveAttribute("aria-expanded", "true");
  });

  test("Technologies: a rail of categories, editorial links only, and the way to the directory", async ({
    page,
  }) => {
    await page.goto("/");
    await chevron(page, "Technologies").click();
    const panel = panelOf(page, "Technologies");
    const tabs = panel.getByRole("tab");
    await expect(tabs).toHaveCount(registry.nav.technologies.categories.length);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(panel.getByRole("link", { name: "Flutter", exact: true })).toBeVisible();
    await expect(
      panel.getByRole("link", { name: "All technologies in this category" }),
    ).toHaveAttribute("href", "/technologies/#cat-mobile");
    await expect(panel.getByRole("link", { name: "View all technologies" })).toHaveAttribute(
      "href",
      "/technologies/",
    );
    await tabs.nth(2).focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(3)).toBeFocused();
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
    for (const h of await panelHrefs(page, "Technologies")) expect(published.has(h), h).toBe(true);
  });

  test("Work: 'What we build' with every Work Area in five groups, and All Work Areas", async ({
    page,
  }) => {
    await page.goto("/");
    await chevron(page, "Work").click();
    const panel = panelOf(page, "Work");
    await expect(panel.getByText("What we build", { exact: true })).toBeVisible();
    for (const g of [
      "Software & Products",
      "Web, Apps & Commerce",
      "AI, Automation & Data",
      "Connect & Run",
      "Design, Growth & Change",
    ])
      await expect(panel.getByText(g, { exact: true })).toBeVisible();
    const hrefs = await panelHrefs(page, "Work");
    expect(hrefs.filter((h) => h.startsWith("/work/areas/"))).toHaveLength(WORK_AREAS);
    expect(hrefs).toContain("/work/");
    for (const h of hrefs) expect(published.has(h), h).toBe(true);
  });

  test("every menu link resolves, and no category shows more than its menu limit", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const all = new Set<string>();
    for (const name of ["Services", "Technologies", "Work"])
      for (const h of await panelHrefs(page, name)) all.add(h);
    expect(all.size).toBeGreaterThan(SERVICES + TECH_PAGES);
    for (const h of all) expect((await request.get(h)).status(), h).toBe(200);
    await chevron(page, "Technologies").click();
    const visible = await panelOf(page, "Technologies").getByRole("tabpanel").locator("li").count();
    expect(visible).toBeLessThanOrEqual(registry.nav.technologies.menuLimit);
  });

  test("clicking outside closes the menu; navigating through it works", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    const btn = chevron(page, "Services");
    await btn.click();
    await page.mouse.click(40, 700);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await panelOf(page, "Services").getByRole("link", { name: "Software Development" }).click();
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

  test("menus still work with reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await chevron(page, "Work").click();
    await expect(panelOf(page, "Work")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(chevron(page, "Work")).toHaveAttribute("aria-expanded", "false");
    await ctx.close();
  });
});

test.describe("touch at a desktop width never depends on hover", () => {
  test.use({ viewport: { width: 1280, height: 800 }, hasTouch: true });

  test("tapping the chevron opens the menu; tapping the label navigates", async ({ page }) => {
    await page.goto("/");
    await chevron(page, "Technologies").tap();
    await expect(chevron(page, "Technologies")).toHaveAttribute("aria-expanded", "true");
    await panelOf(page, "Technologies").getByRole("link", { name: "Next.js", exact: true }).tap();
    await expect(page).toHaveURL(/\/web-development\/nextjs\/$/);
    await labelLink(page, "Services").tap();
    await expect(page).toHaveURL(/\/services\/$/);
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("desktop nav is hidden; the menu button and CTA are reachable", async ({ page }) => {
    await page.goto("/");
    await expect(primary(page)).toBeHidden();
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
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  });

  test("each section is a link to its hub with a separate, labelled expander", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    for (const [label, href] of [
      ["Services", "/services/"],
      ["Technologies", "/technologies/"],
      ["Work", "/work/"],
    ] as const) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toHaveAttribute(
        "href",
        href,
      );
      const box = await dialog.getByRole("button", { name: `${label} sections` }).boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(43.5);
      expect(box!.height).toBeGreaterThanOrEqual(43.5);
    }
  });

  test("Services expands to all services; navigation closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("button", { name: "Services sections" }).tap();
    await expect(dialog.getByRole("link", { name: "Cybersecurity", exact: true })).toBeVisible();
    await dialog.getByRole("link", { name: "Software Development" }).tap();
    await expect(page).toHaveURL(/\/software-development\/$/);
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });

  test("Technologies drills down: category, then technology pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("button", { name: "Technologies sections" }).tap();
    for (const c of registry.nav.technologies.categories)
      await expect(dialog.getByRole("button", { name: new RegExp(`^${c.label}`) })).toBeVisible();
    await dialog.getByRole("button", { name: /^AI & Machine Learning/ }).tap();
    await expect(dialog.getByRole("link", { name: "OpenAI", exact: true })).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: "All technologies in this category" }).first(),
    ).toBeVisible();
    await dialog.getByRole("link", { name: "OpenAI", exact: true }).tap();
    await expect(page).toHaveURL(/\/ai\/openai\/$/);
  });

  test("Work exposes the grouped Work Areas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("button", { name: "Work sections" }).tap();
    await expect(dialog.getByText("What we build", { exact: true })).toBeVisible();
    await dialog.getByRole("link", { name: "Customer Portals", exact: true }).tap();
    await expect(page).toHaveURL(/\/work\/areas\/customer-portals\/$/);
  });

  test("the CTA stays reachable and works from the narrowest phone width", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const cta = page
      .getByRole("dialog", { name: "Site menu" })
      .getByRole("link", { name: "Talk to DECHY" });
    await expect(cta).toBeInViewport();
    await cta.click();
    await expect(page).toHaveURL(/\/contact\/$/);
  });
});

test.describe("site search", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("opens from the header, finds technologies, services, and Work Areas, and navigates", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search the site" }).click();
    const box = page.getByRole("combobox", { name: /Search services/ });
    await expect(box).toBeFocused();
    await box.fill("next");
    await expect(page.getByRole("option").first()).toContainText("Next.js");
    await box.fill("customer portal");
    await expect(page.getByRole("option", { name: /Customer Portals/ })).toBeVisible();
    await box.fill("kubernetes");
    await expect(page.getByRole("option").first()).toContainText("Kubernetes");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/cloud\/kubernetes\/$/);
  });

  test("the slash key opens it, arrow keys choose, Escape closes and returns focus", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("/");
    const box = page.getByRole("combobox", { name: /Search services/ });
    await expect(box).toBeFocused();
    await box.fill("automation");
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option", { selected: true })).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(box).toBeHidden();
    await expect(page.getByRole("button", { name: "Search the site" })).toBeFocused();
  });

  test("says so when nothing matches, and never lists a page that does not exist", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search the site" }).click();
    const box = page.getByRole("combobox", { name: /Search services/ });
    await box.fill("zzzzqq");
    await expect(page.getByText(/No pages match/)).toBeVisible();
    await box.fill("a");
    const hrefs = await page
      .getByRole("listbox")
      .locator("a[href]")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    for (const h of hrefs) expect(published.has(h), h).toBe(true);
  });

  test("is reachable from the mobile menu", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: /Search services/ }).tap();
    await expect(page.getByRole("combobox", { name: /Search services/ })).toBeFocused();
    await ctx.close();
  });

  test("the index is one static file with only published pages", async ({ request }) => {
    const res = await request.get("/search-index.json");
    expect(res.status()).toBe(200);
    const entries = (await res.json()) as { p: string }[];
    expect(entries.length).toBe(PAGES.length);
    for (const e of entries) expect(published.has(e.p), e.p).toBe(true);
  });
});
