import { useEffect, useState } from 'react'

import {
  ESCALAS,
  fraccionEscala,
  leerIndice,
  parseSolarXml,
  type ClaveIndice,
  type Condicion,
  type IndicesSolares as Indices,
  type Nivel,
} from '../lib/calc/solar'
import { formatearNumero } from '../lib/calculadoras'
import { PROXIES } from '../lib/proxies'
import Icono, { type NombreIcono } from './partials/Icono'
import { TARJETA, botonSecundarioClass } from './partials/estilos'

/** Versión 2: la copia guarda también las condiciones de banda. */
const CACHE_KEY = 'ce4ly-solar-2'
const TTL_MS = 30 * 60 * 1000

type Copia = { data: Indices; at: number }

type Estado =
  { tipo: 'cargando' } | { tipo: 'vacio' } | { tipo: 'ok' | 'stale'; data: Indices; at: number }

const leerCache = (): Copia | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as Copia | null
    return parsed?.data && typeof parsed.at === 'number' ? parsed : null
  } catch {
    return null
  }
}

const guardarCache = (copia: Copia) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(copia))
  } catch {
    // Sin almacenamiento: la próxima visita vuelve a pedir los índices.
  }
}

/** «23-10-2026, 05:18» en hora de Chile (sin «a. m.», que chocaba con el punto final). */
const MARCA_TIEMPO = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago',
  dateStyle: 'short',
  timeStyle: 'short',
  hourCycle: 'h23',
})

const INDICES: readonly { clave: ClaveIndice; etiqueta: string; ayuda: string }[] = [
  {
    clave: 'sfi',
    etiqueta: 'Flujo solar (SFI)',
    ayuda: 'Flujo solar a 10,7 cm. Sobre 100 se abren las bandas altas de HF.',
  },
  {
    clave: 'sunspots',
    etiqueta: 'Manchas solares',
    ayuda: 'Número de manchas solares. Más manchas, más ionización y mejor propagación.',
  },
  {
    clave: 'aIndex',
    etiqueta: 'Índice A',
    ayuda: 'Actividad geomagnética del día (0–400). Bajo 8 el campo está tranquilo.',
  },
  {
    clave: 'kIndex',
    etiqueta: 'Índice K',
    ayuda: 'Actividad geomagnética de las últimas 3 horas (0–9). Desde 5 hay tormenta.',
  },
]

/**
 * Colores de estado (fijos, nunca de serie) con icono y texto: el color nunca va solo. La pista
 * del medidor es el mismo color, más claro.
 */
const NIVEL: Record<Nivel, { icono: NombreIcono; color: string; relleno: string; pista: string }> =
  {
    bueno: {
      icono: 'correcto',
      color: 'text-[#0ca30c]',
      relleno: 'fill-[#0ca30c]',
      pista: 'fill-[#0ca30c]/15',
    },
    regular: {
      icono: 'alerta',
      color: 'text-[#e09a00] dark:text-[#fab219]',
      relleno: 'fill-[#fab219]',
      pista: 'fill-[#fab219]/20',
    },
    malo: {
      icono: 'error',
      color: 'text-[#ec835a]',
      relleno: 'fill-[#ec835a]',
      pista: 'fill-[#ec835a]/20',
    },
    critico: {
      icono: 'tormenta',
      color: 'text-[#d03b3b] dark:text-[#ec6a6a]',
      relleno: 'fill-[#d03b3b]',
      pista: 'fill-[#d03b3b]/15',
    },
  }

const NIVEL_CONDICION: Record<Condicion, Nivel> = {
  buena: 'bueno',
  regular: 'regular',
  mala: 'malo',
}

const ETIQUETA_CONDICION: Record<Condicion, string> = {
  buena: 'Buena',
  regular: 'Regular',
  mala: 'Mala',
}

const EstadoNivel = ({ nivel, children }: { nivel: Nivel; children: string }) => (
  <span className='inline-flex items-center gap-1 text-xs font-medium text-stone-700 dark:text-indigo-100'>
    <Icono nombre={NIVEL[nivel].icono} className={`size-4 shrink-0 ${NIVEL[nivel].color}`} />
    {children}
  </span>
)

/** Barra continua (SVG: la CSP no admite `style=` en línea para el ancho). */
const Medidor = ({ fraccion, nivel }: { fraccion: number; nivel: Nivel }) => (
  <svg viewBox='0 0 100 6' preserveAspectRatio='none' className='h-1.5 w-full' aria-hidden='true'>
    <rect width='100' height='6' rx='1.5' ry='3' className={NIVEL[nivel].pista} />
    <rect
      width={Math.max(fraccion * 100, 3)}
      height='6'
      rx='1.5'
      ry='3'
      className={NIVEL[nivel].relleno}
    />
  </svg>
)

/** Índice K en nueve segmentos, cada uno con el color de su nivel; se llenan hasta el valor. */
const MedidorK = ({ valor }: { valor: number }) => (
  <svg viewBox='0 0 90 6' preserveAspectRatio='none' className='h-1.5 w-full' aria-hidden='true'>
    {Array.from({ length: 9 }, (_, i) => {
      const { relleno, pista } = NIVEL[leerIndice('kIndex', i + 1).nivel]
      return (
        <rect
          key={i}
          x={i * 10}
          width='8.5'
          height='6'
          rx='1'
          className={i < Math.round(valor) ? relleno : pista}
        />
      )
    })}
  </svg>
)

const Indicador = ({
  clave,
  etiqueta,
  ayuda,
  valor,
}: {
  clave: ClaveIndice
  etiqueta: string
  ayuda: string
  valor: number | null
}) => {
  const lectura = valor === null ? null : leerIndice(clave, valor)
  const { min, max } = ESCALAS[clave]
  return (
    <div
      className='flex flex-col gap-2 rounded-lg border border-stone-200 bg-stone-50/60 p-3 dark:border-indigo-900 dark:bg-indigo-950/40'
      title={`${ayuda} Escala del medidor: ${min}–${max}.`}
    >
      <dt className='text-xs font-medium text-stone-500 dark:text-indigo-300'>{etiqueta}</dt>
      <dd className='flex flex-1 flex-col gap-2'>
        <span className='text-3xl leading-none font-semibold text-stone-900 dark:text-white'>
          {formatearNumero(valor, 0)}
        </span>
        {lectura && valor !== null && (
          <>
            {clave === 'kIndex' ? (
              <MedidorK valor={valor} />
            ) : (
              <Medidor fraccion={fraccionEscala(clave, valor)} nivel={lectura.nivel} />
            )}
            <EstadoNivel nivel={lectura.nivel}>{lectura.etiqueta}</EstadoNivel>
          </>
        )}
      </dd>
    </div>
  )
}

const CondicionCelda = ({ condicion }: { condicion: Condicion | null }) => (
  <td className='py-1.5 pl-3'>
    {condicion ? (
      <EstadoNivel nivel={NIVEL_CONDICION[condicion]}>{ETIQUETA_CONDICION[condicion]}</EstadoNivel>
    ) : (
      '—'
    )}
  </td>
)

const Bandas = ({ data }: { data: Indices }) => (
  <table className='w-full text-sm'>
    <caption className='mb-2 text-left text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-indigo-300'>
      Condiciones en HF
    </caption>
    <thead>
      <tr className='text-left text-xs text-stone-500 dark:text-indigo-300'>
        <th className='pb-1 font-medium'>Bandas</th>
        <th className='pb-1 pl-3 font-medium'>
          <span className='inline-flex items-center gap-1'>
            <Icono nombre='sol' className='size-3.5' />
            Día
          </span>
        </th>
        <th className='pb-1 pl-3 font-medium'>
          <span className='inline-flex items-center gap-1'>
            <Icono nombre='luna' className='size-3.5' />
            Noche
          </span>
        </th>
      </tr>
    </thead>
    <tbody className='divide-y divide-stone-200 dark:divide-indigo-900'>
      {data.bandas.map(({ banda, dia, noche }) => (
        <tr key={banda}>
          <th
            scope='row'
            className='py-1.5 text-left font-mono font-semibold text-stone-800 dark:text-indigo-100'
          >
            {banda}
          </th>
          <CondicionCelda condicion={dia} />
          <CondicionCelda condicion={noche} />
        </tr>
      ))}
    </tbody>
  </table>
)

const textoDato = (valor: number | string | null) =>
  valor === null || valor === '' ? '—' : String(valor)

/**
 * Panel de propagación con los datos de hamqsl.com: SFI, manchas, índices A y K con su medidor y
 * estado, y las condiciones calculadas por banda. Se piden al proxy del propio sitio; si la red
 * falla, se muestra la última copia guardada en el navegador.
 */
const IndicesSolares = ({
  className = '',
  titulo: Titulo = 'h2',
}: {
  className?: string
  /** Nivel del título según dónde va el panel. */
  titulo?: 'h2' | 'h3'
}) => {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' })
  const [actualizando, setActualizando] = useState(false)
  /** Cada clic en «Actualizar» lo incrementa y fuerza un pedido a la red. */
  const [pedido, setPedido] = useState(0)

  useEffect(() => {
    const cached = leerCache()
    const controlador = new AbortController()

    const cargar = async () => {
      if (pedido === 0 && cached && Date.now() - cached.at < TTL_MS) {
        setEstado({ tipo: 'ok', ...cached })
        return
      }
      setActualizando(true)
      try {
        const res = await fetch(PROXIES.solar.ruta, { signal: controlador.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = parseSolarXml(await res.text())
        if (!data || data.sfi === null) throw new Error('XML sin índices')
        const copia = { data, at: Date.now() }
        guardarCache(copia)
        setEstado({ tipo: 'ok', ...copia })
      } catch {
        if (controlador.signal.aborted) return
        setEstado(cached ? { tipo: 'stale', ...cached } : { tipo: 'vacio' })
      } finally {
        if (!controlador.signal.aborted) setActualizando(false)
      }
    }

    void cargar()
    return () => controlador.abort()
  }, [pedido])

  return (
    <div className={`@container ${TARJETA} space-y-4 p-4 text-sm ${className}`}>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <Titulo className='font-serif text-lg font-semibold text-stone-900 dark:text-white'>
          Índices solares
        </Titulo>
        <button
          type='button'
          onClick={() => setPedido((n) => n + 1)}
          disabled={actualizando}
          className={`${botonSecundarioClass} inline-flex items-center gap-1.5 py-1.5 text-xs`}
        >
          <Icono
            nombre='actualizar'
            className={`size-4 ${actualizando ? 'animate-spin motion-reduce:animate-none' : ''}`}
          />
          {actualizando ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {estado.tipo === 'cargando' && (
        <p className='text-stone-600 dark:text-indigo-300'>Cargando índices…</p>
      )}
      {estado.tipo === 'vacio' && (
        <p className='text-stone-600 dark:text-indigo-300'>
          No hay datos de propagación en este momento. Inténtalo más tarde.
        </p>
      )}
      {(estado.tipo === 'ok' || estado.tipo === 'stale') && (
        <>
          <dl className='grid grid-cols-2 gap-3 @lg:grid-cols-4'>
            {INDICES.map(({ clave, etiqueta, ayuda }) => (
              <Indicador
                key={clave}
                clave={clave}
                etiqueta={etiqueta}
                ayuda={ayuda}
                valor={estado.data[clave]}
              />
            ))}
          </dl>

          <div className='grid gap-4 @2xl:grid-cols-[3fr_2fr]'>
            {estado.data.bandas.length > 0 && <Bandas data={estado.data} />}
            <dl className='grid grid-cols-[auto_1fr] content-start gap-x-3 gap-y-1.5 text-xs'>
              <dt className='text-stone-500 dark:text-indigo-300'>Rayos X</dt>
              <dd className='font-mono text-stone-800 dark:text-indigo-100'>
                {textoDato(estado.data.xray)}
              </dd>
              <dt className='text-stone-500 dark:text-indigo-300'>Campo geomagnético</dt>
              <dd className='font-mono text-stone-800 dark:text-indigo-100'>
                {textoDato(estado.data.geomagField)}
              </dd>
              <dt className='text-stone-500 dark:text-indigo-300'>Ruido de señal</dt>
              <dd className='font-mono text-stone-800 dark:text-indigo-100'>
                {textoDato(estado.data.signalnoise)}
              </dd>
            </dl>
          </div>

          <p className='text-xs text-stone-500 dark:text-indigo-300/80'>
            {estado.tipo === 'stale' ? 'Último dato disponible' : 'Actualizado'}:{' '}
            {MARCA_TIEMPO.format(estado.at)}. Fuente: hamqsl.com (N0NBH).
          </p>
        </>
      )}
    </div>
  )
}

export default IndicesSolares
