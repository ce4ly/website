import { useEffect, useState } from 'react'
import {
  faCloud,
  faCloudBolt,
  faCloudMoon,
  faCloudMoonRain,
  faCloudRain,
  faCloudShowersHeavy,
  faCloudSun,
  faCloudSunRain,
  faMoon,
  faSmog,
  faSnowflake,
  faSun,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import { formatearNumero } from '../lib/calculadoras'
import { describirTiempo, parsearClima, type ClimaCiudad, type TipoTiempo } from '../lib/clima'
import { PROXIES } from '../lib/proxies'
import Icon from './partials/Icon'
import { TARJETA } from './partials/estilos'

type Estado = { tipo: 'cargando' } | { tipo: 'error' } | { tipo: 'ok'; ciudades: ClimaCiudad[] }

/** Icono (de día y de noche) y color de cada tipo de tiempo. El texto va siempre al lado. */
const ICONOS: Record<TipoTiempo, { dia: IconDefinition; noche: IconDefinition; color: string }> = {
  despejado: { dia: faSun, noche: faMoon, color: 'text-amber-500' },
  parcial: { dia: faCloudSun, noche: faCloudMoon, color: 'text-amber-500' },
  nublado: { dia: faCloud, noche: faCloud, color: 'text-stone-400 dark:text-indigo-300' },
  niebla: { dia: faSmog, noche: faSmog, color: 'text-stone-400 dark:text-indigo-300' },
  llovizna: {
    dia: faCloudSunRain,
    noche: faCloudMoonRain,
    color: 'text-sky-600 dark:text-sky-400',
  },
  lluvia: { dia: faCloudRain, noche: faCloudRain, color: 'text-sky-600 dark:text-sky-400' },
  chubascos: {
    dia: faCloudShowersHeavy,
    noche: faCloudShowersHeavy,
    color: 'text-sky-700 dark:text-sky-400',
  },
  nieve: { dia: faSnowflake, noche: faSnowflake, color: 'text-sky-400 dark:text-sky-200' },
  tormenta: { dia: faCloudBolt, noche: faCloudBolt, color: 'text-violet-600 dark:text-violet-400' },
}

const grados = (valor: number | null) => (valor === null ? '—' : `${formatearNumero(valor, 0)}°`)

const Ciudad = ({ ciudad: c }: { ciudad: ClimaCiudad }) => {
  const { texto, tipo } = describirTiempo(c.codigo)
  const icono = ICONOS[tipo]
  return (
    <li className='flex flex-col gap-1 rounded-lg border border-stone-200 bg-stone-50/60 p-3 dark:border-indigo-900 dark:bg-indigo-950/40'>
      <div className='flex items-start justify-between gap-2'>
        <p className='text-xs font-medium text-stone-500 dark:text-indigo-300'>{c.nombre}</p>
        <Icon
          icon={c.dia ? icono.dia : icono.noche}
          className={`shrink-0 text-3xl ${icono.color}`}
        />
      </div>
      <p className='text-3xl leading-none font-semibold text-stone-900 dark:text-white'>
        {grados(c.temperatura)}
      </p>
      <p className='truncate text-xs text-stone-700 dark:text-indigo-100' title={texto}>
        {texto}
      </p>
      <dl className='mt-1 flex flex-wrap gap-x-2.5 text-xs text-stone-600 dark:text-indigo-200'>
        <div className='flex gap-0.5'>
          <dt>
            <span aria-hidden='true'>↑</span>
            <span className='sr-only'>Máxima</span>
          </dt>
          <dd>{grados(c.maxima)}</dd>
        </div>
        <div className='flex gap-0.5'>
          <dt>
            <span aria-hidden='true'>↓</span>
            <span className='sr-only'>Mínima</span>
          </dt>
          <dd>{grados(c.minima)}</dd>
        </div>
        {c.humedad !== null && (
          <div className='flex gap-0.5'>
            <dt className='sr-only'>Humedad</dt>
            <dd>{formatearNumero(c.humedad, 0)} %</dd>
          </div>
        )}
      </dl>
    </li>
  )
}

/** Temperatura actual en las capitales del Maule y Constitución, de Open-Meteo (por el proxy del sitio). */
const Clima = ({ className = '' }: { className?: string }) => {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' })

  useEffect(() => {
    const controlador = new AbortController()

    const cargar = async () => {
      try {
        const res = await fetch(PROXIES.clima.ruta, { signal: controlador.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const ciudades = parsearClima(await res.json())
        if (!ciudades) throw new Error('Respuesta sin clima')
        setEstado({ tipo: 'ok', ciudades })
      } catch {
        if (!controlador.signal.aborted) setEstado({ tipo: 'error' })
      }
    }

    void cargar()
    return () => controlador.abort()
  }, [])

  return (
    <div className={`${TARJETA} space-y-3 p-4 ${className}`}>
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <h3 className='font-serif text-lg font-semibold text-stone-900 dark:text-white'>
          El tiempo en el Maule
        </h3>
        <p className='text-xs text-stone-500 dark:text-indigo-300/80'>Fuente: Open-Meteo</p>
      </div>
      {estado.tipo === 'cargando' && (
        <p className='text-sm text-stone-600 dark:text-indigo-300'>Cargando el tiempo…</p>
      )}
      {estado.tipo === 'error' && (
        <p className='text-sm text-stone-600 dark:text-indigo-300'>
          El tiempo no está disponible en este momento.
        </p>
      )}
      {estado.tipo === 'ok' && (
        <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
          {estado.ciudades.map((ciudad) => (
            <Ciudad key={ciudad.nombre} ciudad={ciudad} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default Clima
