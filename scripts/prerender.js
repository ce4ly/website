import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const serverPath = join(distDir, 'server', 'entry-server.js')

const PRERENDER_PATHS = [
  '/',
  '/acerca',
  '/contacto',
  '/terminos',
  '/privacidad'
]

const template = readFileSync(join(distDir, 'index.html'), 'utf-8')
const { render } = await import(serverPath)

for (const path of PRERENDER_PATHS) {
  const html = render(path)
  const fullHtml = template.replace('<!--ssr-outlet-->', html)

  const outPath = path === '/' ? 'index.html' : join(path, 'index.html')
  const outFile = join(distDir, outPath)

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, fullHtml)
  console.log(`Prerendered: ${path === '/' ? '/' : path}`)
}
