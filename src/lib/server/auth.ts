/**
 * DECHY Admin authentication boundary. Provider-agnostic and configuration-only: no credential is
 * stored in the repository, and admin stays locked until the environment provides one.
 *
 *   ADMIN_EMAIL            the administrator's sign-in email
 *   ADMIN_PASSWORD_HASH    scrypt hash from `npm run admin:hash`, or a PBKDF2 hash made in the
 *                          browser at /admin/setup/ (never the password itself)
 *   ADMIN_SESSION_SECRET   at least 32 random characters; signs the session cookie
 *   ADMIN_API_TOKEN        optional; a long random token for server-to-server or mobile access
 *                          (sent as "Authorization: Bearer <token>")
 *
 * Sessions are HMAC-signed, HttpOnly, SameSite=Strict, Secure in production, and expire after
 * eight hours. Every admin page and endpoint checks the session on the server. A dedicated identity
 * provider can replace verifyCredentials and the session functions without touching the pages.
 * Server-only.
 */
import crypto from "node:crypto";

type Env = Record<string, string | undefined>;

export const SESSION_COOKIE = "dechy_admin";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export function adminConfigured(env: Env = process.env): boolean {
  return Boolean(
    env.ADMIN_EMAIL?.trim() &&
    /^(scrypt|pbkdf2):/.test(env.ADMIN_PASSWORD_HASH?.trim() ?? "") &&
    (env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32,
  );
}

/** scrypt:N:r:p:saltBase64:hashBase64 (":" so the value never needs escaping in .env files) */
export function hashPassword(password: string, salt = crypto.randomBytes(16)): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = crypto.scryptSync(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt:${N}:${r}:${p}:${salt.toString("base64")}:${hash.toString("base64")}`;
}

/**
 * pbkdf2:sha256:iterations:saltBase64:hashBase64, made in the owner's browser at /admin/setup/
 * (Web Crypto PBKDF2), so the password never leaves their device.
 */
function verifyPbkdf2(password: string, stored: string): boolean {
  const [, digest, iter, saltB64, hashB64] = stored.split(":");
  const iterations = Number(iter);
  if (digest !== "sha256" || !Number.isInteger(iterations) || iterations < 100_000) return false;
  if (iterations > 5_000_000) return false;
  const expected = Buffer.from(hashB64 ?? "", "base64");
  if (expected.length < 32) return false;
  const actual = crypto.pbkdf2Sync(
    password,
    Buffer.from(saltB64 ?? "", "base64"),
    iterations,
    expected.length,
    "sha256",
  );
  return crypto.timingSafeEqual(actual, expected);
}

export function verifyPassword(password: string, stored: string): boolean {
  if (stored.startsWith("pbkdf2:")) return verifyPbkdf2(password, stored);
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const N = Number(n);
  const R = Number(r);
  const P = Number(p);
  if (![N, R, P].every((x) => Number.isInteger(x) && x > 0) || N > 1 << 20) return false;
  const expected = Buffer.from(hashB64!, "base64");
  if (expected.length < 32) return false;
  const actual = crypto.scryptSync(password, Buffer.from(saltB64!, "base64"), expected.length, {
    N,
    r: R,
    p: P,
    maxmem: 128 * 1024 * 1024,
  });
  return crypto.timingSafeEqual(actual, expected);
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function verifyCredentials(
  email: string,
  password: string,
  env: Env = process.env,
): boolean {
  if (!adminConfigured(env)) return false;
  // Always run the password check so timing does not reveal whether the email matched.
  const passwordOk = verifyPassword(password, env.ADMIN_PASSWORD_HASH!.trim());
  const emailOk = safeEqual(email.trim().toLowerCase(), env.ADMIN_EMAIL!.trim().toLowerCase());
  return passwordOk && emailOk;
}

type Session = { sub: string; iat: number; exp: number };

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

function sign(payload: string, env: Env): string {
  return crypto.createHmac("sha256", env.ADMIN_SESSION_SECRET!).update(payload).digest("base64url");
}

export function createSession(email: string, env: Env = process.env, now = Date.now()): string {
  const payload = b64url(
    JSON.stringify({ sub: email.trim().toLowerCase(), iat: now, exp: now + SESSION_TTL_MS }),
  );
  return `${payload}.${sign(payload, env)}`;
}

export function readSession(
  token: string | undefined,
  env: Env = process.env,
  now = Date.now(),
): Session | null {
  if (!token || !adminConfigured(env)) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload, env))) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (typeof s.exp !== "number" || s.exp < now) return null;
    if (s.sub !== env.ADMIN_EMAIL!.trim().toLowerCase()) return null;
    return s;
  } catch {
    return null;
  }
}

export function sessionCookie(value: string, env: Env = process.env): string {
  const secure = env.NODE_ENV === "production" && !env.ADMIN_INSECURE_COOKIE ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_MS / 1000}${secure}`;
}

export function clearedCookie(env: Env = process.env): string {
  const secure = env.NODE_ENV === "production" && !env.ADMIN_INSECURE_COOKIE ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function cookieValue(
  cookieHeader: string | null,
  name = SESSION_COOKIE,
): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/** Server-side authorization for admin API calls: a valid session cookie or the API token. */
export function authorizeRequest(headers: Headers, env: Env = process.env): boolean {
  if (!adminConfigured(env)) return false;
  const bearer = headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = env.ADMIN_API_TOKEN?.trim();
  if (bearer && token && token.length >= 32 && safeEqual(bearer, token)) return true;
  return readSession(cookieValue(headers.get("cookie")), env) !== null;
}
