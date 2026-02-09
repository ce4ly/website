import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  haversineKm,
  latLonALocator,
  limitesLocator,
  puntosGranCirculo,
  locatorALatLon,
  locatorValido,
  rumboEntreLocators,
} from '../src/lib/calc/maidenhead.ts'
import { CLUB } from '../src/lib/club.ts'
import { definido } from './ayuda.ts'

describe('maidenhead', () => {
  it('convierte Washington Monument a FM18lv', () => {
    assert.equal(latLonALocator(38.8895, -77.0353, 6), 'FM18lv')
  })

  it('el locator del club corresponde a sus coordenadas', () => {
    assert.equal(latLonALocator(CLUB.latitud, CLUB.longitud, 6), CLUB.locator)
  })

  it('ida y vuelta 6 caracteres queda en el mismo subsquare', () => {
    const loc = definido(latLonALocator(-35.4264, -71.6556, 6))
    const centro = definido(locatorALatLon(loc))
    assert.equal(latLonALocator(centro.latitud, centro.longitud, 6), loc)
  })

  it('ida y vuelta 4 y 8 caracteres', () => {
    assert.match(definido(latLonALocator(-35.4264, -71.6556, 4)), /^FF44$/i)
    const loc8 = definido(latLonALocator(-35.4264, -71.6556, 8))
    assert.equal(loc8.length, 8)
    const c8 = definido(locatorALatLon(loc8))
    assert.equal(latLonALocator(c8.latitud, c8.longitud, 8), loc8)
  })

  it('límites de la cuadrícula: FF44 va de 72° a 70° O y de 36° a 35° S', () => {
    const l = definido(limitesLocator('FF44'))
    assert.ok(Math.abs(l.oeste + 72) < 1e-9 && Math.abs(l.este + 70) < 1e-9)
    assert.ok(Math.abs(l.sur + 36) < 1e-9 && Math.abs(l.norte + 35) < 1e-9)
    const club = definido(limitesLocator('FF44en'))
    assert.ok(Math.abs(club.este - club.oeste - 2 / 24) < 1e-9)
    assert.equal(limitesLocator('ZZ99'), null)
  })

  it('ruta de gran círculo: extremos exactos y punto medio sobre el ecuador', () => {
    const r = puntosGranCirculo({ latitud: 0, longitud: 0 }, { latitud: 0, longitud: 90 }, 4)
    assert.equal(r.length, 5)
    assert.ok(Math.abs(r[2][0]) < 1e-9 && Math.abs(r[2][1] - 45) < 1e-9)
    assert.ok(Math.abs(r[4][1] - 90) < 1e-9)
  })

  it('la ruta no salta al cruzar el antimeridiano', () => {
    const r = puntosGranCirculo({ latitud: -35, longitud: 170 }, { latitud: -35, longitud: -170 })
    for (let i = 1; i < r.length; i++) assert.ok(Math.abs(r[i][1] - r[i - 1][1]) < 5)
    assert.ok(Math.abs(r.at(-1)![1] - 190) < 1e-6)
  })

  it('rechaza locators y coordenadas fuera de rango', () => {
    assert.equal(locatorValido('ZZ99'), false)
    assert.equal(locatorALatLon('hola'), null)
    assert.equal(latLonALocator(91, 0), null)
  })

  it('distancia 1° en el ecuador ≈ 111,2 km', () => {
    const d = haversineKm(0, 0, 0, 1)
    assert.ok(d > 110.5 && d < 111.4)
  })

  it('rumbo entre locators de referencia (AA00 → AB00, ~1112 km al norte)', () => {
    const rumbo = definido(rumboEntreLocators('AA00aa', 'AB00aa'))
    assert.ok(rumbo.distanciaKm > 1100 && rumbo.distanciaKm < 1130)
    assert.ok(rumbo.azimutDirecto < 10 || rumbo.azimutDirecto > 350)
    assert.ok(Math.abs(rumbo.azimutInverso - 180) < 10)
  })
})
