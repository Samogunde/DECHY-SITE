import QRCode from "qrcode";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/admin-session";
import { getStore } from "@/lib/server/store";
import { webhookStatus } from "@/lib/server/telegram";
import { beginTotpSetup, pendingTotp, totpRequired } from "@/lib/server/totp";

export const dynamic = "force-dynamic";

/**
 * Two-step sign-in (owner, 24 October 2026). The server creates the secret and shows it here once
 * as a QR code for the owner's authenticator app; it never leaves the server otherwise.
 */
export default async function Security({
  searchParams,
}: {
  searchParams: Promise<{
    done?: string;
    error?: string;
    off?: string;
    again?: string;
    tg?: string;
  }>;
}) {
  const { email } = await requireAdmin();
  const sp = await searchParams;
  const store = getStore();
  const on = await totpRequired(store);
  const fromEnv = Boolean(process.env.ADMIN_TOTP_SECRET?.trim());
  let setup: { secret: string; qr: string } | null = null;
  if (!on) {
    const pending =
      (sp.again ? null : await pendingTotp(store, email)) ?? (await beginTotpSetup(store, email));
    setup = {
      secret: pending.secret,
      qr: await QRCode.toString(pending.uri, { type: "svg", margin: 1, width: 220 }),
    };
  }
  const tg = await webhookStatus();
  return (
    <AdminShell email={email} current="/admin/security/" title="Security">
      <section className="admin-card admin-security" aria-labelledby="twostep-h">
        <h2 id="twostep-h" className="admin-h2">
          Two-step sign-in
        </h2>
        {sp.done ? (
          <p className="admin-note" role="status">
            Two-step sign-in is on. From now on, signing in asks for the code from your app.
          </p>
        ) : null}
        {sp.off ? (
          <p className="admin-note" role="status">
            Two-step sign-in is off.
          </p>
        ) : null}
        {sp.error ? (
          <p className="admin-error" role="alert">
            That code did not match. Check the time on your phone is set automatically and try the
            newest code.
          </p>
        ) : null}
        {on ? (
          fromEnv ? (
            <p className="admin-note">
              Two-step sign-in is on, using the secret set in the host&rsquo;s environment settings.
            </p>
          ) : (
            <form method="post" action="/api/admin/security/" className="admin-login-form">
              <p className="admin-note">
                Two-step sign-in is on. To turn it off, enter a current code.
              </p>
              <input type="hidden" name="action" value="disable" />
              <div className="field">
                <label htmlFor="code-off">Code from your authenticator app</label>
                <input
                  id="code-off"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={7}
                  required
                />
              </div>
              <button type="submit" className="admin-btn admin-btn-quiet">
                Turn off two-step sign-in
              </button>
            </form>
          )
        ) : setup ? (
          <>
            <ol className="admin-steps">
              <li>
                On your phone, open an authenticator app (Google Authenticator, Microsoft
                Authenticator, or 1Password) and choose to add an account.
              </li>
              <li>Scan this code with the app.</li>
            </ol>
            <div className="admin-qr" dangerouslySetInnerHTML={{ __html: setup.qr }} />
            <p className="admin-note">
              Cannot scan? Choose &ldquo;Enter a setup key&rdquo;, type DECHY Admin as the name,
              choose time based, and enter:
            </p>
            <p className="admin-setup-key">
              <code>{setup.secret.match(/.{1,4}/g)!.join(" ")}</code>
            </p>
            <form method="post" action="/api/admin/security/" className="admin-login-form">
              <input type="hidden" name="action" value="confirm" />
              <div className="field">
                <label htmlFor="code-on">3. Enter the six-digit code the app now shows</label>
                <input
                  id="code-on"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={7}
                  required
                />
              </div>
              <button type="submit" className="admin-btn">
                Turn on two-step sign-in
              </button>
            </form>
            <p className="admin-note">
              Lost the phone later? Set ADMIN_2FA_RESET=1 in Netlify, redeploy, sign in, set it up
              again here, then remove the variable.
            </p>
          </>
        ) : null}
      </section>
      <section id="telegram" className="admin-card admin-security" aria-labelledby="telegram-h">
        <h2 id="telegram-h" className="admin-h2">
          Telegram live chat
        </h2>
        <p className="admin-note">
          When a visitor asks for a person, their conversation is posted to your Telegram chat.
          Reply to that message in Telegram and the reply appears in the visitor&rsquo;s chat
          window.
        </p>
        {sp.tg === "connected" ? (
          <p className="admin-note" role="status">
            Telegram replies are connected.
          </p>
        ) : null}
        {sp.tg === "failed" ? (
          <p className="admin-error" role="alert">
            Telegram did not accept the connection. Check TELEGRAM_BOT_TOKEN in Netlify and that
            SITE_ORIGIN is the site&rsquo;s https address.
          </p>
        ) : null}
        {!tg.configured ? (
          <p className="admin-note">
            Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Netlify first.
          </p>
        ) : (
          <>
            <p className="admin-note">
              Status: {tg.connected ? "connected" : "not connected yet"}
              {tg.lastError ? `. Last error from Telegram: ${tg.lastError}` : ""}
            </p>
            <form method="post" action="/api/admin/telegram/">
              <button
                type="submit"
                className={`admin-btn${tg.connected ? " admin-btn-quiet" : ""}`}
              >
                {tg.connected ? "Reconnect Telegram replies" : "Connect Telegram replies"}
              </button>
            </form>
          </>
        )}
      </section>
    </AdminShell>
  );
}
