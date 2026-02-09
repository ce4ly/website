import { useEffect, useState } from 'react'

import { FEED_BOLETINES } from '../lib/proxies'
import { parsearFeedRss, type EpisodioRss } from '../lib/rss'

export type EstadoBoletines =
  { tipo: 'cargando' } | { tipo: 'error' } | { tipo: 'ok'; episodios: EpisodioRss[] }

/** Episodios del feed de SoundCloud, pedidos al montar (en el prerender queda en «cargando»). */
export function useBoletines(): EstadoBoletines {
  const [estado, setEstado] = useState<EstadoBoletines>({ tipo: 'cargando' })

  useEffect(() => {
    const controlador = new AbortController()

    const cargar = async () => {
      try {
        // El feed de SoundCloud llega por el proxy de Netlify (netlify.toml).
        const res = await fetch(FEED_BOLETINES, {
          headers: { Accept: 'application/rss+xml' },
          signal: controlador.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const xml = await res.text()
        if (!xml.includes('<rss')) throw new Error('La respuesta no es un feed RSS')
        setEstado({ tipo: 'ok', episodios: parsearFeedRss(xml) })
      } catch {
        if (!controlador.signal.aborted) setEstado({ tipo: 'error' })
      }
    }

    void cargar()
    return () => controlador.abort()
  }, [])

  return estado
}
