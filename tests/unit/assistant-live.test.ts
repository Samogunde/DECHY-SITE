import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { faqAnswer, menuAnswer, MENU } from "@/lib/assistant/answers";
import { guidedReply } from "@/lib/assistant/engine";
import { getRegistry } from "@/lib/content/load";
import { resetMemoryLimits } from "@/lib/server/ratelimit";
import { MemoryStore, setStore } from "@/lib/server/store";
import { validWebhook, webhookSecret } from "@/lib/server/telegram";

const fact = (id: string) => getRegistry().facts.get(id)?.value ?? "";

describe("answers from the site (owner, 24 October 2026)", () => {
  it("answers the starting questions with DECHY's published prices and timelines", () => {
    const cost = menuAnswer(MENU.cost)!;
    expect(cost.reply).toContain(fact("price.summary-website"));
    expect(cost.reply).toContain(fact("price.summary-mobile-app"));
    expect(cost.links.map((l) => l.path)).toContain("/tools/cost-estimator/");
    expect(cost.suggestions).toContain("Website prices");

    const site = menuAnswer("Website prices")!;
    expect(site.reply).toContain(fact("price.web-development-landing-page"));
    expect(site.links[0]!.path).toBe("/resources/cost-guides/how-much-does-a-website-cost/");

    const time = menuAnswer("How long does it take to build a mobile app?")!;
    expect(time.reply).toMatch(/weeks/);
    expect(time.reply).toMatch(/scope is approved/);
    expect(menuAnswer(MENU.build)!.links[0]!.path).toBe("/services/");
  });

  it("quotes a question already answered on a page, with a link to it", () => {
    const a = faqAnswer("Who owns the code?")!;
    expect(a.reply).toMatch(/^You do/);
    expect(a.links[0]!.path).toMatch(/#/);
    expect(faqAnswer("what is the weather like")).toBeNull();
  });

  it("never hands a price question to a person, but offers one when it should", () => {
    const price = guidedReply("How much does an online store cost?", []);
    expect(price.offerHuman).toBe(false);
    expect(price.reply).toContain(fact("price.summary-online-store"));
    expect(price.links.length).toBeGreaterThan(0);

    expect(guidedReply("This is useless, not what I asked", []).offerHuman).toBe(true);
    expect(guidedReply("I want to make a complaint about an invoice", []).offerHuman).toBe(true);
    expect(guidedReply("Can you review our contract?", []).offerHuman).toBe(true);
    expect(guidedReply("Talk to a person", []).humanRequested).toBe(true);
  });
});

describe("live chat through Telegram", () => {
  let store: MemoryStore;
  const sent: { method: string; body: Record<string, unknown> }[] = [];
  let nextId = 100;

  beforeEach(() => {
    store = new MemoryStore();
    setStore(store);
    resetMemoryLimits();
    sent.length = 0;
    vi.stubEnv("SITE_ORIGIN", "https://site.test");
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("CONTACT_DELIVERY", "none");
    vi.stubEnv("NOTIFICATION_PROVIDER", "none");
    vi.stubEnv("NETLIFY_FORMS", "");
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:test-token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "4242");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const method = String(url).split("/").at(-1)!;
        sent.push({ method, body: JSON.parse(String(init?.body ?? "{}")) });
        return Response.json({ ok: true, result: { message_id: nextId++ } });
      }),
    );
  });
  afterEach(() => {
    setStore(null);
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const post = (url: string, body: unknown, headers: Record<string, string> = {}) =>
    new Request(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://site.test",
        host: "site.test",
        ...headers,
      },
      body: JSON.stringify(body),
    });

  it("accepts webhook calls only with the secret derived from the bot token", () => {
    expect(validWebhook(webhookSecret())).toBe(true);
    expect(validWebhook("wrong")).toBe(false);
    expect(validWebhook(null)).toBe(false);
  });

  it("posts the handed-off chat to Telegram and brings the team's reply back to the visitor", async () => {
    const assistant = await import("@/app/api/assistant/route");
    const handoff = await import("@/app/api/assistant/handoff/route");
    const conversations = await import("@/app/api/assistant/conversations/route");
    const telegram = await import("@/app/api/telegram/route");

    const r1 = await assistant.POST(
      post("https://site.test/api/assistant/", { message: "How much does a website cost?" }),
    );
    const b1 = (await r1.json()) as { conversationId: string; links: { path: string }[] };
    expect(b1.links.length).toBeGreaterThan(0);

    const h = await handoff.POST(
      post("https://site.test/api/assistant/handoff/", {
        action: "confirm",
        conversationId: b1.conversationId,
        name: "Ada Lovelace",
        email: "ada@example.test",
        kind: "new",
      }),
    );
    const hb = (await h.json()) as { ok: boolean; ref: string; live: boolean };
    expect(hb.ok).toBe(true);
    expect(hb.live).toBe(true);
    const opening = sent.find((s) => String(s.body.text ?? "").startsWith("Live chat"));
    expect(opening?.body.text).toContain(hb.ref);
    expect(opening?.body.text).toContain("How much does a website cost?");

    // After the handoff, the visitor's messages go to the team, with no automated reply.
    const r2 = await assistant.POST(
      post("https://site.test/api/assistant/", {
        conversationId: b1.conversationId,
        message: "Can we start next month?",
      }),
    );
    const b2 = (await r2.json()) as { forwarded: boolean; reply: string };
    expect(b2.forwarded).toBe(true);
    expect(b2.reply).toBe("");
    const forwardedAt = sent.findIndex((s) =>
      String(s.body.text).includes("Can we start next month?"),
    );
    expect(forwardedAt).toBeGreaterThanOrEqual(0);
    const forwardedId = 100 + forwardedAt;

    // A reply without the secret is refused; with it, the reply reaches the conversation.
    const update = {
      message: {
        message_id: 999,
        chat: { id: 4242 },
        text: "Yes, next month works. Sam",
        reply_to_message: { message_id: forwardedId },
      },
    };
    expect((await telegram.POST(post("https://site.test/api/telegram/", update))).status).toBe(401);
    const ok = await telegram.POST(
      post("https://site.test/api/telegram/", update, {
        "x-telegram-bot-api-secret-token": webhookSecret(),
      }),
    );
    expect(ok.status).toBe(200);
    // Another chat cannot write into a conversation.
    await telegram.POST(
      post(
        "https://site.test/api/telegram/",
        { message: { ...update.message, chat: { id: 1 }, text: "spoof" } },
        { "x-telegram-bot-api-secret-token": webhookSecret() },
      ),
    );

    const poll = await conversations.POST(
      post("https://site.test/api/assistant/conversations/", {
        action: "poll",
        conversationId: b1.conversationId,
        after: new Date(0).toISOString(),
      }),
    );
    const pb = (await poll.json()) as { replies: { text: string }[] };
    expect(pb.replies.map((r) => r.text)).toEqual(["Yes, next month works. Sam"]);
  });
});
