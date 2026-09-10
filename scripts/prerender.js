import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { HERRAMIENTA_LINKS } from '../src/lib/herramientas.js'
import { REDIRECCIONES } from '../src/lib/redirecciones.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const serverPath = join(distDir, 'server', 'entry-server.js')

const PRERENDER_PATHS = [
  '/',
  '/acerca',
  '/boletines',
  '/contacto',
  '/terminos',
  '/privacidad',
  '/herramientas',
  '/ca5nfs',
  ...HERRAMIENTA_LINKS.map(link => link.to)
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

for (const { from, to } of REDIRECCIONES) {
  const html = `<!DOCTYPE html>
<html lang="es">
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

const htaccess = `<IfModule mod_rewrite.c>
	RewriteEngine on

	# Redirecciones permanentes de rutas antiguas
${REDIRECCIONES.map(
  ({ from, to }) => `\tRewriteRule ^${from.slice(1)}/?$ ${to} [R=301,L]`
).join('\n')}

	RewriteCond %{REQUEST_FILENAME} -f [OR]
	RewriteCond %{REQUEST_FILENAME} -d
	RewriteRule ^ - [L]
	RewriteRule ^ index.html [L]
</IfModule>
`
writeFileSync(join(distDir, '.htaccess'), htaccess)
console.log('Wrote dist/.htaccess redirects')
