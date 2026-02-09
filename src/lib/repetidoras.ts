export type Repetidora = {
  id: string
  nombre: string
  frecuenciaMhz: number
  tonoHz: number
  offsetMhz: number
  /** En servicio: solo las que están en el aire se anuncian en la portada. */
  enAire: boolean
}

export const REPETIDORAS: readonly Repetidora[] = [
  {
    id: 'vhf',
    nombre: 'VHF CE4LY',
    frecuenciaMhz: 146.38,
    tonoHz: 67.0,
    offsetMhz: 0.6,
    enAire: true,
  },
  {
    id: 'uhf',
    nombre: 'UHF CE4LY',
    frecuenciaMhz: 433.1,
    tonoHz: 67.0,
    offsetMhz: 5.0,
    enAire: false,
  },
]

export const formatearFrecuenciaMhz = (mhz: number, decimales = 3): string =>
  mhz.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
