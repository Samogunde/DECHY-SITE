import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES, watchErrors } from "./helpers";

test.describe("contact form", () => {
  test("shows accessible errors for empty and invalid input, and moves focus to the first problem", async ({
    page,
  }) => {
    await page.goto("/contact/");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Please choose what we can help with.")).toBeVisible();
    await expect(page.getByText(/at least 20 characters/)).toBeVisible();
    await expect(page.getByLabel("Your name")).toBeFocused();
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
    await page.getByLabel("Your name").fill("Ada Lovelace");
    await page.getByLabel("Work email").fill("not-an-email");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel("Work email")).toBeFocused();
  });

  test("stores the inquiry, thanks the visitor, and gives a reference", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/contact/?service=software-development");
    await expect(page.getByText("Your inquiry is about")).toContainText("Software Development");
    await page.getByLabel("Your name").fill("Ada Lovelace");
    await page.getByLabel("Work email").fill("ada@example.org");
    await expect(page.getByLabel("What can we help with?")).toHaveValue("Software Development");
    await page
      .getByLabel("Tell us about the project or request")
      .fill("We need a customer portal to track orders and invoices across three systems.");
    await page.getByLabel("Estimated budget").selectOption("$10,000 to $14,999");
    await page.waitForTimeout(2800); // the anti-bot minimum fill time
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Thank you");
    await expect(page.getByRole("status")).toContainText(/DECHY-[23456789A-HJ-NP-TV-Z]{6}/);
    await expect(page.getByRole("status")).toBeFocused();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("the honeypot field is invisible and unreachable", async ({ page }) => {
    await page.goto("/contact/");
    const hp = page.locator(".hp-field input");
    expect(await hp.count()).toBe(1);
    await expect(hp).toHaveAttribute("tabindex", "-1");
    const box = await hp.boundingBox();
    expect(box === null || box.x < -500 || box.width <= 1).toBe(true);
  });

  test("the API refuses wrong methods and content types, and cross-origin posts", async ({
    request,
    baseURL,
  }) => {
    expect((await request.get("/api/contact/")).status()).toBe(405);
    expect(
      (
        await request.post("/api/contact/", {
          data: "x",
          headers: { "content-type": "text/plain" },
        })
      ).status(),
    ).toBe(415);
    const cross = await request.post("/api/contact/", {
      data: {
        name: "Ada Lovelace",
        email: "ada@example.org",
        message: "A long enough message for validation.",
      },
      headers: { origin: "https://evil.example", "content-type": "application/json" },
    });
    expect(cross.status()).toBe(403);
    expect(cross.headers()["cache-control"]).toContain("no-store");
    void baseURL;
  });
});

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  for (const width of [390, 1440]) {
    for (const p of PAGES) {
      test(`${p.path} at ${width}px has no axe violations`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(p.path);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
          .analyze();
        expect(
          results.violations.map(
            (v) =>
              `${v.id}: ${v.nodes
                .map((n) => n.target.join(" "))
                .slice(0, 3)
                .join(" | ")}`,
          ),
        ).toEqual([]);
      });
    }
  }

  test("the open desktop menus (Services, Technologies, Work) and the open mobile menu have no violations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    let r;
    for (const name of ["Services", "Technologies", "Work"]) {
      await page.getByRole("button", { name: `${name} menu` }).click();
      r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        r.violations.map((v) => v.id),
        name,
      ).toEqual([]);
      await page.keyboard.press("Escape");
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });

  test("form validation errors state is accessible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact/");
    await page.getByRole("button", { name: "Send message" }).click();
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe("security and crawl controls", () => {
  test("sends the full set of security headers and hides the framework", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["content-security-policy"]).toContain("object-src 'none'");
    expect(h["content-security-policy"]).toContain("base-uri 'self'");
    expect(h["content-security-policy"]).toContain("form-action 'self'");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["cross-origin-opener-policy"]).toBe("same-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("robots.txt blocks all crawlers while indexing is off", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toMatch(/User-Agent: \*\s+Disallow: \//i);
    expect(txt).not.toMatch(/Sitemap:/i);
  });

  test("sitemap.xml is valid and lists only indexable pages with absolute, slashed URLs", async ({
    request,
    baseURL,
  }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
    expect(locs).toEqual(PAGES.map((p) => `${baseURL}${p.path}`).sort());
    for (const l of locs) expect(l).toMatch(/\/$/);
  });

  test("declares the approved DECHY icons, and every icon request succeeds", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (r) => {
      if (/icon|favicon|manifest/.test(r.url()) && r.status() >= 400) failed.push(r.url());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await page.locator('link[rel~="icon"]').first().getAttribute("href")).toMatch(
      /favicon.ico|icon/,
    );
    expect(failed).toEqual([]);
  });
});
