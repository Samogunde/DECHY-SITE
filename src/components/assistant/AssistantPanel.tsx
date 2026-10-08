"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { AssistantRequest } from "./AssistantLauncher";

type Rec = { id: string; name: string; path: string; kind: string; reason?: string };
type SourceLink = { name: string; path: string };
type Msg = {
  role: "visitor" | "assistant";
  text: string;
  kind?: "message" | "handoff";
  recs?: Rec[];
  sources?: SourceLink[];
  pending?: boolean;
};
type Extracted = { value: string; source: string } | null;
type Prefill = {
  name: Extracted;
  email: Extracted;
  organization: Extracted;
  need: string;
  service: string;
  intent: "new" | "existing" | "unclear";
};
type PageCtx = {
  kind: string;
  name: string;
  suggestion: { label: string; message: string };
} | null;
type Done = {
  ok: true;
  conversationId?: string;
  reply: string;
  mode: "ai" | "guided";
  recommendations: Rec[];
  sources: SourceLink[];
  offerHuman: boolean;
  humanRequested: boolean;
  handoffRef: string | null;
  handoff?: Prefill;
};

const CONV_KEY = "dechy-assistant-conversation";

const INTENTS: { label: string; message: string }[] = [
  { label: "Build something new", message: "We want to build something new." },
  { label: "Add AI or automation", message: "We want to add AI or automation to how we work." },
  { label: "Connect our systems", message: "We need our systems to work together." },
  {
    label: "Improve or modernize what we have",
    message: "We want to improve or modernize a system we already have.",
  },
];

const KIND_LABEL: Record<string, string> = {
  service: "Service",
  solution: "Solution",
  "work-area": "System we build",
  industry: "Industry",
  technology: "Technology",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stored(): string | undefined {
  try {
    return window.sessionStorage.getItem(CONV_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}
function store(id: string | null) {
  try {
    if (id) window.sessionStorage.setItem(CONV_KEY, id);
    else window.sessionStorage.removeItem(CONV_KEY);
  } catch {
    // without storage the conversation lasts only while this page is open
  }
}

/** Reads a server-sent event stream: calls back per event with its parsed JSON data. */
async function readEvents(res: Response, on: (event: string, data: unknown) => void) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let cut: number;
    while ((cut = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      let event = "message";
      let data = "";
      for (const line of block.split("\n")) {
        if (line.startsWith("event: ")) event = line.slice(7);
        else if (line.startsWith("data: ")) data += line.slice(6);
      }
      try {
        on(event, data ? JSON.parse(data) : null);
      } catch {
        // a malformed event is skipped
      }
    }
  }
}

/**
 * The assistant panel. Floating on larger screens (with a wider side-drawer option), full screen on
 * phones. Not modal: the page stays usable. Replies are plain text; every link comes from the
 * server's catalog. A person is one step away, and asking for one keeps the visitor here: a short
 * card, filled in from the conversation, that they check and confirm.
 */
export default function AssistantPanel({
  ai,
  page,
  hidden,
  request,
  onMinimize,
  onClose,
}: {
  ai: boolean;
  page: string;
  hidden: boolean;
  request: AssistantRequest;
  onMinimize: () => void;
  onClose: () => void;
}) {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const [mode, setMode] = useState<"ai" | "guided">(ai ? "ai" : "guided");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [restoring, setRestoring] = useState(true);
  const [pageCtx, setPageCtx] = useState<PageCtx>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [offerHuman, setOfferHuman] = useState(false);
  const [handoffRef, setHandoffRef] = useState<string | null>(null);
  const [card, setCard] = useState<Prefill | null>(null);
  const [via, setVia] = useState<"header" | "offer" | "message" | "contact">("header");
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [wide, setWide] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const cardFirst = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const handledRequest = useRef(0);
  const panel = useRef<HTMLDivElement>(null);

  /* Restore this session's conversation (the server is the source of truth). */
  useEffect(() => {
    const id = stored();
    const q = new URLSearchParams({ page });
    if (id) q.set("conversationId", id);
    let live = true;
    fetch(`/api/assistant/?${q}`, { headers: { accept: "application/json" } })
      .then((r) => r.json())
      .then(
        (b: {
          ai?: boolean;
          page?: PageCtx;
          conversation?: {
            id: string;
            mode: "ai" | "guided";
            messages: (Msg & { recommendations?: Rec[] })[];
            handoffRef: string | null;
          } | null;
        }) => {
          if (!live) return;
          if (typeof b.ai === "boolean") setMode(b.ai ? "ai" : "guided");
          setPageCtx(b.page ?? null);
          if (b.conversation) {
            setConversationId(b.conversation.id);
            setHandoffRef(b.conversation.handoffRef);
            setMessages(
              b.conversation.messages.map((m) => ({
                role: m.role,
                text: m.text,
                kind: m.kind,
                recs: m.recommendations,
                sources: m.sources,
              })),
            );
          } else if (id) store(null);
        },
      )
      .catch(() => undefined)
      .finally(() => live && setRestoring(false));
    return () => {
      live = false;
    };
    // Restore once; later page changes only refresh the page suggestion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Page awareness: refresh the suggestion when the visitor moves to another page. */
  const firstPage = useRef(page);
  useEffect(() => {
    if (page === firstPage.current) return;
    firstPage.current = page;
    let live = true;
    fetch(`/api/assistant/?${new URLSearchParams({ page })}`)
      .then((r) => r.json())
      .then((b: { page?: PageCtx }) => live && setPageCtx(b.page ?? null))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [page]);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [messages, busy]);

  // The card opens at its top, so the details filled in from the conversation are seen first.
  const cardOpen = Boolean(card);
  useEffect(() => {
    const l = log.current;
    const c = cardRef.current;
    if (cardOpen && l && c)
      l.scrollTop += c.getBoundingClientRect().top - l.getBoundingClientRect().top - 12;
  }, [cardOpen]);

  useEffect(() => {
    if (hidden) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMinimize();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hidden, onMinimize]);

  /* Keep the input above the on-screen keyboard on phones. */
  useEffect(() => {
    const vv = window.visualViewport;
    const el = panel.current;
    if (!vv || !el) return;
    const fit = () => el.style.setProperty("--assist-vh", `${vv.height}px`);
    fit();
    vv.addEventListener("resize", fit);
    return () => vv.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (!hidden && !card) inputRef.current?.focus({ preventScroll: true });
  }, [hidden, card]);

  const openCard = useCallback(
    async (from: "header" | "offer" | "contact" = "header") => {
      if (handoffRef) return;
      setVia(from);
      try {
        const res = await fetch("/api/assistant/handoff/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "prepare", conversationId, page }),
        });
        const b = (await res.json().catch(() => null)) as {
          ok?: boolean;
          prefill?: Prefill;
        } | null;
        setError("");
        setCard(
          b?.prefill ?? {
            name: null,
            email: null,
            organization: null,
            need: "",
            service: "",
            intent: "unclear",
          },
        );
      } catch {
        setCard({
          name: null,
          email: null,
          organization: null,
          need: "",
          service: "",
          intent: "unclear",
        });
      }
      setCardErrors({});
      requestAnimationFrame(() => cardFirst.current?.focus({ preventScroll: true }));
    },
    [conversationId, handoffRef, page],
  );

  /* Requests from outside the panel (the contact page's "speak to someone" path). */
  useEffect(() => {
    if (restoring || request.n === handledRequest.current) return;
    handledRequest.current = request.n;
    if (request.mode === "human") void Promise.resolve().then(() => openCard("contact"));
  }, [request, restoring, openCard]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setError("");
    setInput("");
    setBusy(true);
    setMessages((m) => [
      ...m,
      { role: "visitor", text: message },
      { role: "assistant", text: "", pending: true },
    ]);
    const patchLast = (fn: (m: Msg) => Msg) =>
      setMessages((all) => {
        const next = all.slice();
        const last = next.at(-1);
        if (last?.role === "assistant") next[next.length - 1] = fn(last);
        return next;
      });
    const dropPending = () => setMessages((all) => all.filter((m) => !(m.pending && !m.text)));
    const finish = (b: Done) => {
      if (b.conversationId) {
        setConversationId(b.conversationId);
        store(b.conversationId);
      }
      setMode(b.mode);
      patchLast(() => ({
        role: "assistant",
        text: b.reply,
        recs: b.recommendations,
        sources: b.sources,
      }));
      if (b.handoffRef) setHandoffRef(b.handoffRef);
      if (b.offerHuman) setOfferHuman(true);
      if (b.humanRequested && !b.handoffRef) {
        setVia("message");
        setCard(
          b.handoff ?? {
            name: null,
            email: null,
            organization: null,
            need: "",
            service: "",
            intent: "unclear",
          },
        );
        setCardErrors({});
        requestAnimationFrame(() => cardFirst.current?.focus({ preventScroll: true }));
      }
    };
    try {
      const res = await fetch("/api/assistant/", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "text/event-stream" },
        body: JSON.stringify({ conversationId, message, page }),
      });
      if ((res.headers.get("content-type") ?? "").includes("text/event-stream")) {
        let completed = false;
        await readEvents(res, (event, data) => {
          if (event === "delta") {
            const t = (data as { text?: string })?.text ?? "";
            patchLast((m) => ({ ...m, text: m.text + t }));
          } else if (event === "done") {
            completed = true;
            finish(data as Done);
          } else if (event === "error") {
            setError(
              (data as { message?: string })?.message ??
                "The assistant is not available right now.",
            );
          }
        });
        if (!completed) {
          dropPending();
          setOfferHuman(true);
          setError((e) => e || "The answer was interrupted. Try again, or talk to the team.");
        }
        return;
      }
      const b = (await res.json().catch(() => null)) as (Done & { message?: string }) | null;
      if (!res.ok || !b?.ok || !b.reply) {
        dropPending();
        setOfferHuman(true);
        setError(
          b?.message ?? "The assistant is not available right now. You can still talk to the team.",
        );
        return;
      }
      finish(b);
    } catch {
      dropPending();
      setOfferHuman(true);
      setError("We could not reach the assistant. Check your connection, or talk to the team.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmHandoff(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (submitting || !card) return;
    const fd = new FormData(ev.currentTarget);
    const values = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      organization: String(fd.get("organization") ?? "").trim(),
      note: String(fd.get("note") ?? "").trim(),
      timeSensitive: fd.get("timeSensitive") === "on",
      kind: (fd.get("kind") as "new" | "existing" | null) ?? undefined,
      website: String(fd.get("website") ?? ""),
    };
    const errs: Record<string, string> = {};
    if (values.name.length < 2) errs.name = "Please enter your name.";
    if (!EMAIL.test(values.email)) errs.email = "Please enter a valid email address.";
    if (card.intent === "unclear" && !values.kind) errs.kind = "Please choose one.";
    setCardErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/assistant/handoff/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "confirm", conversationId, page, via, ...values }),
      });
      const b = (await res.json().catch(() => null)) as {
        ok?: boolean;
        ref?: string;
        conversationId?: string | null;
        message?: string;
        errors?: Record<string, string>;
      } | null;
      if (res.ok && b?.ok && b.ref) {
        if (b.conversationId) {
          setConversationId(b.conversationId);
          store(b.conversationId);
        }
        setHandoffRef(b.ref);
        setCard(null);
        setOfferHuman(false);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            kind: "handoff",
            text: `Sent to the DECHY team. Your reference is ${b.ref}. A person will reply by email.`,
          },
        ]);
        return;
      }
      if (b?.errors) setCardErrors(b.errors);
      else
        setError(
          b?.message ??
            "We could not send this right now. Please try again, or use the contact form.",
        );
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function newTopic() {
    store(null);
    setConversationId(undefined);
    setMessages([]);
    setHandoffRef(null);
    setCard(null);
    setOfferHuman(false);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const followed = () => {
    // On a phone the panel covers the page, so step aside; the conversation is kept.
    if (window.matchMedia("(max-width: 39.99rem)").matches) onMinimize();
  };

  const isAI = mode === "ai";
  const empty = messages.length === 0 && !restoring;
  const showSuggestion = pageCtx && empty;
  const lastHandoff = messages.at(-1)?.kind === "handoff";

  return (
    <div
      id="dechy-assistant"
      ref={panel}
      className="assist-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={fid("title")}
      aria-describedby={fid("disclosure")}
      data-wide={wide ? "true" : undefined}
      hidden={hidden}
    >
      <div className="assist-head">
        <div className="assist-head-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/dechy-monogram.png"
            alt=""
            width={32}
            height={32}
            className="assist-head-mark"
          />
          <p id={fid("title")} className="assist-title">
            {isAI ? "DECHY AI" : "DECHY assistant"}
          </p>
          <div className="assist-head-actions">
            <button
              type="button"
              className="assist-icon assist-only-wide"
              onClick={() => setWide((w) => !w)}
              aria-pressed={wide}
              aria-label={wide ? "Use the smaller panel" : "Expand to a side panel"}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <rect
                  x="3"
                  y="4"
                  width="14"
                  height="12"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path d={wide ? "M12 4v12" : "M8 4v12"} stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </button>
            <button
              type="button"
              className="assist-icon"
              onClick={onMinimize}
              aria-label="Minimize the assistant"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="assist-icon"
              onClick={onClose}
              aria-label="Close the assistant"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M5.5 5.5l9 9M14.5 5.5l-9 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="assist-head-bar">
          <p id={fid("disclosure")} className="assist-disclosure">
            {isAI
              ? "AI, not a person. Check important details with the team."
              : "Automated assistant, not a person."}
          </p>
          {handoffRef ? (
            <span className="assist-head-ref">
              Sent · <span className="ref-code">{handoffRef}</span>
            </span>
          ) : !card ? (
            <button type="button" className="assist-team" onClick={() => void openCard()}>
              Talk to the team
            </button>
          ) : null}
        </div>
      </div>

      <div
        ref={log}
        className="assist-log"
        role="log"
        aria-live="polite"
        aria-busy={busy}
        aria-label="Conversation"
      >
        {empty ? (
          <div className="assist-hello">
            <p className="assist-hello-title">{isAI ? "DECHY AI" : "Ask DECHY"}</p>
            <p className="assist-hello-text">
              Tell me what you&apos;re trying to do. I&apos;ll point you to the right part of DECHY.
            </p>
            {showSuggestion ? (
              <button
                type="button"
                className="assist-suggest"
                onClick={() => void send(pageCtx.suggestion.message)}
              >
                <span className="assist-suggest-k">On this page</span>
                <span>{pageCtx.suggestion.label}</span>
              </button>
            ) : null}
            <ul className="assist-intents" aria-label="Common starting points">
              {INTENTS.map((s) => (
                <li key={s.label}>
                  <button
                    type="button"
                    className="assist-intent"
                    onClick={() => void send(s.message)}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {messages.map((m, i) => {
          const recPaths = new Set((m.recs ?? []).map((r) => r.path));
          const extraSources = (m.sources ?? []).filter((s) => !recPaths.has(s.path));
          if (m.kind === "handoff")
            return (
              <div key={i} className="assist-sent" role="status">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M5 10.5l3.2 3L15 6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>
                  Sent to the DECHY team. Reference:{" "}
                  <strong className="ref-code">
                    {/DECHY-[A-Z0-9]{6}/.exec(m.text)?.[0] ?? handoffRef}
                  </strong>
                  . A person will reply by email.
                </p>
              </div>
            );
          return (
            <div key={i} className={`assist-msg assist-msg-${m.role}`}>
              {m.pending && !m.text ? (
                <div className="assist-thinking" role="status">
                  <span className="assist-progress" aria-hidden="true" />
                  <span>Reading DECHY&apos;s pages…</span>
                </div>
              ) : (
                <p className="assist-bubble">{m.text}</p>
              )}
              {m.recs && m.recs.length > 0 ? (
                <ul className="assist-recs" aria-label="Suggested pages">
                  {m.recs.map((r) => (
                    <li key={r.id}>
                      <Link href={r.path} className="assist-rec" onClick={followed}>
                        <span className="assist-rec-kind">{KIND_LABEL[r.kind] ?? "Page"}</span>
                        <span className="assist-rec-name">{r.name}</span>
                        {r.reason ? <span className="assist-rec-why">{r.reason}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              {extraSources.length > 0 ? (
                <p className="assist-sources">
                  From{" "}
                  {extraSources.map((s, k) => (
                    <span key={s.path}>
                      {k > 0 ? ", " : null}
                      <Link href={s.path} onClick={followed}>
                        {s.name}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          );
        })}

        {offerHuman && !card && !handoffRef && !busy ? (
          <div className="assist-offer">
            <p>A person on the team can take this further.</p>
            <button type="button" className="assist-team" onClick={() => void openCard("offer")}>
              Talk to the team
            </button>
          </div>
        ) : null}

        {card ? (
          <form
            ref={cardRef}
            className="assist-card"
            onSubmit={confirmHandoff}
            noValidate
            aria-labelledby={fid("card-title")}
          >
            <p id={fid("card-title")} className="assist-card-title">
              Talk to the DECHY team
            </p>
            <p className="assist-card-note">
              {card.name || card.email || card.need
                ? "We'll pass on this conversation so you don't have to repeat yourself. Check the details, then send."
                : "A person will reply by email."}
            </p>
            {card.need ? (
              <div className="assist-card-need">
                <span className="assist-card-k">What we&apos;ll pass on</span>
                <span>{card.need}</span>
                {card.service && card.service !== card.need ? (
                  <span className="assist-card-k2">Likely fit: {card.service}</span>
                ) : null}
              </div>
            ) : null}
            <div className="field">
              <label htmlFor={fid("name")}>Name</label>
              <input
                ref={cardFirst}
                id={fid("name")}
                name="name"
                autoComplete="name"
                defaultValue={card.name?.value ?? ""}
                required
                aria-invalid={cardErrors.name ? "true" : undefined}
                aria-describedby={cardErrors.name ? fid("name-err") : undefined}
              />
              {cardErrors.name ? (
                <p id={fid("name-err")} className="error">
                  {cardErrors.name}
                </p>
              ) : null}
            </div>
            <div className="field">
              <label htmlFor={fid("email")}>Email</label>
              <input
                id={fid("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                defaultValue={card.email?.value ?? ""}
                required
                aria-invalid={cardErrors.email ? "true" : undefined}
                aria-describedby={cardErrors.email ? fid("email-err") : undefined}
              />
              {cardErrors.email ? (
                <p id={fid("email-err")} className="error">
                  {cardErrors.email}
                </p>
              ) : null}
            </div>
            <div className="field">
              <label htmlFor={fid("org")}>
                Organization <span className="assist-opt">(optional)</span>
              </label>
              <input
                id={fid("org")}
                name="organization"
                autoComplete="organization"
                defaultValue={card.organization?.value ?? ""}
              />
            </div>
            {card.intent === "unclear" ? (
              <fieldset
                className="assist-choice"
                aria-invalid={cardErrors.kind ? "true" : undefined}
                aria-describedby={cardErrors.kind ? fid("kind-err") : undefined}
              >
                <legend>
                  Is this about a new project or something we&apos;re already working on together?
                </legend>
                <label className="assist-check">
                  <input type="radio" name="kind" value="new" />
                  <span>A new project</span>
                </label>
                <label className="assist-check">
                  <input type="radio" name="kind" value="existing" />
                  <span>Something we&apos;re already working on</span>
                </label>
                {cardErrors.kind ? (
                  <p id={fid("kind-err")} className="error">
                    {cardErrors.kind}
                  </p>
                ) : null}
              </fieldset>
            ) : (
              <input type="hidden" name="kind" value={card.intent} />
            )}
            <div className="field">
              <label htmlFor={fid("note")}>
                Anything else? <span className="assist-opt">(optional)</span>
              </label>
              <textarea id={fid("note")} name="note" rows={2} maxLength={2000} />
            </div>
            <label className="assist-check">
              <input type="checkbox" name="timeSensitive" />
              <span>This is time-sensitive</span>
            </label>
            <div className="hp-field" aria-hidden="true">
              <label htmlFor={fid("website")}>Leave this field empty</label>
              <input id={fid("website")} name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="assist-card-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? "Sending" : "Send to the team"}
              </button>
              <button type="button" className="assist-link-button" onClick={() => setCard(null)}>
                Not now
              </button>
            </div>
            <p className="assist-fine">
              We use these details only to reply. <Link href="/privacy/">Privacy</Link>
            </p>
          </form>
        ) : null}

        {lastHandoff ? (
          <div className="assist-after">
            <p>You can keep writing here; anything you add goes to the same request.</p>
            <div className="assist-after-actions">
              <button type="button" className="assist-link-button" onClick={newTopic}>
                Start a new topic
              </button>
              <button type="button" className="assist-link-button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="assist-error" role="alert">
          {error}
        </p>
      ) : null}

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
          rows={1}
          placeholder={handoffRef ? "Add to your request" : "Describe what you need"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
        />
        <button type="submit" className="assist-send" disabled={busy || !input.trim()}>
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
    </div>
  );
}
