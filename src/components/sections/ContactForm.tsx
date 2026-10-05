"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";

type Option = { value: string; label: string };
type Fields = "name" | "email" | "organization" | "interest" | "timeline" | "message";
type Errors = Partial<Record<Fields, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const TIMELINE_OPTIONS: Option[] = [
  { value: "", label: "Not sure yet" },
  { value: "asap", label: "As soon as possible" },
  { value: "one-to-three-months", label: "Within one to three months" },
  { value: "later", label: "Later than three months" },
  { value: "exploring", label: "Just exploring" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientValidate(v: Record<Fields, string>): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 20)
    e.message = "Please tell us a little more (at least 20 characters).";
  return e;
}

export function ContactForm({ services }: { services: Option[] }) {
  const uid = useId();
  // The optional ?service= value is read on the client only, so the form itself is fully
  // server-rendered (no Suspense fallback, no layout shift).
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const preset = new URLSearchParams(search).get("service") ?? "";
  const presetLabel = services.find((s) => s.value === preset)?.label ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const id = (f: string) => `${uid}-${f}`;

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === "submitting") return;
    const fd = new FormData(ev.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      organization: String(fd.get("organization") ?? ""),
      interest: String(fd.get("interest") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const local = clientValidate(values);
    setFormError("");
    if (Object.keys(local).length > 0) {
      setErrors(local);
      const first = (["name", "email", "message"] as Fields[]).find((f) => local[f]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          timeline: values.timeline || undefined,
          website: String(fd.get("website") ?? ""),
          startedAt: startedAt.current,
        }),
      });
      const body = (await res.json().catch(() => null)) as
        { ok: true } | { ok: false; code?: string; message?: string; errors?: Errors } | null;
      if (res.ok && body?.ok) {
        setStatus("success");
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }
      if (body && !body.ok && body.errors) {
        setErrors(body.errors);
        setStatus("idle");
        return;
      }
      setFormError(
        (body && !body.ok && body.message) || "Something went wrong. Please try again in a moment.",
      );
      setStatus("error");
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch {
      setFormError("We could not reach the server. Check your connection and try again.");
      setStatus("error");
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="border-l-2 border-blue bg-white p-6 outline-none"
      >
        <h3 className="t-h3 m-0">Thank you. Your message has been sent.</h3>
        <p className="t-body mt-3 mb-0">
          We read every inquiry and will reply to the email address you provided.
        </p>
      </div>
    );
  }

  const describedBy = (f: Fields, hint = false) =>
    [errors[f] ? `${id(f)}-err` : "", hint ? `${id(f)}-hint` : ""].filter(Boolean).join(" ") ||
    undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      method="post"
      action="/api/contact/"
      className="grid gap-6"
    >
      {presetLabel ? (
        <p className="t-small m-0 border-l-2 border-blue pl-4">
          Your inquiry is about <strong>{presetLabel}</strong>.
        </p>
      ) : null}

      <div className="field">
        <label htmlFor={id("name")}>Your name</label>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={describedBy("name")}
        />
        {errors.name ? (
          <p id={`${id("name")}-err`} className="error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={id("email")}>Work email</label>
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={describedBy("email", true)}
        />
        <p id={`${id("email")}-hint`} className="hint">
          We use it only to reply to you.
        </p>
        {errors.email ? (
          <p id={`${id("email")}-err`} className="error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={id("organization")}>
          Organization <span className="font-normal text-slate-text">(optional)</span>
        </label>
        <input
          id={id("organization")}
          name="organization"
          type="text"
          autoComplete="organization"
        />
      </div>

      <div className="grid gap-6 min-[40rem]:grid-cols-2">
        <div className="field">
          <label htmlFor={id("interest")}>
            What is it about? <span className="font-normal text-slate-text">(optional)</span>
          </label>
          <select key={presetLabel} id={id("interest")} name="interest" defaultValue={presetLabel}>
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.value} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id("timeline")}>
            Timeline <span className="font-normal text-slate-text">(optional)</span>
          </label>
          <select id={id("timeline")} name="timeline" defaultValue="">
            {TIMELINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor={id("message")}>What would you like to build, fix, or understand?</label>
        <textarea
          id={id("message")}
          name="message"
          required
          aria-required="true"
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={describedBy("message", true)}
        />
        <p id={`${id("message")}-hint`} className="hint">
          A few sentences about the situation is enough. Please do not include passwords or
          sensitive personal data.
        </p>
        {errors.message ? (
          <p id={`${id("message")}-err`} className="error">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-error-text bg-white p-4 outline-none"
        >
          <p className="t-body m-0 font-semibold text-error-text">{formError}</p>
        </div>
      ) : null}

      <div>
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
        <p className="t-caption mt-3 max-w-[52ch]">
          By sending this form you agree that DECHY may use your details to respond to your inquiry.
          See the <Link href="/privacy/">privacy policy</Link> for how data is handled.
        </p>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {status === "submitting" ? "Sending your message" : ""}
      </p>
    </form>
  );
}
