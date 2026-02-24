const CACHE_NAME = 'acnhex-v25';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/ads.js',
  './js/data.js',
  './js/storage.js',
  './js/reviews.js',
  './data/catalog-index.json',
  './data/villagers.json',
  './data/review-templates.json',
  './manifest.json',
  './icons/icon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Strip query strings for cache matching so ?v=25 hits the cached asset
  url.search = '';
  const cleanRequest = new Request(url.toString(), e.request);

  // Network-first for app shell (HTML, CSS, JS) so updates are picked up immediately
  // Cache-first only for large data files (JSON) for performance
  const isDataFile = e.request.url.includes('/data/');

  if (isDataFile) {
    // Cache-first for data files
    e.respondWith(
      caches.match(cleanRequest).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(resp => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(cleanRequest, clone));
          }
          return resp;
        });
      }).catch(() => caches.match('./index.html'))
    );
  } else {
    // Network-first for app shell (CSS, JS, HTML)
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(cleanRequest, clone));
        }
        return resp;
      }).catch(() => caches.match(cleanRequest).then(cached => cached || caches.match('./index.html')))
    );
  }
});
