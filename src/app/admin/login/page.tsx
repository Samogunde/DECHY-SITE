import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/patterns/Logo";
import { SESSION_COOKIE, adminConfigured, readSession } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const configured = adminConfigured();
  if (configured && readSession((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/admin/");
  const { error } = await searchParams;
  return (
    <main id="main" className="admin-login">
      <div className="admin-login-card">
        <Logo sizes="160px" className="h-8" />
        <h1 className="admin-title mt-6">Sign in to DECHY Admin</h1>
        {!configured ? (
          <div className="admin-note" role="status">
            <p className="m-0">
              Admin is locked because sign-in is not configured on this server. Set ADMIN_EMAIL,
              ADMIN_PASSWORD_HASH (from <code>npm run admin:hash</code>), and ADMIN_SESSION_SECRET
              in the host&rsquo;s environment settings, then redeploy.
            </p>
          </div>
        ) : (
          <form method="post" action="/api/admin/session/" className="admin-login-form">
            {error ? (
              <p className="admin-error" role="alert">
                {error === "locked"
                  ? "Too many attempts. Wait fifteen minutes and try again."
                  : "Those details did not match. Try again."}
              </p>
            ) : null}
            <div className="field">
              <label htmlFor="admin-email">Email</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Sign in
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
