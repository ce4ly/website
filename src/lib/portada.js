import { REPETIDORAS, formatearFrecuenciaMhz } from './repetidoras.js'

const lineaRepetidora = r => {
  const freq = formatearFrecuenciaMhz(r.frecuenciaMhz)
  const tono = r.tonoHz.toFixed(1)
  const offset = formatearFrecuenciaMhz(r.offsetMhz)
  return `${freq} MHz - t${tono} - +${offset}`
}

/**
 * Bloque destacado de la portada. El contenido vive aquí —no en el JSX—
 * para poder mostrarlo de nuevo sin tocar el componente. Poner `oculto` en
 * false cuando las repetidoras vuelvan al aire.
 */
export const BLOQUE_PORTADA = {
  id: 'repetidores',
  oculto: true,
  titulo: 'Nuestros Repetidores:',
  lineas: REPETIDORAS.map(lineaRepetidora)
}
