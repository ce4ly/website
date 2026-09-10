import { useEffect, useState } from 'react'
import CalculadoraLayout, {
  Articulo
} from '../components/CalculadoraLayout.jsx'
import IndicesSolares from '../components/IndicesSolares.jsx'
import { meta as routeMeta } from '../lib/meta.js'

export const meta = () => routeMeta({ location: '/herramientas/reloj' })

const fmt = (date, timeZone) =>
  new Intl.DateTimeFormat('es-CL', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)

const fechaLarga = (date, timeZone) =>
  new Intl.DateTimeFormat('es-CL', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)

const esVeranoChile = date => {
  const local = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    timeZoneName: 'shortOffset'
  }).format(date)
  return /GMT-3|UTC-3/.test(local)
}

const Reloj = () => {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const verano = esVeranoChile(ahora)

  return (
    <CalculadoraLayout
      titulo="Hora UTC y Propagación"
      intro="Hora coordinada universal junto a la hora de Chile, con los índices solares de hamqsl.com."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-stone-300/70 bg-white p-6 text-center shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-white">
            UTC
          </h2>
          <p className="mt-2 font-mono text-4xl font-semibold text-blue-950 dark:text-indigo-100">
            {fmt(ahora, 'UTC')}
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-indigo-300">
            {fechaLarga(ahora, 'UTC')}
          </p>
        </article>
        <article className="rounded-xl border border-stone-300/70 bg-white p-6 text-center shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-white">
            Chile (Santiago)
          </h2>
          <p className="mt-2 font-mono text-4xl font-semibold text-blue-950 dark:text-indigo-100">
            {fmt(ahora, 'America/Santiago')}
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-indigo-300">
            {fechaLarga(ahora, 'America/Santiago')}
          </p>
          <p className="mt-2 text-xs font-medium text-stone-500 dark:text-indigo-300">
            {verano
              ? 'Horario de verano (UTC−3)'
              : 'Horario de invierno (UTC−4)'}
          </p>
        </article>
      </div>
      <IndicesSolares />
      <Articulo titulo="Nota">
        <p className="text-justify">
          Los índices solares no se precachean: necesitan datos vivos. El reloj
          UTC y el resto de calculadoras sí funcionan sin red, para usarlas en
          el cerro durante una activación.
        </p>
      </Articulo>
    </CalculadoraLayout>
  )
}

export default Reloj
