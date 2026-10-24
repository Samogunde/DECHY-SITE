import { describe, expect, it, vi } from "vitest";
import { MemoryStore } from "../../src/lib/server/store";
import {
  base32Decode,
  base32Encode,
  matchTotp,
  newTotpSecret,
  totpAt,
} from "../../src/lib/server/totp";
import {
  listSubscriptions,
  saveSubscription,
  sendPush,
  validSubscription,
} from "../../src/lib/server/push";

// DECHY Admin as an installable app (owner, 24 October 2026): two-step sign-in and phone alerts.

describe("two-step sign-in", () => {
  it("matches the RFC 6238 reference codes", () => {
    const secret = Buffer.from("12345678901234567890");
    expect(totpAt(secret, Math.floor(59 / 30))).toBe("287082");
    expect(totpAt(secret, Math.floor(1111111109 / 30))).toBe("081804");
    expect(totpAt(secret, Math.floor(1234567890 / 30))).toBe("005924");
  });

  it("round-trips base32 secrets", () => {
    const buf = Buffer.from("12345678901234567890");
    expect(base32Encode(buf)).toBe("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
    expect(base32Decode("gezd gnbv gy3t qojq gezd gnbv gy3t qojq").equals(buf)).toBe(true);
  });

  it("accepts the current code and one step of drift, nothing else", () => {
    const { secret, uri } = newTotpSecret("owner@example.org");
    expect(uri).toContain("otpauth://totp/DECHY%20Admin");
    const env = { ADMIN_TOTP_SECRET: secret };
    const now = 1_800_000_000_000;
    const step = Math.floor(now / 30_000);
    const code = (s: number) => totpAt(base32Decode(secret), s);
    expect(matchTotp(code(step), env, now)).toBe(step);
    expect(matchTotp(code(step - 1), env, now)).toBe(step - 1);
    expect(matchTotp(code(step - 3), env, now)).toBeNull();
    expect(matchTotp("12345", env, now)).toBeNull();
    expect(matchTotp(code(step), {}, now)).toBeNull();
  });
});

describe("phone alerts (web push)", () => {
  const sub = (n: number) => ({
    endpoint: `https://push.example.org/send/${n}`,
    keys: { p256dh: "BNc".padEnd(87, "x"), auth: "a".repeat(22) },
  });
  const env = { VAPID_PUBLIC_KEY: "pub", VAPID_PRIVATE_KEY: "priv" };

  it("accepts only https subscriptions with keys", () => {
    expect(validSubscription(sub(1))).toBe(true);
    expect(validSubscription({ ...sub(1), endpoint: "http://x" })).toBe(false);
    expect(validSubscription({ endpoint: "https://x" })).toBe(false);
  });

  it("sends to every device and forgets one the push service says is gone", async () => {
    const store = new MemoryStore();
    await saveSubscription(store, sub(1), "Android");
    await saveSubscription(store, sub(2), "iPhone");
    const send = vi.fn(async (s: { endpoint: string }) => {
      if (s.endpoint.endsWith("/2")) throw Object.assign(new Error("gone"), { statusCode: 410 });
      return {} as never;
    });
    const r = await sendPush(
      store,
      { title: "New quote request", body: "Ada, /contact/", url: "/admin/" },
      env,
      send as never,
    );
    expect(r).toEqual({ sent: 1, removed: 1 });
    expect((await listSubscriptions(store)).map((s) => s.device)).toEqual(["Android"]);
    const payload = JSON.parse(String((send.mock.calls[0] as unknown as [unknown, string])[1]));
    expect(payload).toEqual({ title: "New quote request", body: "Ada, /contact/", url: "/admin/" });
  });

  it("does nothing until the keys are set", async () => {
    const store = new MemoryStore();
    await saveSubscription(store, sub(1), "Android");
    const send = vi.fn();
    expect(await sendPush(store, { title: "x", body: "y", url: "/admin/" }, {}, send)).toEqual({
      sent: 0,
      removed: 0,
    });
    expect(send).not.toHaveBeenCalled();
  });
});

describe("setup without copying secrets (owner, 24 October 2026)", () => {
  it("turns two-step sign-in on only with a code from the new secret", async () => {
    const { beginTotpSetup, confirmTotpSetup, totpRequired, activeTotpSecret } =
      await import("../../src/lib/server/totp");
    const store = new MemoryStore();
    expect(await totpRequired(store, {})).toBe(false);
    const { secret } = await beginTotpSetup(store, "owner@example.org");
    const now = 1_800_000_000_000;
    expect(await confirmTotpSetup(store, "000000", now)).toBe(false);
    const good = totpAt(base32Decode(secret), Math.floor(now / 30_000));
    expect(await confirmTotpSetup(store, good, now)).toBe(true);
    expect(await activeTotpSecret(store, {})).toBe(secret);
    expect(await totpRequired(store, { ADMIN_2FA_RESET: "1" })).toBe(false);
  });

  it("creates the push keys once and keeps them", async () => {
    const { vapidKeys } = await import("../../src/lib/server/push");
    const store = new MemoryStore();
    expect(await vapidKeys(store, {})).toBeNull();
    const made = await vapidKeys(store, {}, true);
    expect(made?.publicKey).toMatch(/^[A-Za-z0-9_-]{80,}$/);
    expect(await vapidKeys(store, {})).toEqual(made);
  });

  it("signs in with a password hash made in the browser (PBKDF2)", async () => {
    const crypto = await import("node:crypto");
    const { verifyPassword } = await import("../../src/lib/server/auth");
    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync("correct horse battery", salt, 600_000, 32, "sha256");
    const stored = `pbkdf2:sha256:600000:${salt.toString("base64")}:${hash.toString("base64")}`;
    expect(verifyPassword("correct horse battery", stored)).toBe(true);
    expect(verifyPassword("wrong password here", stored)).toBe(false);
    expect(verifyPassword("x", "pbkdf2:sha256:10:AAAA:AAAA")).toBe(false);
  });
});
