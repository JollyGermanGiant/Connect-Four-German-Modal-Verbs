// service-worker.js
const CACHE_NAME = "connect-four-v5"; // increment this when you update assets
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
  // add any other JS/CSS/assets your game uses
];

// Install: cache all assets
self.addEventListener("install", event => {
  console.log("🛠️ Installing service worker and caching assets...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // activate new SW immediately
  );
});

// Activate: clean up old caches
self.addEventListener("activate", event => {
  console.log("♻️ Activating service worker and removing old caches...");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // keep only current cache
          .map(key => caches.delete(key))
      ).then(() => self.clients.claim()) // take control of all pages
    )
  );
});

// Fetch: respond with cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // fallback if offline and asset not cached
        return caches.match("./index.html");
      })
  );
});
