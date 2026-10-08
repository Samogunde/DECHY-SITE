/**
 * Retention enforcement. Runs on a schedule (a daily Netlify scheduled function calls
 * /api/maintenance with MAINTENANCE_SECRET) and opportunistically at most every few hours when the
 * site is used, so the documented retention holds even if the schedule is not configured.
 *
 *   Conversations      CONVERSATION_RETENTION_DAYS (default 90), unless handed to the team, in which
 *                      case they live as long as the record they belong to
 *   Activity log       ACTIVITY_RETENTION_DAYS (default 365)
 *   Rate-limit entries removed once older than a day
 *   AI usage counters  kept 90 days
 *
 * Inquiries, support requests, and contacts are kept until deleted in DECHY Admin. Server-only.
 */
import type { Conversation } from "./records";
import { retentionDays } from "./records";
import type { Store } from "./store";

type Env = Record<string, string | undefined>;

export function activityRetentionDays(env: Env = process.env): number {
  const n = Number(env.ACTIVITY_RETENTION_DAYS ?? "365");
  return Number.isFinite(n) && n >= 30 && n <= 3650 ? Math.floor(n) : 365;
}

export type MaintenanceReport = {
  conversations: number;
  activity: number;
  rateLimits: number;
  usage: number;
};

export async function runMaintenance(
  store: Store,
  now = Date.now(),
  env: Env = process.env,
): Promise<MaintenanceReport> {
  const report: MaintenanceReport = { conversations: 0, activity: 0, rateLimits: 0, usage: 0 };
  const iso = new Date(now).toISOString();

  for (const key of await store.list("conversation/")) {
    const c = await store.get<Conversation>(key);
    if (!c) continue;
    const linked = c.status === "escalated" || Boolean(c.supportRef);
    const expiry =
      c.expiresAt ??
      new Date(Date.parse(c.createdAt) + retentionDays(env) * 86_400_000).toISOString();
    if (!linked && expiry < iso) {
      await store.delete(key);
      report.conversations++;
    }
  }

  const activityCutoff = new Date(now - activityRetentionDays(env) * 86_400_000)
    .toISOString()
    .replace(/[^0-9]/g, "");
  for (const key of await store.list("activity/")) {
    const stamp = key.slice("activity/".length).split("-")[0] ?? "";
    if (stamp && stamp < activityCutoff) {
      await store.delete(key);
      report.activity++;
    }
  }

  for (const key of await store.list("ratelimit/")) {
    const hits = (await store.get<number[]>(key)) ?? [];
    if (hits.every((t) => now - t > 86_400_000)) {
      await store.delete(key);
      report.rateLimits++;
    }
  }

  const usageCutoff = new Date(now - 90 * 86_400_000).toISOString().slice(0, 10);
  for (const key of await store.list("usage/ai/")) {
    if (key.slice("usage/ai/".length) < usageCutoff) {
      await store.delete(key);
      report.usage++;
    }
  }

  await store.set("maintenance/last", { at: iso, report });
  return report;
}

/** Runs maintenance if it has not run in the last six hours. Never throws. */
export async function maybeMaintain(store: Store, now = Date.now()): Promise<void> {
  if (store.kind === "none") return;
  try {
    const last = await store.get<{ at: string }>("maintenance/last");
    if (last && now - Date.parse(last.at) < 6 * 3_600_000) return;
    await runMaintenance(store, now);
  } catch {
    // retention is retried on the next run
  }
}
