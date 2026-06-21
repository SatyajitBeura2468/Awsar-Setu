const CACHE_NAME = "awsarsetu-v1";
const OFFLINE_URL = "/offline";
const APP_SHELL = ["/", "/explore", "/vacancies", "/saved", "/account", OFFLINE_URL, "/brand/awsarsetu-logo.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (request.url.startsWith(self.location.origin) && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match(OFFLINE_URL);
      }),
  );
});

self.addEventListener("push", (event) => {
  const fallback = {
    title: "AwsarSetu",
    body: "A relevant opportunity update is available.",
    url: "/",
  };
  const data = event.data ? event.data.json() : fallback;
  event.waitUntil(
    self.registration.showNotification(data.title || fallback.title, {
      body: data.body || fallback.body,
      icon: "/brand/awsarsetu-logo.svg",
      badge: "/brand/awsarsetu-logo.svg",
      data: { url: data.url || fallback.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(self.clients.openWindow(url));
});
