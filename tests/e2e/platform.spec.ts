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
  test("guides, keeps the conversation across pages and reloads, and hands it to the team in place", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.goto("/cloud/");
    // Guided mode (no AI key in tests): the label never claims AI.
    const launcher = page.getByRole("button", { name: "Ask DECHY", exact: true });
    await launcher.click();
    const panel = page.getByRole("dialog", { name: "DECHY assistant" });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Automated assistant, not a person.");
    await expect(panel).not.toContainText("DECHY AI");
    // First state: the greeting, a suggestion for this page, and four starting points.
    await expect(panel).toContainText("Tell me what you're trying to do.");
    await expect(
      panel.getByRole("button", { name: /Questions about Cloud & DevOps/ }),
    ).toBeVisible();
    await expect(
      panel.getByRole("list", { name: "Common starting points" }).getByRole("button"),
    ).toHaveCount(4);

    // Free text, answered with recommendation cards that say why.
    const input = panel.getByLabel("Your message");
    await input.fill(
      "Our warehouse team copies orders from email into a spreadsheet every day. I'm Dana from Northfield Supply.",
    );
    await input.press("Enter");
    const log = panel.getByRole("log");
    await expect(log).toContainText(/closest fit/i);
    const cards = panel.getByRole("list", { name: "Suggested pages" }).first().getByRole("link");
    await expect(cards.first()).toHaveAttribute("href", /^\/[a-z0-9/-]+\/$/);
    await expect(panel.locator(".assist-rec-why").first()).not.toBeEmpty();

    // Following a recommendation keeps the panel and the conversation.
    const href = (await cards.first().getAttribute("href"))!;
    await cards.first().click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(panel).toBeVisible();
    await expect(log).toContainText("Northfield Supply");

    // A reload restores the same conversation from the server.
    await page.reload();
    const again = page.getByRole("dialog", { name: "DECHY assistant" });
    await expect(again.getByRole("log")).toContainText("Northfield Supply");

    // Asking for a person opens a card in the thread, filled in from the conversation.
    await again.getByLabel("Your message").fill("Can someone from DECHY contact me?");
    await again.getByLabel("Your message").press("Enter");
    const card = again.locator("form.assist-card");
    await expect(card).toBeVisible();
    await expect(card.getByLabel("Name")).toHaveValue("Dana");
    await expect(card.getByLabel(/Organization/)).toHaveValue("Northfield Supply");
    await expect(card.getByLabel("Email")).toHaveValue("");
    await card.getByRole("button", { name: "Send to the team" }).click();
    await expect(card).toContainText("Please enter a valid email address.");
    await expect(card).toContainText("Please choose one.");
    await card.getByLabel("Email").fill("dana@example.test");
    await card.getByLabel("A new project").check();
    await card.getByRole("button", { name: "Send to the team" }).click();
    const sent = again.locator(".assist-sent");
    await expect(sent).toContainText("Sent to the DECHY team.");
    await expect(sent).toContainText(REF);
    await expect(sent).toContainText("A person will reply by email.");
    const ref = (await sent.textContent())!.match(REF)![0];
    await expect(again.getByRole("button", { name: "Start a new topic" })).toBeVisible();

    // The visitor can keep writing; it is added to the same request.
    await again.getByLabel("Your message").fill("We also take orders by phone.");
    await again.getByLabel("Your message").press("Enter");
    await expect(again.getByRole("log")).toContainText(`added this to your request ${ref}`);

    // Escape minimizes; the launcher gets focus back.
    await page.keyboard.press("Escape");
    await expect(again).toBeHidden();
    await expect(page.getByRole("button", { name: "Ask DECHY", exact: true })).toBeFocused();
    expect(errors, errors.join("\n")).toEqual([]);

    // The team sees the summary first, where each detail came from, and the later message.
    await signIn(page);
    await page.goto(`/admin/inbox/${ref}/`);
    const main = page.locator("main");
    await expect(main.locator(".admin-kind").first()).toHaveText("Inquiry");
    await expect(main).toContainText("AI handoff");
    await expect(main.getByRole("heading", { name: "Summary" })).toBeVisible();
    await expect(main).toContainText("copies orders from email");
    await expect(main).toContainText("Dana from the conversation");
    await expect(main).toContainText("dana@example.test entered by the visitor");
    await expect(main).toContainText("The visitor asked for a person in the conversation");
    await expect(main).toContainText("added 1 message after the handoff");
    await main.getByText("Full transcript").click();
    await expect(main.locator(".admin-transcript")).toContainText("We also take orders by phone.");
    await expect(main.locator(".admin-after").first()).toBeVisible();
    await main.getByLabel("Add a note").fill("Called back; sending a proposal.");
    await main.getByRole("button", { name: "Add note" }).click();
    await expect(page.locator(".admin-notes")).toContainText("Called back; sending a proposal.");
  });

  test("the contact page offers three paths, and the third opens the team card", async ({
    page,
  }) => {
    await page.goto("/contact/");
    // The page has its own ways in, so the floating launcher stays out of the way.
    await expect(page.locator(".assist-launcher")).toHaveCount(0);
    const paths = page.getByRole("list", { name: "Ways to reach DECHY" });
    await expect(paths.getByRole("button")).toHaveCount(2);
    await expect(paths.getByRole("link")).toHaveCount(1);
    await paths.getByRole("button", { name: /speak to someone/ }).click();
    const panel = page.getByRole("dialog", { name: "DECHY assistant" });
    const card = panel.locator("form.assist-card");
    await expect(card.getByLabel("Name")).toBeFocused();
    await expect(card).toContainText(
      "Is this about a new project or something we're already working on together?",
    );
    await card.getByLabel("Name").fill("Grace Example");
    await card.getByLabel("Email").fill("grace@example.test");
    await card.getByLabel("Something we're already working on").check();
    await card.getByRole("button", { name: "Send to the team" }).click();
    await expect(panel.locator(".assist-sent")).toContainText(REF);
  });

  test("minimizing keeps a draft, and closing keeps the conversation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ask DECHY", exact: true }).click();
    const panel = page.getByRole("dialog", { name: "DECHY assistant" });
    await panel.getByRole("button", { name: "Connect our systems" }).click();
    await expect(panel.getByRole("log")).toContainText(/fit/i);
    await panel.getByLabel("Your message").fill("a draft");
    await panel.getByRole("button", { name: "Minimize the assistant" }).click();
    await expect(panel).toBeHidden();
    await page.getByRole("button", { name: "Ask DECHY", exact: true }).click();
    await expect(panel.getByLabel("Your message")).toHaveValue("a draft");
    await panel.getByRole("button", { name: "Close the assistant" }).click();
    await page.getByRole("button", { name: "Ask DECHY", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "DECHY assistant" }).getByRole("log"),
    ).toContainText("We need our systems to work together.");
  });

  test("is accessible open, and fits every phone width without horizontal scrolling", async ({
    page,
  }) => {
    for (const width of [320, 360, 375, 390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await page.getByRole("button", { name: "Ask DECHY", exact: true }).click();
      const panel = page.getByRole("dialog", { name: "DECHY assistant" });
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("list", { name: "Common starting points" })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
      const box = (await panel.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      if (width < 640) {
        // Full screen on phones, with the input pinned to the bottom.
        expect(Math.round(box.width)).toBe(width);
        const input = (await panel.locator(".assist-input").boundingBox())!;
        expect(input.y + input.height).toBeGreaterThan(box.y + box.height - 2);
      } else {
        expect(box.width).toBeLessThanOrEqual(421);
      }
      const small = await panel.evaluate(
        (el) =>
          [...el.querySelectorAll("button, a, input, textarea")]
            .map((n) => n.getBoundingClientRect())
            .filter((r) => r.width > 0 && (r.height < 44 || r.width < 44)).length,
      );
      expect(small, `touch targets at ${width}px`).toBe(0);
      const r = await new AxeBuilder({ page }).withTags(WCAG).include("#dechy-assistant").analyze();
      expect(
        r.violations.map((v) => v.id),
        `${width}px`,
      ).toEqual([]);
      // Closed panels stay closed on the next page; an open one would reopen there.
      await panel.getByRole("button", { name: "Close the assistant" }).click();
    }
  });

  test("the assistant API streams, knows the page, and refuses cross-origin and oversized requests", async ({
    request,
  }) => {
    const ctx = await (await request.get("/api/assistant/?page=/cloud/")).json();
    expect(ctx.ai).toBe(false);
    expect(ctx.page.name).toBe("Cloud & DevOps");
    const stream = await request.post("/api/assistant/", {
      data: { message: "We chase approvals by email every day" },
      headers: { "content-type": "application/json", accept: "text/event-stream" },
    });
    expect(stream.headers()["content-type"]).toContain("text/event-stream");
    const body = await stream.text();
    expect(body).toContain("event: delta");
    expect(body).toContain("event: done");
    const cross = await request.post("/api/assistant/", {
      data: { message: "hello" },
      headers: { origin: "https://evil.example", "content-type": "application/json" },
    });
    expect(cross.status()).toBe(403);
    const big = await request.post("/api/assistant/", {
      data: { message: "x".repeat(9000) },
      headers: { "content-type": "application/json" },
    });
    expect(big.status()).toBe(413);
    const noEmail = await request.post("/api/assistant/handoff/", {
      data: { action: "confirm", name: "No Email" },
      headers: { "content-type": "application/json" },
    });
    expect(noEmail.status()).toBe(400);
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
        action: "confirm",
        via: "contact",
        name: "Inbox Check",
        email: "inbox@example.test",
        kind: "new",
        note: "Please call about a portal.",
      },
      headers: { "content-type": "application/json" },
    });
    expect(res.status()).toBe(200);
    const { ref } = (await res.json()) as { ref: string };
    expect(ref).toMatch(REF);

    await signIn(page);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.locator(".admin-stats")).toContainText("Person requested, not yet sent");
    await expect(page.locator(".admin-config")).toContainText("AI use today");
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
