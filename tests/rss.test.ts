import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { fechaIsoRss, formatearFechaRss, parsearFeedRss } from '../src/lib/rss.ts'

const XML = `<?xml version="1.0"?>
<rss version="2.0"><channel>
<title>Prueba</title>
<item>
  <title><![CDATA[Cap1: Hola]]></title>
  <link>https://soundcloud.com/radio-club-lircay/cap1</link>
  <pubDate>Sat, 28 Jun 2026 00:56:30 +0000</pubDate>
  <description>Un capítulo &amp; más</description>
</item>
<item>
  <title>Cap2: Adiós</title>
  <link>https://soundcloud.com/radio-club-lircay/cap2</link>
</item>
</channel></rss>`

describe('parsearFeedRss', () => {
  it('extrae título, enlace, fecha y descripción', () => {
    const items = parsearFeedRss(XML)
    assert.equal(items.length, 2)
    assert.equal(items[0].title, 'Cap1: Hola')
    assert.ok(items[0].link.endsWith('/cap1'))
    assert.ok(items[0].pubDate.includes('2026'))
    assert.equal(items[0].description, 'Un capítulo & más')
    assert.equal(items[1].title, 'Cap2: Adiós')
  })

  it('un feed sin episodios da una lista vacía', () => {
    assert.deepEqual(parsearFeedRss('<rss><channel></channel></rss>'), [])
  })
})

describe('fechas del feed', () => {
  it('formatea en hora de Chile y da ISO para <time>', () => {
    // 00:56 UTC del 28 de junio = 20:56 del 27 en Chile (UTC−4).
    assert.equal(formatearFechaRss('Sat, 28 Jun 2026 00:56:30 +0000'), '27 de junio de 2026')
    assert.equal(fechaIsoRss('Sat, 28 Jun 2026 00:56:30 +0000'), '2026-06-28T00:56:30.000Z')
  })

  it('una fecha inválida no rompe la página', () => {
    assert.equal(formatearFechaRss('ayer'), 'ayer')
    assert.equal(fechaIsoRss('ayer'), undefined)
  })
})
