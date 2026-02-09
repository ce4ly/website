/** Clases y utilidades de las tablas de referencia (sin componentes, para el fast refresh). */

export const thClass =
  'border-b border-stone-300 bg-stone-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100'

export const tdClass =
  'border-b border-stone-200 px-3 py-3 text-stone-800 dark:border-indigo-900/60 dark:text-indigo-100'

/** Celda secundaria (notas), en gris. */
export const tdNotaClass = `${tdClass} text-stone-500 dark:text-indigo-300/80`

export const filaClass = (destacar = false) =>
  [
    'transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30',
    destacar ? 'bg-amber-50/90 dark:bg-amber-950/25' : '',
  ].join(' ')

export const fmtFreq = (valor: number, decimales = 3, unidad = 'MHz') =>
  `${valor.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })} ${unidad}`

/** Para buscar sin distinguir mayúsculas ni tildes («Japon» encuentra «Japón»). */
export const normalizarBusqueda = (texto: string) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
