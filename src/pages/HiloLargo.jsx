import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Nota
} from '../components/CalculadoraLayout.jsx'
import { useQueryState } from '../hooks/useQueryState.js'
import {
  BANDAS_HILO,
  largoContrapeso,
  rankearLargos
} from '../lib/calc/hilo-largo.js'
import {
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'
import { meta as routeMeta } from '../lib/meta.js'

const DEFAULTS = {
  bandas: '80,40,20,15,10',
  lmin: '12',
  lmax: '40',
  paso: '0,1'
}

export const meta = () => routeMeta({ location: '/calculadoras/hilo-largo' })

const HiloLargo = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const ids = q.bandas.split(',').filter(Boolean)
  const ranking = rankearLargos({
    bandasIds: ids,
    lMin: parseNumero(q.lmin) ?? 12,
    lMax: parseNumero(q.lmax) ?? 40,
    paso: parseNumero(q.paso) ?? 0.1,
    top: 8
  })
  const contrapeso = largoContrapeso(ids)

  const toggle = id => {
    const set = new Set(ids)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    setQ({
      bandas: BANDAS_HILO.map(b => b.id)
        .filter(x => set.has(x))
        .join(',')
    })
  }

  return (
    <CalculadoraLayout
      titulo="Hilo Largo con Unun 9:1"
      intro="A diferencia de la EFHW, aquí el hilo se elige a propósito lejos de cualquier múltiplo de media onda en las bandas marcadas."
    >
      <Articulo titulo="No resonante a propósito">
        <p className="text-justify">
          Un unun 9:1 espera una impedancia de unos cientos de ohmios, no un
          múltiplo de media onda (alta impedancia extrema). Se barren largos
          candidatos y se ordenan por el margen mínimo a las zonas prohibidas.
        </p>
        <Nota>
          Son puntos de partida. Recorte con analizador o medidor de ROE. Un
          choque de corriente en el coaxial limita la RF en el chasis: el unun
          no aísla el equipo.
        </Nota>
      </Articulo>
      <Campo>
        <p className={labelClass}>Bandas a cubrir</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BANDAS_HILO.map(b => (
            <label
              key={b.id}
              className="inline-flex items-center gap-1 text-sm text-stone-700 dark:text-indigo-100"
            >
              <input
                type="checkbox"
                checked={ids.includes(b.id)}
                onChange={() => toggle(b.id)}
              />
              {b.nombre}
            </label>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="lmin">
              Largo mínimo (m)
            </label>
            <input
              id="lmin"
              className={inputClass}
              value={q.lmin}
              onChange={e => setQ({ lmin: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="lmax">
              Largo máximo (m)
            </label>
            <input
              id="lmax"
              className={inputClass}
              value={q.lmax}
              onChange={e => setQ({ lmax: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="paso">
              Paso (m)
            </label>
            <input
              id="paso"
              className={inputClass}
              value={q.paso}
              onChange={e => setQ({ paso: e.target.value })}
            />
          </div>
        </div>
      </Campo>
      {ranking.length > 0 && (
        <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900 dark:text-white">
            Mejores largos
          </h2>
          <dl className="space-y-3 text-sm">
            {ranking.map((c, i) => (
              <Fila
                key={c.largo}
                etiqueta={`${i + 1}. ${formatearLongitud(c.largo)}`}
                valor={`margen ${formatearNumero(c.margen, 2)} m`}
                resaltar={i === 0}
              />
            ))}
            {contrapeso !== null && (
              <Fila
                etiqueta="Contrapeso (~0,05 λ de la banda más baja)"
                valor={formatearLongitud(contrapeso)}
              />
            )}
          </dl>
          <Nota>
            El contrapeso corto no reemplaza un plano de tierra. Si sientes RF
            en el micrófono o en el chasis, alarga el contrapaso, baja potencia
            y agrega un choque.
          </Nota>
        </div>
      )}
    </CalculadoraLayout>
  )
}

export default HiloLargo
