const CACHE_NAME = 'acnhex-v3.1.0';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/ads.js',
  './js/data.js',
  './js/storage.js',
  './js/reviews.js',
  './js/sounds.js',
  './js/utils.js',
  './js/shared/icons.js',
  './js/shared/helpers.js',
  './js/pages/info.js',
  './js/pages/settings.js',
  './js/pages/cart.js',
  './js/pages/wishlist.js',
  './js/pages/catalog.js',
  './js/pages/detail.js',
  './data/catalog-index.json',
  './data/villagers.json',
  './data/review-templates.json',
  './data/categories/accessories.json',
  './data/categories/art.json',
  './data/categories/bags.json',
  './data/categories/clothing.json',
  './data/categories/fencing.json',
  './data/categories/fish.json',
  './data/categories/flooring.json',
  './data/categories/food.json',
  './data/categories/fossils.json',
  './data/categories/furniture.json',
  './data/categories/gyroids.json',
  './data/categories/headwear.json',
  './data/categories/insects.json',
  './data/categories/music.json',
  './data/categories/other.json',
  './data/categories/photos.json',
  './data/categories/posters.json',
  './data/categories/rugs.json',
  './data/categories/sea-life.json',
  './data/categories/shoes.json',
  './data/categories/socks.json',
  './data/categories/tools.json',
  './data/categories/umbrellas.json',
  './data/categories/wall-items.json',
  './data/categories/wallpaper.json',
  './data/categories/wetsuits.json',
  './manifest.json',
  './icons/icon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.error('SW install failed:', err))
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
  // Only handle same-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  // Strip query string for cache matching
  const url = new URL(e.request.url);
  url.search = '';
  const urlWithoutQuery = url.href;

  const isDataFile = e.request.url.includes('/data/');
  const isNavigation = e.request.mode === 'navigate';

  if (isDataFile) {
    // Network-first for data files (ensures fresh data)
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(urlWithoutQuery, clone));
        }
        return resp;
      }).catch(() => {
        return caches.open(CACHE_NAME).then(cache => cache.match(urlWithoutQuery));
      })
    );
  } else {
    // Network-first for app shell (CSS, JS, HTML)
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(urlWithoutQuery, clone));
        }
        return resp;
      }).catch(() => {
        return caches.open(CACHE_NAME).then(cache => {
          return cache.match(urlWithoutQuery).then(cached => {
            if (cached) return cached;
            // Only fall back to index.html for navigation requests
            if (isNavigation) return cache.match('./index.html');
            return new Response('Offline', { status: 503 });
          });
        });
      })
    );
  }
});
