const CACHE_NAME = 'spiewnik-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  'barka.md',
  'cześć.md',
  'gwiazdo.md',
  'idźmy.md',
  'jasnogórska.md',
  'Krolowej.md',
  'kto.md',
  'matko.md',
  'pan.md',
  'pod.md',
  'serdeczna matko.md',
  'uczyńcie.md',
  'weź.md',
  'Z dawna Polski Tyś Królową.md',
  'zdrowaś.md',
  'barka.html',
  'cześć.html',
  'gwiazdo.html',
  'idźmy.html',
  'jasnogórska.html',
  'Krolowej.html',
  'kto.html',
  'matko.html',
  'pan.html',
  'pod.html',
  'serdeczna matko.html',
  'uczyńcie.html',
  'weź.html',
  'Z dawna Polski Tyś Królową.html',
  'zdrowaś.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      // For navigation requests (page loads) prefer network first so users get
      // the latest HTML; fall back to cached index.html when offline.
      if (req.mode === 'navigate') {
        try {
          const networkResponse = await fetch(req);
          // update cache in background
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, networkResponse.clone()).catch(() => {});
          return networkResponse;
        } catch (err) {
          const cached = await caches.match('./index.html');
          if (cached) return cached;
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      }

      // For other requests use cache-first then network
      try {
        const cached = await caches.match(req);
        if (cached) return cached;
        const response = await fetch(req);
        // update cache in background
        caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone())).catch(() => {});
        return response;
      } catch (err) {
        // final fallback for navigations handled above; otherwise undefined
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
  }
});
