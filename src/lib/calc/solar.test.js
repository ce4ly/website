import { describe, expect, it } from 'vitest'
import { parseSolarXml } from './solar.js'

const XML = `<?xml version="1.0"?>
<solar>
  <solardata>
    <updated>09 Sep 2026 1200 GMT</updated>
    <solarflux>150</solarflux>
    <aindex>7</aindex>
    <kindex>2</kindex>
    <sunspots>88</sunspots>
  </solardata>
</solar>`

describe('solar', () => {
  it('parsea SFI, manchas, A y K', () => {
    const d = parseSolarXml(XML)
    expect(d.sfi).toBe(150)
    expect(d.sunspots).toBe(88)
    expect(d.aIndex).toBe(7)
    expect(d.kIndex).toBe(2)
  })

  it('XML vacío no rompe', () => {
    expect(parseSolarXml('')).toBeNull()
  })
})
