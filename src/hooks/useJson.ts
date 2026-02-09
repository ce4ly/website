import { useEffect, useState } from 'react'

export type EstadoJson<T> = { tipo: 'cargando' } | { tipo: 'error' } | { tipo: 'ok'; datos: T }

/**
 * Descarga y parsea un JSON del propio sitio al montar (en el prerender queda en «cargando»). Con
 * `url` en `null` espera: sirve para no bajar un archivo grande hasta que haga falta.
 */
export function useJson<T>(url: string | null): EstadoJson<T> {
  const [estado, setEstado] = useState<EstadoJson<T>>({ tipo: 'cargando' })

  useEffect(() => {
    if (url === null) return
    const controlador = new AbortController()

    const cargar = async () => {
      try {
        const res = await fetch(url, { signal: controlador.signal })
        if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
        setEstado({ tipo: 'ok', datos: (await res.json()) as T })
      } catch {
        if (!controlador.signal.aborted) setEstado({ tipo: 'error' })
      }
    }

    void cargar()
    return () => controlador.abort()
  }, [url])

  return estado
}
