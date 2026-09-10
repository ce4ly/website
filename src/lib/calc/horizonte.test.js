import { describe, expect, it } from 'vitest'
import {
  fsplDb,
  horizonteRadioKm,
  presupuestoEnlace,
  wattsADbm
} from './horizonte.js'

describe('horizonte', () => {
  it('k=4/3 con 100 m y 0 m ≈ 41,2 km', () => {
    expect(horizonteRadioKm(100, 0)).toBeCloseTo(41.2, 1)
  })

  it('FSPL a 146,38 MHz y 10 km', () => {
    const db = fsplDb(146.38, 10)
    expect(db).toBeCloseTo(95.76, 1)
  })

  it('presupuesto de enlace con 50 W y 0 dBi', () => {
    const ptx = wattsADbm(50)
    const r = presupuestoEnlace({
      ptxDbm: ptx,
      gtxDbi: 0,
      lcableTxDb: 0,
      fMhz: 146.38,
      dKm: 10,
      grxDbi: 0,
      lcableRxDb: 0,
      sensibilidadDbm: -120
    })
    expect(ptx).toBeCloseTo(46.99, 1)
    expect(r.margen).toBeGreaterThan(60)
  })
})
