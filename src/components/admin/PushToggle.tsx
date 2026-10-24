"use client";

import { useEffect, useState } from "react";

const toKey = (b64: string) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

type State = "loading" | "unsupported" | "install" | "off" | "on" | "blocked" | "busy";

/**
 * Phone alerts for this device (owner, 24 October 2026): registers the admin service worker, asks
 * for permission, and subscribes to web push. On iPhone this works only after DECHY Admin is added
 * to the home screen, so the card says so instead of offering a button that cannot work.
 */
export function PushToggle({ publicKey }: { publicKey: string }) {
  const [state, setState] = useState<State>("loading");
  const [note, setNote] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const standalone = window.matchMedia("(display-mode: standalone)").matches;
        setState(ios && !standalone ? "install" : "unsupported");
        return;
      }
      if (Notification.permission === "denied") return setState("blocked");
      const reg = await navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin/" });
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "on" : "off");
    };
    run().catch(() => setState("unsupported"));
  }, []);

  const post = (body: unknown) =>
    fetch("/api/admin/push/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  async function turnOn() {
    setState("busy");
    setNote("");
    try {
      if ((await Notification.requestPermission()) !== "granted") return setState("blocked");
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toKey(publicKey),
      });
      const device = /Android/.test(navigator.userAgent)
        ? "Android"
        : /iPhone|iPad/.test(navigator.userAgent)
          ? "iPhone"
          : "Computer";
      const res = await post({ action: "subscribe", subscription: sub.toJSON(), device });
      if (!res.ok) throw new Error();
      setState("on");
      setNote("Alerts are on for this device.");
    } catch {
      setState("off");
      setNote("Could not turn alerts on. Try again.");
    }
  }

  async function turnOff() {
    setState("busy");
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await post({ action: "unsubscribe", endpoint: sub.endpoint }).catch(() => null);
      await sub.unsubscribe().catch(() => false);
    }
    setState("off");
    setNote("Alerts are off for this device.");
  }

  async function test() {
    const res = await post({ action: "test" }).catch(() => null);
    const b = (await res?.json().catch(() => null)) as { sent?: number } | null;
    setNote(
      b?.sent
        ? `Test sent to ${b.sent} device${b.sent === 1 ? "" : "s"}.`
        : "No device received it.",
    );
  }

  return (
    <div className="admin-push">
      {state === "install" ? (
        <p className="admin-note">
          On iPhone, first add DECHY Admin to the home screen: tap Share, then Add to Home Screen.
          Open it from there and turn alerts on.
        </p>
      ) : state === "unsupported" ? (
        <p className="admin-note">
          This browser cannot receive alerts. Try Chrome on Android, or the home screen app on
          iPhone.
        </p>
      ) : state === "blocked" ? (
        <p className="admin-note">
          Notifications are blocked for this site. Allow them in the browser or phone settings, then
          reload this page.
        </p>
      ) : (
        <p className="admin-actions">
          {state === "on" ? (
            <>
              <button type="button" className="admin-btn" onClick={test}>
                Send a test alert
              </button>{" "}
              <button type="button" className="admin-btn admin-btn-quiet" onClick={turnOff}>
                Turn off on this device
              </button>
            </>
          ) : (
            <button type="button" className="admin-btn" onClick={turnOn} disabled={state !== "off"}>
              Turn on alerts on this device
            </button>
          )}
        </p>
      )}
      {note ? (
        <p className="admin-note" role="status">
          {note}
        </p>
      ) : null}
    </div>
  );
}
