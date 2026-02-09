import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { CIUDADES, FUENTE_CLIMA, describirTiempo, parsearClima } from '../src/lib/clima.ts'
import { definido } from './ayuda.ts'

const ciudad = (temperatura: number, codigo: number, isDay = 1) => ({
  current: {
    temperature_2m: temperatura,
    relative_humidity_2m: 80,
    wind_speed_10m: 5.4,
    weather_code: codigo,
    is_day: isDay,
  },
  daily: { temperature_2m_max: [24.9], temperature_2m_min: [11] },
})

describe('clima', () => {
  it('pide todas las ciudades en una sola consulta', () => {
    const url = new URL(FUENTE_CLIMA)
    assert.equal(url.searchParams.get('latitude')?.split(',').length, CIUDADES.length)
    assert.equal(url.searchParams.get('longitude')?.split(',').length, CIUDADES.length)
  })

  it('una fila por ciudad, en el orden de CIUDADES', () => {
    const filas = definido(
      parsearClima([
        ciudad(14.2, 45, 0),
        ciudad(16, 0),
        ciudad(15, 3),
        ciudad(13, 2),
        ciudad(12.5, 61),
      ]),
    )
    assert.deepEqual(
      filas.map((f) => f.nombre),
      ['Curicó', 'Talca', 'Linares', 'Cauquenes', 'Constitución'],
    )
    assert.deepEqual(filas[0], {
      nombre: 'Curicó',
      temperatura: 14.2,
      codigo: 45,
      dia: false,
      humedad: 80,
      viento: 5.4,
      maxima: 24.9,
      minima: 11,
    })
  })

  it('una respuesta incompleta o de error no rompe', () => {
    assert.equal(parsearClima({ error: true, reason: 'x' }), null)
    assert.equal(parsearClima([ciudad(10, 0)]), null)
    const sinTemperatura: unknown[] = CIUDADES.map(() => ciudad(10, 0))
    sinTemperatura[CIUDADES.length - 1] = {}
    assert.equal(parsearClima(sinTemperatura), null)
  })

  it('describe los códigos WMO', () => {
    assert.equal(describirTiempo(0).tipo, 'despejado')
    assert.equal(describirTiempo(2).texto, 'Parcialmente nublado')
    assert.equal(describirTiempo(45).tipo, 'niebla')
    assert.equal(describirTiempo(63).tipo, 'lluvia')
    assert.equal(describirTiempo(81).tipo, 'chubascos')
    assert.equal(describirTiempo(73).tipo, 'nieve')
    assert.equal(describirTiempo(95).tipo, 'tormenta')
  })
})
