import assert from 'node:assert/strict'
import fs from 'node:fs'
import { describe, it } from 'node:test'

import { SITE_URL } from '../src/lib/club.ts'
import { PAGINAS, normalizarRuta } from '../src/lib/paginas.ts'
import { EMISORAS } from '../src/lib/emisoras.ts'
import { ORIGEN_BUSCADOR_LUGARES } from '../src/lib/lugares.ts'
import { ORIGEN_TESELAS } from '../src/lib/mapa.ts'
import { FEED_BOLETINES, PROXIES } from '../src/lib/proxies.ts'
import { SOUNDCLOUD_WIDGET_ORIGIN } from '../src/lib/soundcloud.ts'
import { leerCabeceras, leerRedirects } from '../scripts/netlify-toml.ts'

const leer = (ruta: string) => fs.readFileSync(new URL(`../${ruta}`, import.meta.url), 'utf-8')

const toml = leer('netlify.toml')
const readRedirects = () => leerRedirects(toml)
const readHeaders = () =>
  new Map(leerCabeceras(toml).map(({ patron, valores }) => [patron, valores]))

const RUTAS_PAGINAS = new Set(PAGINAS.map((p) => p.path))

describe('netlify.toml: redirects', () => {
  const redirects = readRedirects()

  it('los proxies coinciden con PROXIES (src/lib/proxies.ts)', () => {
    for (const { ruta, destino } of Object.values(PROXIES)) {
      const rule = redirects.find((r) => r.from === ruta)
      assert.deepEqual(rule, { from: ruta, to: destino, status: 200 }, ruta)
    }
  })

  it('cada redirect permanente lleva a una página existente (o al feed) y es 301 forzado', () => {
    const permanentes = redirects.filter((r) => r.status !== 200)
    assert.ok(permanentes.length > 30)
    for (const rule of permanentes) {
      assert.equal(rule.status, 301, rule.from ?? '')
      assert.equal(rule.force, true, rule.from ?? '')
      assert.ok(
        rule.to === FEED_BOLETINES || RUTAS_PAGINAS.has(rule.to ?? ''),
        `${rule.from} → ${rule.to}`,
      )
    }
  })

  it('ningún redirect tapa una página ni hay fallback SPA', () => {
    for (const rule of redirects) {
      assert.ok(!RUTAS_PAGINAS.has(normalizarRuta(rule.from ?? '')), rule.from ?? '')
      assert.notEqual(rule.to, '/index.html')
    }
  })

  it('las URLs antiguas del feed (servidor PHP) llevan al feed actual', () => {
    for (const antigua of ['/feedBoletines.php', '/api/boletines.php']) {
      assert.equal(redirects.find((r) => r.from === antigua)?.to, FEED_BOLETINES, antigua)
    }
  })
})

describe('netlify.toml: cabeceras', () => {
  const headers = readHeaders()
  const csp = Object.fromEntries(
    (headers.get('/*')?.['Content-Security-Policy'] ?? '')
      .split(';')
      .map((directiva) => directiva.trim().split(/\s+/))
      .map(([nombre, ...valores]) => [nombre, valores]),
  )

  it('CSP sin scripts ni estilos en línea; SoundCloud como marco y OSM como teselas', () => {
    assert.deepEqual(csp['script-src'], ["'self'"])
    assert.deepEqual(csp['style-src'], ["'self'"])
    // Única excepción: el buscador de ciudades del Grid Maidenhead (src/lib/lugares.ts).
    assert.deepEqual(csp['connect-src'], ["'self'", ORIGEN_BUSCADOR_LUGARES])
    // Teselas del mapa del Grid Maidenhead (src/lib/mapa.ts).
    assert.deepEqual(csp['img-src'], ["'self'", 'data:', ORIGEN_TESELAS])
    assert.deepEqual(csp['frame-src'], [SOUNDCLOUD_WIDGET_ORIGIN])
    assert.deepEqual(csp['form-action'], ["'self'"])
  })

  it('media-src admite justo los streams de las radios (src/lib/emisoras.ts)', () => {
    const origenes = [...new Set(EMISORAS.map((e) => new URL(e.stream).origin))]
    assert.deepEqual(csp['media-src'], ["'self'", ...origenes])
  })

  it('assets inmutables y sw.js siempre revalidado', () => {
    assert.match(headers.get('/assets/*')?.['Cache-Control'] ?? '', /immutable/)
    assert.equal(headers.get('/sw.js')?.['Cache-Control'], 'no-cache')
  })
})

describe('HTML base y archivos públicos', () => {
  it('index.html no lleva scripts en línea (la CSP los bloquearía)', () => {
    for (const [script] of leer('index.html').matchAll(/<script\b[^>]*>/g)) {
      assert.match(script, /\ssrc="/, script)
    }
  })

  it('robots.txt apunta al sitemap del dominio canónico', () => {
    assert.ok(leer('public/robots.txt').includes(`Sitemap: ${SITE_URL}/sitemap.xml`))
  })
})
