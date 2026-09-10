import { describe, expect, it } from 'vitest'
import {
  coloresAValor,
  divisorTension,
  leyOhm,
  resonanciaLc,
  valorAColores
} from './electronica.js'

describe('electronica', () => {
  it('Ohm: 12 V y 2 A → 6 Ω y 24 W', () => {
    expect(leyOhm({ v: 12, i: 2 })).toMatchObject({ r: 6, p: 24 })
  })

  it('resistencia 4 bandas 1 kΩ ±5 %', () => {
    const v = coloresAValor(4, ['marron', 'negro', 'rojo', 'oro'])
    expect(v.ohm).toBe(1000)
    expect(v.tolerancia).toBe(5)
    expect(valorAColores(1000, 4, 5).slice(0, 3)).toEqual([
      'marron',
      'negro',
      'rojo'
    ])
  })

  it('divisor 12 V 1k/1k → 6 V', () => {
    const d = divisorTension({ vin: 12, r1: 1000, r2: 1000 })
    expect(d.vout).toBeCloseTo(6)
    expect(d.pR1).toBeCloseTo(0.036)
  })

  it('LC 1 µH y 100 pF ≈ 15,92 MHz', () => {
    const r = resonanciaLc({ l: 1e-6, c: 100e-12 })
    expect(r.f).toBeCloseTo(15.915e6, -3)
  })
})
