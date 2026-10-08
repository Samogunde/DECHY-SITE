"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { AssistantMode } from "./AssistantLauncher";

type Rec = { id: string; name: string; path: string; kind: string };
type Msg = { role: "visitor" | "assistant"; text: string; recs?: Rec[] };
type View = "chat" | "human" | "done";

const STARTERS = [
  "I need custom software for my team",
  "We repeat the same tasks every day",
  "Our systems do not talk to each other",
  "I am not sure where to start",
];

const KIND_LABEL: Record<string, string> = {
  service: "Service",
  solution: "Solution",
  "work-area": "System we build",
  industry: "Industry",
  technology: "Technology",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The assistant panel: a conversation with the DECHY assistant, with a way to reach a person at
 * every step. Plain text only: replies are rendered as text, and links come only from the
 * server's catalog recommendations.
 */
export default function AssistantPanel({
  initialMode,
  onClose,
}: {
  initialMode: AssistantMode;
  onClose: () => void;
}) {
  const uid = useId();
  const [view, setView] = useState<View>(initialMode === "human" ? "human" : "chat");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hello. Tell me what you are trying to build, connect, automate, or fix, and I will point you to the right part of DECHY. You can ask for a person at any time.",
    },
  ]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [aiMode, setAiMode] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [offerHuman, setOfferHuman] = useState(false);
  const [ref, setRef] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const humanFirst = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus();
    if (view === "human") humanFirst.current?.focus();
    if (view === "done") doneRef.current?.focus();
  }, [view]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, sending]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || sending) return;
    setError("");
    setInput("");
    setMessages((m) => [...m, { role: "visitor", text: message }]);
    setSending(true);
    try {
      const res = await fetch("/api/assistant/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, message }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        conversationId?: string;
        reply?: string;
        mode?: string;
        recommendations?: Rec[];
        offerHuman?: boolean;
        humanRequested?: boolean;
        message?: string;
      } | null;
      if (!res.ok || !body?.ok || !body.reply) {
        setError(
          body?.message ??
            "The assistant is not available right now. You can still reach a person.",
        );
        setOfferHuman(true);
        return;
      }
      if (body.conversationId) setConversationId(body.conversationId);
      if (body.mode === "ai") setAiMode(true);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: body.reply!, recs: body.recommendations },
      ]);
      if (body.offerHuman) setOfferHuman(true);
      if (body.humanRequested) setView("human");
    } catch {
      setError("We could not reach the assistant. Check your connection, or ask for a person.");
      setOfferHuman(true);
    } finally {
      setSending(false);
    }
  }

  async function requestHuman(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (submitting) return;
    const fd = new FormData(ev.currentTarget);
    const values = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      organization: String(fd.get("organization") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      timeSensitive: fd.get("timeSensitive") === "on",
      website: String(fd.get("website") ?? ""),
    };
    const errs: Record<string, string> = {};
    if (values.name.length < 2) errs.name = "Please enter your name.";
    if (!EMAIL.test(values.email)) errs.email = "Please enter a valid email address.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/assistant/handoff/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          conversationId,
          reason: offerHuman && messages.length > 2 ? "assistant-suggested" : "visitor-request",
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        ref?: string;
        message?: string;
        errors?: Record<string, string>;
      } | null;
      if (res.ok && body?.ok) {
        setRef(body.ref ?? "");
        setView("done");
        return;
      }
      if (body?.errors) setFieldErrors(body.errors);
      else
        setError(body?.message ?? "We could not send this right now. Please use the contact form.");
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fid = (f: string) => `${uid}-${f}`;

  return (
    <div
      id="dechy-assistant"
      ref={panel}
      className="assist-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={fid("title")}
      aria-describedby={fid("disclosure")}
    >
      <div className="assist-head">
        <div className="min-w-0">
          <p id={fid("title")} className="assist-title">
            DECHY assistant
          </p>
          <p id={fid("disclosure")} className="assist-disclosure">
            {aiMode
              ? "An AI assistant, not a person. Answers can be imperfect; check important details with the team."
              : "An automated assistant, not a person."}{" "}
            A person can take over at any time.
          </p>
        </div>
        <button
          type="button"
          className="assist-close"
          onClick={onClose}
          aria-label="Close the assistant"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {view === "chat" ? (
        <>
          <div
            ref={log}
            className="assist-log"
            role="log"
            aria-live="polite"
            aria-label="Conversation"
          >
            {messages.map((m, i) => (
              <div key={i} className={`assist-msg assist-msg-${m.role}`}>
                <p className="assist-bubble">{m.text}</p>
                {m.recs && m.recs.length > 0 ? (
                  <ul className="assist-recs" aria-label="Suggested pages">
                    {m.recs.map((r) => (
                      <li key={r.id}>
                        <Link href={r.path} className="assist-rec" onClick={onClose}>
                          <span className="assist-rec-kind">{KIND_LABEL[r.kind] ?? "Page"}</span>
                          <span className="assist-rec-name">{r.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            {sending ? (
              <div
                className="assist-msg assist-msg-assistant"
                aria-label="The assistant is thinking"
              >
                <p className="assist-bubble assist-thinking">
                  <span className="assist-dot" />
                  <span className="assist-dot" />
                  <span className="assist-dot" />
                  <span className="visually-hidden">Thinking</span>
                </p>
              </div>
            ) : null}
            {messages.length === 1 && !sending ? (
              <div className="assist-starters" aria-label="Ways to start">
                {STARTERS.map((s) => (
                  <button key={s} type="button" className="assist-starter" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="assist-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="assist-actions">
            <button
              type="button"
              className={`assist-human${offerHuman ? " assist-human-strong" : ""}`}
              onClick={() => setView("human")}
            >
              Talk to a person
            </button>
            <Link href="/contact/" className="assist-link" onClick={onClose}>
              Use the contact form
            </Link>
          </div>

          <form
            className="assist-input"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor={fid("input")} className="visually-hidden">
              Your message
            </label>
            <textarea
              id={fid("input")}
              ref={inputRef}
              value={input}
              maxLength={1000}
              rows={2}
              placeholder="Describe your situation"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <button type="submit" className="assist-send" disabled={sending || !input.trim()}>
              <span className="visually-hidden">Send</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M4 10h11M11 5.5 15.5 10 11 14.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </>
      ) : null}

      {view === "human" ? (
        <form className="assist-human-form" onSubmit={requestHuman} noValidate>
          <p className="assist-form-title">Talk to the DECHY team</p>
          <p className="assist-form-note">
            {conversationId
              ? "We will pass on this conversation, so you do not have to repeat yourself. A person replies by email."
              : "Leave your details and a short note. A person replies by email."}
          </p>
          <div className="field">
            <label htmlFor={fid("name")}>Your name</label>
            <input
              ref={humanFirst}
              id={fid("name")}
              name="name"
              autoComplete="name"
              required
              aria-invalid={fieldErrors.name ? "true" : undefined}
              aria-describedby={fieldErrors.name ? fid("name-err") : undefined}
            />
            {fieldErrors.name ? (
              <p id={fid("name-err")} className="error">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor={fid("email")}>Work email</label>
            <input
              id={fid("email")}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              aria-invalid={fieldErrors.email ? "true" : undefined}
              aria-describedby={fieldErrors.email ? fid("email-err") : undefined}
            />
            {fieldErrors.email ? (
              <p id={fid("email-err")} className="error">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor={fid("org")}>
              Organization <span className="font-normal text-slate-text">(optional)</span>
            </label>
            <input id={fid("org")} name="organization" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor={fid("msg")}>
              Anything to add? <span className="font-normal text-slate-text">(optional)</span>
            </label>
            <textarea id={fid("msg")} name="message" rows={3} maxLength={2000} />
          </div>
          <label className="assist-check">
            <input type="checkbox" name="timeSensitive" />
            <span>This is time-sensitive</span>
          </label>
          <div className="hp-field" aria-hidden="true">
            <label htmlFor={fid("website")}>Leave this field empty</label>
            <input id={fid("website")} name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {error ? (
            <p className="assist-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="assist-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Sending" : "Send to the DECHY team"}
            </button>
            <button type="button" className="assist-link-button" onClick={() => setView("chat")}>
              Back to the assistant
            </button>
          </div>
          <p className="assist-fine">
            We use these details only to reply. See the <Link href="/privacy/">privacy policy</Link>
            .
          </p>
        </form>
      ) : null}

      {view === "done" ? (
        <div ref={doneRef} tabIndex={-1} className="assist-done" role="status">
          <p className="assist-form-title">Your request has been sent to the DECHY team.</p>
          {ref ? (
            <p className="assist-form-note">
              Your reference is <strong className="ref-code">{ref}</strong>. A person will reply to
              the email address you gave.
            </p>
          ) : (
            <p className="assist-form-note">A person will reply to the email address you gave.</p>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
