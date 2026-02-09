import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { Licencia } from '../src/lib/licencias.ts'
import {
  buscarPorLetras,
  esCoincidenciaExacta,
  esOperativo,
  hoyEnChile,
  iniciarOperativo,
  nombreArchivoReporte,
  quitarEstacion,
  registrarEstacion,
  reporteTxt,
  terminarOperativo,
} from '../src/lib/operativo.ts'

const lic = (indicativo: string, nombre = 'APELLIDO NOMBRE'): Licencia => ({
  licencia: '1-1',
  indicativo,
  nombre,
  region: 'Región del Maule',
  comuna: 'Talca',
  vencimiento: '01/01/2030',
  categoria: 'general',
})

const LICENCIAS = [lic('CA3NFS'), lic('CA5NFS'), lic('CA4NFSX'), lic('CE4NF'), lic('CE4LY')]

// 20:31 hora de Chile (verano, UTC−3) del 23 de octubre de 2026.
const T0 = new Date('2026-10-23T23:30:00Z')
const T1 = new Date('2026-10-23T23:31:00Z')
const T2 = new Date('2026-10-24T00:15:00Z')

describe('búsqueda por letras', () => {
  it('sufijo exacto primero y, dentro, la zona del club', () => {
    assert.deepEqual(
      buscarPorLetras(LICENCIAS, 'nfs').map((l) => l.indicativo),
      ['CA3NFS', 'CA5NFS', 'CA4NFSX'],
    )
    assert.deepEqual(
      buscarPorLetras(LICENCIAS, 'NF').map((l) => l.indicativo),
      ['CE4NF', 'CA4NFSX', 'CA3NFS', 'CA5NFS'],
    )
  })

  it('coincidencia exacta: el sufijo completo, no uno que solo empieza igual', () => {
    const [ca5nfs, ca4nfsx] = [LICENCIAS[1], LICENCIAS[2]]
    assert.equal(esCoincidenciaExacta(ca5nfs, 'nfs'), true)
    assert.equal(esCoincidenciaExacta(ca4nfsx, 'NFS'), false)
    assert.equal(esCoincidenciaExacta(ca5nfs, 'CA5NFS'), true)
    assert.equal(esCoincidenciaExacta(ca5nfs, ''), false)
  })

  it('con un número busca por indicativo completo', () => {
    assert.deepEqual(
      buscarPorLetras(LICENCIAS, 'ca5n').map((l) => l.indicativo),
      ['CA5NFS'],
    )
    assert.deepEqual(buscarPorLetras(LICENCIAS, '  '), [])
  })

  it('con varias palabras, cada una en cualquier parte del indicativo', () => {
    assert.deepEqual(
      buscarPorLetras(LICENCIAS, '5 fs').map((l) => l.indicativo),
      ['CA5NFS'],
    )
    assert.deepEqual(
      buscarPorLetras(LICENCIAS, 'fs 4').map((l) => l.indicativo),
      ['CA4NFSX'],
    )
    // Lo escuchado a medias no es una coincidencia exacta: Enter no registra sin elegir.
    assert.equal(esCoincidenciaExacta(LICENCIAS[1], '5 fs'), false)
    assert.equal(esCoincidenciaExacta(LICENCIAS[1], 'CA5 NFS'), true)
  })
})

describe('operativo', () => {
  it('registra cada estación una vez, con su hora, y permite quitarla', () => {
    let op = iniciarOperativo('  Ejercicio regional ', '2026-10-23', T0)
    assert.equal(op.nombre, 'Ejercicio regional')
    op = registrarEstacion(op, { indicativo: 'ca5nfs', nombre: 'FUENTEALBA CARTES RODRIGO' }, T1)
    op = registrarEstacion(op, { indicativo: 'CA5NFS', nombre: 'otra vez' }, T2)
    assert.equal(op.registros.length, 1)
    assert.deepEqual(op.registros[0], {
      indicativo: 'CA5NFS',
      nombre: 'FUENTEALBA CARTES RODRIGO',
      hora: T1.toISOString(),
    })
    assert.equal(quitarEstacion(op, 'CA5NFS').registros.length, 0)
  })

  it('terminado no acepta más estaciones', () => {
    const op = terminarOperativo(iniciarOperativo('X', '2026-10-23', T0), T2)
    assert.equal(op.fin, T2.toISOString())
    assert.equal(registrarEstacion(op, { indicativo: 'CE4LY', nombre: '' }).registros.length, 0)
  })

  it('reporte en texto con hora de Chile y UTC', () => {
    let op = iniciarOperativo('Ejercicio de Emergencia', '2026-10-23', T0)
    op = registrarEstacion(op, { indicativo: 'CA5NFS', nombre: 'FUENTEALBA CARTES RODRIGO' }, T1)
    op = registrarEstacion(
      op,
      { indicativo: 'XQ4ZZ', nombre: 'Juan Pérez', noRegistrado: true },
      T2,
    )
    op = registrarEstacion(op, { indicativo: 'CA4ZZZ', nombre: '', noRegistrado: true }, T2)
    op = terminarOperativo(op, T2)
    const txt = reporteTxt(op)
    assert.ok(txt.includes('Operativo: Ejercicio de Emergencia'))
    assert.ok(txt.includes('Fecha:     23-10-2026'))
    assert.ok(txt.includes('Inicio:    20:30 (23:30 UTC)'))
    assert.ok(txt.includes('Término:   21:15 (00:15 UTC)'))
    assert.ok(txt.includes('Estaciones presentes: 3'))
    assert.match(txt, /^ {3}1 {2}20:31 {2}23:31 {2}CA5NFS {6}FUENTEALBA CARTES RODRIGO$/m)
    assert.match(txt, /XQ4ZZ +Juan Pérez \(no registrado\)$/m)
    assert.match(txt, /CA4ZZZ +\(no registrado\)$/m)
    assert.equal(nombreArchivoReporte(op), 'operativo-2026-10-23-ejercicio-de-emergencia.txt')
  })

  it('la fecha de hoy es la de Chile, no la UTC', () => {
    assert.equal(hoyEnChile(T2), '2026-10-23')
  })

  it('descarta lo guardado si no tiene la forma de un operativo', () => {
    assert.ok(esOperativo(iniciarOperativo('X', '2026-10-23', T0)))
    assert.equal(esOperativo({ nombre: 'X' }), false)
    assert.equal(esOperativo(null), false)
  })
})
