export type ColorResistencia = {
  id: string
  nombre: string
  /** Dígito significativo; `null` en oro y plata. */
  valor: number | null
  multi: number
  /** Tolerancia en %, si el color la tiene. */
  tol: number | null
  /** Coeficiente de temperatura (ppm/K) de la sexta banda. */
  temp: number | null
  hex: string
}

export const COLORES_RESISTENCIA: readonly ColorResistencia[] = [
  {
    id: 'negro',
    nombre: 'Negro',
    valor: 0,
    multi: 1,
    tol: null,
    temp: 250,
    hex: '#1c1917',
  },
  {
    id: 'marron',
    nombre: 'Marrón',
    valor: 1,
    multi: 10,
    tol: 1,
    temp: 100,
    hex: '#7c2d12',
  },
  {
    id: 'rojo',
    nombre: 'Rojo',
    valor: 2,
    multi: 100,
    tol: 2,
    temp: 50,
    hex: '#b91c1c',
  },
  {
    id: 'naranjo',
    nombre: 'Naranjo',
    valor: 3,
    multi: 1e3,
    tol: null,
    temp: 15,
    hex: '#ea580c',
  },
  {
    id: 'amarillo',
    nombre: 'Amarillo',
    valor: 4,
    multi: 1e4,
    tol: null,
    temp: 25,
    hex: '#eab308',
  },
  {
    id: 'verde',
    nombre: 'Verde',
    valor: 5,
    multi: 1e5,
    tol: 0.5,
    temp: 20,
    hex: '#16a34a',
  },
  {
    id: 'azul',
    nombre: 'Azul',
    valor: 6,
    multi: 1e6,
    tol: 0.25,
    temp: 10,
    hex: '#2563eb',
  },
  {
    id: 'violeta',
    nombre: 'Violeta',
    valor: 7,
    multi: 1e7,
    tol: 0.1,
    temp: 5,
    hex: '#7c3aed',
  },
  {
    id: 'gris',
    nombre: 'Gris',
    valor: 8,
    multi: 1e8,
    tol: 0.05,
    temp: 1,
    hex: '#6b7280',
  },
  {
    id: 'blanco',
    nombre: 'Blanco',
    valor: 9,
    multi: 1e9,
    tol: null,
    temp: null,
    hex: '#f5f5f4',
  },
  {
    id: 'oro',
    nombre: 'Oro',
    valor: null,
    multi: 0.1,
    tol: 5,
    temp: null,
    hex: '#b8860b',
  },
  {
    id: 'plata',
    nombre: 'Plata',
    valor: null,
    multi: 0.01,
    tol: 10,
    temp: null,
    hex: '#a8a29e',
  },
]

const colorPorId = (id: string) => COLORES_RESISTENCIA.find((c) => c.id === id)

export type ErrorCalculo = { error: string }

/** Lo que el usuario dejó vacío llega como `null` o `undefined`. */
type Dato = number | null | undefined

const hayDato = (x: Dato): x is number => typeof x === 'number' && Number.isFinite(x)

export type Ohm = { v: number; i: number; r: number; p: number }

/** Ley de Ohm y potencia: con dos de V, I, R y P calcula las otras dos. */
export const leyOhm = (dados: { v?: Dato; i?: Dato; r?: Dato; p?: Dato }): Ohm | ErrorCalculo => {
  const claves = (['v', 'i', 'r', 'p'] as const).filter((k) => hayDato(dados[k]))
  if (claves.length !== 2) return { error: 'Ingresa exactamente dos magnitudes.' }
  const v = dados.v ?? NaN
  const i = dados.i ?? NaN
  const r = dados.r ?? NaN
  const p = dados.p ?? NaN
  const casos: Record<string, () => Ohm> = {
    iv: () => ({ v, i, r: v / i, p: v * i }),
    rv: () => ({ v, i: v / r, r, p: (v * v) / r }),
    pv: () => ({ v, i: p / v, r: (v * v) / p, p }),
    ir: () => ({ v: i * r, i, r, p: i * i * r }),
    ip: () => ({ v: p / i, i, r: p / (i * i), p }),
    pr: () => ({ v: Math.sqrt(p * r), i: Math.sqrt(p / r), r, p }),
  }
  const calcular = casos[claves.sort().join('')]
  if (!calcular) return { error: 'Par de magnitudes no válido.' }
  const out = calcular()
  if (Object.values(out).some((x) => !Number.isFinite(x) || x < 0)) {
    return { error: 'Los valores no permiten un resultado físico.' }
  }
  return out
}

export const coloresAValor = (bandas: number, ids: readonly string[]) => {
  if (ids.length !== bandas) return null
  const cols = ids.map(colorPorId)
  if (cols.some((c) => !c)) return null
  const colores = cols as ColorResistencia[]
  const digitos = bandas === 4 ? 2 : 3
  let significativo = 0
  for (let i = 0; i < digitos; i += 1) {
    const valor = colores[i].valor
    if (valor === null) return null
    significativo = significativo * 10 + valor
  }
  const multi = colores[digitos].multi
  const ohm = significativo * multi
  const tol = colores[digitos + 1]?.tol ?? null
  const temp = bandas === 6 ? (colores[5].temp ?? null) : null
  return { ohm, tolerancia: tol, tempco: temp }
}

const MULTIPLOS = [1e9, 1e8, 1e7, 1e6, 1e5, 1e4, 1e3, 100, 10, 1, 0.1, 0.01]

export const valorAColores = (ohm: number, bandas = 5, tolerancia = 1): string[] | null => {
  if (!(ohm > 0)) return null
  const digitos = bandas === 4 ? 2 : 3
  const escala = 10 ** (digitos - 1)
  let multiElegido: number | null = null
  let sig: number | null = null
  for (const m of MULTIPLOS) {
    const s = Math.round(ohm / m)
    if (s >= escala && s < escala * 10) {
      multiElegido = m
      sig = s
      break
    }
  }
  if (multiElegido === null) return null
  const ids: string[] = []
  for (const ch of String(sig).padStart(digitos, '0')) {
    const col = COLORES_RESISTENCIA.find((c) => c.valor === Number(ch))
    if (!col) return null
    ids.push(col.id)
  }
  const multiCol = COLORES_RESISTENCIA.find((c) => c.multi === multiElegido)
  if (!multiCol) return null
  ids.push(multiCol.id)
  const tolCol = COLORES_RESISTENCIA.find((c) => c.tol === tolerancia) ?? colorPorId('oro')!
  ids.push(tolCol.id)
  if (bandas === 6) ids.push('marron')
  return ids
}

export const divisorTension = ({ vin, r1, r2 }: { vin: Dato; r1: Dato; r2: Dato }) => {
  if (!hayDato(vin) || !hayDato(r1) || !hayDato(r2)) return null
  if (!(vin >= 0) || !(r1 > 0) || !(r2 > 0)) return null
  const vout = vin * (r2 / (r1 + r2))
  const i = vin / (r1 + r2)
  return {
    vout,
    corriente: i,
    pR1: i * i * r1,
    pR2: i * i * r2,
  }
}

export type Lc = { f: number; l: number; c: number }

/** Resonancia LC en unidades SI (Hz, H, F): con dos de f, L y C calcula la tercera. */
export const resonanciaLc = ({ f, l, c }: { f?: Dato; l?: Dato; c?: Dato }): Lc | ErrorCalculo => {
  const positivo = (x: Dato): x is number => hayDato(x) && x > 0
  const dados = [f, l, c].filter(positivo)
  if (dados.length !== 2) return { error: 'Ingresa exactamente dos de f, L y C.' }
  const dosPi = 2 * Math.PI
  if (positivo(l) && positivo(c)) {
    return { f: 1 / (dosPi * Math.sqrt(l * c)), l, c }
  }
  if (positivo(f) && positivo(l)) {
    return { f, l, c: 1 / ((dosPi * f) ** 2 * l) }
  }
  const fHz = f as number
  const cF = c as number
  return { f: fHz, l: 1 / ((dosPi * fHz) ** 2 * cF), c: cF }
}
