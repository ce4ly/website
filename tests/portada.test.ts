import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatearFijo } from '../src/lib/calculadoras.ts'
import { CLUB } from '../src/lib/club.ts'
import { rutaDe } from '../src/lib/paginas.ts'
import { HORARIO_BOLETINES, QUE_HACEMOS, REPETIDORAS_EN_AIRE } from '../src/lib/portada.ts'

describe('portada', () => {
  it('anuncia solo la repetidora que está en el aire (VHF 146,380)', () => {
    assert.deepEqual(
      REPETIDORAS_EN_AIRE.map((r) => formatearFijo(r.frecuenciaMhz, 3)),
      ['146,380'],
    )
  })

  it('«Qué hacemos»: cursos, boletines al medio y actividades en Instagram', () => {
    assert.deepEqual(
      QUE_HACEMOS.map((t) => t.titulo),
      ['Cursos abiertos', 'Boletines', 'Actividades'],
    )
    for (const t of QUE_HACEMOS) {
      if ('pagina' in t) assert.ok(rutaDe(t.pagina))
      else assert.equal(t.url, CLUB.redes.instagram)
    }
  })

  it('boletines los miércoles y sábados (lunes = 0)', () => {
    assert.deepEqual(HORARIO_BOLETINES.dias, [2, 5])
  })
})
