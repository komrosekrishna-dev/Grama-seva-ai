// service-worker.js
// Basic offline caching for Graama Seva AI PWA

const CACHE_NAME = "graama-seva-ai-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache first, fall back to network
// Always go to network for API calls (Claude AI requests) so results stay fresh
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls - always fetch fresh from network
  if (url.origin === "https://api.anthropic.com") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache new requests for next time (app shell, static assets)
          return caches.open(CACHE_NAME).then((cache) => {
            if (event.request.method === "GET" && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Offline fallback - serve cached index for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
