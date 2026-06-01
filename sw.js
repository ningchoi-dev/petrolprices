// PetrolPrices service worker — installable + offline shell.
// The API (cross-origin Worker) is never cached here; it has its own edge cache.
const CACHE = "pp-shell-v1";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let the FuelWatch Worker API hit the network

  // Page loads: network-first (always fresh prices), fall back to cached shell when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put("/index.html", copy)); return r; })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }
  // Other same-origin assets (icon, manifest): cache-first.
  e.respondWith(caches.match(req).then((c) => c || fetch(req)));
});
