"use client";

import { usePathname } from "next/navigation";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

/** The panel is loaded only when a visitor opens it, so pages carry almost no assistant code. */
const AssistantPanel = lazy(() => import("./AssistantPanel"));

export type AssistantMode = "guide" | "human";
export type AssistantRequest = { mode: AssistantMode; n: number };

/** Opens the assistant from anywhere on the page (for example the contact page paths). */
export function openAssistant(mode: AssistantMode = "guide") {
  window.dispatchEvent(new CustomEvent("dechy:assistant", { detail: { mode } }));
}

/** Per-viewer conveniences only: whether the label has been shown, and whether the panel was open. */
const SEEN_KEY = "dechy-assistant-seen";
const OPEN_KEY = "dechy-assistant-open";

function read(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}
function write(storage: () => Storage, key: string, value: string | null) {
  try {
    if (value === null) storage().removeItem(key);
    else storage().setItem(key, value);
  } catch {
    // storage blocked: the assistant still works, it just forgets between pages
  }
}
const local = () => window.localStorage;
const session = () => window.sessionStorage;

type State = "closed" | "open" | "minimized";

/**
 * The DECHY assistant launcher: the approved monogram with a typographic "AI" mark when real AI
 * answers are on ("Ask DECHY AI"), or the monogram alone for the automated assistant ("Ask DECHY").
 * The label shows once on a first visit and then folds away; nothing pulses, counts, or opens by
 * itself. The panel stays mounted while minimized so a draft and the scroll position survive, and
 * the conversation itself lives on the server for the rest of the session.
 */
export function AssistantLauncher({ ai }: { ai: boolean }) {
  const pathname = usePathname() ?? "/";
  const [state, setState] = useState<State>("closed");
  const [request, setRequest] = useState<AssistantRequest>({ mode: "guide", n: 0 });
  const [expanded, setExpanded] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  // Reopen after a reload if the visitor had it open in this session (their choice, not auto-open).
  // Storage is read after hydration so the server and first client render match.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (read(session, OPEN_KEY) === "1") setState("open");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // First visit: show the label once, then fold it on scroll or after a few seconds.
  useEffect(() => {
    if (read(local, SEEN_KEY)) return;
    const show = requestAnimationFrame(() => {
      write(local, SEEN_KEY, "1");
      setExpanded(true);
    });
    const fold = () => setExpanded(false);
    const t = window.setTimeout(fold, 7000);
    const onScroll = () => {
      if (window.scrollY > 240) fold();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(show);
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const m = (e as CustomEvent<{ mode?: AssistantMode }>).detail?.mode;
      setRequest((r) => ({ mode: m === "human" ? "human" : "guide", n: r.n + 1 }));
      setState("open");
      setExpanded(false);
      write(session, OPEN_KEY, "1");
    };
    window.addEventListener("dechy:assistant", onOpen);
    return () => window.removeEventListener("dechy:assistant", onOpen);
  }, []);

  const hide = useCallback((next: State) => {
    setState(next);
    write(session, OPEN_KEY, null);
    requestAnimationFrame(() => button.current?.focus({ preventScroll: true }));
  }, []);
  const minimize = useCallback(() => hide("minimized"), [hide]);
  const close = useCallback(() => hide("closed"), [hide]);

  const open = () => {
    setState("open");
    setExpanded(false);
    write(session, OPEN_KEY, "1");
  };

  const label = ai ? "Ask DECHY AI" : "Ask DECHY";

  return (
    <>
      {state !== "open" ? (
        <button
          ref={button}
          type="button"
          className="assist-launcher"
          aria-controls="dechy-assistant"
          aria-expanded={false}
          aria-label={label}
          data-expanded={expanded ? "true" : undefined}
          data-ai={ai ? "true" : undefined}
          onClick={open}
        >
          {/* The approved monogram, scaled only. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/dechy-monogram.png"
            alt=""
            width={32}
            height={32}
            className="assist-mark"
          />
          {ai ? (
            <span className="assist-ai" aria-hidden="true">
              AI
            </span>
          ) : null}
          <span className="assist-launcher-label" aria-hidden="true">
            {label}
          </span>
        </button>
      ) : null}
      {state !== "closed" ? (
        <Suspense fallback={null}>
          <AssistantPanel
            ai={ai}
            page={pathname}
            hidden={state === "minimized"}
            request={request}
            onMinimize={minimize}
            onClose={close}
          />
        </Suspense>
      ) : null}
    </>
  );
}
