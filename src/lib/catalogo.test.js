import { describe, expect, it } from 'vitest'
import {
  PAGINAS_SITEMAP,
  RUTA_PROPAGACION,
  RUTAS_OFFLINE,
  TOOLS
} from './tools-catalog.js'
import { canonicalDe, metaDeRuta, robotsTxt, sitemapXml } from './meta.js'

describe('catálogo y metadatos', () => {
  it('cada herramienta tiene slug, path, title, description y section', () => {
    for (const t of TOOLS) {
      expect(t.slug).toBeTruthy()
      expect(t.path.startsWith('/')).toBe(true)
      expect(t.title).toBeTruthy()
      expect(t.shortTitle).toBeTruthy()
      expect(t.description.length).toBeGreaterThan(20)
      expect(t.section).toBeTruthy()
      expect(t.keywords.length).toBeGreaterThan(0)
    }
  })

  it('títulos y canonicals únicos en el sitemap', () => {
    const titles = PAGINAS_SITEMAP.map(p => metaDeRuta(p.path).title)
    const cans = PAGINAS_SITEMAP.map(p => canonicalDe(p.path))
    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(cans).size).toBe(cans.length)
  })

  it('sitemap lista las herramientas y robots lo referencia', () => {
    const xml = sitemapXml()
    expect(xml).toContain('https://www.ce4ly.cl/herramientas')
    expect(xml).toContain('https://www.ce4ly.cl/herramientas/locator')
    expect(robotsTxt()).toContain('Sitemap: https://www.ce4ly.cl/sitemap.xml')
  })

  it('el precache offline cubre el catálogo salvo la ruta de propagación', () => {
    expect(RUTAS_OFFLINE).toContain('/herramientas')
    expect(RUTAS_OFFLINE).toContain('/calculadoras/dipolo')
    expect(RUTAS_OFFLINE).not.toContain(RUTA_PROPAGACION)
  })
})
