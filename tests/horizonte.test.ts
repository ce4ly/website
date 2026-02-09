import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  fsplDb,
  horizonteRadioKm,
  presupuestoEnlace,
  wattsADbm,
} from '../src/lib/calc/horizonte.ts'
import { cerca, definido } from './ayuda.ts'

describe('horizonte', () => {
  it('k=4/3 con 100 m y 0 m ≈ 41,2 km', () => {
    cerca(horizonteRadioKm(100, 0), 41.2, 1)
  })

  it('FSPL a 146,38 MHz y 10 km', () => {
    cerca(fsplDb(146.38, 10), 95.76, 1)
  })

  it('presupuesto de enlace con 50 W y 0 dBi', () => {
    const ptx = definido(wattsADbm(50))
    const r = definido(
      presupuestoEnlace({
        ptxDbm: ptx,
        gtxDbi: 0,
        lcableTxDb: 0,
        fMhz: 146.38,
        dKm: 10,
        grxDbi: 0,
        lcableRxDb: 0,
        sensibilidadDbm: -120,
      }),
    )
    cerca(ptx, 46.99, 1)
    assert.ok(definido(r.margen) > 60)
  })

  it('sin sensibilidad no hay margen', () => {
    const r = definido(presupuestoEnlace({ ptxDbm: 40, fMhz: 146, dKm: 5 }))
    assert.equal(r.margen, null)
  })
})
