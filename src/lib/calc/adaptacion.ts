import { longitudOnda } from '../calculadoras'

/**
 * Gamma match y hairpin para llevar un excitado de resistencia `ra` (< 50 Ω) a 50 Ω.
 * `null` fuera de rango (`ra` debe estar entre 0 y 50 Ω).
 */
export const gammaHairpin = (mhz: number, ra: number) => {
  if (!(mhz > 0) || !(ra > 0 && ra < 50)) return null
  const lambda = longitudOnda(mhz)
  const qMatch = Math.sqrt(50 / ra - 1)
  // Reactancia serie que debe presentar el excitado (acortándolo) y que cancela el condensador
  // del gamma: Xs = Ra·√(50/Ra − 1) = √(Ra(50 − Ra)).
  const xSerie = ra * qMatch
  // Reactancia inductiva en paralelo que aporta el hairpin: Xp = 50 / √(50/Ra − 1).
  const xHairpin = 50 / qMatch
  return {
    gammaLargo: 0.05 * lambda,
    xSerie,
    capacitorPf: 1e6 / (2 * Math.PI * mhz * xSerie),
    xHairpin,
    hairpinUh: xHairpin / (2 * Math.PI * mhz),
    hairpinLargo: 0.03 * lambda,
  }
}
