export const REPETIDORAS = [
  {
    id: 'vhf',
    nombre: 'VHF CE4LY',
    frecuenciaMhz: 146.38,
    tonoHz: 67.0,
    offsetMhz: 0.6
  },
  {
    id: 'uhf',
    nombre: 'UHF CE4LY',
    frecuenciaMhz: 433.1,
    tonoHz: 67.0,
    offsetMhz: 5.0
  }
]

export const formatearFrecuenciaMhz = (mhz, decimales = 3) =>
  mhz.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  })
