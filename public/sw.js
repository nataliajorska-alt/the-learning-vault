// The Learning Vault — service worker
// Strategy: network-first for navigation and Next.js static assets,
// fall back to cache when offline. Skip Firebase/API traffic entirely
// so writes still queue via Firestore offline persistence.

// Bump przy każdym istotnym wydaniu — activate kasuje stare cache (!== CACHE),
// więc to czyści też zalegające hashowane chunki z poprzednich deployów.
const CACHE = "tlv-shell-v2";
// Twardy limit wpisów — runtime cache (HTML, _next, ~5 MB grafik z /art) nie
// rośnie już w nieskończoność; najstarsze wpisy wypadają (LRU po kolejności).
const MAX_ENTRIES = 64;

async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(
    keys.slice(0, keys.length - max).map((k) => cache.delete(k))
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin (Firebase, Google Fonts CDN, etc.) — let them go through.
  if (url.origin !== self.location.origin) return;

  // Skip API routes — they need fresh responses (and we don't want to cache
  // /api/generate or /api/grade responses).
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.status === 200 && fresh.type === "basic") {
          const copy = fresh.clone();
          caches
            .open(CACHE)
            .then((c) => c.put(request, copy))
            .then(() => trimCache(CACHE, MAX_ENTRIES))
            .catch(() => {});
        }
        return fresh;
      } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
        // Navigation fallback — serve any cached HTML so the SPA shell loads.
        if (request.mode === "navigate") {
          const fallback = await caches.match("/");
          if (fallback) return fallback;
        }
        return new Response("Offline", {
          status: 503,
          statusText: "Offline",
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })()
  );
});
