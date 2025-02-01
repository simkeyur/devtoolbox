const CACHE_NAME = 'dev-tools-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/icons/logo.svg',
  // Add other assets (e.g., fonts, icons) here
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => {
        console.error('Failed to cache assets:', err);
      })
  );
});

// Fetch cached assets or fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached asset if found
        if (response) {
          return response;
        }
        // Fallback to network
        return fetch(event.request);
      })
      .catch(() => {
        // Fallback to a custom offline page (optional)
        return caches.match('/offline.html');
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});