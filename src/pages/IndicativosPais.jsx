import { useMemo, useState } from 'react'
import { inputClass, labelClass } from '../lib/calculadoras.js'
import { banderaEmoji, PAISES_INDICATIVOS } from '../lib/indicativos.js'

const thClass =
  'border-b border-stone-300 bg-stone-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100'

const tdClass =
  'border-b border-stone-200 px-3 py-3 text-stone-800 dark:border-indigo-900/60 dark:text-indigo-100'

const normalizar = texto =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const Indicativos = () => {
  const [filtro, setFiltro] = useState('')

  const paises = useMemo(() => {
    const q = normalizar(filtro.trim())
    const lista = [...PAISES_INDICATIVOS].sort((a, b) => {
      if (a.iso === 'CL') return -1
      if (b.iso === 'CL') return 1
      return a.pais.localeCompare(b.pais, 'es')
    })
    if (!q) return lista
    return lista.filter(p => {
      const hay = [
        p.pais,
        p.indicativo,
        p.iso,
        ...(p.series || []),
        p.nota || ''
      ]
        .join(' ')
        .toLowerCase()
      return normalizar(hay).includes(q)
    })
  }, [filtro])

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Indicativos por País
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Prefijo con el que se reconoce un país en el aire y las series de
          letras que usan sus estaciones. En Chile el indicativo habitual es CE;
          las clases son CD, CA, CE y XQ.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <label htmlFor="ind-filtro" className={labelClass}>
          Buscar país o prefijo
        </label>
        <input
          id="ind-filtro"
          className={inputClass}
          type="search"
          placeholder="Ej: Chile, CE, LU, Japón…"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
      </div>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={thClass}>País</th>
                <th className={thClass}>Indicativo</th>
                <th className={thClass}>Series / clases</th>
              </tr>
            </thead>
            <tbody>
              {paises.map(p => (
                <tr
                  key={`${p.iso}-${p.indicativo}`}
                  className={`transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30 ${
                    p.iso === 'CL' ? 'bg-blue-50/70 dark:bg-indigo-900/30' : ''
                  }`}
                >
                  <td className={`${tdClass} whitespace-nowrap`}>
                    <span className="mr-2 text-lg leading-none" aria-hidden>
                      {banderaEmoji(p.iso)}
                    </span>
                    {p.pais}
                  </td>
                  <td className={`${tdClass} font-mono font-semibold`}>
                    {p.indicativo}
                  </td>
                  <td className={tdClass}>
                    <span className="font-mono text-xs sm:text-sm">
                      {p.series.join(', ')}
                    </span>
                    {p.nota && (
                      <span className="mt-0.5 block text-xs text-stone-500 dark:text-indigo-300/80">
                        {p.nota}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {paises.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className={`${tdClass} text-center text-stone-500`}
                  >
                    No hay coincidencias.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mx-auto max-w-3xl text-center text-xs text-stone-500 dark:text-indigo-300/80">
        El indicativo es el prefijo con el que suele anunciarse el país. Las
        series son los bloques que emiten las estaciones (clases de licencia o
        asignaciones UIT). Chile está primero; el resto va por orden alfabético.
        Consulte siempre la autoridad nacional: en Chile,{' '}
        <a
          href="https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radio-aficionados/"
          className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          SUBTEL
        </a>
        .
      </p>
    </section>
  )
}

export default Indicativos
