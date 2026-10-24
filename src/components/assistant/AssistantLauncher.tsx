"use client";

import { usePathname } from "next/navigation";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/** The panel is loaded only when a visitor opens it, so pages carry almost no assistant code. */
const AssistantPanel = lazy(() => import("./AssistantPanel"));

export type AssistantMode = "guide" | "human";
export type AssistantRequest = { mode: AssistantMode; n: number };

/** Opens the assistant from anywhere on the page (for example the contact page paths). */
export function openAssistant(mode: AssistantMode = "guide") {
  window.dispatchEvent(new CustomEvent("dechy:assistant", { detail: { mode } }));
}

/** Per-viewer convenience only: whether the panel was open, to reopen it after a reload. */
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
const session = () => window.sessionStorage;

type State = "closed" | "open" | "minimized";

/** What the launcher must never cover on a phone: the cookie choice, the footer, a form's buttons. */
const KEEP_CLEAR =
  ".consent, footer, form button[type='submit'], form .btn, .est-actions, .search-dialog[open]";

/**
 * On phones, true while anything that must stay tappable sits in the strip at the bottom of the
 * screen where the launcher floats.
 */
function useKeepClear(active: boolean) {
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    if (!active) return;
    const phone = window.matchMedia("(max-width: 39.99rem)");
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!phone.matches) return setBlocked(false);
        const top = window.innerHeight - 96;
        const hit = [...document.querySelectorAll<HTMLElement>(KEEP_CLEAR)].some((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.bottom > top && r.top < window.innerHeight;
        });
        setBlocked(hit);
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: false });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      mo.disconnect();
    };
  }, [active]);
  return blocked;
}

/**
 * The DECHY assistant launcher (owner, 24 October 2026): a dark pill with a small chat icon and
 * "Ask DECHY", bottom right. It slides in once after the page settles; nothing pulses or opens by
 * itself. On phones it steps aside while the cookie choice, the footer, or a form's buttons are
 * under it. The panel stays mounted while minimized so a draft and the scroll position survive,
 * and the conversation itself lives on the server for the rest of the session.
 */
export function AssistantLauncher({ ai }: { ai: boolean }) {
  const pathname = usePathname() ?? "/";
  const [state, setState] = useState<State>("closed");
  const [request, setRequest] = useState<AssistantRequest>({ mode: "guide", n: 0 });
  const button = useRef<HTMLButtonElement>(null);
  const blocked = useKeepClear(state !== "open");

  // Reopen after a reload if the visitor had it open in this session (their choice, not auto-open).
  // Storage is read after hydration so the server and first client render match.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (read(session, OPEN_KEY) === "1") setState("open");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const m = (e as CustomEvent<{ mode?: AssistantMode }>).detail?.mode;
      setRequest((r) => ({ mode: m === "human" ? "human" : "guide", n: r.n + 1 }));
      setState("open");
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
    track("assistant_open", { page_path: window.location.pathname });
    setState("open");
    write(session, OPEN_KEY, "1");
  };

  return (
    <>
      {state !== "open" ? (
        <button
          ref={button}
          type="button"
          className="assist-launcher"
          aria-controls="dechy-assistant"
          aria-expanded={false}
          data-hide={blocked ? "true" : undefined}
          tabIndex={blocked ? -1 : undefined}
          onClick={open}
        >
          <span className="assist-launcher-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path
                d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3h0A2.5 2.5 0 0 1 4 10.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 7.5h5M7.5 10h3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>Ask DECHY</span>
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
