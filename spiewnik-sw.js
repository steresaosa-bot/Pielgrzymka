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
    event.respondWith(
      caches.match(req).then(cached => {
        const networkFetch = fetch(req).then(response => {
          // Update cache in background
          caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone()));
          return response;
        }).catch(() => cached);

        // Prefer cached response, fall back to network
        return cached || networkFetch;
      }).catch(() => {
        // If everything fails, and it's a navigation, show index
        if (req.mode === 'navigate') return caches.match('./index.html');
      })
    );
  }
});
