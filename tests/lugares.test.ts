import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { MAX_LUGARES, parsearLugares, urlBusquedaLugar } from '../src/lib/lugares.ts'

describe('buscador de ciudades', () => {
  it('pide pocos resultados, en español y en JSON', () => {
    const url = new URL(urlBusquedaLugar('  Talca '))
    assert.equal(url.searchParams.get('q'), 'Talca')
    assert.equal(url.searchParams.get('format'), 'jsonv2')
    assert.equal(url.searchParams.get('limit'), String(MAX_LUGARES))
    assert.equal(url.searchParams.get('accept-language'), 'es')
  })

  it('lee nombre y coordenadas, y descarta lo inválido', () => {
    const lugares = parsearLugares([
      { display_name: 'Talca, Región del Maule, Chile', lat: '-35.4265', lon: '-71.6660' },
      { display_name: 'Sin coordenadas' },
      { display_name: 'Fuera de rango', lat: '95', lon: '0' },
      { lat: '1', lon: '1' },
    ])
    assert.deepEqual(lugares, [
      { nombre: 'Talca, Región del Maule, Chile', latitud: -35.4265, longitud: -71.666 },
    ])
    assert.deepEqual(parsearLugares({ error: 'x' }), [])
  })
})
