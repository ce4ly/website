const RADIO_TIERRA_KM = 6371
const CODIGO_A = 'A'.charCodeAt(0)

const enRango = (valor: number, min: number, max: number) =>
  Number.isFinite(valor) && valor >= min && valor <= max

const normalizarLocator = (texto: string | null | undefined) =>
  (texto ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

export const locatorValido = (texto: string | null | undefined): boolean => {
  const loc = normalizarLocator(texto)
  return /^(?:[A-R]{2}[0-9]{2}(?:[A-X]{2}(?:[0-9]{2})?)?)$/.test(loc)
}

export const latLonALocator = (lat: number, lon: number, precision = 6): string | null => {
  if (!enRango(lat, -90, 90) || !enRango(lon, -180, 180)) return null
  const pasos = precision === 4 ? 2 : precision === 8 ? 4 : 3
  let x = lon + 180
  let y = lat + 90
  let locator = ''
  // [paso de longitud, paso de latitud, ¿letras?, índice máximo] de cada par del locator.
  const divisores: [number, number, boolean, number][] = [
    [20, 10, true, 17],
    [2, 1, false, 9],
    [2 / 24, 1 / 24, true, 23],
    [2 / 240, 1 / 240, false, 9],
  ]
  for (let i = 0; i < pasos; i += 1) {
    const [dx, dy, letra, maxIdx] = divisores[i]
    const cx = Math.min(Math.floor(x / dx), maxIdx)
    const cy = Math.min(Math.floor(y / dy), maxIdx)
    if (letra) {
      const mayus = i < 2
      const a = String.fromCharCode(CODIGO_A + cx)
      const b = String.fromCharCode(CODIGO_A + cy)
      locator += mayus ? a + b : a.toLowerCase() + b.toLowerCase()
    } else {
      locator += String(cx)
      locator += String(cy)
    }
    x -= cx * dx
    y -= cy * dy
  }
  return locator
}

export type PuntoLocator = { latitud: number; longitud: number; precision: number }

export const locatorALatLon = (texto: string | null | undefined): PuntoLocator | null => {
  const loc = normalizarLocator(texto)
  if (!locatorValido(loc)) return null
  let lon = -180
  let lat = -90
  let lonSpan = 20
  let latSpan = 10
  lon += (loc.charCodeAt(0) - CODIGO_A) * 20
  lat += (loc.charCodeAt(1) - CODIGO_A) * 10
  if (loc.length >= 4) {
    lonSpan = 2
    latSpan = 1
    lon += Number(loc[2]) * 2
    lat += Number(loc[3]) * 1
  }
  if (loc.length >= 6) {
    lonSpan = 2 / 24
    latSpan = 1 / 24
    lon += (loc.charCodeAt(4) - CODIGO_A) * lonSpan
    lat += (loc.charCodeAt(5) - CODIGO_A) * latSpan
  }
  if (loc.length >= 8) {
    lonSpan = 2 / 240
    latSpan = 1 / 240
    lon += Number(loc[6]) * lonSpan
    lat += Number(loc[7]) * latSpan
  }
  return {
    latitud: lat + latSpan / 2,
    longitud: lon + lonSpan / 2,
    precision: loc.length,
  }
}

/** Ancho (longitud) y alto (latitud), en grados, de una cuadrícula según sus caracteres. */
const TAMANO_CUADRICULA: Readonly<Record<number, readonly [number, number]>> = {
  2: [20, 10],
  4: [2, 1],
  6: [2 / 24, 1 / 24],
  8: [2 / 240, 1 / 240],
}

export type LimitesLocator = { oeste: number; sur: number; este: number; norte: number }

/** Bordes de la cuadrícula de un locator (para dibujarla en un mapa). */
export const limitesLocator = (texto: string | null | undefined): LimitesLocator | null => {
  const centro = locatorALatLon(texto)
  if (!centro) return null
  const [ancho, alto] = TAMANO_CUADRICULA[centro.precision]
  return {
    oeste: centro.longitud - ancho / 2,
    sur: centro.latitud - alto / 2,
    este: centro.longitud + ancho / 2,
    norte: centro.latitud + alto / 2,
  }
}

const aRadianes = (grados: number) => (grados * Math.PI) / 180
const aGrados = (radianes: number) => (radianes * 180) / Math.PI

export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const dLat = aRadianes(lat2 - lat1)
  const dLon = aRadianes(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * RADIO_TIERRA_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const azimutInicial = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const φ1 = aRadianes(lat1)
  const φ2 = aRadianes(lat2)
  const Δλ = aRadianes(lon2 - lon1)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return (aGrados(Math.atan2(y, x)) + 360) % 360
}

export const rumboEntreLocators = (origen: string, destino: string) => {
  const a = locatorALatLon(origen)
  const b = locatorALatLon(destino)
  if (!a || !b) return null
  return {
    distanciaKm: haversineKm(a.latitud, a.longitud, b.latitud, b.longitud),
    azimutDirecto: azimutInicial(a.latitud, a.longitud, b.latitud, b.longitud),
    azimutInverso: azimutInicial(b.latitud, b.longitud, a.latitud, a.longitud),
    origen: a,
    destino: b,
  }
}

/**
 * `segmentos + 1` puntos [latitud, longitud] sobre la ruta de gran círculo de `a` a `b`, para
 * dibujarla en un mapa. Las longitudes van «desenrolladas» (pueden pasar de ±180°) para que la
 * línea no salte de un borde del mapa al otro al cruzar el antimeridiano.
 */
export const puntosGranCirculo = (
  a: { latitud: number; longitud: number },
  b: { latitud: number; longitud: number },
  segmentos = 64,
): [number, number][] => {
  const aVector = (lat: number, lon: number) => {
    const φ = aRadianes(lat)
    const λ = aRadianes(lon)
    return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)]
  }
  const p = aVector(a.latitud, a.longitud)
  const q = aVector(b.latitud, b.longitud)
  const angulo = Math.acos(Math.min(1, Math.max(-1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])))
  const puntos: [number, number][] = []
  for (let i = 0; i <= segmentos; i++) {
    const t = i / segmentos
    // Interpolación esférica; con ambos puntos casi iguales, basta la lineal.
    const [fa, fb] =
      angulo < 1e-9
        ? [1 - t, t]
        : [Math.sin((1 - t) * angulo) / Math.sin(angulo), Math.sin(t * angulo) / Math.sin(angulo)]
    const [x, y, z] = [0, 1, 2].map((k) => fa * p[k] + fb * q[k])
    const lat = aGrados(Math.atan2(z, Math.hypot(x, y)))
    let lon = aGrados(Math.atan2(y, x))
    const anterior = puntos.at(-1)
    if (anterior) lon += Math.round((anterior[1] - lon) / 360) * 360
    else lon = a.longitud
    puntos.push([lat, lon])
  }
  return puntos
}
