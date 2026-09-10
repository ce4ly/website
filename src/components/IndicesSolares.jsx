import { useEffect, useState } from 'react'
import { formatearNumero } from '../lib/calculadoras.js'

const CACHE_KEY = 'ce4ly-solar'
const TTL_MS = 30 * 60 * 1000

const leerCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.data) return null
    return parsed
  } catch {
    return null
  }
}

const IndicesSolares = ({ className = '' }) => {
  const [estado, setEstado] = useState({
    tipo: 'cargando',
    data: null,
    at: null
  })

  useEffect(() => {
    const cached = leerCache()
    let cancelado = false
    const aplicar = (data, at, stale) => {
      if (cancelado) return
      setEstado({
        tipo: data ? (stale ? 'stale' : 'ok') : 'vacio',
        data,
        at
      })
    }

    const fetchSolar = async () => {
      try {
        const res = await fetch('/api/solar.json')
        if (!res.ok) throw new Error('solar')
        const data = await res.json()
        if (!data?.sfi && !data?.ok && data?.sfi !== 0) {
          throw new Error('vacío')
        }
        const at = data.fetchedAt || Date.now()
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, at }))
        aplicar(data, at, Boolean(data.stale))
      } catch {
        if (cached?.data) aplicar(cached.data, cached.at, true)
        else aplicar(null, null, false)
      }
    }

    if (cached?.data && Date.now() - cached.at < TTL_MS) {
      aplicar(cached.data, cached.at, false)
    }
    fetchSolar()
    return () => {
      cancelado = true
    }
  }, [])

  const { tipo, data, at } = estado
  const marca = at
    ? new Date(at).toLocaleString('es-CL', { timeZone: 'America/Santiago' })
    : null

  return (
    <div
      className={`rounded-xl border border-stone-300/70 bg-white p-4 text-sm shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 ${className}`}
    >
      <h2 className="mb-3 font-serif text-lg font-semibold text-stone-900 dark:text-white">
        Índices solares
      </h2>
      {tipo === 'cargando' && (
        <p className="text-stone-600 dark:text-indigo-300">Cargando índices…</p>
      )}
      {tipo === 'vacio' && (
        <p className="text-stone-600 dark:text-indigo-300">
          No hay datos de propagación en este momento. Inténtalo más tarde.
        </p>
      )}
      {data && (tipo === 'ok' || tipo === 'stale') && (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <dt className="text-xs text-stone-500 dark:text-indigo-300">
                SFI
              </dt>
              <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                {formatearNumero(data.sfi, 0)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500 dark:text-indigo-300">
                Manchas
              </dt>
              <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                {formatearNumero(data.sunspots, 0)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500 dark:text-indigo-300">
                Índice A
              </dt>
              <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                {formatearNumero(data.aIndex, 0)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500 dark:text-indigo-300">
                Índice K
              </dt>
              <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                {formatearNumero(data.kIndex, 0)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-stone-500 dark:text-indigo-300/80">
            {tipo === 'stale' ? 'Último dato disponible' : 'Actualizado'}
            {marca ? `: ${marca}` : ''}. Fuente: hamqsl.com.
          </p>
        </>
      )}
    </div>
  )
}

export default IndicesSolares
