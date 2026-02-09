import { useSyncExternalStore } from 'react'

import IndicesSolares from '../IndicesSolares'
import CalculadoraLayout, { Articulo } from '../calculadora/CalculadoraLayout'
import { TARJETA } from '../partials/estilos'

const ZONA_CHILE = 'America/Santiago'

/** Reloj compartido: un solo intervalo de 1 s mientras haya algún componente suscrito. */
const reloj = (() => {
  let ahora = Date.now()
  let intervalo: number | undefined
  const oyentes = new Set<() => void>()
  return {
    suscribir(aviso: () => void) {
      oyentes.add(aviso)
      if (oyentes.size === 1) {
        ahora = Date.now()
        intervalo = window.setInterval(() => {
          ahora = Date.now()
          for (const oyente of oyentes) oyente()
        }, 1000)
      }
      return () => {
        oyentes.delete(aviso)
        if (oyentes.size === 0) window.clearInterval(intervalo)
      }
    },
    leer: () => ahora,
  }
})()

const hora = (fecha: Date, timeZone: string) =>
  new Intl.DateTimeFormat('es-CL', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(fecha)

const fechaLarga = (fecha: Date, timeZone: string) =>
  new Intl.DateTimeFormat('es-CL', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha)

const esVeranoChile = (fecha: Date) => {
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_CHILE,
    timeZoneName: 'shortOffset',
  }).format(fecha)
  return /GMT-3|UTC-3/.test(offset)
}

const TarjetaHora = ({
  titulo,
  fecha,
  timeZone,
  pie,
}: {
  titulo: string
  fecha: Date | null
  timeZone: string
  pie?: string
}) => (
  <article className={`${TARJETA} p-6 text-center`}>
    <h2 className='font-serif text-lg font-semibold text-stone-900 dark:text-white'>{titulo}</h2>
    <p className='mt-2 font-mono text-4xl font-semibold text-blue-950 dark:text-indigo-100'>
      {fecha ? hora(fecha, timeZone) : '--:--:--'}
    </p>
    <p className='mt-2 text-sm text-stone-600 dark:text-indigo-300'>
      {fecha ? fechaLarga(fecha, timeZone) : ' '}
    </p>
    {pie && <p className='mt-2 text-xs font-medium text-stone-500 dark:text-indigo-300'>{pie}</p>}
  </article>
)

const Reloj = () => {
  // En el prerender no hay hora: el HTML sale con «--:--:--» y la hora real aparece al hidratar.
  const ms = useSyncExternalStore(reloj.suscribir, reloj.leer, () => null)
  const ahora = ms === null ? null : new Date(ms)

  return (
    <CalculadoraLayout
      titulo='Hora UTC y Propagación'
      intro='Hora coordinada universal junto a la hora de Chile, con los índices solares de hamqsl.com.'
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <TarjetaHora titulo='UTC' fecha={ahora} timeZone='UTC' />
        <TarjetaHora
          titulo='Chile (Santiago)'
          fecha={ahora}
          timeZone={ZONA_CHILE}
          pie={
            ahora
              ? esVeranoChile(ahora)
                ? 'Horario de verano (UTC−3)'
                : 'Horario de invierno (UTC−4)'
              : undefined
          }
        />
      </div>
      <IndicesSolares />
      <Articulo titulo='Nota'>
        <p className='text-justify'>
          Los índices solares no se precachean: necesitan datos vivos. El reloj UTC y el resto de
          calculadoras sí funcionan sin red, para usarlas en el cerro durante una activación.
        </p>
      </Articulo>
    </CalculadoraLayout>
  )
}

export default Reloj
