import { useSyncExternalStore } from 'react'

import { esOperativo, type Operativo } from '../lib/operativo'

/** Clave en localStorage del operativo en curso (o del último terminado). */
const CLAVE = 'ce4ly-operativo'

/** Última lectura: misma referencia mientras no cambie el texto guardado. */
let cache: { texto: string | null; valor: Operativo | null } = { texto: null, valor: null }
const oyentes = new Set<() => void>()

const interpretar = (texto: string | null): Operativo | null => {
  if (!texto) return null
  try {
    const valor: unknown = JSON.parse(texto)
    return esOperativo(valor) ? valor : null
  } catch {
    return null
  }
}

const leer = (): Operativo | null => {
  let texto: string | null
  try {
    texto = localStorage.getItem(CLAVE)
  } catch {
    // Sin localStorage (modo privado estricto): el operativo vive solo en memoria.
    return cache.valor
  }
  if (texto !== cache.texto) cache = { texto, valor: interpretar(texto) }
  return cache.valor
}

const guardar = (operativo: Operativo | null) => {
  const texto = operativo ? JSON.stringify(operativo) : null
  cache = { texto, valor: operativo }
  try {
    if (texto) localStorage.setItem(CLAVE, texto)
    else localStorage.removeItem(CLAVE)
  } catch {
    // Se mantiene en memoria; se perderá al cerrar la página.
  }
  for (const aviso of oyentes) aviso()
}

const suscribir = (aviso: () => void) => {
  oyentes.add(aviso)
  // Otra pestaña con la misma página también registra estaciones.
  window.addEventListener('storage', aviso)
  return () => {
    oyentes.delete(aviso)
    window.removeEventListener('storage', aviso)
  }
}

/**
 * Operativo guardado en el navegador. `undefined` en el prerender y al hidratar (el servidor no
 * conoce localStorage); después, el operativo o `null` si no hay ninguno.
 */
export const useOperativo = () => {
  const operativo = useSyncExternalStore<Operativo | null | undefined>(
    suscribir,
    leer,
    () => undefined,
  )
  /** Aplica un cambio sobre el operativo actual y lo guarda. */
  const actualizar = (cambio: (actual: Operativo) => Operativo) => {
    const actual = leer()
    if (actual) guardar(cambio(actual))
  }
  return { operativo, guardar, actualizar }
}
