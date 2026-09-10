import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { respondContact } from './server/contacto-http.js'
import { getBoletinesRss } from './server/boletines-rss.js'
import { getSolar } from './server/solar.js'
import { robotsTxt, sitemapXml } from './src/lib/meta.js'

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
        if (pathname === '/boletines.xml' && req.method === 'GET') {
          const feed = await getBoletinesRss(env)
          if (!feed.body) {
            send(res, 503, 'text/plain; charset=utf-8', 'Feed no disponible.')
            return
          }
          send(res, 200, 'application/rss+xml; charset=utf-8', feed.body)
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
        if (
          (pathname === '/contacto' || pathname === '/api/contact.php') &&
          req.method === 'POST'
        ) {
          await respondContact(req, res, env)
          return
        }
        next()
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
      include: [
        'src/**/*.test.js',
        'server/**/*.test.js',
        'scripts/**/*.test.js'
      ]
    }
  }
})
