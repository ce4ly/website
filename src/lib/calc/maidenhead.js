const RADIO_TIERRA_KM = 6371
const CODIGO_A = 'A'.charCodeAt(0)

const enRango = (valor, min, max) =>
  Number.isFinite(valor) && valor >= min && valor <= max

const normalizarLocator = texto =>
  String(texto || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

export const locatorValido = texto => {
  const loc = normalizarLocator(texto)
  return /^(?:[A-R]{2}[0-9]{2}(?:[A-X]{2}(?:[0-9]{2})?)?)$/.test(loc)
}

export const latLonALocator = (lat, lon, precision = 6) => {
  if (!enRango(lat, -90, 90) || !enRango(lon, -180, 180)) return null
  const pasos = precision === 4 ? 2 : precision === 8 ? 4 : 3
  let x = lon + 180
  let y = lat + 90
  let locator = ''
  const divisores = [
    [20, 10, true, 17],
    [2, 1, false, 9],
    [2 / 24, 1 / 24, true, 23],
    [2 / 240, 1 / 240, false, 9]
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

export const locatorALatLon = texto => {
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
    precision: loc.length
  }
}

const aRadianes = grados => (grados * Math.PI) / 180
const aGrados = radianes => (radianes * 180) / Math.PI

export const haversineKm = (lat1, lon1, lat2, lon2) => {
  const dLat = aRadianes(lat2 - lat1)
  const dLon = aRadianes(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) *
      Math.cos(aRadianes(lat2)) *
      Math.sin(dLon / 2) ** 2
  return 2 * RADIO_TIERRA_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const azimutInicial = (lat1, lon1, lat2, lon2) => {
  const φ1 = aRadianes(lat1)
  const φ2 = aRadianes(lat2)
  const Δλ = aRadianes(lon2 - lon1)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return (aGrados(Math.atan2(y, x)) + 360) % 360
}

export const rumboEntreLocators = (origen, destino) => {
  const a = locatorALatLon(origen)
  const b = locatorALatLon(destino)
  if (!a || !b) return null
  return {
    distanciaKm: haversineKm(a.latitud, a.longitud, b.latitud, b.longitud),
    azimutDirecto: azimutInicial(a.latitud, a.longitud, b.latitud, b.longitud),
    azimutInverso: azimutInicial(b.latitud, b.longitud, a.latitud, a.longitud),
    origen: a,
    destino: b
  }
}
