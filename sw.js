// ==============================
// Service Worker for PWA
// ==============================

const CACHE_NAME = 'almassia-kitchens-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/calculator.js',
  '/js/gallery.js',
  '/js/form-handler.js',
  '/images/logo-light.webp',
  '/images/logo-dark.webp',
  '/images/kitchen1.webp',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Install event
self.addEventListener('install', function (event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', function (event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', function (event) {
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Clone the request
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(
            function (response) {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function (cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          ).catch(function (error) {
            console.log('Fetch failed; returning offline page instead.', error);
            // You can return a custom offline page here
          });
        })
    );
  }
});

// Background sync for form submissions
self.addEventListener('sync', function (event) {
  if (event.tag === 'background-form-sync') {
    console.log('Background sync for forms');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background form submission logic here
  console.log('Performing background sync...');
}