/* global CACHE, PRECACHE, RUTAS_VIVAS, RUTA_OFFLINE */
// Plantilla del service worker. scripts/prerender.ts antepone las constantes del build (CACHE,
// PRECACHE, RUTAS_VIVAS y RUTA_OFFLINE) y escribe el resultado en dist/sw.js.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // Un recurso que falle no impide instalar el resto.
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

/** Datos en vivo (índices solares, feed, formulario): primero la red, la copia solo sin conexión. */
const esVivo = (pathname) => RUTAS_VIVAS.some((ruta) => pathname === ruta)

/** `/acerca` y `/acerca/` son la misma página; en caché está la de barra final. */
const conBarra = (url) => (url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`)

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  if (esVivo(url.pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
    return
  }

  // Caché primero y actualización en segundo plano: las calculadoras abren al instante y sin red.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const navegacion = event.request.mode === 'navigate'
      const cached =
        (await cache.match(event.request, { ignoreSearch: true })) ||
        (navegacion ? await cache.match(conBarra(url)) : undefined)
      const network = fetch(event.request)
        .then((res) => {
          if (res.ok) cache.put(event.request, res.clone())
          return res
        })
        .catch(async () => {
          if (cached) return cached
          if (navegacion) {
            return (await cache.match(RUTA_OFFLINE)) || (await cache.match('/'))
          }
          return Response.error()
        })
      return cached || network
    }),
  )
})
