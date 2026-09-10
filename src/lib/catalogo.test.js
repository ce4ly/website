import { describe, expect, it } from 'vitest'
import {
  PAGINAS_SITEMAP,
  RUTA_PROPAGACION,
  RUTAS_OFFLINE,
  TOOLS
} from './tools-catalog.js'
import { canonicalDe, metaDeRuta, robotsTxt, sitemapXml } from './meta.js'
import { NAV_PRINCIPAL } from './nav.js'

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
    expect(xml).toContain('https://www.ce4ly.cl/cursos')
    expect(xml).toContain('https://www.ce4ly.cl/emergencias')
    expect(xml).not.toContain('https://www.ce4ly.cl/404')
    expect(robotsTxt()).toContain('Sitemap: https://www.ce4ly.cl/sitemap.xml')
  })

  it('el precache offline cubre cursos y emergencias, no contacto ni el reloj', () => {
    expect(RUTAS_OFFLINE).toContain('/herramientas')
    expect(RUTAS_OFFLINE).toContain('/calculadoras/dipolo')
    expect(RUTAS_OFFLINE).toContain('/cursos')
    expect(RUTAS_OFFLINE).toContain('/emergencias')
    expect(RUTAS_OFFLINE).not.toContain('/contacto')
    expect(RUTAS_OFFLINE).not.toContain(RUTA_PROPAGACION)
  })

  it('el menú va Inicio, Acerca, Boletines, Cursos, Herramientas, Emergencias, Contacto', () => {
    expect(NAV_PRINCIPAL.map(i => i.label)).toEqual([
      'Inicio',
      'Acerca',
      'Boletines',
      'Cursos',
      'Herramientas',
      'Emergencias',
      'Contacto'
    ])
  })

  it('cursos y emergencias tienen título y descripción propios', () => {
    const cursos = metaDeRuta('/cursos')
    const emergencias = metaDeRuta('/emergencias')
    expect(cursos.title).toMatch(/Cursos/)
    expect(emergencias.title).toMatch(/emergencias/i)
    expect(cursos.description).not.toBe(emergencias.description)
    expect(cursos.canonical).toBe('https://www.ce4ly.cl/cursos')
    expect(emergencias.canonical).toBe('https://www.ce4ly.cl/emergencias')
  })
})
