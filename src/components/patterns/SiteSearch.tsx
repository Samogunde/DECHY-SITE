"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchEntries, type SearchEntry } from "@/lib/search";

export const OPEN_SEARCH_EVENT = "dechy:search";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Site search in a native modal dialog (focus trap, Escape, and inert backdrop come with the
 * element). It fetches one static index on first open, matches in the browser, and stores nothing.
 * Opening: the header button, "/" outside a text field, or Ctrl/Cmd+K.
 */
export function SiteSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const uid = useId();
  const listId = `${uid}-results`;

  const load = useCallback(() => {
    if (entries || failed) return;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: SearchEntry[]) => setEntries(j))
      .catch(() => setFailed(true));
  }, [entries, failed]);

  const open = useCallback(() => {
    const d = dialog.current;
    if (!d || d.open) return;
    load();
    d.showModal();
    input.current?.focus();
  }, [load]);

  const close = useCallback(() => {
    dialog.current?.close();
  }, []);

  useEffect(() => {
    const onEvent = () => open();
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onEvent);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onEvent);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = entries ? searchEntries(entries, query, 8) : [];
  const safeActive = Math.min(active, Math.max(0, results.length - 1));

  const go = (path: string) => {
    close();
    router.push(path);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      // A search field clears itself on Escape; here Escape always closes the dialog.
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((safeActive + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((safeActive - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[safeActive]) {
      e.preventDefault();
      go(results[safeActive]!.p);
    }
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={open}
        aria-label="Search the site"
        aria-haspopup="dialog"
        className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-ink hover:text-blue ${className}`}
      >
        <SearchIcon />
      </button>
      <dialog
        ref={dialog}
        aria-label="Search the site"
        className="search-dialog"
        onClose={() => {
          setQuery("");
          setActive(0);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="search-panel">
          <div className="search-field">
            <SearchIcon />
            <input
              ref={input}
              type="search"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-activedescendant={results.length ? `${uid}-r${safeActive}` : undefined}
              aria-label="Search services, technologies, and work"
              placeholder="Search services, technologies, and work"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              className="search-input"
            />
            <button type="button" onClick={close} className="search-close">
              Close
            </button>
          </div>
          <div aria-live="polite" className="search-status t-small">
            {failed
              ? "Search is not available right now. Use the menu to browse."
              : query.trim() && entries && results.length === 0
                ? `No pages match "${query.trim()}". Try a service, a technology, or a kind of system.`
                : ""}
          </div>
          <ul id={listId} role="listbox" aria-label="Results" className="search-results">
            {results.map((r, i) => (
              <li
                key={r.p}
                id={`${uid}-r${i}`}
                role="option"
                aria-selected={i === safeActive}
                data-active={i === safeActive}
              >
                <a
                  href={r.p}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    go(r.p);
                  }}
                >
                  <span className="search-title">{r.t}</span>
                  <span className="search-kind">{r.k}</span>
                  <span className="search-desc">{r.d}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="search-hint t-caption">
            Press / to search from any page. Use the arrow keys, Enter to open, Escape to close.
          </p>
        </div>
      </dialog>
    </>
  );
}
