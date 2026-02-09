import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { gammaHairpin } from '../src/lib/calc/adaptacion.ts'
import {
  formatearFijo,
  formatearLongitud,
  formatearLongitudCm,
  formatearNumero,
  parseNumero,
  perdidaLinea,
} from '../src/lib/calculadoras.ts'
import { cerca, definido } from './ayuda.ts'

describe('entrada y formato', () => {
  it('acepta coma o punto decimal', () => {
    assert.equal(parseNumero('146,38'), 146.38)
    assert.equal(parseNumero('7.148'), 7.148)
    assert.equal(parseNumero(''), null)
    assert.equal(parseNumero('abc'), null)
  })

  it('formatea con coma decimal y guion si no hay valor', () => {
    assert.equal(formatearNumero(1234.567, 1), '1.234,6')
    assert.equal(formatearNumero(null), '—')
    assert.equal(formatearFijo(146.38, 3), '146,380')
  })

  it('longitudes: bajo 3 m en centímetros', () => {
    assert.equal(formatearLongitud(0.5), '50 cm')
    assert.equal(formatearLongitud(20.123), '20,12 m')
    assert.equal(formatearLongitudCm(97.3), '97,3 cm')
    assert.equal(formatearLongitudCm(1990), '19,90 m')
  })
})

describe('pérdida de línea', () => {
  it('con ROE 1:1 no hay pérdida extra y el equipo ve 1:1', () => {
    const r = perdidaLinea({ matchedDb: 3, swrCarga: 1 })
    cerca(r.extraDb, 0, 6)
    cerca(r.swrEquipo, 1, 6)
  })

  it('la línea con pérdidas mejora la ROE que ve el equipo', () => {
    const r = perdidaLinea({ matchedDb: 3, swrCarga: 3 })
    assert.ok(r.extraDb > 0)
    assert.ok(r.swrEquipo < 3)
  })
})

describe('gamma match y hairpin', () => {
  it('Ra = 25 Ω: Xserie = 25 Ω y Xhairpin = 50 Ω', () => {
    const m = definido(gammaHairpin(146.38, 25))
    cerca(m.xSerie, 25, 6)
    cerca(m.xHairpin, 50, 6)
  })

  it('fuera de rango no calcula', () => {
    assert.equal(gammaHairpin(146.38, 50), null)
    assert.equal(gammaHairpin(0, 20), null)
  })
})
