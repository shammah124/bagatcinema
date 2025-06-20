const CACHE_VERSION = "v2";
const CACHE_NAME = `bagatcinema-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/movies",
];

// INSTALL: Pre-cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate this service worker immediately
});

// ACTIVATE: Delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim(); // Take control of open clients
});

// FETCH: Serve from network first, then cache fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionally update cache in the background here
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        })
      )
  );
});
