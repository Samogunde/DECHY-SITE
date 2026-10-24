import { sameOrigin } from "@/lib/contact/handler";
import {
  adminConfigured,
  clearedCookie,
  createSession,
  sessionCookie,
  verifyCredentials,
} from "@/lib/server/auth";
import { clientAddress, overLimit, peekLimit } from "@/lib/server/ratelimit";
import { activeTotpSecret, matchTotp } from "@/lib/server/totp";
import { getStore } from "@/lib/server/store";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const back = (path: string, cookie?: string) =>
  new Response(null, {
    status: 303,
    headers: {
      Location: path,
      "Cache-Control": "no-store",
      ...(cookie ? { "Set-Cookie": cookie } : {}),
    },
  });

/** Sign in (form post). Rate limited; the reply never says which part was wrong. */
export async function POST(request: Request) {
  if (!sameOrigin(request.headers, siteOrigin())) return new Response(null, { status: 403 });
  const form = await request.formData().catch(() => null);
  if (form?.get("action") === "logout") return back("/admin/login/", clearedCookie());
  if (!adminConfigured()) return back("/admin/login/");
  // Only failed attempts count; while over the limit, even a correct password is refused.
  const store = getStore();
  const client = clientAddress(request.headers);
  if (await peekLimit(store, "admin-login", client, 5, 15 * 60 * 1000))
    return back("/admin/login/?error=locked");
  const email = String(form?.get("email") ?? "").slice(0, 200);
  const password = String(form?.get("password") ?? "").slice(0, 500);
  const code = String(form?.get("code") ?? "")
    .replace(/\s/g, "")
    .slice(0, 6);
  const fail = async () => {
    await overLimit(store, "admin-login", client, 5, 15 * 60 * 1000);
    return back("/admin/login/?error=1");
  };
  if (!email || !password || !verifyCredentials(email, password)) return fail();
  // Two-step sign-in (owner, 24 October 2026): the authenticator code, used once only.
  const totp = await activeTotpSecret(store);
  if (totp) {
    const step = matchTotp(code, { ADMIN_TOTP_SECRET: totp });
    if (step === null) return fail();
    const last = await store.get<number>("admin/totp-last-step").catch(() => null);
    if (last !== null && step <= last) return fail();
    await store.set("admin/totp-last-step", step).catch(() => {});
  }
  return back("/admin/", sessionCookie(createSession(email)));
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
