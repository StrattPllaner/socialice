/* =====================================================================
   SOCIALICE · Service Worker
   ---------------------------------------------------------------------
   CÓDIGO (html/css/js): red-PRIMERO sin caché HTTP (siempre fresco) y,
   si la red responde bien, se guarda copia en Cache Storage — así la
   app ABRE OFFLINE con la última versión vista.
   MEDIOS (videos/fotos): caché PERSISTENTE — se bajan UNA vez; los
   pedidos de rango de <video> se responden 206 rebanados a mano
   (Safari lo exige). OJO: si un video cambia bajo el MISMO nombre de
   archivo, hay que bumpear VERSION para que se vuelva a bajar.
   FUENTES (fonts.googleapis / fonts.gstatic): cache-first para que
   también funcionen offline sin re-descargarse.
   ===================================================================== */

const VERSION = 'socialice-v44-media-cache';
// Rev del SW: bumpear ESTE número (no VERSION) cuando quieras forzar que las
// apps ya abiertas se recarguen con el código nuevo. Cambiar cualquier byte de
// este archivo instala un SW nuevo → controllerchange → index recarga una vez.
// VERSION solo se bumpea si un video cambió bajo el mismo nombre (tira la
// caché de medios y los usuarios re-descargan TODO).
const SW_REV = 12;
const CODIGO = 'socialice-codigo-v1';
const FUENTES = 'socialice-fuentes-v1';
const CACHES_VIVAS = [VERSION, CODIGO, FUENTES];

const MEDIA = /\.(mp4|webm|jpe?g|png|svg|gif|ico)(\?|$)/i;
const ES_FUENTE = /fonts\.(googleapis|gstatic)\.com/;

// Al instalar: toma el control de inmediato
self.addEventListener('install', () => { self.skipWaiting(); });

// Al activar: borra las cachés de versiones anteriores y controla las pestañas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !CACHES_VIVAS.includes(k)).map((k) => caches.delete(k))))
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

// Fuentes de Google: una vez bajadas, siempre desde caché (offline OK)
async function fuenteDesdeCache(req) {
  const cache = await caches.open(FUENTES);
  const hit = await cache.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r.status === 200) cache.put(req, r.clone());
  return r;
}

// Código propio: red-primero (siempre fresco) con copia para offline
async function codigoDesdeRed(req) {
  try {
    const r = await fetch(req, { cache: 'no-store' });
    if (r.status === 200) {
      const cache = await caches.open(CODIGO);
      cache.put(req, r.clone());
    }
    return r;
  } catch (err) {
    const cache = await caches.open(CODIGO);
    const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (hit) return hit;
    // Navegación offline sin coincidencia exacta: sirve el index guardado
    if (req.mode === 'navigate') {
      const idx = await cache.match('index.html', { ignoreSearch: true }) ||
                  await cache.match(new URL('index.html', self.registration.scope).href, { ignoreSearch: true });
      if (idx) return idx;
    }
    throw err;
  }
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (ES_FUENTE.test(url)) {
    e.respondWith(fuenteDesdeCache(e.request).catch(() => fetch(e.request)));
    return;
  }
  if (MEDIA.test(url)) {
    e.respondWith(mediaDesdeCache(e.request).catch(() => fetch(e.request)));
    return;
  }
  if (new URL(url).origin === self.location.origin || e.request.mode === 'navigate') {
    e.respondWith(codigoDesdeRed(e.request));
    return;
  }
  // Otros orígenes: comportamiento normal del navegador
});
