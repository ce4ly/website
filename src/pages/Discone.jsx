import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota
} from '../components/CalculadoraLayout.jsx'
import { useQueryState } from '../hooks/useQueryState.js'
import { discone } from '../lib/calc/discone.js'
import {
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'
import { meta as routeMeta } from '../lib/meta.js'

const DEFAULTS = { fmin: '100' }

export const meta = () => routeMeta({ location: '/calculadoras/discone' })

const rango = dim => {
  if (!dim) return '—'
  if (dim.unidad === '°' || dim.unidad === '') {
    return `${formatearNumero(dim.nominal, 0)} ${dim.unidad} (${formatearNumero(dim.min, 0)}–${formatearNumero(dim.max, 0)})`.trim()
  }
  return `${formatearLongitud(dim.nominal)} (${formatearLongitud(dim.min)} – ${formatearLongitud(dim.max)})`
}

const Discone = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const fmin = parseNumero(q.fmin)
  const d = fmin ? discone(fmin) : null

  return (
    <CalculadoraLayout
      titulo="Calculadora de Discone"
      intro="Antena de banda ancha para escanear marinas, comerciales, emergencia y TV. Las proporciones salen de la literatura, no de un único valor mágico."
    >
      <Articulo titulo="Referencias">
        <p className="text-justify">
          ARRL Antenna Book (Hall, ed.): el lado del cono vale λ/4 a la
          frecuencia mínima y el disco, 0,7 × (λ/4). Belrose, VE2CV, QST julio
          1975: ángulo de cono típico 60° (30° al eje) y disco entre 0,64 y 0,70
          del diámetro de la boca. El ancho de banda útil ronda de f a 10·f.
        </p>
        <Formula>
          <p>
            Ls ≈ λ/4 &nbsp;|&nbsp; Ddisco ≈ 0,64–0,70 × Dboca &nbsp;|&nbsp; Φ ≈
            60°
          </p>
        </Formula>
      </Articulo>
      <Campo>
        <label htmlFor="fmin" className={labelClass}>
          Frecuencia mínima (MHz)
        </label>
        <input
          id="fmin"
          className={inputClass}
          value={q.fmin}
          onChange={e => setQ({ fmin: e.target.value })}
          placeholder="Ej: 100"
        />
      </Campo>
      {d && (
        <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900 dark:text-white">
            Dimensiones (nominal y rango)
          </h2>
          <dl className="space-y-3 text-sm">
            <Fila
              etiqueta="Largo inclinado del cono"
              valor={rango(d.largoInclinado)}
            />
            <Fila
              etiqueta="Diámetro del disco"
              valor={rango(d.diametroDisco)}
            />
            <Fila
              etiqueta="Diámetro superior del cono"
              valor={rango(d.diametroSuperiorCono)}
            />
            <Fila
              etiqueta="Separación disco–cono"
              valor={rango(d.separacionDiscoCono)}
            />
            <Fila
              etiqueta="Ángulo del cono (incluido)"
              valor={rango(d.anguloCono)}
            />
            <Fila etiqueta="Número de varillas" valor={rango(d.varillas)} />
            <Fila
              etiqueta="Ancho de banda útil estimado"
              valor={`${formatearNumero(fmin, 1)} – ${formatearNumero(d.fMaxUtilMhz, 1)} MHz`}
              resaltar
            />
          </dl>
          <Nota>
            Recorte con analizador. Más varillas acercan el cono a una
            superficie continua y bajan un poco la frecuencia de corte.
          </Nota>
        </div>
      )}
    </CalculadoraLayout>
  )
}

export default Discone
