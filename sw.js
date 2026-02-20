const CACHE_NAME = 'acnhex-v16';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/data.js',
  './js/storage.js',
  './data/catalog-index.json',
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
  // Strip query strings for cache matching so ?v=8 hits the cached asset
  url.search = '';
  const cleanRequest = new Request(url.toString(), e.request);

  e.respondWith(
    caches.match(cleanRequest).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok && e.request.url.includes('/data/')) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(cleanRequest, clone));
        }
        return resp;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
