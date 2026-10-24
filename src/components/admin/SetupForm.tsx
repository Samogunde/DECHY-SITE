"use client";

import { useState } from "react";

const ITERATIONS = 600_000;
const b64 = (buf: ArrayBuffer | Uint8Array) =>
  btoa(
    String.fromCharCode(...new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf))),
  );

/** Makes ADMIN_EMAIL, ADMIN_PASSWORD_HASH, and ADMIN_SESSION_SECRET in the browser only. */
export function SetupForm() {
  const [lines, setLines] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const email = String(fd.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(fd.get("password") ?? "");
    const again = String(fd.get("again") ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter your email address.");
    if (password.length < 6) return setError("Use at least 6 characters for the password.");
    if (password !== again) return setError("The two passwords do not match.");
    setError("");
    setBusy(true);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
      key,
      256,
    );
    const session = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    setLines([
      `ADMIN_EMAIL=${email}`,
      `ADMIN_PASSWORD_HASH=pbkdf2:sha256:${ITERATIONS}:${b64(salt)}:${b64(bits)}`,
      `ADMIN_SESSION_SECRET=${session}`,
    ]);
    setBusy(false);
    ev.currentTarget.reset();
  }

  if (lines)
    return (
      <div className="admin-setup-out">
        <p className="admin-note">
          In Netlify, open the project, then Project configuration, then Environment variables. Add
          each line below as a variable (the name before the = sign, the value after it). Mark the
          last two as secret. Then ask for a redeploy and sign in at /admin/login/.
        </p>
        <pre className="admin-setup-lines">{lines.join("\n")}</pre>
        <p className="admin-note">
          These values are shown once and never stored. Close this page when they are saved.
        </p>
      </div>
    );

  return (
    <form className="admin-login-form" onSubmit={onSubmit} noValidate>
      <p className="admin-note">
        Your password is turned into a one-way hash here in your browser. Nothing you type on this
        page is sent anywhere.
      </p>
      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="field">
        <label htmlFor="setup-email">Your email</label>
        <input id="setup-email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="setup-password">New password (at least 6 characters)</label>
        <input
          id="setup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="setup-again">The same password again</label>
        <input id="setup-again" name="again" type="password" autoComplete="new-password" required />
      </div>
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Working..." : "Make my sign-in settings"}
      </button>
    </form>
  );
}
