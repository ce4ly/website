import { describe, expect, it } from 'vitest'
import {
  largoContrapeso,
  margenAResonancia,
  rankearLargos,
  zonasResonantes,
  BANDAS_HILO
} from './hilo-largo.js'

describe('hilo-largo', () => {
  it('un múltiplo de media onda en 40 m tiene margen 0', () => {
    const zonas = zonasResonantes(BANDAS_HILO.filter(b => b.id === '40'))
    const media = 142.5 / 7.15
    expect(margenAResonancia(media, zonas).margen).toBe(0)
  })

  it('rankea largos con margen positivo', () => {
    const top = rankearLargos({
      bandasIds: ['40', '20'],
      lMin: 12,
      lMax: 25,
      paso: 0.1,
      top: 3
    })
    expect(top[0].margen).toBeGreaterThan(0)
    expect(top[0].margen).toBeGreaterThanOrEqual(top[1].margen)
  })

  it('contrapeso ~0,05 λ de la banda más baja', () => {
    expect(largoContrapeso(['40'])).toBeCloseTo(0.05 * (300 / 7), 2)
  })
})
