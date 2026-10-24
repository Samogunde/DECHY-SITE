/**
 * Two-step sign-in for DECHY Admin (owner, 24 October 2026): a six-digit code from an
 * authenticator app (RFC 6238 TOTP: SHA-1, 30-second steps), checked after the password.
 *
 * The owner turns it on inside DECHY Admin (Security): the server creates the secret, shows it once
 * as a QR code, and keeps it in private storage, so it never passes through anyone else. A secret
 * in ADMIN_TOTP_SECRET (from `npm run admin:totp`) is used instead when set. ADMIN_2FA_RESET=1
 * switches the stored one off for a phone that is lost: sign in, set it up again, remove the variable.
 *
 * One step either side is accepted for clock drift, and a code that has been used cannot be used
 * again (the last accepted step is kept in storage). Server-only.
 */
import crypto from "node:crypto";
import type { Store } from "./store";

type Env = Record<string, string | undefined>;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const i = ALPHABET.indexOf(ch);
    if (i < 0) throw new Error("Invalid base32 secret");
    value = (value << 5) | i;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/** The six-digit code for one 30-second step. */
export function totpAt(secret: Buffer, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const mac = crypto.createHmac("sha1", secret).update(counter).digest();
  const offset = mac[mac.length - 1]! & 15;
  const bin = (mac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return bin.toString().padStart(6, "0");
}

const STORED = "admin/totp";
const PENDING = "admin/totp-pending";

type StoredTotp = { secret: string; enabledAt: string };

/** The active secret: the environment's, else the one turned on in DECHY Admin, else none. */
export async function activeTotpSecret(store: Store | null, env: Env = process.env) {
  const fromEnv = env.ADMIN_TOTP_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (!store || store.kind === "none" || env.ADMIN_2FA_RESET === "1") return null;
  const rec = await store.get<StoredTotp>(STORED).catch(() => null);
  return rec?.secret ?? null;
}

export async function totpRequired(store: Store | null, env: Env = process.env) {
  return (await activeTotpSecret(store, env)) !== null;
}

/** Starts setup: a new secret kept as pending until the owner proves the app has it. */
export async function beginTotpSetup(store: Store, account: string) {
  const fresh = newTotpSecret(account);
  await store.set(PENDING, { secret: fresh.secret, createdAt: new Date().toISOString() });
  return fresh;
}

export async function pendingTotp(store: Store, account: string) {
  const p = await store.get<{ secret: string }>(PENDING).catch(() => null);
  return p ? { secret: p.secret, uri: totpUri(p.secret, account) } : null;
}

/** Finishes setup when the code matches the pending secret. */
export async function confirmTotpSetup(store: Store, code: string, now = Date.now()) {
  const p = await store.get<{ secret: string }>(PENDING).catch(() => null);
  if (!p || matchTotp(code, { ADMIN_TOTP_SECRET: p.secret }, now) === null) return false;
  await store.set(STORED, { secret: p.secret, enabledAt: new Date(now).toISOString() });
  await store.delete(PENDING);
  return true;
}

export async function disableTotp(store: Store) {
  await store.delete(STORED);
  await store.delete(PENDING);
}

/**
 * The step the code matches (current, previous, or next), or null. The caller rejects a step at or
 * before the last one accepted, so a code cannot be replayed.
 */
export function matchTotp(code: string, env: Env = process.env, now = Date.now()): number | null {
  const raw = env.ADMIN_TOTP_SECRET?.trim();
  if (!raw || !/^\d{6}$/.test(code)) return null;
  let secret: Buffer;
  try {
    secret = base32Decode(raw);
  } catch {
    return null;
  }
  const step = Math.floor(now / 30_000);
  for (const s of [step, step - 1, step + 1]) {
    const expected = Buffer.from(totpAt(secret, s));
    if (crypto.timingSafeEqual(expected, Buffer.from(code))) return s;
  }
  return null;
}

export function totpUri(secret: string, account: string) {
  const label = encodeURIComponent(`DECHY Admin:${account}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=DECHY%20Admin&algorithm=SHA1&digits=6&period=30`;
}

/** A new secret and the link an authenticator app reads (enter the secret by hand, or as a QR). */
export function newTotpSecret(account: string): { secret: string; uri: string } {
  const secret = base32Encode(crypto.randomBytes(20));
  return { secret, uri: totpUri(secret, account) };
}
