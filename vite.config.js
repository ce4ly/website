import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleContactPost } from './server/mailgun-contact.js'
import { getSolar } from './server/solar.js'
import { robotsTxt, sitemapXml } from './src/lib/meta.js'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(res, status, type, body) {
  res.statusCode = status
  res.setHeader('Content-Type', type)
  res.end(body)
}

function contactApiPlugin(env) {
  return {
    name: 'ce4ly-dev-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        if (pathname === '/sitemap.xml' && req.method === 'GET') {
          send(res, 200, 'application/xml; charset=utf-8', sitemapXml())
          return
        }
        if (pathname === '/robots.txt' && req.method === 'GET') {
          send(res, 200, 'text/plain; charset=utf-8', robotsTxt())
          return
        }
        if (
          (pathname === '/api/solar.json' || pathname === '/api/solar.php') &&
          req.method === 'GET'
        ) {
          const data = await getSolar()
          send(
            res,
            200,
            'application/json; charset=utf-8',
            JSON.stringify(data)
          )
          return
        }
        if (pathname !== '/api/contact.php' || req.method !== 'POST') {
          next()
          return
        }
        const raw = await readBody(req)
        let body
        try {
          body = raw.trim() ? JSON.parse(raw) : {}
        } catch {
          send(
            res,
            400,
            'application/json; charset=utf-8',
            JSON.stringify({ ok: false, error: 'Cuerpo JSON inválido' })
          )
          return
        }
        const result = await handleContactPost(body, env)
        send(
          res,
          result.ok ? 200 : result.status,
          'application/json; charset=utf-8',
          JSON.stringify(
            result.ok ? { ok: true } : { ok: false, error: result.error }
          )
        )
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return {
    plugins: [react(), tailwindcss(), contactApiPlugin(env)],
    test: {
      environment: 'node',
      include: ['src/**/*.test.js']
    }
  }
})
