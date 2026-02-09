/** Velocidad de la luz en millones de m/s: λ (m) = 300 / f (MHz). */
export const VELOCIDAD_LUZ = 300
export const VF_ALAMBRE = 0.95
/** λ/2 práctica: 0,95 × 150 = 142,5 */
export const LARGO_MEDIA_ONDA = VF_ALAMBRE * 150

const LOCALE = 'es-CL'

const sinValor = (valor: number | null | undefined): valor is null | undefined =>
  valor === null || valor === undefined || Number.isNaN(valor)

/** Número con coma decimal chilena; `—` si no hay valor. */
export const formatearNumero = (valor: number | null | undefined, decimales = 2): string => {
  if (sinValor(valor)) return '—'
  return valor.toLocaleString(LOCALE, { maximumFractionDigits: decimales })
}

/** Como `formatearNumero`, pero siempre con `decimales` cifras (146,380). */
export const formatearFijo = (valor: number | null | undefined, decimales: number): string => {
  if (sinValor(valor)) return '—'
  return valor.toLocaleString(LOCALE, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}

export const redondear = (valor: number, decimales: number): number => {
  const factor = 10 ** decimales
  return Math.round(valor * factor) / factor
}

/** Menos de 3 m → cm; 3 m o más → m. */
export const formatearLongitud = (metros: number | null | undefined): string => {
  if (sinValor(metros)) return '—'
  if (metros < 3) {
    return `${formatearNumero(metros * 100, 1)} cm`
  }
  return `${formatearNumero(metros, 2)} m`
}

/** Medida en centímetros: hasta 3 m en cm (1 decimal); desde ahí, en metros (2 decimales). */
export const formatearLongitudCm = (cm: number): string =>
  cm >= 300 ? `${formatearFijo(cm / 100, 2)} m` : `${formatearFijo(cm, 1)} cm`

/** Lee lo que escribe el usuario, con coma o punto decimal. Vacío o inválido → `null`. */
export const parseNumero = (texto: string | null | undefined): number | null => {
  if (texto === null || texto === undefined || texto === '') return null
  const num = parseFloat(texto.replace(',', '.'))
  if (Number.isNaN(num)) return null
  return num
}

/** `true` si hay valor y es mayor que cero (y lo estrecha a `number`). */
export const esPositivo = (valor: number | null | undefined): valor is number =>
  valor !== null && valor !== undefined && valor > 0

export const frecuenciaValida = esPositivo

export const longitudOnda = (mhz: number): number => VELOCIDAD_LUZ / mhz

export type Cable = {
  id: string
  nombre: string
  /** Factor de velocidad. */
  vf: number
  /** Coeficientes de atenuación: α (dB/100 m) ≈ k1·√f + k2·f, f en MHz. */
  k1: number
  k2: number
}

export const CABLES: readonly Cable[] = [
  { id: 'rg58', nombre: 'RG-58 (PE sólido)', vf: 0.66, k1: 1.48, k2: 0.003 },
  { id: 'rg8x', nombre: 'RG-8X (foam)', vf: 0.8, k1: 1.05, k2: 0.002 },
  { id: 'rg213', nombre: 'RG-213 / RG-8 (PE)', vf: 0.66, k1: 0.7, k2: 0.0015 },
  { id: 'lmr400', nombre: 'LMR-400', vf: 0.85, k1: 0.39, k2: 0.0004 },
  { id: 'rg59', nombre: 'RG-59 (75 Ω)', vf: 0.66, k1: 1.2, k2: 0.0025 },
  { id: 'rg11', nombre: 'RG-11 (75 Ω)', vf: 0.75, k1: 0.55, k2: 0.001 },
  { id: 'ladder450', nombre: 'Línea de escalera 450 Ω', vf: 0.91, k1: 0.12, k2: 0.0002 },
  { id: 'twin300', nombre: 'Bifilar 300 Ω', vf: 0.8, k1: 0.25, k2: 0.0004 },
  { id: 'open600', nombre: 'Línea abierta 600 Ω', vf: 0.97, k1: 0.08, k2: 0.0001 },
]

export const perdidaCableDbPor100m = (cable: Cable, mhz: number): number =>
  cable.k1 * Math.sqrt(mhz) + cable.k2 * mhz

export const inductanciaWheelerUh = (
  diametroMm: number,
  largoMm: number,
  vueltas: number,
): number | null => {
  const dIn = diametroMm / 25.4
  const lIn = largoMm / 25.4
  if (dIn <= 0 || vueltas <= 0) return null
  return (dIn * dIn * vueltas * vueltas) / (18 * dIn + 40 * Math.max(lIn, 0.01))
}

export const vueltasParaInductancia = (
  lUh: number,
  diametroMm: number,
  pasoMm: number,
): number | null => {
  const dIn = diametroMm / 25.4
  const pasoIn = pasoMm / 25.4
  if (dIn <= 0 || lUh <= 0 || pasoIn <= 0) return null
  const a = dIn * dIn
  const b = -(40 * lUh * pasoIn)
  const c = -(18 * lUh * dIn)
  const disc = b * b - 4 * a * c
  if (disc < 0) return null
  return (-b + Math.sqrt(disc)) / (2 * a)
}

export const dl6wuSpacings = [
  0.075, 0.18, 0.215, 0.25, 0.28, 0.3, 0.315, 0.33, 0.345, 0.36, 0.375, 0.39, 0.4, 0.4,
]

type CoeficientesDl6wu = { k: number; k1: number; k2: number; k3: number; k4: number }

const DL6WU_K: readonly CoeficientesDl6wu[] = [
  { k: 0.001, k1: 0.4711, k2: 0.018, k3: 0.08398, k4: 0.965 },
  { k: 0.003, k1: 0.462, k2: 0.01941, k3: 0.08543, k4: 0.9697 },
  { k: 0.005, k1: 0.4538, k2: 0.02117, k3: 0.0951, k4: 1.007 },
  { k: 0.007, k1: 0.4491, k2: 0.02274, k3: 0.08801, k4: 0.9004 },
  { k: 0.01, k1: 0.4421, k2: 0.02396, k3: 0.1027, k4: 1.038 },
  { k: 0.015, k1: 0.4358, k2: 0.02558, k3: 0.1149, k4: 1.034 },
  { k: 0.02, k1: 0.4268, k2: 0.02614, k3: 0.1112, k4: 1.036 },
]

/** Interpola linealmente el coeficiente `campo` según el diámetro relativo `ed` (d/λ). */
const interpK = (ed: number, campo: Exclude<keyof CoeficientesDl6wu, 'k'>): number => {
  const primero = DL6WU_K[0]
  const ultimo = DL6WU_K[DL6WU_K.length - 1]
  if (ed <= primero.k) return primero[campo]
  if (ed >= ultimo.k) return ultimo[campo]
  for (let i = 0; i < DL6WU_K.length - 1; i += 1) {
    const lo = DL6WU_K[i]
    const hi = DL6WU_K[i + 1]
    if (ed >= lo.k && ed <= hi.k) {
      const j = (ed - lo.k) / (hi.k - lo.k)
      return lo[campo] + j * (hi[campo] - lo[campo])
    }
  }
  return primero[campo]
}

export type ElementoYagi = { nombre: string; posicion: number; largo: number }

export type DisenoYagi = {
  lambda: number
  reflector: number
  driven: number
  reflectorEspacio: number
  dirs: ElementoYagi[]
  boom: number
  ganancia: number
}

export const disenarYagiDl6wu = ({
  mhz,
  elementos,
  diametroMm,
}: {
  mhz: number
  elementos: number
  diametroMm: number
}): DisenoYagi => {
  const lambda = longitudOnda(mhz)
  const ed = Math.min(0.02, Math.max(0.001, diametroMm / 1000 / lambda))
  const dd = ed
  const directores = Math.max(1, elementos - 2)
  const k1 = interpK(ed, 'k1')
  const k2 = interpK(ed, 'k2')
  const k3 = interpK(ed, 'k3')
  const k4 = interpK(ed, 'k4')

  const spacings: number[] = []
  for (let n = 1; n <= directores; n += 1) {
    spacings.push(n <= 14 ? dl6wuSpacings[n - 1] : 0.4)
  }

  let acc = 0.2
  const dirs = spacings.map((s, i) => {
    acc += s
    const n = i + 1
    const largo = (k1 - k2 * Math.log(n)) * (1 - k3 * Math.exp(-k4 * n)) * lambda
    return {
      nombre: `Director ${n}`,
      posicion: acc * lambda,
      largo,
    }
  })

  const xr = 20
  const reflector = (((xr - 40) / (186.8769 * Math.log(2 / ed) - 320) + 1) / 2) * lambda
  const driven = 1.02 * ((0.4777 - 1.0522 * dd + 0.43363 * dd ** -0.014891) / 2) * lambda

  const boom = acc * lambda
  const ganancia = 9.2 + 3.39 * Math.log(acc)

  return {
    lambda,
    reflector,
    driven,
    reflectorEspacio: 0.2 * lambda,
    dirs,
    boom,
    ganancia,
  }
}

export const moxonCebik = (mhz: number, diametroMm: number) => {
  const lambda = longitudOnda(mhz)
  const dw = diametroMm / 1000 / lambda
  const d1 = Math.log10(dw)
  const a = -0.0008571428571 * d1 * d1 - 0.009571428571 * d1 + 0.3398571429
  const b = -0.002142857143 * d1 * d1 - 0.02035714286 * d1 + 0.008285714286
  const c = 0.001809523381 * d1 * d1 + 0.01780952381 * d1 + 0.05164285714
  const d = 0.001 * d1 + 0.07178571429
  const e = b + c + d
  return {
    lambda,
    A: a * lambda,
    B: b * lambda,
    C: c * lambda,
    D: d * lambda,
    E: e * lambda,
  }
}

export const loopMagneticoAa5tb = ({
  mhz,
  diametroLoopM,
  diametroConductorMm,
  potenciaW,
}: {
  mhz: number
  diametroLoopM: number
  diametroConductorMm: number
  potenciaW: number
}) => {
  const radio = diametroLoopM / 2
  const sFt = 2 * Math.PI * radio * 3.28084
  const dIn = diametroConductorMm / 25.4
  const aSqFt = Math.PI * radio * radio * 10.7639
  const rr = 3.38e-8 * (mhz * mhz * aSqFt) ** 2
  const rl = 9.96e-4 * Math.sqrt(mhz) * (sFt / dIn)
  const L = 1.9e-8 * sFt * (7.353 * Math.log10((96 * sFt) / (Math.PI * dIn)) - 6.386)
  const xl = 2 * Math.PI * mhz * (L * 1e6)
  const ctF = 1 / (2 * Math.PI * mhz * (xl * 1e6))
  const q = xl / (2 * (rr + rl))
  const bw = (mhz * 1e6) / q
  const eta = rr / (rr + rl)
  // En resonancia toda la potencia aceptada se disipa en (rr + rl); la tensión
  // del capacitor es esa corriente circulante por su reactancia: Vc = Irms · XL.
  const iRms = Math.sqrt(potenciaW / (rr + rl))
  const vc = iRms * xl
  return {
    rr,
    rl,
    Luh: L * 1e6,
    xl,
    ctPf: ctF * 1e12,
    q,
    bwKhz: bw / 1000,
    eta,
    etaDb: 10 * Math.log10(eta),
    vc,
    iRms,
    perimetro: 2 * Math.PI * radio,
    area: Math.PI * radio * radio,
  }
}

export const perdidaLinea = ({ matchedDb, swrCarga }: { matchedDb: number; swrCarga: number }) => {
  const a = 10 ** (matchedDb / 10)
  const rho = (swrCarga - 1) / (swrCarga + 1)
  const rho2 = rho * rho
  const totalDb = 10 * Math.log10((a * a - rho2) / (a * (1 - rho2)))
  const extraDb = totalDb - matchedDb
  // La onda reflejada recorre la línea de ida y vuelta, así que se atenúa con
  // el doble de la pérdida adaptada: |Γin| = |Γcarga| · 10^(−2·ML/20) = ρ / a.
  const gammaIn = rho / a
  const swrEquipo = (1 + gammaIn) / (1 - gammaIn)
  return { totalDb, extraDb, swrEquipo, matchedDb }
}
