import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { formatearFijo } from '../lib/calculadoras'
import { EMISORAS, type Emisora } from '../lib/emisoras'
import { REPETIDORAS_EN_AIRE } from '../lib/portada'
import Icono from './partials/Icono'
import { TARJETA } from './partials/estilos'

type EstadoAudio = 'detenido' | 'conectando' | 'sonando' | 'sin-senal'

const REPETIDORA = 'repetidora'

const ESTADO_TEXTO: Record<EstadoAudio, string> = {
  detenido: 'Detenido',
  conectando: 'Sintonizando…',
  sonando: 'En vivo',
  'sin-senal': 'Sin señal',
}

const tituloClass = 'font-serif text-lg font-semibold text-stone-900 dark:text-white'

const pantallaClass =
  'relative rounded-lg bg-linear-to-b from-amber-300 to-amber-400 px-4 py-3 font-mono text-amber-950 shadow-inner ring-4 ring-stone-800 dark:ring-black/80'

const rotuloClass = 'flex justify-between text-[11px] tracking-widest text-amber-900/80 uppercase'

const botonRedondoClass =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Repetidora del club con el aspecto de la pantalla retroiluminada de un equipo. Easter egg: el
 * «FM» abre un menú para sintonizar radios de Talca (src/lib/emisoras.ts); entonces la pantalla
 * muestra la emisora y, en vez del texto de ayuda, hay play, stop y volumen.
 */
const Repetidora = () => {
  const [sintonia, setSintonia] = useState(REPETIDORA)
  const [menu, setMenu] = useState(false)
  const [estado, setEstado] = useState<EstadoAudio>('detenido')
  const [volumen, setVolumen] = useState(0.8)
  const audioRef = useRef<HTMLAudioElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const botonFmRef = useRef<HTMLButtonElement>(null)
  const opcionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const emisora = EMISORAS.find((e) => e.id === sintonia) ?? null

  // Al salir de la portada se corta el audio (un <audio> fuera del DOM puede seguir sonando).
  useEffect(() => {
    const audio = audioRef.current
    return () => audio?.pause()
  }, [])

  useEffect(() => {
    if (!menu) return
    const fuera = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [menu])

  const reproducir = (e: Emisora) => {
    const audio = audioRef.current
    if (!audio) return
    // Siempre desde el stream: tras un stop se vuelve a la transmisión en vivo, no a lo guardado.
    audio.src = e.stream
    audio.volume = volumen
    setEstado('conectando')
    audio.play().catch((error: unknown) => {
      // AbortError: otro stop o cambio de emisora interrumpió la carga; no es falta de señal.
      if (!(error instanceof DOMException && error.name === 'AbortError')) setEstado('sin-senal')
    })
  }

  const detener = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    // Sin `src` el navegador deja de descargar el stream.
    audio.removeAttribute('src')
    audio.load()
    setEstado('detenido')
  }

  const sintonizar = (id: string) => {
    setMenu(false)
    botonFmRef.current?.focus()
    if (id === sintonia) return
    setSintonia(id)
    const elegida = EMISORAS.find((e) => e.id === id)
    if (elegida) reproducir(elegida)
    else detener()
  }

  const cambiarVolumen = (valor: number) => {
    setVolumen(valor)
    if (audioRef.current) audioRef.current.volume = valor
  }

  const opciones = [{ id: REPETIDORA, nombre: 'Nuestra repetidora' }, ...EMISORAS]

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const actual = opcionRefs.current.findIndex((el) => el === document.activeElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      setMenu(false)
      botonFmRef.current?.focus()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const paso = e.key === 'ArrowDown' ? 1 : -1
      opcionRefs.current[(actual + paso + opciones.length) % opciones.length]?.focus()
    }
  }

  const abrirMenu = () => {
    setMenu((abierto) => !abierto)
    // El menú aparece en el próximo render: se enfoca la opción actual en el cuadro siguiente.
    requestAnimationFrame(() =>
      opcionRefs.current[opciones.findIndex((o) => o.id === sintonia)]?.focus(),
    )
  }

  /** El «FM» de la pantalla: parece un rótulo más, pero abre el menú. */
  const BotonFm = (
    <div ref={menuRef} className='relative' onKeyDown={onMenuKeyDown}>
      <button
        ref={botonFmRef}
        type='button'
        onClick={abrirMenu}
        aria-haspopup='menu'
        aria-expanded={menu}
        aria-label='FM: cambiar de emisora'
        className='cursor-pointer rounded tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-amber-950 focus-visible:outline-none'
      >
        FM
      </button>
      {menu && (
        <div
          role='menu'
          aria-label='Emisoras'
          className='absolute top-full right-0 z-10 mt-2 w-52 overflow-hidden rounded-md border border-stone-800 bg-stone-900 py-1 font-mono text-xs tracking-wide text-amber-300 normal-case shadow-xl'
        >
          {opciones.map((opcion, i) => (
            <button
              key={opcion.id}
              ref={(el) => {
                opcionRefs.current[i] = el
              }}
              type='button'
              role='menuitemradio'
              aria-checked={opcion.id === sintonia}
              onClick={() => sintonizar(opcion.id)}
              className='flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-amber-400/15 focus:bg-amber-400/15 focus:outline-none'
            >
              <span className='w-3' aria-hidden='true'>
                {opcion.id === sintonia ? '▸' : ''}
              </span>
              {opcion.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={`${TARJETA} space-y-4 p-4`}>
      <audio
        ref={audioRef}
        preload='none'
        onPlaying={() => setEstado('sonando')}
        onWaiting={() => setEstado('conectando')}
        onError={() => {
          // Al detener se quita el `src`; solo es error si había una emisora cargada.
          if (audioRef.current?.getAttribute('src')) setEstado('sin-senal')
        }}
      />

      <h3 className={tituloClass}>
        {emisora
          ? emisora.nombre
          : REPETIDORAS_EN_AIRE.length > 1
            ? 'Nuestras repetidoras'
            : 'Nuestra repetidora'}
      </h3>

      {emisora ? (
        <div className={pantallaClass}>
          <div className={rotuloClass}>
            <span>{emisora.ciudad}</span>
            {BotonFm}
          </div>
          <p className='text-4xl font-semibold text-amber-950 tabular-nums sm:text-5xl'>
            {formatearFijo(emisora.frecuenciaMhz, 1)}
            <span className='ml-2 text-base font-normal text-amber-900/80'>MHz</span>
          </p>
          <p className='mt-1 flex items-center gap-2 text-xs text-amber-900' aria-live='polite'>
            <span
              className={`size-2 rounded-full ${
                estado === 'sonando'
                  ? 'animate-pulse bg-red-700 motion-reduce:animate-none'
                  : estado === 'conectando'
                    ? 'bg-amber-700'
                    : 'bg-amber-900/30'
              }`}
              aria-hidden='true'
            />
            <span className='font-semibold'>{ESTADO_TEXTO[estado]}</span>
          </p>
        </div>
      ) : (
        REPETIDORAS_EN_AIRE.map((r, i) => (
          <div key={r.id} className={pantallaClass}>
            <div className={rotuloClass}>
              <span>{r.nombre}</span>
              {i === 0 ? BotonFm : <span>FM</span>}
            </div>
            <p className='text-4xl font-semibold text-amber-950 tabular-nums sm:text-5xl'>
              {formatearFijo(r.frecuenciaMhz, 3)}
              <span className='ml-2 text-base font-normal text-amber-900/80'>MHz</span>
            </p>
            <dl className='mt-1 flex flex-wrap gap-x-6 text-xs text-amber-900'>
              <div className='flex gap-1.5'>
                <dt>Tono</dt>
                <dd className='font-semibold'>{formatearFijo(r.tonoHz, 1)} Hz</dd>
              </div>
              <div className='flex gap-1.5'>
                <dt>Desplazamiento</dt>
                <dd className='font-semibold'>+{formatearFijo(r.offsetMhz, 3)} MHz</dd>
              </div>
            </dl>
          </div>
        ))
      )}

      {emisora ? (
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => reproducir(emisora)}
              disabled={estado === 'sonando' || estado === 'conectando'}
              aria-label={`Escuchar ${emisora.nombre}`}
              className={`${botonRedondoClass} bg-blue-950 text-white hover:bg-blue-900 dark:bg-indigo-600 dark:hover:bg-indigo-500`}
            >
              <Icono nombre='reproducir' className='size-5' />
            </button>
            <button
              type='button'
              onClick={detener}
              disabled={estado === 'detenido'}
              aria-label='Detener'
              className={`${botonRedondoClass} border border-stone-300 text-blue-950 hover:bg-stone-100 dark:border-indigo-700 dark:text-indigo-100 dark:hover:bg-indigo-900`}
            >
              <Icono nombre='detener' className='size-5' />
            </button>
            <label className='flex flex-1 items-center gap-2 text-stone-500 dark:text-indigo-300'>
              <Icono nombre={volumen === 0 ? 'silencio' : 'volumen'} className='size-5 shrink-0' />
              <span className='sr-only'>Volumen</span>
              <input
                type='range'
                min={0}
                max={1}
                step={0.05}
                value={volumen}
                onChange={(e) => cambiarVolumen(Number(e.target.value))}
                className='w-full accent-blue-950 dark:accent-amber-400'
              />
            </label>
          </div>
          {estado === 'sin-senal' && (
            <p className='text-xs text-stone-600 dark:text-indigo-300'>
              La emisora no está transmitiendo por internet en este momento.
            </p>
          )}
        </div>
      ) : (
        <p className='text-sm text-stone-600 dark:text-indigo-200'>
          Programa tu equipo con el tono y el desplazamiento para operar por la repetidora del club.
        </p>
      )}
    </div>
  )
}

export default Repetidora
