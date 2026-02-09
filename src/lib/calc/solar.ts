/** Fuente de los índices; Netlify la reexpone en el mismo origen (`PROXIES.solar`). */
export const FUENTE_SOLAR = 'https://www.hamqsl.com/solarxml.php'

const num = (xml: string, tag: string): number | string | null => {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i'))
  if (!m) return null
  const n = Number(String(m[1]).replace(',', '.'))
  return Number.isFinite(n) ? n : String(m[1]).trim()
}

export type IndicesSolares = {
  sfi: number | null
  sunspots: number | null
  aIndex: number | null
  kIndex: number | null
  kIndexNt: number | null
  xray: number | string | null
  geomagField: number | string | null
  signalnoise: number | string | null
  updated: number | string | null
  source: string
  /** Condiciones de HF calculadas por hamqsl.com, por grupo de bandas. */
  bandas: CondicionBanda[]
}

export type Condicion = 'buena' | 'regular' | 'mala'

export type CondicionBanda = { banda: string; dia: Condicion | null; noche: Condicion | null }

const CONDICIONES: Record<string, Condicion> = { good: 'buena', fair: 'regular', poor: 'mala' }

/** `<band name="80m-40m" time="day">Fair</band>` → una fila por banda, con día y noche. */
const parseBandas = (xml: string): CondicionBanda[] => {
  const filas = new Map<string, CondicionBanda>()
  for (const [, banda, momento, valor] of xml.matchAll(
    /<band\s+name="([^"]+)"\s+time="(day|night)"\s*>([^<]*)<\/band>/gi,
  )) {
    const fila = filas.get(banda) ?? { banda, dia: null, noche: null }
    fila[momento.toLowerCase() === 'day' ? 'dia' : 'noche'] =
      CONDICIONES[valor.trim().toLowerCase()] ?? null
    filas.set(banda, fila)
  }
  return [...filas.values()]
}

/** Extrae los índices del XML de hamqsl.com; `null` si la respuesta no es ese XML. */
export const parseSolarXml = (xml: string | null | undefined): IndicesSolares | null => {
  if (!xml || !xml.includes('<solar')) return null
  return {
    sfi: Number(num(xml, 'solarflux')) || null,
    sunspots: Number(num(xml, 'sunspots')) || null,
    aIndex: Number(num(xml, 'aindex')) || null,
    kIndex: Number(num(xml, 'kindex')) || null,
    kIndexNt: Number(num(xml, 'kindexnt')) || null,
    xray: num(xml, 'xray'),
    geomagField: num(xml, 'geomagfield'),
    signalnoise: num(xml, 'signalnoise'),
    updated: num(xml, 'updated'),
    source: FUENTE_SOLAR,
    bandas: parseBandas(xml),
  }
}

/** Estado de un índice para la propagación en HF, de mejor a peor. */
export type Nivel = 'bueno' | 'regular' | 'malo' | 'critico'

export type Lectura = { nivel: Nivel; etiqueta: string }

/**
 * Umbrales habituales (NOAA y hamqsl.com). Flujo solar y manchas: cuanto más, mejor para HF.
 * Índices A y K: cuanto menos, más tranquilo el campo geomagnético.
 */
export const ESCALAS = {
  sfi: { min: 50, max: 250 },
  sunspots: { min: 0, max: 250 },
  aIndex: { min: 0, max: 50 },
  kIndex: { min: 0, max: 9 },
} as const

export type ClaveIndice = keyof typeof ESCALAS

export function leerIndice(clave: ClaveIndice, valor: number): Lectura {
  switch (clave) {
    case 'sfi':
      if (valor >= 150) return { nivel: 'bueno', etiqueta: 'Excelente' }
      if (valor >= 100) return { nivel: 'bueno', etiqueta: 'Buena' }
      if (valor >= 70) return { nivel: 'regular', etiqueta: 'Regular' }
      return { nivel: 'malo', etiqueta: 'Baja' }
    case 'sunspots':
      if (valor >= 100) return { nivel: 'bueno', etiqueta: 'Alta actividad' }
      if (valor >= 25) return { nivel: 'regular', etiqueta: 'Moderada' }
      return { nivel: 'malo', etiqueta: 'Baja actividad' }
    case 'aIndex':
      if (valor < 8) return { nivel: 'bueno', etiqueta: 'Tranquilo' }
      if (valor < 16) return { nivel: 'regular', etiqueta: 'Inestable' }
      if (valor < 30) return { nivel: 'malo', etiqueta: 'Activo' }
      return { nivel: 'critico', etiqueta: 'Tormenta' }
    case 'kIndex':
      if (valor <= 2) return { nivel: 'bueno', etiqueta: 'Tranquilo' }
      if (valor < 4) return { nivel: 'regular', etiqueta: 'Inestable' }
      if (valor < 5) return { nivel: 'malo', etiqueta: 'Activo' }
      return { nivel: 'critico', etiqueta: 'Tormenta' }
  }
}

/** Fracción (0–1) de la escala que ocupa `valor`, para el medidor. */
export const fraccionEscala = (clave: ClaveIndice, valor: number) => {
  const { min, max } = ESCALAS[clave]
  return Math.min(1, Math.max(0, (valor - min) / (max - min)))
}
