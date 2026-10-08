/**
 * Server-component helper: the signed-in administrator, or a redirect to the sign-in page.
 * Authorization is decided here on the server for every admin page. Server-only.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, adminConfigured, readSession } from "./auth";

export async function requireAdmin(): Promise<{ email: string }> {
  if (!adminConfigured()) redirect("/admin/login/");
  const jar = await cookies();
  const session = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login/");
  return { email: session.sub };
}
