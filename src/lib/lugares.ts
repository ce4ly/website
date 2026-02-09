/**
 * Buscador de ciudades del Grid Maidenhead: Nominatim, el geocodificador de OpenStreetMap. El
 * navegador lo consulta directo (su origen va en `connect-src` de la CSP; tests/netlify.test.ts lo
 * comprueba). Su política de uso no admite búsquedas mientras se escribe: solo al enviar.
 */
export const BUSCADOR_LUGARES = 'https://nominatim.openstreetmap.org/search'

export const ORIGEN_BUSCADOR_LUGARES = new URL(BUSCADOR_LUGARES).origin

export const MAX_LUGARES = 5

export type Lugar = { nombre: string; latitud: number; longitud: number }

export const urlBusquedaLugar = (texto: string) =>
  `${BUSCADOR_LUGARES}?${new URLSearchParams({
    q: texto.trim(),
    format: 'jsonv2',
    limit: String(MAX_LUGARES),
    'accept-language': 'es',
  })}`

/** Resultados de Nominatim con nombre y coordenadas válidas (lat/lon llegan como texto). */
export function parsearLugares(json: unknown): Lugar[] {
  if (!Array.isArray(json)) return []
  return json.flatMap((item: { display_name?: unknown; lat?: unknown; lon?: unknown }) => {
    const latitud = Number(item?.lat)
    const longitud = Number(item?.lon)
    if (typeof item?.display_name !== 'string') return []
    if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) return []
    if (Math.abs(latitud) > 90 || Math.abs(longitud) > 180) return []
    return [{ nombre: item.display_name, latitud, longitud }]
  })
}
