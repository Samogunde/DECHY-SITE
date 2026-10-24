import { Logo } from "@/components/patterns/Logo";
import { SetupForm } from "@/components/admin/SetupForm";
import { adminConfigured } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/**
 * First-time sign-in settings for DECHY Admin (owner, 24 October 2026). Everything happens in the
 * owner's browser: the password is turned into a one-way hash and a random session key is made,
 * and the page shows the three lines to paste into Netlify. Nothing typed here is sent anywhere.
 */
export default function AdminSetup() {
  return (
    <main id="main" className="admin-login">
      <div className="admin-login-card">
        <Logo sizes="160px" className="h-8" />
        <h1 className="admin-title mt-6">Set up DECHY Admin sign-in</h1>
        {adminConfigured() ? (
          <p className="admin-note">
            Sign-in is already set up on this server. Use this page only to change the password:
            make new settings and replace the three values in Netlify.
          </p>
        ) : null}
        <SetupForm />
      </div>
    </main>
  );
}
