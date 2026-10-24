/*
 * DECHY Admin service worker (owner, 24 October 2026): shows phone notifications for new leads
 * and requests for a person, and opens the record when one is tapped. It caches nothing, so no
 * private data is ever stored on the device by it.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let msg = { title: "DECHY Admin", body: "Something new is waiting.", url: "/admin/" };
  try {
    msg = { ...msg, ...event.data.json() };
  } catch {
    // a push without a readable body still shows the default notification
  }
  event.waitUntil(
    self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: msg.tag,
      data: { url: msg.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = (event.notification.data && event.notification.data.url) || "/admin/";
  const url = new URL(path.startsWith("/admin/") ? path : "/admin/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.startsWith(self.location.origin + "/admin/") && "focus" in c) {
          c.navigate(url);
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
