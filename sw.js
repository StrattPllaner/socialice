/* =====================================================================
   SOCIALICE · Service Worker (modo "siempre fresco")
   ---------------------------------------------------------------------
   Durante el desarrollo NO queremos caché: borra todas las cachés viejas
   y siempre va a la red. Así nunca te quedas viendo una versión anterior.
   ===================================================================== */

const VERSION = 'socialice-no-cache-v36';

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

// Cada petición va directo a la red SALTÁNDOSE la caché HTTP del navegador
// (cache: 'no-store'): sin esto, Safari/Chrome guardan index.html hasta 10
// min (max-age de GitHub Pages) y el usuario "no ve" los cambios recién
// publicados aunque el servidor ya los sirva.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
  );
});
