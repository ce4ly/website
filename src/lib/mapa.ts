/**
 * Teselas de OpenStreetMap para el mapa del Grid Maidenhead. Leaflet las carga como imágenes, así
 * que su origen va en `img-src` de la CSP; tests/netlify.test.ts lo comprueba. La política de uso
 * de OSM exige mostrar la atribución.
 */
export const TESELAS_OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

export const ORIGEN_TESELAS = new URL(TESELAS_OSM.replace(/\{[xyz]\}/g, '0')).origin

export const ATRIBUCION_OSM =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'

/** Zoom del mapa con un solo punto, según los caracteres del locator. */
export const ZOOM_POR_PRECISION: Readonly<Record<number, number>> = { 2: 3, 4: 7, 6: 12, 8: 15 }
