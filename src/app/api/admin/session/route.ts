import { sameOrigin } from "@/lib/contact/handler";
import {
  adminConfigured,
  clearedCookie,
  createSession,
  sessionCookie,
  verifyCredentials,
} from "@/lib/server/auth";
import { clientAddress, overLimit, peekLimit } from "@/lib/server/ratelimit";
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
  if (!email || !password || !verifyCredentials(email, password)) {
    await overLimit(store, "admin-login", client, 5, 15 * 60 * 1000);
    return back("/admin/login/?error=1");
  }
  return back("/admin/", sessionCookie(createSession(email)));
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
