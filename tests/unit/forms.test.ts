import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { formsSkeleton } from "../../src/lib/contact/forms-skeleton";
import { handleContact, resetRateLimit } from "../../src/lib/contact/handler";
import {
  NETLIFY_FORMS,
  forwardToNetlify,
  leadFields,
  netlifyFormsOn,
} from "../../src/lib/contact/netlify-forms";
import { handleNewsletter } from "../../src/lib/contact/newsletter";
import { validateContact } from "../../src/lib/contact/validate";

// Forms, the Netlify Forms copy, and the newsletter (owner, 24 October 2026).

const req = (body: unknown, headers: Record<string, string> = {}) => ({
  headers: new Headers({
    "content-type": "application/json",
    "x-nf-client-connection-ip": `10.0.0.${Math.floor(Math.random() * 250)}`,
    ...headers,
  }),
  text: async () => JSON.stringify(body),
});

const lead = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  interest: "Web Development",
  message: "We need a new booking website for three clinics.",
  startedAt: 1,
  form: "quote",
  source: { utm_source: "google", utm_medium: "cpc", landing_page: "/web-development/" },
};

describe("Netlify Forms copy", () => {
  it("keeps public/__forms.html in step with the form definitions", () => {
    expect(readFileSync("public/__forms.html", "utf8")).toBe(formsSkeleton());
  });

  it("gives every form a different name and its own subject", () => {
    const forms = Object.values(NETLIFY_FORMS);
    expect(new Set(forms.map((f) => f.name)).size).toBe(forms.length);
    expect(new Set(forms.map((f) => f.subject)).size).toBe(forms.length);
    for (const f of forms) expect(f.fields).toContain("email");
  });

  it("posts URL-encoded fields to the skeleton file, only when switched on", async () => {
    const fetchImpl = vi.fn(async () => new Response("ok"));
    const data = validateContact(lead);
    if (!data.ok) throw new Error("lead should be valid");
    const fields = leadFields(data.data, "DCH-1234");

    expect(await forwardToNetlify("quote", fields, {}, fetchImpl)).toEqual({
      ok: false,
      skipped: true,
    });
    expect(fetchImpl).not.toHaveBeenCalled();

    const env = { NETLIFY_FORMS: "on", URL: "https://dechy-site.netlify.app" };
    expect(netlifyFormsOn(env)).toBe(true);
    expect((await forwardToNetlify("quote", fields, env, fetchImpl)).ok).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://dechy-site.netlify.app/__forms.html");
    const body = new URLSearchParams(String(init.body));
    expect(body.get("form-name")).toBe("quote");
    expect(body.get("subject")).toBe("DECHY website: new quote request");
    expect(body.get("email")).toBe("ada@example.org");
    expect(body.get("reference")).toBe("DCH-1234");
    expect(body.get("utm_source")).toBe("google");
    expect(body.get("landing_page")).toBe("/web-development/");
  });

  it("never fails a lead when the copy fails", async () => {
    const env = { NETLIFY_FORMS: "on", URL: "https://dechy-site.netlify.app" };
    const res = await forwardToNetlify(
      "contact",
      {},
      env,
      async () => {
        throw new Error("network");
      },
      () => {},
    );
    expect(res.ok).toBe(false);
  });
});

describe("contact handler with the Netlify copy", () => {
  it("succeeds through the Netlify copy alone and passes the form and source", async () => {
    resetRateLimit();
    const forward = vi.fn(async () => ({ ok: true }));
    const res = await handleContact(req(lead), "http://localhost:4310", {
      now: () => 10_000,
      deliver: async () => ({ ok: false, reason: "unconfigured" }),
      forward,
    });
    expect(res.status).toBe(200);
    const [data] = forward.mock.calls[0] as unknown as [{ form: string; source: object }];
    expect(data.form).toBe("quote");
    expect(data.source).toMatchObject({ utm_source: "google" });
  });

  it("answers the shared rate limit before reading the body", async () => {
    resetRateLimit();
    const res = await handleContact(req(lead), "http://localhost:4310", {
      now: () => 10_000,
      deliver: async () => ({ ok: true }),
      overLimit: async () => true,
    });
    expect(res.status).toBe(429);
  });

  it("defaults to the contact form when no form is named", () => {
    const r = validateContact({ ...lead, form: undefined });
    expect(r.ok && r.data.form).toBe("contact");
  });
});

describe("newsletter signup", () => {
  const deps = (over: Partial<Parameters<typeof handleNewsletter>[2]> = {}) => ({
    now: () => 10_000,
    overLimit: async () => false,
    save: vi.fn(async () => true as boolean | null),
    forward: vi.fn(async () => ({ ok: true })),
    ...over,
  });

  it("saves a new address and copies it to Netlify Forms", async () => {
    const d = deps();
    const res = await handleNewsletter(
      req({ email: "reader@example.org", startedAt: 1 }),
      "http://x",
      d,
    );
    expect(res.status).toBe(200);
    expect(d.save).toHaveBeenCalled();
    expect(d.forward).toHaveBeenCalled();
  });

  it("answers a repeat signup the same way without copying it again", async () => {
    const d = deps({ save: vi.fn(async () => false) });
    const res = await handleNewsletter(
      req({ email: "reader@example.org", startedAt: 1 }),
      "http://x",
      d,
    );
    expect(res.status).toBe(200);
    expect(d.forward).not.toHaveBeenCalled();
  });

  it("drops bots quietly and rejects instant or invalid submissions", async () => {
    const d = deps();
    const bot = await handleNewsletter(
      req({ email: "a@b.co", website: "x", startedAt: 1 }),
      "http://x",
      d,
    );
    expect(bot.status).toBe(200);
    expect(d.save).not.toHaveBeenCalled();
    expect(
      (await handleNewsletter(req({ email: "a@b.co", startedAt: 9_000 }), "http://x", d)).status,
    ).toBe(400);
    expect(
      (await handleNewsletter(req({ email: "not-an-email", startedAt: 1 }), "http://x", d)).status,
    ).toBe(400);
    expect(
      (
        await handleNewsletter(req({ email: "a@b.co", startedAt: 1 }), "http://x", {
          ...d,
          overLimit: async () => true,
        })
      ).status,
    ).toBe(429);
  });
});
