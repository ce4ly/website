/**
 * Sirve `dist/` y POST /api/contact.php (Mailgun; mismo path que PHP en Apache).
 * Uso: npm run build && npm start
 */
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleContactPost } from './mailgun-contact.js'

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
  '.webmanifest': 'application/manifest+json'
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw.trim()) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve(null)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  })
  res.end(JSON.stringify(obj))
}

async function handleApiContact(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Método no permitido' })
    return
  }
  const data = await readJsonBody(req)
  if (data === null) {
    sendJson(res, 400, { ok: false, error: 'Cuerpo JSON inválido' })
    return
  }
  const result = await handleContactPost(data, process.env)
  if (result.ok) {
    sendJson(res, 200, { ok: true })
  } else {
    sendJson(res, result.status, { ok: false, error: result.error })
  }
}

async function trySendFile(res, filePath) {
  const stat = await fs.stat(filePath)
  if (!stat.isFile()) throw new Error('not a file')
  const ext = path.extname(filePath)
  const type = MIME[ext] || 'application/octet-stream'
  const buf = await fs.readFile(filePath)
  res.writeHead(200, { 'Content-Type': type })
  res.end(buf)
}

async function serveStatic(req, res) {
  const host = req.headers.host || 'localhost'
  const url = new URL(req.url || '/', `http://${host}`)
  let pathname = url.pathname
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  if (pathname === '/api/contact.php') {
    await handleApiContact(req, res)
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

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('No encontrado')
}

const server = http.createServer((req, res) => {
  serveStatic(req, res).catch(err => {
    console.error(err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    }
    res.end('Error interno')
  })
})

const port = Number(process.env.PORT) || 4173
server.listen(port, () => {
  console.log(`CE4LY estático + API en http://localhost:${port}`)
})
