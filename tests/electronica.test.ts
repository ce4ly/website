import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  coloresAValor,
  divisorTension,
  leyOhm,
  resonanciaLc,
  valorAColores,
} from '../src/lib/calc/electronica.ts'
import { cerca, definido } from './ayuda.ts'

describe('electronica', () => {
  it('Ohm: 12 V y 2 A → 6 Ω y 24 W', () => {
    assert.deepEqual(leyOhm({ v: 12, i: 2 }), { v: 12, i: 2, r: 6, p: 24 })
  })

  it('Ohm: exige exactamente dos magnitudes', () => {
    assert.ok('error' in leyOhm({ v: 12 }))
    assert.ok('error' in leyOhm({ v: 12, i: 2, r: 6 }))
  })

  it('resistencia 4 bandas 1 kΩ ±5 %', () => {
    const v = definido(coloresAValor(4, ['marron', 'negro', 'rojo', 'oro']))
    assert.equal(v.ohm, 1000)
    assert.equal(v.tolerancia, 5)
    assert.deepEqual(definido(valorAColores(1000, 4, 5)).slice(0, 3), ['marron', 'negro', 'rojo'])
  })

  it('divisor 12 V 1k/1k → 6 V', () => {
    const d = definido(divisorTension({ vin: 12, r1: 1000, r2: 1000 }))
    cerca(d.vout, 6)
    cerca(d.pR1, 0.036)
  })

  it('LC 1 µH y 100 pF ≈ 15,92 MHz', () => {
    const r = resonanciaLc({ l: 1e-6, c: 100e-12 })
    assert.ok(!('error' in r))
    cerca(r.f / 1e6, 15.915, 2)
  })
})
