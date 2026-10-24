// Self-destructing Service Worker
// Automatically unregisters legacy PWA service workers and purges cached assets

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        for (const client of clients) {
          if (client.url && 'navigate' in client) {
            client.navigate(client.url);
          }
        }
      });
    })
  );
});
