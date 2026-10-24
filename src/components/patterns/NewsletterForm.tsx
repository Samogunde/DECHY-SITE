"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { leadSource } from "@/lib/contact/lead-source";

/**
 * The newsletter signup (owner, 24 October 2026): email only, placed quietly at the end of each
 * article, once in the footer, and under the article list on Resources. Never a popup, slide-in,
 * sticky bar, or overlay. "block" is the full version with a title; "line" is the footer's one row.
 */
export function NewsletterForm({ variant = "block" }: { variant?: "block" | "line" }) {
  const uid = useId();
  const started = useRef(0);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    started.current = Date.now();
  }, []);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(ev.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website: String(fd.get("website") ?? ""),
          startedAt: started.current,
          source: leadSource(),
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok: boolean; message?: string } | null;
      if (!res.ok || !body?.ok) throw new Error(body?.message ?? "Please try again in a moment.");
      setState("done");
    } catch (e) {
      setError((e as Error).message);
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div className={`nl nl-${variant}`} role="status">
        <p className="nl-done">Thank you. You are on the list.</p>
      </div>
    );

  return (
    <div className={`nl nl-${variant}`}>
      {variant === "block" ? (
        <>
          <p className="nl-title" id={`${uid}-t`}>
            Get new guides by email
          </p>
          <p className="nl-text">
            Cost guides and plain advice on software, websites, apps, and AI. About once a month,
            nothing else.
          </p>
        </>
      ) : (
        <p className="nl-text" id={`${uid}-t`}>
          New guides by email, about once a month.
        </p>
      )}
      <form className="nl-form" onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-t`}>
        <label htmlFor={`${uid}-email`} className="visually-hidden">
          Your email address
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={state === "error" ? true : undefined}
          aria-describedby={state === "error" ? `${uid}-err` : undefined}
        />
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="visually-hidden"
          aria-hidden="true"
        />
        <button type="submit" className="btn btn-secondary" disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Subscribe"}
        </button>
      </form>
      {state === "error" ? (
        <p className="nl-error" id={`${uid}-err`} role="alert">
          {error}
        </p>
      ) : null}
      <p className="nl-consent">
        We use your email only to send these guides. See our{" "}
        <Link href="/privacy/">privacy policy</Link>.
      </p>
    </div>
  );
}
