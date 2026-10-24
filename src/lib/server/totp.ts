/**
 * Two-step sign-in for DECHY Admin (owner, 24 October 2026): a six-digit code from an
 * authenticator app (RFC 6238 TOTP: SHA-1, 30-second steps), checked after the password.
 *
 *   ADMIN_TOTP_SECRET   base32 secret from `npm run admin:totp`; when set, the code is required
 *
 * One step either side is accepted for clock drift, and a code that has been used cannot be used
 * again (the last accepted step is kept in storage). Server-only.
 */
import crypto from "node:crypto";

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

export function totpRequired(env: Env = process.env): boolean {
  return Boolean(env.ADMIN_TOTP_SECRET?.trim());
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

/** A new secret and the link an authenticator app reads (enter the secret by hand, or as a QR). */
export function newTotpSecret(account: string): { secret: string; uri: string } {
  const secret = base32Encode(crypto.randomBytes(20));
  const label = encodeURIComponent(`DECHY Admin:${account}`);
  const uri = `otpauth://totp/${label}?secret=${secret}&issuer=DECHY%20Admin&algorithm=SHA1&digits=6&period=30`;
  return { secret, uri };
}
