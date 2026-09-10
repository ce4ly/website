import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync
} from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { boletinesLocalPhp, cargarEnv, mailgunLocalPhp } from './api-config.js'
import { REDIRECCIONES } from '../src/lib/redirecciones.js'
import {
  RUTA_PROPAGACION,
  RUTAS_OFFLINE,
  RUTAS_PRERENDER
} from '../src/lib/tools-catalog.js'
import { metaTagsHtml, robotsTxt, sitemapXml } from '../src/lib/meta.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const distDir = join(rootDir, 'dist')
const envPath = join(rootDir, '.env')
if (existsSync(envPath)) {
  cargarEnv(readFileSync(envPath, 'utf8'), process.env)
}
const serverPath = join(distDir, 'server', 'entry-server.js')

const PRERENDER_PATHS = RUTAS_PRERENDER

const template = readFileSync(join(distDir, 'index.html'), 'utf-8')
const { render } = await import(serverPath)

const META_RE = /<!--app-meta-->[\s\S]*?<!--\/app-meta-->/

for (const path of PRERENDER_PATHS) {
  const html = render(path)
  const fullHtml = template
    .replace('<!--ssr-outlet-->', html)
    .replace(
      META_RE,
      `<!--app-meta-->\n    ${metaTagsHtml(path)}\n    <!--/app-meta-->`
    )

  const outPath = path === '/' ? 'index.html' : join(path, 'index.html')
  const outFile = join(distDir, outPath)

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, fullHtml)
  console.log(`Prerendered: ${path === '/' ? '/' : path}`)
}

for (const { from, to } of REDIRECCIONES) {
  const html = `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${to}">
  <link rel="canonical" href="${to}">
  <title>Redirigido</title>
</head>
<body>
  <p>Esta página se movió a <a href="${to}">${to}</a>.</p>
</body>
</html>
`
  const outFile = join(distDir, from.slice(1), 'index.html')
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
  console.log(`Redirect: ${from} → ${to}`)
}

writeFileSync(join(distDir, 'sitemap.xml'), sitemapXml())
writeFileSync(join(distDir, 'robots.txt'), robotsTxt())
console.log('Wrote sitemap.xml and robots.txt')

for (const code of ['404', '500']) {
  const src = join(distDir, code, 'index.html')
  writeFileSync(join(distDir, `${code}.html`), readFileSync(src, 'utf-8'))
  console.log(`Copied ${code}/index.html → ${code}.html`)
}

const htaccess = `Options -MultiViews

<IfModule mod_rewrite.c>
	RewriteEngine on
	RewriteBase /

	# /boletines.xml no debe negociarse como el directorio /boletines/
	RewriteRule ^boletines\\.xml$ api/boletines.php [END]

	# Redirecciones permanentes de rutas antiguas
${REDIRECCIONES.map(
  ({ from, to }) => `\tRewriteRule ^${from.slice(1)}/?$ ${to} [R=301,L]`
).join('\n')}

	RewriteRule ^api/solar\\.json$ api/solar.php [L]

	RewriteCond %{REQUEST_METHOD} POST
	RewriteRule ^contacto/?$ api/contact.php [L]

	RewriteCond %{REQUEST_FILENAME} -f [OR]
	RewriteCond %{REQUEST_FILENAME} -d
	RewriteRule ^ - [L]
</IfModule>

<FilesMatch "\\.local\\.php$">
	Require all denied
</FilesMatch>

ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
`
writeFileSync(join(distDir, '.htaccess'), htaccess)
console.log('Wrote dist/.htaccess redirects')

const apiDir = join(distDir, 'api')
mkdirSync(apiDir, { recursive: true })
const mailgunPhp = mailgunLocalPhp(process.env)
if (mailgunPhp) {
  writeFileSync(join(apiDir, 'mailgun.local.php'), mailgunPhp)
  console.log('Wrote dist/api/mailgun.local.php (desde .env)')
} else {
  console.log(
    'Sin MAILGUN_API_KEY/MAILGUN_DOMAIN: no se escribió mailgun.local.php'
  )
}
const boletinesPhp = boletinesLocalPhp(process.env)
if (boletinesPhp) {
  writeFileSync(join(apiDir, 'boletines.local.php'), boletinesPhp)
  console.log('Wrote dist/api/boletines.local.php (desde .env)')
}

const walkAssets = (dir, prefix = '/assets') => {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const url = `${prefix}/${name}`
    if (statSync(full).isDirectory()) {
      out.push(...walkAssets(full, url))
    } else if (/\.(js|css|woff2|woff)$/i.test(name)) {
      out.push(url)
    }
  }
  return out
}

const STATICOS_OFFLINE = [
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/logo.png',
  '/logo-frontpage.png',
  '/banner.jpg',
  '/og-default.png',
  '/data/licencias.json',
  '/img/cursos/electronica-basica.webp',
  '/img/cursos/confeccion-antenas.webp',
  '/img/cursos/reglamentacion.webp'
]

const PRECACHE = [
  ...new Set([
    ...RUTAS_OFFLINE,
    ...STATICOS_OFFLINE,
    ...walkAssets(join(distDir, 'assets'))
  ])
]

const sw = `const CACHE = 'ce4ly-offline-v3'
const PRECACHE = ${JSON.stringify(PRECACHE)}
const RUTA_PROPAGACION = ${JSON.stringify(RUTA_PROPAGACION)}
const API_VIVA = ['/api/solar.json', '/api/solar.php', '/api/contact.php', '/api/boletines.php']
const RUTAS_VIVAS = ['/contacto', '/boletines.xml']

const esVivo = pathname =>
  pathname === RUTA_PROPAGACION ||
  pathname.startsWith(RUTA_PROPAGACION + '/') ||
  API_VIVA.includes(pathname) ||
  RUTAS_VIVAS.includes(pathname)

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(
        PRECACHE.map(url => cache.add(url).catch(() => null))
      )
    ).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (esVivo(url.pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
    return
  }

  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(event.request, { ignoreSearch: true })
      const network = fetch(event.request)
        .then(res => {
          if (res.ok) cache.put(event.request, res.clone())
          return res
        })
        .catch(async () => {
          if (cached) return cached
          if (event.request.mode === 'navigate') {
            return (
              (await cache.match('/herramientas')) ||
              (await cache.match('/'))
            )
          }
          return cached
        })
      return cached || network
    })
  )
})
`
writeFileSync(join(distDir, 'sw.js'), sw)
console.log(`Wrote dist/sw.js (${PRECACHE.length} precache URLs)`)
