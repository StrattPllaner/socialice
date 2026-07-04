/* =====================================================================
   SOCIALICE · Service Worker (modo "siempre fresco")
   ---------------------------------------------------------------------
   Durante el desarrollo NO queremos caché: borra todas las cachés viejas
   y siempre va a la red. Así nunca te quedas viendo una versión anterior.
   ===================================================================== */

const VERSION = 'socialice-no-cache-v41';

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

// El CÓDIGO (html/css/js) va siempre fresco saltándose la caché HTTP
// (sin esto Safari/Chrome guardan index.html hasta 10 min y el usuario "no
// ve" los cambios recién publicados). Los MEDIOS pesados (videos de fondo,
// fotos, SVGs) SÍ usan la caché normal del navegador: si no, un video de
// 28MB se re-descargaría completo en cada visita.
const MEDIA = /\.(mp4|webm|jpe?g|png|svg|gif|ico)(\?|$)/i;
self.addEventListener('fetch', (e) => {
  const esMedia = MEDIA.test(e.request.url);
  e.respondWith(
    fetch(e.request, esMedia ? undefined : { cache: 'no-store' })
      .catch(() => caches.match(e.request))
  );
});
