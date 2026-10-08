"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

/** The panel is loaded only when a visitor opens it, so pages carry almost no assistant code. */
const AssistantPanel = lazy(() => import("./AssistantPanel"));

export type AssistantMode = "guide" | "human";

/** Opens the assistant from anywhere on the page (for example the contact page paths). */
export function openAssistant(mode: AssistantMode = "guide") {
  window.dispatchEvent(new CustomEvent("dechy:assistant", { detail: { mode } }));
}

export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("guide");
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const m = (e as CustomEvent<{ mode?: AssistantMode }>).detail?.mode;
      setMode(m === "human" ? "human" : "guide");
      setOpen(true);
    };
    window.addEventListener("dechy:assistant", onOpen);
    return () => window.removeEventListener("dechy:assistant", onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => button.current?.focus());
  }, []);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="assist-launcher"
        aria-expanded={open}
        aria-controls="dechy-assistant"
        onClick={() => (open ? close() : (setMode("guide"), setOpen(true)))}
        data-open={open ? "true" : undefined}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="assist-launcher-icon">
          <path
            d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 16 14H9l-3.5 2.75V14H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 8.25h7M6.5 10.75h4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span>{open ? "Close assistant" : "Ask DECHY"}</span>
      </button>
      {open ? (
        <Suspense
          fallback={
            <div id="dechy-assistant" className="assist-panel assist-panel-loading" role="status">
              Opening the assistant
            </div>
          }
        >
          <AssistantPanel key={mode} initialMode={mode} onClose={close} />
        </Suspense>
      ) : null}
    </>
  );
}
