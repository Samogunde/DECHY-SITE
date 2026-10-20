"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The page motion driver. It adds no visual output of its own. Three jobs, all optional
 * enhancement (the page is complete and visible without it):
 *
 *  1. Entrance reveals: elements marked data-reveal that start below the fold are set to
 *     data-state="hidden" and flipped to "shown" as they scroll into view. CSS does the
 *     animation (opacity and a small rise), so there is no JavaScript animation.
 *  2. Diagram pause: figures carry data-inview, so looping diagram motion only runs on screen.
 *  3. Header state: data-scrolled on the sticky header once the page has moved.
 *
 * With prefers-reduced-motion: reduce nothing is ever hidden and no reveal runs.
 * Content already in the first screen is never hidden, so nothing waits on this script.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        header?.toggleAttribute("data-scrolled", window.scrollY > 8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Open on hover (owner direction, 20 October 2026): on devices with a real pointer, questions
  // open when the pointer is over them and close when it leaves, and tabs switch on hover. Clicks,
  // taps, and the keyboard keep working exactly as before.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onOver = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      const details = t?.closest<HTMLDetailsElement>("main details");
      if (details && !details.open) {
        details.open = true;
        details.dataset.hoverOpened = "true";
      }
      const tab = t?.closest<HTMLElement>('main [role="tab"]');
      if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
    };
    const onOut = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      const details = (e.target as Element | null)?.closest<HTMLDetailsElement>("main details");
      if (!details || details.contains(e.relatedTarget as Node | null)) return;
      if (details.dataset.hoverOpened === "true") {
        details.open = false;
        delete details.dataset.hoverOpened;
      }
    };
    // A click on an open question keeps it open for reading.
    const onClick = (e: MouseEvent) => {
      const summary = (e.target as Element | null)?.closest("main summary");
      const details = summary?.parentElement as HTMLDetailsElement | null;
      if (details?.dataset.hoverOpened === "true") {
        e.preventDefault();
        delete details.dataset.hoverOpened;
      }
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const figures = targets.filter((el) => el.dataset.reveal === "figure");
    if (typeof IntersectionObserver === "undefined") return;

    // Looping diagram motion pauses off screen (battery and CPU), independent of reveals.
    const viewObserver = new IntersectionObserver((entries) => {
      for (const e of entries) (e.target as HTMLElement).dataset.inview = String(e.isIntersecting);
    });
    figures.forEach((el) => viewObserver.observe(el));

    if (reduce.matches) return () => viewObserver.disconnect();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.state = "shown";
          revealObserver.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    const fold = window.innerHeight * 0.92;
    for (const el of targets) {
      if (el.dataset.state === "shown") continue;
      if (!el.dataset.state) {
        // Anything already on screen (or above it, after a restored scroll) stays as it is.
        if (el.getBoundingClientRect().top < fold) continue;
        el.dataset.state = "hidden";
      }
      // Re-observe elements left hidden by an earlier run (development double-invoke, remount).
      revealObserver.observe(el);
    }
    const showAll = () => {
      document.querySelectorAll<HTMLElement>('[data-state="hidden"]').forEach((el) => {
        el.dataset.state = "shown";
      });
    };
    reduce.addEventListener("change", showAll);
    return () => {
      reduce.removeEventListener("change", showAll);
      revealObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
