/* =====================================================================
   SOCIALICE · Service Worker
   ---------------------------------------------------------------------
   CÓDIGO (html/css/js): siempre fresco, directo a la red sin caché HTTP
   (así nunca te quedas viendo una versión anterior).
   MEDIOS (videos/fotos): caché PERSISTENTE en Cache Storage — se bajan
   UNA vez y después arrancan al instante, incluso los pedidos de rango
   de los <video> se responden desde la caché (206 rebanado a mano,
   Safari lo exige). OJO: si un video cambia bajo el MISMO nombre de
   archivo, hay que bumpear VERSION para que se vuelva a bajar.
   ===================================================================== */

const VERSION = 'socialice-v44-media-cache';
const MEDIA = /\.(mp4|webm|jpe?g|png|svg|gif|ico)(\?|$)/i;

// Al instalar: toma el control de inmediato
self.addEventListener('install', () => { self.skipWaiting(); });

// Al activar: borra las cachés de versiones anteriores y controla las pestañas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rellena la caché con el archivo COMPLETO en segundo plano (sin duplicar
// descargas si varios pedidos llegan a la vez)
const _llenando = new Set();
function llenarCache(url) {
  if (_llenando.has(url)) return;
  _llenando.add(url);
  caches.open(VERSION)
    .then(async (cache) => {
      if (await cache.match(url)) return;
      const r = await fetch(url);
      if (r.status === 200) await cache.put(url, r);
    })
    .catch(() => {})
    .finally(() => _llenando.delete(url));
}

async function mediaDesdeCache(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req.url);
  const range = req.headers.get('range');
  if (hit) {
    if (!range) return hit;
    // <video> pide rangos: rebanamos el cuerpo cacheado y devolvemos 206
    const buf = await hit.arrayBuffer();
    const m = /bytes=(\d+)-(\d*)/.exec(range);
    const ini = m ? +m[1] : 0;
    const fin = m && m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
    return new Response(buf.slice(ini, fin + 1), {
      status: 206,
      headers: {
        'Content-Type': hit.headers.get('Content-Type') || 'video/mp4',
        'Content-Range': `bytes ${ini}-${fin}/${buf.byteLength}`,
        'Content-Length': String(fin - ini + 1),
        'Accept-Ranges': 'bytes'
      }
    });
  }
  if (!range) {
    // Primera bajada completa (la precarga de la app entra por aquí):
    // se guarda en caché mientras se entrega
    const r = await fetch(req);
    if (r.status === 200) cache.put(req.url, r.clone());
    return r;
  }
  // Rango sin caché todavía: que la red lo atienda YA (el video arranca
  // en streaming) y de fondo bajamos el archivo completo para la próxima
  llenarCache(req.url);
  return fetch(req);
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (MEDIA.test(e.request.url)) {
    e.respondWith(mediaDesdeCache(e.request).catch(() => fetch(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(() => caches.match(e.request))
  );
});
