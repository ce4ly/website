import { TASA_MAXIMA, TASA_VENTANA_MS } from '../src/lib/contacto-schema.js'

const golpes = new Map()

export function clientIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.trim() !== '') {
    return xf.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

export function permitirEnvio(
  ip,
  { limite = TASA_MAXIMA, ventanaMs = TASA_VENTANA_MS, ahora = Date.now() } = {}
) {
  const clave = ip || 'unknown'
  const previos = (golpes.get(clave) || []).filter(t => ahora - t < ventanaMs)
  if (previos.length >= limite) {
    golpes.set(clave, previos)
    return false
  }
  previos.push(ahora)
  golpes.set(clave, previos)
  return true
}

export function resetRateLimit() {
  golpes.clear()
}
