import { describe, expect, it } from "vitest";
import { aiAllowed, limits, recordUsage, todayUsage } from "@/lib/server/ai-budget";
import { activityRetentionDays, maybeMaintain, runMaintenance } from "@/lib/server/maintenance";
import { overLimit } from "@/lib/server/ratelimit";
import { Repo } from "@/lib/server/records";
import { MemoryStore } from "@/lib/server/store";

const DAY = 86_400_000;
const NOW = Date.parse("2026-10-07T12:00:00Z");

describe("AI cost limits", () => {
  it("reads limits from configuration, with safe defaults", () => {
    expect(limits({})).toEqual({ calls: 500, outputTokens: 300_000, perVisitor: 40 });
    expect(limits({ AI_DAILY_CALL_LIMIT: "10", AI_VISITOR_DAILY_LIMIT: "2" })).toMatchObject({
      calls: 10,
      perVisitor: 2,
    });
    expect(limits({ AI_DAILY_CALL_LIMIT: "-4" }).calls).toBe(500);
  });

  it("stops AI answers when the site budget is spent, and tells the team once", async () => {
    const store = new MemoryStore();
    const env = { AI_DAILY_CALL_LIMIT: "2" };
    expect(await aiAllowed(store, "203.0.113.1", env, NOW)).toBe(true);
    await recordUsage(store, "203.0.113.1", { input: 100, output: 50 }, env, NOW);
    await recordUsage(store, "203.0.113.2", { input: 100, output: 50 }, env, NOW);
    expect(await todayUsage(store, NOW)).toMatchObject({
      calls: 2,
      inputTokens: 200,
      outputTokens: 100,
    });
    expect(await aiAllowed(store, "198.51.100.9", env, NOW)).toBe(false);
    expect(await aiAllowed(store, "198.51.100.9", env, NOW)).toBe(false);
    const budget = (await new Repo(store).listActivity()).filter(
      (a) => a.type === "ai.budget_reached",
    );
    expect(budget).toHaveLength(1);
    // A new day starts a new budget.
    expect(await aiAllowed(store, "198.51.100.9", env, NOW + DAY)).toBe(true);
  });

  it("limits each visitor's AI answers per day without blocking anyone else", async () => {
    const store = new MemoryStore();
    const env = { AI_VISITOR_DAILY_LIMIT: "2" };
    await recordUsage(store, "203.0.113.7", { input: 1, output: 1 }, env, NOW);
    await recordUsage(store, "203.0.113.7", { input: 1, output: 1 }, env, NOW);
    expect(await aiAllowed(store, "203.0.113.7", env, NOW)).toBe(false);
    expect(await aiAllowed(store, "203.0.113.8", env, NOW)).toBe(true);
  });

  it("stores usage without any personal data", async () => {
    const store = new MemoryStore();
    await recordUsage(store, "203.0.113.7", { input: 1, output: 1 }, {}, NOW);
    const keys = await store.list("");
    expect(keys.join(" ")).not.toContain("203.0.113.7");
    expect(JSON.stringify(await store.get("usage/ai/2026-10-07"))).not.toContain("203.0.113.7");
  });
});

describe("retention", () => {
  it("deletes expired conversations unless they were handed to the team", async () => {
    const store = new MemoryStore();
    const old = new Repo(store, () => new Date(NOW - 100 * DAY));
    const expired = await old.createConversation("guided", "/cloud/");
    const handed = await old.createConversation("guided", "/cloud/");
    handed.status = "escalated";
    handed.supportRef = "DECHY-ABC234";
    await store.set(`conversation/${handed.id}`, handed);
    const fresh = await new Repo(store, () => new Date(NOW)).createConversation("ai", "/");
    const report = await runMaintenance(store, NOW, {});
    expect(report.conversations).toBe(1);
    expect(await store.get(`conversation/${expired.id}`)).toBeNull();
    expect(await store.get(`conversation/${handed.id}`)).not.toBeNull();
    expect(await store.get(`conversation/${fresh.id}`)).not.toBeNull();
  });

  it("trims the activity log, rate-limit entries, and old usage counters", async () => {
    const store = new MemoryStore();
    await new Repo(store, () => new Date(NOW - 400 * DAY)).logActivity({
      type: "inquiry.created",
      ref: null,
      summary: "old",
      actor: "system",
    });
    await new Repo(store, () => new Date(NOW - DAY)).logActivity({
      type: "inquiry.created",
      ref: null,
      summary: "recent",
      actor: "system",
    });
    await overLimit(store, "assistant", "203.0.113.1", 30, 600_000, NOW - 2 * DAY);
    await overLimit(store, "assistant", "203.0.113.2", 30, 600_000, NOW - 60_000);
    await store.set("usage/ai/2026-01-01", { calls: 1, inputTokens: 1, outputTokens: 1 });
    await store.set("usage/ai/2026-10-06", { calls: 1, inputTokens: 1, outputTokens: 1 });
    const report = await runMaintenance(store, NOW, {});
    expect(report).toMatchObject({ activity: 1, rateLimits: 1, usage: 1 });
    const left = await new Repo(store).listActivity();
    expect(left.map((a) => a.summary)).toEqual(["recent"]);
    expect(await store.get("usage/ai/2026-10-06")).not.toBeNull();
    expect(activityRetentionDays({ ACTIVITY_RETENTION_DAYS: "5" })).toBe(365);
    expect(activityRetentionDays({ ACTIVITY_RETENTION_DAYS: "90" })).toBe(90);
  });

  it("runs lazily at most every six hours", async () => {
    const store = new MemoryStore();
    await maybeMaintain(store, NOW);
    const first = await store.get<{ at: string }>("maintenance/last");
    await maybeMaintain(store, NOW + 3_600_000);
    expect((await store.get<{ at: string }>("maintenance/last"))?.at).toBe(first?.at);
    await maybeMaintain(store, NOW + 7 * 3_600_000);
    expect((await store.get<{ at: string }>("maintenance/last"))?.at).not.toBe(first?.at);
  });

  it("only runs the scheduled endpoint with the shared secret", async () => {
    const { POST } = await import("@/app/api/maintenance/route");
    const secret = "s".repeat(40);
    process.env.MAINTENANCE_SECRET = secret;
    try {
      const no = await POST(new Request("https://site.test/api/maintenance/", { method: "POST" }));
      expect(no.status).toBe(401);
      const wrong = await POST(
        new Request("https://site.test/api/maintenance/", {
          method: "POST",
          headers: { "x-dechy-maintenance-secret": "t".repeat(40) },
        }),
      );
      expect(wrong.status).toBe(401);
    } finally {
      delete process.env.MAINTENANCE_SECRET;
    }
  });
});
