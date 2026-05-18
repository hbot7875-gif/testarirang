const CACHE_NAME = 'arirang-store-v4';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      '/dashboard.html',
      '/app.js',
      '/styles.css',
      '/arirang logo.jpg'
    ]))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

// Support for Push Notifications (Ready for Backend Web-Push Integration)
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Arirang Ops Update';
  const options = {
    body: data.message || 'New directive received.',
    icon: '/arirang logo.jpg',
    badge: '/arirang logo.jpg'
  };
  e.waitUntil(
    self.registration.showNotification(title, options)
  );
});
