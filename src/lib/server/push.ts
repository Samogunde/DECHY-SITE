/**
 * Web push for DECHY Admin (owner, 24 October 2026): phone notifications from the installed admin
 * app for new leads and requests for a person. Works on Android, and on iPhone once DECHY Admin is
 * added to the home screen (iOS 16.4 or later).
 *
 * The VAPID key pair that signs pushes is created by the server the first time alerts are turned
 * on, and kept in private storage, so no key is ever copied by hand. VAPID_PUBLIC_KEY and
 * VAPID_PRIVATE_KEY (from `npm run admin:vapid`) are used instead when both are set.
 *   VAPID_SUBJECT   a contact for push services (default mailto:hello@...)
 *
 * The notification says what happened, the name, and the page, never an email address or message,
 * and opens the record in DECHY Admin. Subscriptions are stored per device; an expired one is
 * removed the first time a push to it fails. Server-only.
 */
import crypto from "node:crypto";
import webpush from "web-push";
import { EMAILS } from "@/lib/contact/emails";
import type { Store } from "./store";

type Env = Record<string, string | undefined>;

export type PushSubscriptionRecord = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: string;
  device: string;
};

export type PushMessage = { title: string; body: string; url: string; tag?: string };

export type VapidKeys = { publicKey: string; privateKey: string };

/**
 * The key pair: the environment's, else the stored one, else (with create) a new one saved for
 * every later push. Without create, null means push has never been turned on.
 */
export async function vapidKeys(
  store: Store | null,
  env: Env = process.env,
  create = false,
): Promise<VapidKeys | null> {
  const publicKey = env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = env.VAPID_PRIVATE_KEY?.trim();
  if (publicKey && privateKey) return { publicKey, privateKey };
  if (!store || store.kind === "none") return null;
  const stored = await store.get<VapidKeys>("admin/vapid").catch(() => null);
  if (stored) return stored;
  if (!create) return null;
  const fresh = webpush.generateVAPIDKeys();
  await store.set("admin/vapid", fresh);
  return fresh;
}

const keyOf = (endpoint: string) =>
  `push/${crypto.createHash("sha256").update(endpoint).digest("hex").slice(0, 32)}`;

export function validSubscription(
  raw: unknown,
): raw is Omit<PushSubscriptionRecord, "createdAt" | "device"> {
  const s = raw as PushSubscriptionRecord | null;
  return Boolean(
    s &&
    typeof s.endpoint === "string" &&
    /^https:\/\//.test(s.endpoint) &&
    s.endpoint.length < 1000 &&
    typeof s.keys?.p256dh === "string" &&
    typeof s.keys?.auth === "string" &&
    s.keys.p256dh.length < 200 &&
    s.keys.auth.length < 100,
  );
}

export async function saveSubscription(
  store: Store,
  sub: Omit<PushSubscriptionRecord, "createdAt" | "device">,
  device: string,
) {
  const rec: PushSubscriptionRecord = {
    endpoint: sub.endpoint,
    keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    createdAt: new Date().toISOString(),
    device: device.slice(0, 80),
  };
  await store.set(keyOf(sub.endpoint), rec);
}

export async function removeSubscription(store: Store, endpoint: string) {
  await store.delete(keyOf(endpoint));
}

export async function listSubscriptions(store: Store): Promise<PushSubscriptionRecord[]> {
  const keys = await store.list("push/");
  const all = await Promise.all(keys.map((k) => store.get<PushSubscriptionRecord>(k)));
  return all.filter((s): s is PushSubscriptionRecord => s !== null);
}

/** Sends one notification to every subscribed device. Never throws. */
export async function sendPush(
  store: Store,
  msg: PushMessage,
  env: Env = process.env,
  send: typeof webpush.sendNotification = webpush.sendNotification.bind(webpush),
): Promise<{ sent: number; removed: number }> {
  const keys = await vapidKeys(store, env);
  if (!keys) return { sent: 0, removed: 0 };
  const subs = await listSubscriptions(store).catch(() => []);
  const options = {
    TTL: 6 * 60 * 60,
    urgency: "high" as const,
    vapidDetails: {
      subject: env.VAPID_SUBJECT?.trim() || `mailto:${EMAILS.hello}`,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    },
  };
  let sent = 0;
  let removed = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await send({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(msg), options);
        sent++;
      } catch (e) {
        const status = (e as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await removeSubscription(store, s.endpoint).catch(() => {});
          removed++;
        }
      }
    }),
  );
  return { sent, removed };
}
