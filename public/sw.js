const CACHE_NAME = 'hayir-takip-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // PWA yükleme kriteri için fetch handler boş olmamalıdır
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = null;
  try {
    payload = event.data.json();
  } catch {
    payload = { notification: { title: 'Hayır Takip Bildirimi', body: event.data.text() } };
  }

  const title = payload?.notification?.title ?? 'Hayır Takip Bildirimi';
  const body = payload?.notification?.body ?? '';
  const icon = payload?.notification?.icon ?? '/icons/icon-192.svg';
  const badge = payload?.notification?.badge ?? '/icons/icon-192.svg';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: payload?.data ?? {},
    })
  );
});
