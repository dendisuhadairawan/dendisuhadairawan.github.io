// service-worker.js
const CACHE_NAME = 'rental-mobil-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  // tambahkan file-file lain yang perlu di-cache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
