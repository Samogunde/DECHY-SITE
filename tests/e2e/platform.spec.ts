import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { watchErrors } from "./helpers";

const REF = /DECHY-[23456789A-HJ-NP-TV-Z]{6}/;
const WCAG = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

async function signIn(page: Page) {
  await page.goto("/admin/login/");
  await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel("Password").fill(process.env.E2E_ADMIN_PASSWORD!);
  await Promise.all([
    page.waitForURL(/\/admin\/$/),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
}

test.describe("brand assets", () => {
  test("serves the favicon, app icons, manifest, and the approved social image", async ({
    request,
    page,
    baseURL,
  }) => {
    expect((await request.get("/favicon.ico")).status()).toBe(200);
    expect((await request.get("/icons/icon-512.png")).status()).toBe(200);
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.short_name).toBe("DECHY");
    expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(
      expect.arrayContaining(["192x192", "512x512"]),
    );
    await page.goto("/");
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute("href", /favicon|icon/);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toBe(`${baseURL}/og/dechy-technology-solutions-social-image.png`);
    expect((await request.get("/og/dechy-technology-solutions-social-image.png")).status()).toBe(
      200,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    // The site logo is the wordmark without the descriptor; the descriptor is text in the footer.
    await expect(page.locator("header img").first()).toHaveAttribute("alt", "DECHY");
    await expect(page.locator("footer")).toContainText(
      "Technology, Software, AI & Digital Solutions",
    );
  });

  test("the Organization logo is the brand logo, never the social image", async ({ page }) => {
    await page.goto("/");
    const graph = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(graph).toContain("/brand/dechy-logo.png");
    expect(graph).not.toMatch(/"logo":\{[^}]*social-image/);
  });
});

test.describe("website assistant", () => {
  test("opens from the launcher, answers from approved pages, and hands off to a person with a reference", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.goto("/services/");
    const launcher = page.getByRole("button", { name: "Ask DECHY" });
    await launcher.click();
    const panel = page.getByRole("dialog", { name: "DECHY assistant" });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("not a person");
    await panel.getByRole("button", { name: "We repeat the same tasks every day" }).click();
    await expect(panel.getByRole("log")).toContainText(/closest fit/i);
    const rec = panel.getByRole("link", { name: /Automation/ }).first();
    await expect(rec).toHaveAttribute("href", /^\/[a-z0-9/-]+\/$/);
    await panel.getByRole("button", { name: "Talk to a person" }).click();
    await panel.getByLabel("Your name").fill("Test Visitor");
    await panel.getByLabel("Work email").fill("visitor@example.test");
    await panel.getByLabel("This is time-sensitive").check();
    await panel.getByRole("button", { name: "Send to the DECHY team" }).click();
    await expect(panel.getByRole("status")).toContainText("sent to the DECHY team");
    await expect(panel.getByRole("status")).toContainText(REF);
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(launcher).toBeFocused();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("a request for a person is honored straight away", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ask DECHY" }).click();
    const panel = page.getByRole("dialog", { name: "DECHY assistant" });
    await panel.getByLabel("Your message").fill("I'd rather talk to someone from DECHY");
    await panel.getByLabel("Your message").press("Enter");
    await expect(panel.getByLabel("Your name")).toBeVisible();
    await expect(panel.getByLabel("Your name")).toBeFocused();
  });

  test("the contact page offers three paths, and the third opens the person form", async ({
    page,
  }) => {
    await page.goto("/contact/");
    const paths = page.getByRole("list", { name: "Ways to reach DECHY" });
    await expect(paths.getByRole("button")).toHaveCount(2);
    await expect(paths.getByRole("link")).toHaveCount(1);
    await paths.getByRole("button", { name: /speak to someone/ }).click();
    await expect(
      page.getByRole("dialog", { name: "DECHY assistant" }).getByLabel("Your name"),
    ).toBeVisible();
  });

  test("is accessible open, and fits small phones without horizontal scrolling", async ({
    page,
  }) => {
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await page.getByRole("button", { name: "Ask DECHY" }).click();
      await expect(page.getByRole("dialog", { name: "DECHY assistant" })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
      const box = await page.locator("#dechy-assistant").boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      const r = await new AxeBuilder({ page }).withTags(WCAG).include("#dechy-assistant").analyze();
      expect(
        r.violations.map((v) => v.id),
        `${width}px`,
      ).toEqual([]);
    }
  });

  test("the assistant API refuses cross-origin and oversized requests", async ({ request }) => {
    expect((await request.get("/api/assistant/")).status()).toBe(405);
    const cross = await request.post("/api/assistant/", {
      data: { message: "hello" },
      headers: { origin: "https://evil.example", "content-type": "application/json" },
    });
    expect(cross.status()).toBe(403);
    const big = await request.post("/api/assistant/", {
      data: { message: "x".repeat(8000) },
      headers: { "content-type": "application/json" },
    });
    expect(big.status()).toBe(413);
  });
});

test.describe("DECHY Admin", () => {
  test("is private: pages redirect to sign-in and the API refuses anonymous calls", async ({
    page,
    request,
  }) => {
    await page.goto("/admin/inbox/");
    await expect(page).toHaveURL(/\/admin\/login\/$/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect((await request.get("/api/admin/records/")).status()).toBe(401);
    expect((await request.get("/api/admin/records/DECHY-ABC234/")).status()).toBe(401);
    expect((await request.post("/api/admin/ingest/email/", { data: {} })).status()).toBe(401);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \//);
  });

  test("rejects a wrong password without saying which part was wrong", async ({ page }) => {
    await page.goto("/admin/login/");
    await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL!);
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/error=1/);
    await expect(page.locator(".admin-error")).toContainText("did not match");
  });

  test("shows a handoff in the inbox, opens it, changes its status, and signs out", async ({
    page,
    request,
  }) => {
    const res = await request.post("/api/assistant/handoff/", {
      data: {
        name: "Inbox Check",
        email: "inbox@example.test",
        message: "Please call about a portal.",
      },
      headers: { "content-type": "application/json" },
    });
    expect(res.status()).toBe(200);
    const { ref } = (await res.json()) as { ref: string };
    expect(ref).toMatch(REF);

    await signIn(page);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await page.getByRole("link", { name: "Inbox", exact: true }).click();
    await page.getByRole("link", { name: new RegExp(ref) }).click();
    await expect(page.getByRole("heading", { name: ref })).toBeVisible();
    await expect(page.locator("main")).toContainText("Please call about a portal.");
    await page.getByRole("combobox", { name: "Status" }).selectOption("open");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.locator(".admin-meta-line")).toContainText("open");

    // The same session authorizes the JSON API used by a future mobile app.
    const api = await page.request.get(`/api/admin/records/${ref}/`);
    expect(api.status()).toBe(200);
    expect(((await api.json()) as { record: { status: string } }).record.status).toBe("open");

    const r = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(r.violations.map((v) => v.id)).toEqual([]);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login\/$/);
    await page.goto("/admin/");
    await expect(page).toHaveURL(/\/admin\/login\/$/);
  });

  test("works on a small phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 760 });
    await signIn(page);
    for (const path of ["/admin/", "/admin/inbox/", "/admin/conversations/", "/admin/contacts/"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
