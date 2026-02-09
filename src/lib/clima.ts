/**
 * Ciudades del Maule que muestra la portada: las cuatro capitales provinciales, de norte a sur, y
 * Constitución, en la costa.
 */
export const CIUDADES = [
  { nombre: 'Curicó', latitud: -34.9828, longitud: -71.2394 },
  { nombre: 'Talca', latitud: -35.4264, longitud: -71.6554 },
  { nombre: 'Linares', latitud: -35.8467, longitud: -71.5931 },
  { nombre: 'Cauquenes', latitud: -35.9671, longitud: -72.3225 },
  { nombre: 'Constitución', latitud: -35.3333, longitud: -72.4167 },
] as const

/**
 * Open-Meteo: gratis, sin clave y con todas las ciudades en una sola respuesta (un arreglo, en el
 * orden de `CIUDADES`). Netlify la reexpone en el mismo origen (`PROXIES.clima`).
 */
export const FUENTE_CLIMA =
  'https://api.open-meteo.com/v1/forecast' +
  `?latitude=${CIUDADES.map((c) => c.latitud).join(',')}` +
  `&longitude=${CIUDADES.map((c) => c.longitud).join(',')}` +
  '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day' +
  '&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=America/Santiago'

export type ClimaCiudad = {
  nombre: string
  temperatura: number
  /** Código WMO del estado del tiempo. */
  codigo: number
  dia: boolean
  humedad: number | null
  /** km/h */
  viento: number | null
  maxima: number | null
  minima: number | null
}

const numero = (valor: unknown): number | null =>
  typeof valor === 'number' && Number.isFinite(valor) ? valor : null

type RespuestaOpenMeteo = {
  current?: Record<string, unknown>
  daily?: Record<string, unknown[] | undefined>
}

/** Una fila por ciudad; `null` si la respuesta no trae todas las ciudades con su temperatura. */
export function parsearClima(json: unknown): ClimaCiudad[] | null {
  if (!Array.isArray(json) || json.length !== CIUDADES.length) return null
  const filas = (json as RespuestaOpenMeteo[]).map((r, i) => {
    const actual = r?.current ?? {}
    const temperatura = numero(actual.temperature_2m)
    const codigo = numero(actual.weather_code)
    if (temperatura === null || codigo === null) return null
    return {
      nombre: CIUDADES[i].nombre,
      temperatura,
      codigo,
      dia: actual.is_day !== 0,
      humedad: numero(actual.relative_humidity_2m),
      viento: numero(actual.wind_speed_10m),
      maxima: numero(r.daily?.temperature_2m_max?.[0]),
      minima: numero(r.daily?.temperature_2m_min?.[0]),
    }
  })
  return filas.every((f) => f !== null) ? filas : null
}

export type TipoTiempo =
  | 'despejado'
  | 'parcial'
  | 'nublado'
  | 'niebla'
  | 'llovizna'
  | 'lluvia'
  | 'chubascos'
  | 'nieve'
  | 'tormenta'

/** Descripción e icono de un código WMO (tabla de Open-Meteo). */
export function describirTiempo(codigo: number): { texto: string; tipo: TipoTiempo } {
  if (codigo === 0) return { texto: 'Despejado', tipo: 'despejado' }
  if (codigo === 1) return { texto: 'Mayormente despejado', tipo: 'parcial' }
  if (codigo === 2) return { texto: 'Parcialmente nublado', tipo: 'parcial' }
  if (codigo === 3) return { texto: 'Nublado', tipo: 'nublado' }
  if (codigo === 45 || codigo === 48) return { texto: 'Niebla', tipo: 'niebla' }
  if (codigo >= 51 && codigo <= 57) return { texto: 'Llovizna', tipo: 'llovizna' }
  if (codigo === 61) return { texto: 'Lluvia débil', tipo: 'lluvia' }
  if (codigo >= 62 && codigo <= 67) return { texto: 'Lluvia', tipo: 'lluvia' }
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86)
    return { texto: 'Nieve', tipo: 'nieve' }
  if (codigo >= 80 && codigo <= 82) return { texto: 'Chubascos', tipo: 'chubascos' }
  if (codigo >= 95) return { texto: 'Tormenta eléctrica', tipo: 'tormenta' }
  return { texto: 'Sin datos', tipo: 'nublado' }
}
