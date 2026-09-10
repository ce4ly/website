import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota
} from '../components/CalculadoraLayout.jsx'
import Pestanas from '../components/Pestanas.jsx'
import { useQueryState } from '../hooks/useQueryState.js'
import {
  COLORES_RESISTENCIA,
  coloresAValor,
  divisorTension,
  leyOhm,
  resonanciaLc,
  valorAColores
} from '../lib/calc/electronica.js'
import { inputClass, labelClass, parseNumero } from '../lib/calculadoras.js'
import { formatearNumero } from '../lib/calculadoras.js'
import { meta as routeMeta } from '../lib/meta.js'

const DEFAULTS = {
  tab: 'ohm',
  v: '',
  i: '',
  r: '',
  p: '',
  bandas: '4',
  b0: 'marron',
  b1: 'negro',
  b2: 'rojo',
  b3: 'oro',
  b4: 'marron',
  b5: 'marron',
  ohm: '1000',
  vin: '12',
  r1: '1000',
  r2: '1000',
  f: '',
  l: '',
  c: ''
}

export const meta = () => routeMeta({ location: '/herramientas/electronica' })

const ResistenciaSvg = ({ ids }) => {
  const cols = ids.map(id => COLORES_RESISTENCIA.find(c => c.id === id)?.hex)
  const x0 = 40
  const bw = 12
  const gap = 10
  return (
    <svg viewBox="0 0 260 80" className="h-20 w-full max-w-sm" role="img">
      <title>Resistencia de {ids.length} bandas</title>
      <line
        x1="8"
        y1="40"
        x2="252"
        y2="40"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="28"
        y="18"
        width="204"
        height="44"
        rx="12"
        className="fill-amber-100 stroke-stone-400 dark:fill-amber-200/80"
      />
      {cols.map((hex, i) => (
        <rect
          key={i}
          x={x0 + i * (bw + gap)}
          y="18"
          width={bw}
          height="44"
          fill={hex || '#78716c'}
        />
      ))}
    </svg>
  )
}

const Electronica = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const ohm = leyOhm({
    v: parseNumero(q.v),
    i: parseNumero(q.i),
    r: parseNumero(q.r),
    p: parseNumero(q.p)
  })
  const nBandas = Number(q.bandas) || 4
  const ids = [q.b0, q.b1, q.b2, q.b3, q.b4, q.b5].slice(0, nBandas)
  const desdeColor = coloresAValor(nBandas, ids)
  const divisor = divisorTension({
    vin: parseNumero(q.vin),
    r1: parseNumero(q.r1),
    r2: parseNumero(q.r2)
  })
  const lc = resonanciaLc({
    f: parseNumero(q.f),
    l: parseNumero(q.l) !== null ? parseNumero(q.l) * 1e-6 : null,
    c: parseNumero(q.c) !== null ? parseNumero(q.c) * 1e-12 : null
  })

  return (
    <CalculadoraLayout
      titulo="Electrónica Básica"
      intro="Acompaña al curso de Electrónica Básica del club: Ohm, código de colores, divisor y resonancia LC."
    >
      <Pestanas
        valor={q.tab}
        onChange={tab => setQ({ tab })}
        items={[
          { id: 'ohm', label: 'Ley de Ohm' },
          { id: 'colores', label: 'Resistencias' },
          { id: 'divisor', label: 'Divisor' },
          { id: 'lc', label: 'Resonancia LC' }
        ]}
      />
      {q.tab === 'ohm' && (
        <>
          <Articulo>
            <p>
              Ingresa exactamente dos de V, I, R y P. Las otras dos salen de las
              identidades V = I·R y P = V·I.
            </p>
          </Articulo>
          <Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['v', 'Tensión (V)'],
                ['i', 'Corriente (A)'],
                ['r', 'Resistencia (Ω)'],
                ['p', 'Potencia (W)']
              ].map(([k, lab]) => (
                <div key={k}>
                  <label htmlFor={`ohm-${k}`} className={labelClass}>
                    {lab}
                  </label>
                  <input
                    id={`ohm-${k}`}
                    className={inputClass}
                    value={q[k]}
                    onChange={e => setQ({ [k]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </Campo>
          {ohm && !ohm.error && (
            <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
              <dl className="space-y-3 text-sm">
                <Fila etiqueta="V" valor={`${formatearNumero(ohm.v, 4)} V`} />
                <Fila etiqueta="I" valor={`${formatearNumero(ohm.i, 4)} A`} />
                <Fila etiqueta="R" valor={`${formatearNumero(ohm.r, 4)} Ω`} />
                <Fila
                  etiqueta="P"
                  valor={`${formatearNumero(ohm.p, 4)} W`}
                  resaltar
                />
              </dl>
            </div>
          )}
          {ohm?.error && <Nota>{ohm.error}</Nota>}
        </>
      )}
      {q.tab === 'colores' && (
        <>
          <Campo>
            <label htmlFor="bandas" className={labelClass}>
              Bandas
            </label>
            <select
              id="bandas"
              className={inputClass}
              value={q.bandas}
              onChange={e => setQ({ bandas: e.target.value })}
            >
              <option value="4">4 bandas</option>
              <option value="5">5 bandas</option>
              <option value="6">6 bandas</option>
            </select>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {ids.map((_, i) => (
                <div key={i}>
                  <label className={labelClass} htmlFor={`banda-${i}`}>
                    Banda {i + 1}
                  </label>
                  <select
                    id={`banda-${i}`}
                    className={inputClass}
                    value={q[`b${i}`]}
                    onChange={e => setQ({ [`b${i}`]: e.target.value })}
                  >
                    {COLORES_RESISTENCIA.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <ResistenciaSvg ids={ids} />
            {desdeColor && (
              <dl className="mt-4 space-y-2 text-sm">
                <Fila
                  etiqueta="Valor"
                  valor={`${formatearNumero(desdeColor.ohm, 4)} Ω`}
                  resaltar
                />
                {desdeColor.tolerancia && (
                  <Fila
                    etiqueta="Tolerancia"
                    valor={`± ${formatearNumero(desdeColor.tolerancia, 2)} %`}
                  />
                )}
              </dl>
            )}
            <div className="mt-4">
              <label htmlFor="ohm-val" className={labelClass}>
                Valor (Ω) → colores
              </label>
              <input
                id="ohm-val"
                className={inputClass}
                value={q.ohm}
                onChange={e => {
                  const tolActual = COLORES_RESISTENCIA.find(
                    c => c.id === q[`b${nBandas - 1}`]
                  )?.tol
                  const idsNuevos = valorAColores(
                    parseNumero(e.target.value),
                    nBandas,
                    tolActual ?? 1
                  )
                  const patch = { ohm: e.target.value }
                  idsNuevos?.forEach((id, i) => {
                    patch[`b${i}`] = id
                  })
                  setQ(patch)
                }}
              />
            </div>
          </Campo>
        </>
      )}
      {q.tab === 'divisor' && (
        <>
          <Formula>
            <p>Vout = Vin · R2 / (R1 + R2)</p>
          </Formula>
          <Campo>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="vin">
                  Vin (V)
                </label>
                <input
                  id="vin"
                  className={inputClass}
                  value={q.vin}
                  onChange={e => setQ({ vin: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="r1">
                  R1 (Ω)
                </label>
                <input
                  id="r1"
                  className={inputClass}
                  value={q.r1}
                  onChange={e => setQ({ r1: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="r2">
                  R2 (Ω)
                </label>
                <input
                  id="r2"
                  className={inputClass}
                  value={q.r2}
                  onChange={e => setQ({ r2: e.target.value })}
                />
              </div>
            </div>
          </Campo>
          {divisor && (
            <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
              <dl className="space-y-3 text-sm">
                <Fila
                  etiqueta="Vout"
                  valor={`${formatearNumero(divisor.vout, 3)} V`}
                  resaltar
                />
                <Fila
                  etiqueta="Corriente de la rama"
                  valor={`${formatearNumero(divisor.corriente * 1000, 3)} mA`}
                />
                <Fila
                  etiqueta="Disipación R1"
                  valor={`${formatearNumero(divisor.pR1 * 1000, 2)} mW`}
                />
                <Fila
                  etiqueta="Disipación R2"
                  valor={`${formatearNumero(divisor.pR2 * 1000, 2)} mW`}
                />
              </dl>
            </div>
          )}
        </>
      )}
      {q.tab === 'lc' && (
        <>
          <Formula>
            <p>f = 1 / (2π √(L·C))</p>
          </Formula>
          <Articulo>
            <p>Ingresa dos de las tres: frecuencia (Hz), L (µH) y C (pF).</p>
          </Articulo>
          <Campo>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="lc-f">
                  f (Hz)
                </label>
                <input
                  id="lc-f"
                  className={inputClass}
                  value={q.f}
                  onChange={e => setQ({ f: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="lc-l">
                  L (µH)
                </label>
                <input
                  id="lc-l"
                  className={inputClass}
                  value={q.l}
                  onChange={e => setQ({ l: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="lc-c">
                  C (pF)
                </label>
                <input
                  id="lc-c"
                  className={inputClass}
                  value={q.c}
                  onChange={e => setQ({ c: e.target.value })}
                />
              </div>
            </div>
          </Campo>
          {lc && !lc.error && (
            <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
              <dl className="space-y-3 text-sm">
                <Fila etiqueta="f" valor={`${formatearNumero(lc.f, 3)} Hz`} />
                <Fila
                  etiqueta="L"
                  valor={`${formatearNumero(lc.l * 1e6, 3)} µH`}
                />
                <Fila
                  etiqueta="C"
                  valor={`${formatearNumero(lc.c * 1e12, 3)} pF`}
                  resaltar
                />
              </dl>
            </div>
          )}
          {lc?.error && <Nota>{lc.error}</Nota>}
        </>
      )}
    </CalculadoraLayout>
  )
}

export default Electronica
