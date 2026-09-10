const K_ESTANDAR = 4 / 3
/** km por √metro, con refracción k = 4/3: 3,57 × √k ≈ 4,12 */
export const FACTOR_HORIZONTE = 3.57 * Math.sqrt(K_ESTANDAR)

export const horizonteRadioKm = (h1m, h2m = 0) => {
  if (!(h1m >= 0) || !(h2m >= 0)) return null
  return FACTOR_HORIZONTE * (Math.sqrt(h1m) + Math.sqrt(h2m))
}

export const fsplDb = (fMhz, dKm) => {
  if (!(fMhz > 0) || !(dKm > 0)) return null
  return 32.44 + 20 * Math.log10(fMhz) + 20 * Math.log10(dKm)
}

export const presupuestoEnlace = ({
  ptxDbm,
  gtxDbi,
  lcableTxDb,
  fMhz,
  dKm,
  grxDbi,
  lcableRxDb,
  sensibilidadDbm
}) => {
  const fspl = fsplDb(fMhz, dKm)
  if (fspl === null || !Number.isFinite(ptxDbm)) return null
  const gtx = gtxDbi || 0
  const grx = grxDbi || 0
  const ltx = lcableTxDb || 0
  const lrx = lcableRxDb || 0
  const prx = ptxDbm + gtx - ltx - fspl + grx - lrx
  const margen = Number.isFinite(sensibilidadDbm) ? prx - sensibilidadDbm : null
  return { fspl, prx, margen }
}

export const wattsADbm = watts => {
  if (!(watts > 0)) return null
  return 10 * Math.log10(watts * 1000)
}
