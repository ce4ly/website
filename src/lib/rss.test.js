import { describe, expect, it } from 'vitest'
import { parsearFeedRss } from './rss.js'

const XML = `<?xml version="1.0"?>
<rss version="2.0"><channel>
<title>Prueba</title>
<item>
  <title><![CDATA[Cap1: Hola]]></title>
  <link>https://soundcloud.com/radio-club-lircay/cap1</link>
  <pubDate>Sat, 28 Jun 2026 00:56:30 +0000</pubDate>
  <description>Un capítulo</description>
</item>
<item>
  <title>Cap2: Adiós</title>
  <link>https://soundcloud.com/radio-club-lircay/cap2</link>
</item>
</channel></rss>`

describe('parsearFeedRss', () => {
  it('extrae título, enlace y fecha', () => {
    const items = parsearFeedRss(XML)
    expect(items).toHaveLength(2)
    expect(items[0].title).toBe('Cap1: Hola')
    expect(items[0].link).toContain('cap1')
    expect(items[0].pubDate).toContain('2026')
    expect(items[1].title).toBe('Cap2: Adiós')
  })
})
