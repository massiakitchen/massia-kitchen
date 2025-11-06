// Service Worker for Caching
const CACHE_NAME = 'almassia-v1.2.0';
const urlsToCache = [
  '/',
  '/style.css',
  '/script.js',
  '/images/logo-light.png',
  '/images/logo-dark.png',
  '/images/kitchen1.webp',
  '/images/kitchen2.webp'
];

// Install Event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch new
        return response || fetch(event.request);
      }
    )
  );
});

// Activate Event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
