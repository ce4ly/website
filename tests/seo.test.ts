import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { PAGINAS, PAGINAS_SITEMAP, rutaDe } from '../src/lib/paginas.ts'
import { FEED_BOLETINES } from '../src/lib/proxies.ts'
import { pageHead, renderPageHead, sitemapXml } from '../src/lib/seo.ts'

const atributo = (
  ruta: string,
  filtro: (attrs: Record<string, string>) => boolean,
  clave: string,
) => pageHead(ruta).tags.find(({ attrs }) => filtro(attrs))?.attrs[clave]

const canonical = (ruta: string) => atributo(ruta, (a) => a.rel === 'canonical', 'href')
const robots = (ruta: string) => atributo(ruta, (a) => a.name === 'robots', 'content')

describe('etiquetas de <head>', () => {
  it('canonical absoluto con barra final', () => {
    assert.equal(canonical('/'), 'https://www.ce4ly.cl/')
    assert.equal(canonical('/cursos'), 'https://www.ce4ly.cl/cursos/')
    assert.equal(canonical('/calculadoras/dipolo/'), 'https://www.ce4ly.cl/calculadoras/dipolo/')
  })

  it('títulos únicos; la portada con el indicativo', () => {
    const titulos = PAGINAS.map((p) => pageHead(p.path).title)
    assert.equal(new Set(titulos).size, titulos.length)
    assert.equal(pageHead('/').title, 'Radio Club Lircay de Talca — CE4LY')
    assert.match(pageHead('/cursos/').title, /^Cursos — Radio Club Lircay CE4LY$/)
  })

  it('404 y borradores con noindex; las páginas publicadas (también las legales), indexables', () => {
    assert.equal(robots('/terminos/'), undefined)
    assert.equal(robots('/privacidad/'), undefined)
    assert.equal(robots('/no-existe/'), 'noindex')
    assert.equal(robots('/ca5nfs/'), 'noindex')
    assert.equal(robots('/cursos/'), undefined)
    assert.equal(canonical('/no-existe/'), undefined)
  })

  it('el feed de boletines se anuncia solo en /boletines/', () => {
    const feed = (ruta: string) => atributo(ruta, (a) => a.type === 'application/rss+xml', 'href')
    assert.equal(feed(rutaDe('boletines')), `https://www.ce4ly.cl${FEED_BOLETINES}`)
    assert.equal(feed('/'), undefined)
  })

  it('renderPageHead escapa el contenido', () => {
    const html = renderPageHead({
      title: 'A & <B>',
      tags: [{ tag: 'meta', attrs: { name: 'description', content: '"x"' } }],
    })
    assert.ok(html.includes('<title>A &amp; &lt;B&gt;</title>'))
    assert.ok(html.includes('content="&quot;x&quot;"'))
  })
})

describe('sitemap', () => {
  it('lista las páginas publicadas y ninguna oculta, borrador ni 404', () => {
    const xml = sitemapXml()
    assert.ok(xml.includes('<loc>https://www.ce4ly.cl/herramientas/locator/</loc>'))
    assert.ok(xml.includes('<loc>https://www.ce4ly.cl/cursos/</loc>'))
    assert.ok(xml.includes('<loc>https://www.ce4ly.cl/terminos/</loc>'))
    assert.ok(xml.includes('<loc>https://www.ce4ly.cl/privacidad/</loc>'))
    for (const oculta of ['/ca5nfs/', '/404']) {
      assert.ok(!xml.includes(`https://www.ce4ly.cl${oculta}`), oculta)
    }
    assert.equal(xml.match(/<url>/g)?.length, PAGINAS_SITEMAP.length)
  })
})
