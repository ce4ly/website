export const VELOCIDAD_LUZ = 300
export const VF_ALAMBRE = 0.95
/** λ/2 práctica: 0,95 × 150 = 142,5 */
export const LARGO_MEDIA_ONDA = VF_ALAMBRE * 150

export const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

export const labelClass =
  'block text-sm font-medium text-stone-800 dark:text-indigo-100'

export const formatearNumero = (valor, decimales = 2) => {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return '—'
  return valor.toLocaleString('es-CL', { maximumFractionDigits: decimales })
}

export const redondear = (valor, decimales) => {
  const factor = 10 ** decimales
  return Math.round(valor * factor) / factor
}

/** Menos de 3 m → cm; 3 m o más → m. */
export const formatearLongitud = metros => {
  if (metros === null || metros === undefined || Number.isNaN(metros)) {
    return '—'
  }
  if (metros < 3) {
    return `${formatearNumero(metros * 100, 1)} cm`
  }
  return `${formatearNumero(metros, 2)} m`
}

export const parseNumero = texto => {
  if (texto === undefined || texto === '') return null
  const num = parseFloat(String(texto).replace(',', '.'))
  if (Number.isNaN(num)) return null
  return num
}

export const frecuenciaValida = mhz => mhz !== null && mhz > 0

export const longitudOnda = mhz => VELOCIDAD_LUZ / mhz

export const CABLES = [
  { id: 'rg58', nombre: 'RG-58 (PE sólido)', vf: 0.66, k1: 1.48, k2: 0.003 },
  { id: 'rg8x', nombre: 'RG-8X (foam)', vf: 0.8, k1: 1.05, k2: 0.002 },
  { id: 'rg213', nombre: 'RG-213 / RG-8 (PE)', vf: 0.66, k1: 0.7, k2: 0.0015 },
  { id: 'lmr400', nombre: 'LMR-400', vf: 0.85, k1: 0.39, k2: 0.0004 },
  { id: 'rg59', nombre: 'RG-59 (75 Ω)', vf: 0.66, k1: 1.2, k2: 0.0025 },
  { id: 'rg11', nombre: 'RG-11 (75 Ω)', vf: 0.75, k1: 0.55, k2: 0.001 },
  {
    id: 'ladder450',
    nombre: 'Línea de escalera 450 Ω',
    vf: 0.91,
    k1: 0.12,
    k2: 0.0002
  },
  { id: 'twin300', nombre: 'Bifilar 300 Ω', vf: 0.8, k1: 0.25, k2: 0.0004 },
  {
    id: 'open600',
    nombre: 'Línea abierta 600 Ω',
    vf: 0.97,
    k1: 0.08,
    k2: 0.0001
  }
]

export const perdidaCableDbPor100m = (cable, mhz) => {
  return cable.k1 * Math.sqrt(mhz) + cable.k2 * mhz
}

export const inductanciaWheelerUh = (diametroMm, largoMm, vueltas) => {
  const dIn = diametroMm / 25.4
  const lIn = largoMm / 25.4
  if (dIn <= 0 || vueltas <= 0) return null
  return (dIn * dIn * vueltas * vueltas) / (18 * dIn + 40 * Math.max(lIn, 0.01))
}

export const vueltasParaInductancia = (lUh, diametroMm, pasoMm) => {
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
  0.075, 0.18, 0.215, 0.25, 0.28, 0.3, 0.315, 0.33, 0.345, 0.36, 0.375, 0.39,
  0.4, 0.4
]

const DL6WU_K = [
  { k: 0.001, k1: 0.4711, k2: 0.018, k3: 0.08398, k4: 0.965 },
  { k: 0.003, k1: 0.462, k2: 0.01941, k3: 0.08543, k4: 0.9697 },
  { k: 0.005, k1: 0.4538, k2: 0.02117, k3: 0.0951, k4: 1.007 },
  { k: 0.007, k1: 0.4491, k2: 0.02274, k3: 0.08801, k4: 0.9004 },
  { k: 0.01, k1: 0.4421, k2: 0.02396, k3: 0.1027, k4: 1.038 },
  { k: 0.015, k1: 0.4358, k2: 0.02558, k3: 0.1149, k4: 1.034 },
  { k: 0.02, k1: 0.4268, k2: 0.02614, k3: 0.1112, k4: 1.036 }
]

const interpK = (ed, field) => {
  if (ed <= DL6WU_K[0].k) return DL6WU_K[0][field]
  if (ed >= DL6WU_K[DL6WU_K.length - 1].k)
    return DL6WU_K[DL6WU_K.length - 1][field]
  for (let i = 0; i < DL6WU_K.length - 1; i += 1) {
    const lo = DL6WU_K[i]
    const hi = DL6WU_K[i + 1]
    if (ed >= lo.k && ed <= hi.k) {
      const j = (ed - lo.k) / (hi.k - lo.k)
      return lo[field] + j * (hi[field] - lo[field])
    }
  }
  return DL6WU_K[0][field]
}

export const disenarYagiDl6wu = ({ mhz, elementos, diametroMm }) => {
  const lambda = longitudOnda(mhz)
  const ed = Math.min(0.02, Math.max(0.001, diametroMm / 1000 / lambda))
  const dd = ed
  const directores = Math.max(1, elementos - 2)
  const k1 = interpK(ed, 'k1')
  const k2 = interpK(ed, 'k2')
  const k3 = interpK(ed, 'k3')
  const k4 = interpK(ed, 'k4')

  const spacings = []
  for (let n = 1; n <= directores; n += 1) {
    spacings.push(n <= 14 ? dl6wuSpacings[n - 1] : 0.4)
  }

  let acc = 0.2
  const dirs = spacings.map((s, i) => {
    acc += s
    const n = i + 1
    const largo =
      (k1 - k2 * Math.log(n)) * (1 - k3 * Math.exp(-k4 * n)) * lambda
    return {
      nombre: `Director ${n}`,
      posicion: acc * lambda,
      largo
    }
  })

  const xr = 20
  const reflector =
    (((xr - 40) / (186.8769 * Math.log(2 / ed) - 320) + 1) / 2) * lambda
  const driven =
    1.02 * ((0.4777 - 1.0522 * dd + 0.43363 * dd ** -0.014891) / 2) * lambda

  const boom = acc * lambda
  const ganancia = 9.2 + 3.39 * Math.log(acc)

  return {
    lambda,
    reflector,
    driven,
    reflectorEspacio: 0.2 * lambda,
    dirs,
    boom,
    ganancia
  }
}

export const moxonCebik = (mhz, diametroMm) => {
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
    E: e * lambda
  }
}

export const loopMagneticoAa5tb = ({
  mhz,
  diametroLoopM,
  diametroConductorMm,
  potenciaW
}) => {
  const radio = diametroLoopM / 2
  const sFt = 2 * Math.PI * radio * 3.28084
  const dIn = diametroConductorMm / 25.4
  const aSqFt = Math.PI * radio * radio * 10.7639
  const rr = 3.38e-8 * (mhz * mhz * aSqFt) ** 2
  const rl = 9.96e-4 * Math.sqrt(mhz) * (sFt / dIn)
  const L =
    1.9e-8 * sFt * (7.353 * Math.log10((96 * sFt) / (Math.PI * dIn)) - 6.386)
  const xl = 2 * Math.PI * mhz * (L * 1e6)
  const ctF = 1 / (2 * Math.PI * mhz * (xl * 1e6))
  const q = xl / (2 * (rr + rl))
  const bw = (mhz * 1e6) / q
  const eta = rr / (rr + rl)
  const vc = Math.sqrt(potenciaW * xl * q)
  const iRms = Math.sqrt(potenciaW / (rr + rl))
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
    area: Math.PI * radio * radio
  }
}

export const perdidaLinea = ({ matchedDb, swrCarga }) => {
  const a = 10 ** (matchedDb / 10)
  const rho = (swrCarga - 1) / (swrCarga + 1)
  const rho2 = rho * rho
  const totalDb = 10 * Math.log10((a * a - rho2) / (a * (1 - rho2)))
  const extraDb = totalDb - matchedDb
  const gammaIn = rho * 10 ** (-matchedDb / 20)
  const swrEquipo = (1 + gammaIn) / (1 - gammaIn)
  return { totalDb, extraDb, swrEquipo, matchedDb }
}
