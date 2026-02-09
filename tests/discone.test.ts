import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { discone } from '../src/lib/calc/discone.ts'
import { cerca, definido } from './ayuda.ts'

describe('discone', () => {
  it('cono λ/4 y disco ~0,7 de la boca a 100 MHz', () => {
    const d = definido(discone(100))
    cerca(d.largoInclinado.nominal, 0.75, 3)
    assert.ok(d.diametroDisco.nominal > 0.4 && d.diametroDisco.nominal < 0.6)
    assert.equal(d.fMaxUtilMhz, 1000)
    assert.ok(d.diametroDisco.min < d.diametroDisco.max)
  })

  it('sin frecuencia válida no calcula', () => {
    assert.equal(discone(0), null)
    assert.equal(discone(-5), null)
  })
})
