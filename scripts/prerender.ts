import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import {
  PAGINAS,
  RUTA_NO_ENCONTRADA,
  RUTA_PROPAGACION,
  RUTAS_OFFLINE,
  rutaDe,
} from '../src/lib/paginas.ts'
import { PROXIES } from '../src/lib/proxies.ts'
import { pageHead, renderPageHead, sitemapXml } from '../src/lib/seo.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const templatePath = path.join(distDir, 'index.html')
// El bundle SSR va fuera de dist/ para que Netlify no lo publique.
const serverEntry = path.resolve(__dirname, '../dist-ssr/entry-server.js')

const template = fs.readFileSync(templatePath, 'utf-8')
const { render } = (await import(pathToFileURL(serverEntry).href)) as {
  render: (url: string) => Promise<string>
}

/** `/` → index.html, `/acerca/` → acerca/index.html, la página 404 → 404.html. */
function routeToFile(route: string): string {
  if (route === RUTA_NO_ENCONTRADA) return path.join(distDir, '404.html')
  return path.join(distDir, route.slice(1), 'index.html')
}

// --- Páginas ---------------------------------------------------------------------------------

const rutas = [...PAGINAS.map((pagina) => pagina.path), RUTA_NO_ENCONTRADA]

for (const ruta of rutas) {
  const appHtml = await render(ruta)
  const html = template
    .replace(/<title>[^<]*<\/title>/, () => renderPageHead(pageHead(ruta)))
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)

  const file = routeToFile(ruta)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml())

// --- Service worker ----------------------------------------------------------------------------

/** Archivos de dist/assets que conviene tener sin conexión. */
function assetsOffline(dir: string, prefix = '/assets'): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const url = `${prefix}/${entry.name}`
    if (entry.isDirectory()) return assetsOffline(path.join(dir, entry.name), url)
    // Fuentes: solo woff2 y alfabeto latino (los navegadores con SW soportan woff2, y las demás
    // escrituras solo se descargan si una página las usa, gracias a `unicode-range`).
    if (/\.(woff2?)$/.test(entry.name)) {
      return /-latin-(ext-)?\d+-normal-[\w-]+\.woff2$/.test(entry.name) ? [url] : []
    }
    return /\.(js|css)$/.test(entry.name) ? [url] : []
  })
}

const ESTATICOS_OFFLINE = [
  '/tema.js',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/logo.png',
  '/logo-frontpage.svg',
  '/banner.jpg',
  '/data/licencias.json',
  '/data/socios.json',
  '/img/cursos/electronica-basica.webp',
  '/img/cursos/confeccion-antenas.webp',
  '/img/cursos/reglamentacion.webp',
]

const precache = [
  ...new Set([
    ...RUTAS_OFFLINE,
    ...ESTATICOS_OFFLINE,
    ...assetsOffline(path.join(distDir, 'assets')),
  ]),
]
for (const url of ESTATICOS_OFFLINE) {
  if (!fs.existsSync(path.join(distDir, url)))
    throw new Error(`Precache: no existe ${url} en dist/`)
}

const constantes = {
  // El nombre cambia con el contenido: al activar la versión nueva se borra la caché anterior.
  CACHE: `ce4ly-${createHash('sha256').update(JSON.stringify(precache)).digest('hex').slice(0, 12)}`,
  PRECACHE: precache,
  RUTAS_VIVAS: [
    RUTA_PROPAGACION,
    rutaDe('contacto'),
    PROXIES.solar.ruta,
    PROXIES.clima.ruta,
    PROXIES.boletines.ruta,
  ],
  RUTA_OFFLINE: rutaDe('herramientas'),
}
const cabecera = Object.entries(constantes)
  .map(([nombre, valor]) => `const ${nombre} = ${JSON.stringify(valor)}`)
  .join('\n')
const plantilla = fs.readFileSync(path.join(__dirname, 'service-worker.js'), 'utf-8')
fs.writeFileSync(path.join(distDir, 'sw.js'), `${cabecera}\n\n${plantilla}`)

console.log(
  `Pre-renderizadas ${rutas.length} rutas (${PAGINAS.length} páginas + 404); sw.js con ${precache.length} URLs en precache.`,
)
