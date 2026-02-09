import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  BANDAS_HILO,
  largoContrapeso,
  margenAResonancia,
  rankearLargos,
  zonasResonantes,
} from '../src/lib/calc/hilo-largo.ts'
import { cerca } from './ayuda.ts'

describe('hilo-largo', () => {
  it('un múltiplo de media onda en 40 m tiene margen 0', () => {
    const zonas = zonasResonantes(BANDAS_HILO.filter((b) => b.id === '40'))
    assert.equal(margenAResonancia(142.5 / 7.15, zonas).margen, 0)
  })

  it('rankea largos con margen positivo, de mayor a menor', () => {
    const top = rankearLargos({ bandasIds: ['40', '20'], lMin: 12, lMax: 25, paso: 0.1, top: 3 })
    assert.ok(top[0].margen > 0)
    assert.ok(top[0].margen >= top[1].margen)
  })

  it('sin bandas no hay candidatos ni contrapeso', () => {
    assert.deepEqual(rankearLargos({ bandasIds: [] }), [])
    assert.equal(largoContrapeso([]), null)
  })

  it('contrapeso ~0,05 λ de la banda más baja', () => {
    cerca(largoContrapeso(['40']), 0.05 * (300 / 7), 2)
  })
})
