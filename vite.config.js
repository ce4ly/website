import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleContactPost } from './server/mailgun-contact.js'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function contactApiPlugin(env) {
  return {
    name: 'ce4ly-contact-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        if (pathname !== '/api/contact.php' || req.method !== 'POST') {
          next()
          return
        }
        const raw = await readBody(req)
        let body
        try {
          body = raw.trim() ? JSON.parse(raw) : {}
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ ok: false, error: 'Cuerpo JSON inválido' }))
          return
        }
        const result = await handleContactPost(body, env)
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        if (result.ok) {
          res.statusCode = 200
          res.end(JSON.stringify({ ok: true }))
        } else {
          res.statusCode = result.status
          res.end(JSON.stringify({ ok: false, error: result.error }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return {
    plugins: [react(), tailwindcss(), contactApiPlugin(env)]
  }
})
