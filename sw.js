/* =====================================================================
   SOCIALICE · Service Worker (modo "siempre fresco")
   ---------------------------------------------------------------------
   Durante el desarrollo NO queremos caché: borra todas las cachés viejas
   y siempre va a la red. Así nunca te quedas viendo una versión anterior.
   ===================================================================== */

const VERSION = 'socialice-no-cache-v31';

// Al instalar: toma el control de inmediato
self.addEventListener('install', () => { self.skipWaiting(); });

// Al activar: BORRA todas las cachés y controla las pestañas abiertas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cada petición va directo a la red (sin caché)
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
