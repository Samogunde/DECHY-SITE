/**
 * Rate limiting for public endpoints. Two layers: an in-process window (fast, per instance) and a
 * store-backed window (shared across serverless instances). Client addresses are never stored:
 * keys are salted SHA-256 hashes (RATE_LIMIT_SALT), and the stored entry holds only timestamps.
 * Server-only.
 */
import crypto from "node:crypto";
import type { Store } from "./store";

type Env = Record<string, string | undefined>;

export function clientAddress(headers: Headers): string {
  return (
    headers.get("x-nf-client-connection-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function hashKey(value: string, env: Env = process.env): string {
  const salt = env.RATE_LIMIT_SALT?.trim() || "dechy-rate-limit";
  return crypto.createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 40);
}

const memory = new Map<string, number[]>();

export function resetMemoryLimits() {
  memory.clear();
}

/**
 * True when the caller is over the limit for this scope. Records the attempt otherwise. The
 * store layer is best effort: if storage is unavailable the in-memory layer still applies.
 */
export async function overLimit(
  store: Store | null,
  scope: string,
  client: string,
  max: number,
  windowMs: number,
  now = Date.now(),
): Promise<boolean> {
  const key = `${scope}:${hashKey(client)}`;
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    memory.set(key, recent);
    return true;
  }
  recent.push(now);
  memory.set(key, recent);

  if (!store || store.kind === "none") return false;
  try {
    const skey = `ratelimit/${scope}/${hashKey(client)}`;
    const hits = ((await store.get<number[]>(skey)) ?? []).filter((t) => now - t < windowMs);
    if (hits.length >= max) return true;
    hits.push(now);
    await store.set(skey, hits.slice(-max));
  } catch {
    // storage problems never block a visitor; the memory layer has already counted them
  }
  return false;
}

/** True when the caller is already over the limit; records nothing (pair with overLimit on failure). */
export async function peekLimit(
  store: Store | null,
  scope: string,
  client: string,
  max: number,
  windowMs: number,
  now = Date.now(),
): Promise<boolean> {
  const key = `${scope}:${hashKey(client)}`;
  if ((memory.get(key) ?? []).filter((t) => now - t < windowMs).length >= max) return true;
  if (!store || store.kind === "none") return false;
  try {
    const hits = (await store.get<number[]>(`ratelimit/${scope}/${hashKey(client)}`)) ?? [];
    return hits.filter((t) => now - t < windowMs).length >= max;
  } catch {
    return false;
  }
}
