import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Sincroniza un objeto de campos de formulario con el query string.
 * Recargar la URL restaura el estado.
 */
export const useQueryState = (defaults, { omitDefaults = false } = {}) => {
  const [params, setParams] = useSearchParams()

  const state = useMemo(() => {
    const next = { ...defaults }
    for (const key of Object.keys(defaults)) {
      if (params.has(key)) next[key] = params.get(key)
    }
    return next
  }, [params, defaults])

  const setState = useCallback(
    patch => {
      setParams(
        prev => {
          const next = new URLSearchParams(prev)
          const merged = { ...defaults }
          for (const key of Object.keys(defaults)) {
            if (prev.has(key)) merged[key] = prev.get(key)
          }
          const applied =
            typeof patch === 'function'
              ? patch(merged)
              : { ...merged, ...patch }
          for (const key of Object.keys(defaults)) {
            const valor = applied[key]
            const vacio = valor === '' || valor === null || valor === undefined
            if (
              vacio ||
              (omitDefaults && String(valor) === String(defaults[key]))
            ) {
              next.delete(key)
            } else {
              next.set(key, String(valor))
            }
          }
          return next
        },
        { replace: true }
      )
    },
    [defaults, omitDefaults, setParams]
  )

  return [state, setState]
}
