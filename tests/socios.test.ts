import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  adornosLicencia,
  buscarLicencias,
  candidatosPorSufijo,
  listarSocios,
  normalizar,
  vencida,
  type Licencia,
} from '../src/lib/licencias.ts'
import { leerSocios } from '../src/lib/socios.ts'

const licencia = (indicativo: string, nombre: string, vencimiento = '01/01/2030'): Licencia => ({
  licencia: `${indicativo}-L`,
  indicativo,
  nombre,
  region: 'Región del Maule',
  comuna: 'Talca',
  vencimiento,
  categoria: 'novicio',
})

const LICENCIAS = [
  licencia('CA5NFS', 'FUENTEALBA CARTES RODRIGO'),
  licencia('CA4DJF', 'FUENTEALBA ALIAGA DIEGO'),
  licencia('CE4CHP', 'HERNANDEZ PEÑA Y LILLO CARLOS'),
  licencia('CD4BWW', 'CASTRO MORENO LUIS'),
  licencia('CA4NFS', 'OTRA PERSONA'),
  licencia('CD4EYT', 'NOZIGLIA PINTO PALOMA ELEONORA'),
  licencia('CA4KKW', 'DOLL LARENAS SEBASTIAN MAURICIO'),
]

describe('socios.txt', () => {
  it('lee un indicativo por línea: mayúsculas, sin repetir, ordenados', () => {
    const r = leerSocios('ca5nfs\n\nCE4CHP  \n# comentario\nCA5NFS\r\nCA4DJF # presidente\n')
    assert.deepEqual(r.indicativos, ['CA4DJF', 'CA5NFS', 'CE4CHP'])
    assert.deepEqual(r.duplicados, ['CA5NFS'])
    assert.deepEqual(r.invalidos, [])
  })

  it('señala las líneas que no son indicativos', () => {
    const r = leerSocios('CA5NFS\nCA5 NFS\nhola\n3G4ABC\nXQ4AA')
    assert.deepEqual(
      r.invalidos.map((i) => i.linea),
      [2, 3],
    )
    assert.deepEqual(r.indicativos, ['3G4ABC', 'CA5NFS', 'XQ4AA'])
  })
})

describe('buscador de licencias', () => {
  it('prioriza el indicativo exacto y luego el prefijo', () => {
    const r = buscarLicencias(LICENCIAS, normalizar('ca5nfs'))
    assert.deepEqual(
      r.map((l) => l.indicativo),
      ['CA5NFS'],
    )
    assert.equal(buscarLicencias(LICENCIAS, normalizar('fuentealba')).length, 2)
  })

  it('busca el nombre por palabras, en cualquier orden y sin tildes', () => {
    const indicativos = (busqueda: string) =>
      buscarLicencias(LICENCIAS, busqueda).map((l) => l.indicativo)
    assert.deepEqual(indicativos('RODRIGO FUENTEALBA'), ['CA5NFS'])
    assert.deepEqual(indicativos('rod  fuentealba'), ['CA5NFS'])
    assert.deepEqual(indicativos('Sebastián Doll'), ['CA4KKW'])
    assert.deepEqual(indicativos('rodrigo diego'), [])
    assert.deepEqual(indicativos('ca 5nfs'), ['CA5NFS'])
  })

  it('cada palabra puede ser parte del indicativo: lo que se escuchó a medias', () => {
    const indicativos = (busqueda: string, soloIndicativos = false) =>
      buscarLicencias(LICENCIAS, busqueda, { soloIndicativos }).map((l) => l.indicativo)
    assert.deepEqual(indicativos('A5 RIGO'), ['CA5NFS'])
    assert.deepEqual(indicativos('5 fs rigo'), ['CA5NFS'])
    assert.deepEqual(indicativos('4 fs'), ['CA4NFS'])
    assert.deepEqual(indicativos('5 fs', true), ['CA5NFS'])
    assert.deepEqual(indicativos('5 rigo', true), [])
  })

  it('solo por indicativos: «ria» no trae a los ARRIAGADA', () => {
    const arriagada = [
      ...LICENCIAS,
      licencia('CA4RQE', 'ARRIAGADA SOTO ANA'),
      licencia('CE4RIA', 'ARAYA RODRIGO'),
    ]
    const indicativos = (soloIndicativos: boolean) =>
      buscarLicencias(arriagada, 'RIA', { soloIndicativos }).map((l) => l.indicativo)
    assert.deepEqual(indicativos(false), ['CE4RIA', 'CA4RQE'])
    assert.deepEqual(indicativos(true), ['CE4RIA'])
    assert.deepEqual(buscarLicencias(LICENCIAS, 'fuentealba', { soloIndicativos: true }), [])
    assert.deepEqual(
      listarSocios(arriagada, ['CA4RQE', 'CE4RIA'], 'ria', { soloIndicativos: true }).map(
        (s) => s.indicativo,
      ),
      ['CE4RIA'],
    )
  })

  it('CA4NFS lleva a CA5NFS, sin ocultar a quien tenga ese indicativo', () => {
    const consulta = normalizar('CA4NFS')
    const r = buscarLicencias(LICENCIAS, consulta)
    assert.deepEqual(
      r.map((l) => l.indicativo),
      ['CA5NFS', 'CA4NFS'],
    )
    assert.equal(adornosLicencia(r[0], consulta).nota, '(¡gracias Subtel!)')
    assert.equal(adornosLicencia(r[1], consulta).nota, null)
    assert.equal(adornosLicencia(r[0], normalizar('CA5NFS')).nota, null)
  })

  it('CD4EZH y CD4KKW llevan a CA4KKW, con su propia nota', () => {
    for (const buscado of ['CD4EZH', 'CD4KKW']) {
      const consulta = normalizar(buscado)
      const r = buscarLicencias(LICENCIAS, consulta)
      assert.deepEqual(
        r.map((l) => l.indicativo),
        ['CA4KKW'],
      )
      assert.equal(adornosLicencia(r[0], consulta).nota, '(Subtelcosas)')
    }
    assert.equal(adornosLicencia(LICENCIAS[6], normalizar('CA4KKW')).nota, null)
  })

  it('corazón para CD4EYT', () => {
    const paloma = LICENCIAS.find((l) => l.indicativo === 'CD4EYT')!
    assert.equal(adornosLicencia(paloma, normalizar('CD4EYT')).corazon, true)
    assert.equal(adornosLicencia(paloma, normalizar('eyt')).corazon, true)
    assert.equal(adornosLicencia(paloma, normalizar('noziglia')).corazon, false)
  })

  it('lista los socios por apellido y deja al final a quienes no figuran en SUBTEL', () => {
    const socios = listarSocios(LICENCIAS, ['CE4CHP', 'CE4WQP', 'CA5NFS', 'CA4DJF', 'CD4BWW'])
    assert.deepEqual(
      socios.map((s) => s.indicativo),
      ['CD4BWW', 'CA4DJF', 'CA5NFS', 'CE4CHP', 'CE4WQP'],
    )
    assert.equal(socios.at(-1)?.licencia, null)
  })

  it('busca solo entre los socios', () => {
    const socios = ['CA5NFS', 'CE4CHP', 'CE4WQP']
    assert.deepEqual(
      listarSocios(LICENCIAS, socios, normalizar('nfs')).map((s) => s.indicativo),
      ['CA5NFS'],
    )
    assert.deepEqual(
      listarSocios(LICENCIAS, socios, normalizar('wqp')).map((s) => s.indicativo),
      ['CE4WQP'],
    )
  })

  it('sugiere el mismo sufijo y zona con otro prefijo', () => {
    assert.deepEqual(
      candidatosPorSufijo(LICENCIAS, 'CA4BWW').map((l) => l.indicativo),
      ['CD4BWW'],
    )
    // Otra zona (CA4NFS) no es candidata para CE5NFS… pero CA5NFS sí.
    assert.deepEqual(
      candidatosPorSufijo(LICENCIAS, 'CE5NFS').map((l) => l.indicativo),
      ['CA5NFS'],
    )
  })

  it('una licencia vence el día siguiente a su fecha', () => {
    const hoy = new Date(2026, 9, 23)
    assert.equal(vencida('22/10/2026', hoy), true)
    assert.equal(vencida('23/10/2026', hoy), false)
  })
})
