import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { fraccionEscala, leerIndice, parseSolarXml } from '../src/lib/calc/solar.ts'
import { definido } from './ayuda.ts'

const XML = `<?xml version="1.0"?>
<solar>
  <solardata>
    <updated>09 Sep 2026 1200 GMT</updated>
    <solarflux>150</solarflux>
    <aindex>7</aindex>
    <kindex>2</kindex>
    <sunspots>88</sunspots>
    <calculatedconditions>
      <band name="80m-40m" time="day">Fair</band>
      <band name="30m-20m" time="day">Good</band>
      <band name="80m-40m" time="night">Good</band>
      <band name="30m-20m" time="night">Poor</band>
    </calculatedconditions>
  </solardata>
</solar>`

describe('solar', () => {
  it('parsea SFI, manchas, A y K', () => {
    const d = definido(parseSolarXml(XML))
    assert.equal(d.sfi, 150)
    assert.equal(d.sunspots, 88)
    assert.equal(d.aIndex, 7)
    assert.equal(d.kIndex, 2)
    assert.equal(d.updated, '09 Sep 2026 1200 GMT')
  })

  it('agrupa las condiciones de banda de día y de noche', () => {
    assert.deepEqual(definido(parseSolarXml(XML)).bandas, [
      { banda: '80m-40m', dia: 'regular', noche: 'buena' },
      { banda: '30m-20m', dia: 'buena', noche: 'mala' },
    ])
  })

  it('clasifica cada índice según sus umbrales', () => {
    assert.deepEqual(leerIndice('kIndex', 1), { nivel: 'bueno', etiqueta: 'Tranquilo' })
    assert.equal(leerIndice('kIndex', 3).nivel, 'regular')
    assert.equal(leerIndice('kIndex', 5).nivel, 'critico')
    assert.equal(leerIndice('aIndex', 30).etiqueta, 'Tormenta')
    assert.equal(leerIndice('sfi', 93).etiqueta, 'Regular')
    assert.equal(leerIndice('sunspots', 12).nivel, 'malo')
  })

  it('el medidor no se sale de la escala', () => {
    assert.equal(fraccionEscala('sfi', 30), 0)
    assert.equal(fraccionEscala('sfi', 150), 0.5)
    assert.equal(fraccionEscala('aIndex', 400), 1)
  })

  it('una respuesta que no es el XML de hamqsl no rompe', () => {
    assert.equal(parseSolarXml(''), null)
    assert.equal(parseSolarXml('<html>error</html>'), null)
  })
})
