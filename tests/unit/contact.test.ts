import { beforeEach, describe, expect, it, vi } from "vitest";
import { deliver } from "@/lib/contact/deliver";
import {
  clientKey,
  handleContact,
  resetRateLimit,
  sameOrigin,
  type HandlerDeps,
} from "@/lib/contact/handler";
import { validateContact } from "@/lib/contact/validate";

const good = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  organization: "Analytical Engines",
  interest: "Software Development",
  timeline: "asap",
  message: "We need a portal for our customers to track orders and invoices.",
  website: "",
  startedAt: 1_000,
};

const req = (body: unknown, headers: Record<string, string> = {}) => ({
  headers: new Headers({
    "content-type": "application/json",
    host: "site.test",
    origin: "https://site.test",
    ...headers,
  }),
  text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
});

const origin = "https://site.test";

beforeEach(() => resetRateLimit());

describe("contact validation", () => {
  it("accepts a good submission", () => {
    expect(validateContact(good).ok).toBe(true);
  });
  it("reports field errors", () => {
    const r = validateContact({ ...good, name: "A", email: "nope", message: "short" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
  });
  it("caps lengths", () => {
    expect(validateContact({ ...good, message: "x".repeat(4001) }).ok).toBe(false);
  });
});

describe("contact handler policy", () => {
  const okDeliver = vi.fn(async () => ({ ok: true as const }));
  const deps = (deliverImpl: HandlerDeps["deliver"] = okDeliver): HandlerDeps => ({
    now: () => 10_000,
    deliver: deliverImpl,
  });

  it("delivers a valid submission", async () => {
    okDeliver.mockClear();
    const res = await handleContact(req(good), origin, deps());
    expect(res.status).toBe(200);
    expect(okDeliver).toHaveBeenCalledOnce();
  });

  it("rejects non-JSON content types", async () => {
    const res = await handleContact(req(good, { "content-type": "text/plain" }), origin, deps());
    expect(res.status).toBe(415);
  });

  it("rejects cross-origin posts", async () => {
    const res = await handleContact(req(good, { origin: "https://evil.test" }), origin, deps());
    expect(res.status).toBe(403);
    expect(
      sameOrigin(new Headers({ origin: "https://site.test", host: "site.test" }), origin),
    ).toBe(true);
    expect(sameOrigin(new Headers({ origin: "not a url", host: "site.test" }), origin)).toBe(false);
  });

  it("rejects oversized and malformed bodies", async () => {
    expect((await handleContact(req("x".repeat(20_000)), origin, deps())).status).toBe(413);
    expect((await handleContact(req("{not json"), origin, deps())).status).toBe(400);
  });

  it("returns field errors for invalid input", async () => {
    const res = await handleContact(req({ ...good, email: "bad" }), origin, deps());
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ ok: false, code: "invalid" });
  });

  it("swallows honeypot submissions without delivering", async () => {
    okDeliver.mockClear();
    const res = await handleContact(req({ ...good, website: "http://spam.test" }), origin, deps());
    // Bots learn nothing: it looks like success, but nothing is delivered.
    expect(res.status).toBe(200);
    expect(okDeliver).not.toHaveBeenCalled();
  });

  it("rejects instant submissions", async () => {
    const res = await handleContact(req({ ...good, startedAt: 9_000 }), origin, deps());
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ code: "too_fast" });
  });

  it("rate limits repeated attempts from one client", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++)
      statuses.push(
        (await handleContact(req(good, { "x-forwarded-for": "203.0.113.9" }), origin, deps()))
          .status,
      );
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(5)).toEqual([429, 429]);
    expect(clientKey(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });

  it("reports an honest 503 when no destination is configured, and 502 on delivery failure", async () => {
    const unconfigured = await handleContact(
      req(good),
      origin,
      deps(async () => ({ ok: false as const, reason: "unconfigured" as const })),
    );
    expect(unconfigured.status).toBe(503);
    resetRateLimit();
    const failed = await handleContact(
      req(good),
      origin,
      deps(async () => ({ ok: false as const, reason: "failed" as const })),
    );
    expect(failed.status).toBe(502);
  });
});

describe("delivery adapters", () => {
  const data = validateContact(good).ok
    ? (validateContact(good) as { ok: true; data: Parameters<typeof deliver>[0] }).data
    : (undefined as never);

  it("defaults to unconfigured: no invented destination", async () => {
    expect(await deliver(data, {})).toEqual({ ok: false, reason: "unconfigured" });
    expect(await deliver(data, { CONTACT_DELIVERY: "webhook" })).toEqual({
      ok: false,
      reason: "unconfigured",
    });
    expect(await deliver(data, { CONTACT_DELIVERY: "resend", RESEND_API_KEY: "k" })).toEqual({
      ok: false,
      reason: "unconfigured",
    });
  });

  it("log mode never writes the message body or email address", async () => {
    const lines: string[] = [];
    const r = await deliver(data, { CONTACT_DELIVERY: "log" }, fetch, (l) => lines.push(l));
    expect(r.ok).toBe(true);
    expect(lines.join(" ")).not.toContain("ada@example.org");
    expect(lines.join(" ")).not.toContain("customers to track");
  });

  it("posts JSON to a configured webhook with the shared secret header", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    const r = await deliver(
      data,
      {
        CONTACT_DELIVERY: "webhook",
        CONTACT_WEBHOOK_URL: "https://hooks.test/x",
        CONTACT_WEBHOOK_SECRET: "s3",
      },
      f as never,
    );
    expect(r.ok).toBe(true);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://hooks.test/x");
    expect((init.headers as Record<string, string>)["x-webhook-secret"]).toBe("s3");
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: "Ada Lovelace",
      source: "dechy-site-contact",
    });
  });

  it("sends email through Resend with a sanitized subject and reply-to", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    const nasty = { ...data, name: "Ada\r\nBcc: attacker@evil.test" };
    const r = await deliver(
      nasty,
      {
        CONTACT_DELIVERY: "resend",
        RESEND_API_KEY: "key",
        CONTACT_TO_EMAIL: "to@example.test",
        CONTACT_FROM_EMAIL: "from@example.test",
      },
      f as never,
    );
    expect(r.ok).toBe(true);
    const [, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(init.body as string) as {
      subject: string;
      to: string[];
      reply_to: string;
    };
    expect(body.subject).not.toMatch(/[\r\n]/);
    expect(body.to).toEqual(["to@example.test"]);
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer key");
  });

  it("reports failure when the provider errors or times out", async () => {
    const down = vi.fn(async () => new Response("no", { status: 500 }));
    expect(
      await deliver(
        data,
        { CONTACT_DELIVERY: "webhook", CONTACT_WEBHOOK_URL: "https://hooks.test/x" },
        down as never,
      ),
    ).toEqual({ ok: false, reason: "failed" });
    const boom = vi.fn(async () => {
      throw new Error("network");
    });
    expect(
      await deliver(
        data,
        { CONTACT_DELIVERY: "webhook", CONTACT_WEBHOOK_URL: "https://hooks.test/x" },
        boom as never,
      ),
    ).toEqual({ ok: false, reason: "failed" });
  });
});
