import { describe, expect, it } from 'vitest'
import {
  haversineKm,
  latLonALocator,
  locatorALatLon,
  rumboEntreLocators
} from './maidenhead.js'

describe('maidenhead', () => {
  it('convierte Washington Monument a FM18lv', () => {
    expect(latLonALocator(38.8895, -77.0353, 6)).toBe('FM18lv')
  })

  it('ida y vuelta 6 caracteres queda en el mismo subsquare', () => {
    const loc = latLonALocator(-35.4264, -71.6556, 6)
    const centro = locatorALatLon(loc)
    expect(latLonALocator(centro.latitud, centro.longitud, 6)).toBe(loc)
  })

  it('ida y vuelta 4 y 8 caracteres', () => {
    const loc4 = latLonALocator(-35.4264, -71.6556, 4)
    expect(loc4).toMatch(/^FF44$/i)
    const loc8 = latLonALocator(-35.4264, -71.6556, 8)
    expect(loc8).toHaveLength(8)
    const c8 = locatorALatLon(loc8)
    expect(latLonALocator(c8.latitud, c8.longitud, 8)).toBe(loc8)
  })

  it('distancia 1° en el ecuador ≈ 111,2 km', () => {
    const d = haversineKm(0, 0, 0, 1)
    expect(d).toBeGreaterThan(110.5)
    expect(d).toBeLessThan(111.4)
  })

  it('rumbo entre locators de referencia (AA00 → AB00, ~1112 km al norte)', () => {
    const rumbo = rumboEntreLocators('AA00aa', 'AB00aa')
    expect(rumbo.distanciaKm).toBeGreaterThan(1100)
    expect(rumbo.distanciaKm).toBeLessThan(1130)
    expect(rumbo.azimutDirecto < 10 || rumbo.azimutDirecto > 350).toBe(true)
    expect(Math.abs(rumbo.azimutInverso - 180)).toBeLessThan(10)
  })
})
