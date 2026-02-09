import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  aciertoPorCaracter,
  morseATexto,
  textoAMorse,
  tiemposFarnsworth,
} from '../src/lib/calc/morse.ts'
import { cerca } from './ayuda.ts'

describe('morse', () => {
  it('CQ DE CE4LY ida y vuelta', () => {
    const codigo = textoAMorse('CQ DE CE4LY')
    assert.ok(codigo.includes('-.-.'))
    assert.equal(morseATexto(codigo).replace(/\s+/g, ' ').trim(), 'CQ DE CE4LY')
  })

  it('incluye Ñ, tildes y prosignos', () => {
    assert.equal(textoAMorse('Ñ'), '--.--')
    assert.equal(textoAMorse('á'), textoAMorse('A'))
    assert.equal(textoAMorse('AR'), '.-.-.')
    assert.equal(morseATexto('...-.-'), 'SK')
  })

  it('Farnsworth: el dit sigue al PPM de carácter y las pausas al efectivo', () => {
    const t = tiemposFarnsworth(18, 12)
    cerca(t.dit, 1.2 / 18, 6)
    assert.ok(t.letra > 3 * t.dit)
    assert.ok(t.palabra > 7 * t.dit)
  })

  it('acierto por carácter', () => {
    assert.equal(aciertoPorCaracter('ABCD', 'ABXD').porcentaje, 75)
  })
})
