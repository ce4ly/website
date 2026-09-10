/**
 * Sirve `dist/` y POST /api/contact.php (Mailgun; mismo path que PHP en Apache).
 * Uso: npm run build && npm start
 */
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { respondContact } from './contacto-http.js'
import { getBoletinesRss } from './boletines-rss.js'
import { destinoRedireccion } from '../src/lib/redirecciones.js'
import { getSolar } from './solar.js'
import { robotsTxt, sitemapXml } from '../src/lib/meta.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const rootEnvPath = path.join(__dirname, '..', '.env')
if (existsSync(rootEnvPath)) {
  const text = readFileSync(rootEnvPath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    if (key === '' || process.env[key] !== undefined) continue
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    process.env[key] = val
  }
}

const distDir = path.join(__dirname, '..', 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
}

async function trySendFile(res, filePath, status = 200) {
  const stat = await fs.stat(filePath)
  if (!stat.isFile()) throw new Error('not a file')
  const ext = path.extname(filePath)
  const type = MIME[ext] || 'application/octet-stream'
  const buf = await fs.readFile(filePath)
  res.writeHead(status, { 'Content-Type': type })
  res.end(buf)
}

async function serveStatic(req, res) {
  const host = req.headers.host || 'localhost'
  const url = new URL(req.url || '/', `http://${host}`)
  let pathname = url.pathname
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  const redir = destinoRedireccion(pathname)
  if (redir) {
    res.writeHead(301, { Location: redir })
    res.end()
    return
  }

  if (
    (pathname === '/contacto' || pathname === '/api/contact.php') &&
    req.method === 'POST'
  ) {
    await respondContact(req, res, process.env)
    return
  }

  if (pathname === '/boletines.xml') {
    const feed = await getBoletinesRss(process.env)
    if (!feed.body) {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Feed no disponible.')
      return
    }
    res.writeHead(200, {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    })
    res.end(feed.body)
    return
  }

  if (pathname === '/api/solar.json' || pathname === '/api/solar.php') {
    const data = await getSolar()
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=1800'
    })
    res.end(JSON.stringify(data))
    return
  }

  if (pathname === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' })
    res.end(sitemapXml())
    return
  }

  if (pathname === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(robotsTxt())
    return
  }

  const candidates = []
  if (pathname === '/') {
    candidates.push(path.join(distDir, 'index.html'))
  } else {
    candidates.push(path.join(distDir, pathname.slice(1), 'index.html'))
    candidates.push(path.join(distDir, pathname.slice(1)))
  }

  for (const filePath of candidates) {
    try {
      await trySendFile(res, filePath)
      return
    } catch {
      /* siguiente candidato */
    }
  }

  const notFound = path.join(distDir, '404.html')
  try {
    await trySendFile(res, notFound, 404)
    return
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('No encontrado')
  }
}

const server = http.createServer((req, res) => {
  serveStatic(req, res).catch(err => {
    console.error(err)
    if (res.headersSent) return
    const errorPage = path.join(distDir, '500.html')
    trySendFile(res, errorPage, 500).catch(() => {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Error interno')
    })
  })
})

const port = Number(process.env.PORT) || 4173
server.listen(port, () => {
  console.log(`CE4LY estático + API en http://localhost:${port}`)
})
