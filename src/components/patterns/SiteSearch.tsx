"use client";

import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Highlight,
  SearchSuggestions,
  resultText,
  useSiteIndex,
} from "@/components/patterns/search/SearchKit";

export const OPEN_SEARCH_EVENT = "dechy:search";

const PAGE = 8;

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
 * element). It fetches one static index on first open and matches in the browser as you type:
 * partial words, small typos, and plurals still match. Every match is reachable: the first eight,
 * then more on request, then the full results page. Opening: the header button, "/" outside a text
 * field, or Ctrl/Cmd+K.
 */
export function SiteSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [active, setActive] = useState(0);
  const { index, entries, failed } = useSiteIndex(opened);
  const deferred = useDeferredValue(query);
  const uid = useId();
  const listId = `${uid}-results`;

  const result = useMemo(
    () => (index && deferred.trim() ? index.search(deferred) : null),
    [index, deferred],
  );
  const hits = result?.hits ?? [];
  const visible = hits.slice(0, shown);
  const firstPartial = visible.findIndex((h) => !h.full);
  const safeActive = Math.min(active, Math.max(0, visible.length - 1));

  const open = useCallback(() => {
    const d = dialog.current;
    if (!d || d.open) return;
    setOpened(true);
    d.showModal();
    input.current?.focus();
  }, []);

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

  const go = (path: string) => {
    close();
    router.push(path);
  };
  const seeAll = () => go(`/search/?q=${encodeURIComponent(query.trim())}`);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      // A search field clears itself on Escape; here Escape always closes the dialog.
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((safeActive + 1) % Math.max(1, visible.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((safeActive - 1 + visible.length) % Math.max(1, visible.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = visible[safeActive];
      if (hit && entries) go(entries[hit.doc]!.p);
      else if (query.trim()) seeAll();
    }
  };

  const q = query.trim();
  const status = failed
    ? "Search is not available right now. Use the menu to browse."
    : q && !index
      ? "Loading search..."
      : q && index && deferred === query
        ? hits.length === 0
          ? `Nothing matches "${q}". Try another word, or start from one of these.`
          : (() => {
              const full = hits.filter((h) => h.full).length;
              return full
                ? `${full} ${full === 1 ? "result" : "results"}${hits.length > full ? `, plus ${hits.length - full} partial matches` : ""}`
                : `${hits.length} pages mention some of these words`;
            })()
        : "";

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={open}
        aria-label="Search the site (Ctrl+K)"
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
          setShown(PAGE);
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
              aria-expanded={visible.length > 0}
              aria-controls={listId}
              aria-activedescendant={visible.length ? `${uid}-r${safeActive}` : undefined}
              aria-label="Search pages, services, articles, and questions"
              placeholder="Search pages, services, articles, and questions"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
                setShown(PAGE);
              }}
              onKeyDown={onInputKey}
              className="search-input"
            />
            <kbd className="search-kbd" aria-hidden="true">
              Esc
            </kbd>
            <button type="button" onClick={close} className="search-close">
              Close
            </button>
          </div>
          <div aria-live="polite" className="search-status">
            {status}
          </div>
          <div className="search-scroll">
            {q && result && visible.length > 0 ? (
              <ul id={listId} role="listbox" aria-label="Results" className="search-results">
                {visible.map((h, i) => {
                  const e = entries![h.doc]!;
                  return (
                    <li
                      key={`${e.p}|${e.t}`}
                      id={`${uid}-r${i}`}
                      role="option"
                      aria-selected={i === safeActive}
                      data-active={i === safeActive}
                      data-partial-start={i === firstPartial && i > 0 ? "true" : undefined}
                    >
                      <a
                        href={e.p}
                        tabIndex={-1}
                        onMouseEnter={() => setActive(i)}
                        onClick={(ev) => {
                          ev.preventDefault();
                          go(e.p);
                        }}
                      >
                        <span className="search-title">
                          <Highlight text={e.t} terms={result.terms} />
                        </span>
                        <span className="search-kind">{e.k}</span>
                        <span className="search-desc">
                          <Highlight text={resultText(e, result.terms)} terms={result.terms} />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {q && hits.length > shown ? (
              <button type="button" className="search-more" onClick={() => setShown((n) => n + 10)}>
                Show more results ({hits.length - shown} more)
              </button>
            ) : null}
            {!q || (result && hits.length === 0) ? (
              <SearchSuggestions
                onPick={(s) => {
                  setQuery(s);
                  setShown(PAGE);
                  input.current?.focus();
                }}
                onNavigate={close}
              />
            ) : null}
          </div>
          <div className="search-foot">
            {q && hits.length > 0 ? (
              <button type="button" className="search-all" onClick={seeAll}>
                See all {hits.length} results
              </button>
            ) : (
              <span />
            )}
            <p className="search-hint">
              <kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>/</kbd> to search, arrows to move, Enter to open
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
