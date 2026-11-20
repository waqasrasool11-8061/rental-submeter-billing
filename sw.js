// Service Worker for Rental Sub-Meter & Billing Portal PWA
const CACHE_NAME = 'rental-billing-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './APP%20ICON.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/favicon.png',
  './icons/apple-touch-icon.png',
  './data/bills.json',
  './data/readings.json',
  './data/settings.json',
  './data/ledger.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets v3');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // کلاؤڈ ڈیٹا نیٹ ورک سے آئے
  if (url.includes('api.github.com') || url.includes('raw.githubusercontent.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // HTML صفحات ہمیشہ نیٹ ورک فرسٹ تاکہ تازہ ترین لاگ آؤٹ اور تبدیلیاں فوراً موبائل پر پہنچیں
  if (event.request.mode === 'navigate' || event.request.destination === 'document' || url.endsWith('/') || url.includes('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // باقی اسٹیٹک فائلز (تصاویر، لوگو، مینی فیسٹ) کیشے سے فاسٹ لوڈنگ
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((response) => {
        return response;
      });
    })
  );
});
