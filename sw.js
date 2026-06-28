/* =====================================================================
   SOCIALICE · Service Worker
   ---------------------------------------------------------------------
   Hace que la app sea PWA: guarda los archivos en caché para que abra
   rápido y funcione aunque no haya internet.
   Cuando cambies archivos, sube el número de CACHE_VERSION y el navegador
   tomará la versión nueva.
   ===================================================================== */

const CACHE_VERSION = 'socialice-v7';

// Archivos básicos que queremos disponibles sin conexión
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './manifest.json'
];

// Al instalar: guardamos los archivos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Al activar: borramos cachés viejas de versiones anteriores
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Al pedir un archivo: PRIMERO la red (para ver siempre lo más nuevo
// mientras desarrollamos) y, si no hay internet, usamos la caché.
// Así nunca te quedas viendo una versión vieja.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        // Guardamos una copia fresca en caché para cuando no haya red
        const copia = resp.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request))  // sin internet → caché
  );
});
