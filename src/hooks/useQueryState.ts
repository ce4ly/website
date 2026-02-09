import { useState, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'

type Valores<K extends string> = Record<K, string>

/** `Object.keys` con el tipo de las claves. */
const claves = <K extends string>(objeto: Readonly<Valores<K>>) => Object.keys(objeto) as K[]

/** Valores del query string; lo que no está en la URL toma su valor por defecto. */
const leer = <K extends string>(defaults: Readonly<Valores<K>>, params: URLSearchParams) => {
  const valores = { ...defaults } as Valores<K>
  for (const key of claves(defaults)) {
    valores[key] = params.get(key) ?? defaults[key]
  }
  return valores
}

const sinSuscripcion = () => () => {}

/**
 * `false` en el prerender y mientras React hidrata el HTML; `true` después (y en todo render que no
 * sea de hidratación). Sirve para que el primer render del cliente coincida con el HTML.
 */
const useHidratado = () =>
  useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  )

/** Cuántas escrituras propias recordar mientras la URL se pone al día. */
const MAX_PENDIENTES = 20

type Estado<K extends string> = {
  /** Query string que ya refleja `valores`. */
  query: string
  valores: Valores<K>
  /** Query strings escritos por este hook que React Router aún no ha aplicado. */
  pendientes: string[]
}

/**
 * Sincroniza los campos de un formulario con el query string: recargar o compartir la URL
 * restaura el estado. Un campo igual a su valor por defecto no se escribe en la URL; uno vacío
 * sí (`?r2=`), para que borrarlo no lo devuelva al valor por defecto.
 *
 * Los valores viven además en estado local: React Router aplica las navegaciones dentro de una
 * transición, y un input controlado que leyera directamente de la URL perdería teclas al escribir
 * rápido. La URL se toma como fuente de verdad solo cuando cambia por fuera (otro enlace, «atrás»).
 *
 * El HTML pre-renderizado lleva los valores por defecto: al hidratar se usan esos mismos (si no,
 * React descartaría el HTML por desajuste) y en el render siguiente, los de la URL.
 */
export const useQueryState = <K extends string>(defaults: Readonly<Valores<K>>) => {
  const hidratado = useHidratado()
  const [params, setParams] = useSearchParams()
  const query = params.toString()
  const [estado, setEstado] = useState<Estado<K>>(() => ({
    query,
    valores: leer(defaults, params),
    pendientes: [],
  }))

  let actual = estado
  if (query !== estado.query) {
    const propia = estado.pendientes.indexOf(query)
    actual =
      propia >= 0
        ? { query, valores: estado.valores, pendientes: estado.pendientes.slice(propia + 1) }
        : { query, valores: leer(defaults, params), pendientes: [] }
    setEstado(actual)
  }

  const setState = (patch: Partial<Valores<K>> | ((actual: Valores<K>) => Partial<Valores<K>>)) => {
    const cambios = typeof patch === 'function' ? patch(actual.valores) : patch
    const valores = { ...actual.valores, ...cambios }
    const siguiente = new URLSearchParams(params)
    for (const key of claves(defaults)) {
      if (valores[key] === defaults[key]) siguiente.delete(key)
      else siguiente.set(key, valores[key])
    }
    const escrita = siguiente.toString()
    setEstado({
      query: actual.query,
      valores,
      pendientes: [...actual.pendientes, escrita].slice(-MAX_PENDIENTES),
    })
    setParams(siguiente, { replace: true })
  }

  return [hidratado ? actual.valores : { ...defaults }, setState] as const
}
