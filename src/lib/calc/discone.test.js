import { describe, expect, it } from 'vitest'
import { discone } from './discone.js'

describe('discone', () => {
  it('cono λ/4 y disco ~0,7 de la boca a 100 MHz', () => {
    const d = discone(100)
    expect(d.largoInclinado.nominal).toBeCloseTo(0.75, 3)
    expect(d.diametroDisco.nominal).toBeGreaterThan(0.4)
    expect(d.diametroDisco.nominal).toBeLessThan(0.6)
    expect(d.fMaxUtilMhz).toBe(1000)
    expect(d.diametroDisco.min).toBeLessThan(d.diametroDisco.max)
  })
})
