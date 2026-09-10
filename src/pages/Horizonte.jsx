import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota
} from '../components/CalculadoraLayout.jsx'
import Pestanas from '../components/Pestanas.jsx'
import PresetsRepetidoras from '../components/PresetsRepetidoras.jsx'
import { useQueryState } from '../hooks/useQueryState.js'
import {
  horizonteRadioKm,
  presupuestoEnlace,
  wattsADbm
} from '../lib/calc/horizonte.js'
import { inputClass, labelClass, parseNumero } from '../lib/calculadoras.js'
import { formatearFrecuenciaMhz } from '../lib/repetidoras.js'
import { formatearNumero } from '../lib/calculadoras.js'
import { meta as routeMeta } from '../lib/meta.js'

const DEFAULTS = {
  tab: 'horizonte',
  h1: '10',
  h2: '10',
  f: '146,380',
  d: '',
  ptx: '50',
  gtx: '0',
  ltx: '0,5',
  grx: '0',
  lrx: '0,5',
  sens: '-120'
}

export const meta = () => routeMeta({ location: '/calculadoras/horizonte' })

const Horizonte = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const h1 = parseNumero(q.h1)
  const h2 = parseNumero(q.h2)
  const alcance = h1 !== null && h2 !== null ? horizonteRadioKm(h1, h2) : null
  const f = parseNumero(q.f)
  const d = parseNumero(q.d) ?? alcance
  const ptxW = parseNumero(q.ptx)
  const ptxDbm = ptxW !== null ? wattsADbm(ptxW) : null
  const enlace =
    ptxDbm !== null && f !== null && d !== null
      ? presupuestoEnlace({
          ptxDbm,
          gtxDbi: parseNumero(q.gtx) || 0,
          lcableTxDb: parseNumero(q.ltx) || 0,
          fMhz: f,
          dKm: d,
          grxDbi: parseNumero(q.grx) || 0,
          lcableRxDb: parseNumero(q.lrx) || 0,
          sensibilidadDbm: parseNumero(q.sens)
        })
      : null

  return (
    <CalculadoraLayout
      titulo="Alcance y Presupuesto de Enlace"
      intro="Horizonte radioeléctrico con refracción estándar (k = 4/3) y pérdidas de espacio libre. Punto de partida: el relieve del Maule suele mandar más que el horizonte."
    >
      <Pestanas
        valor={q.tab}
        onChange={tab => setQ({ tab })}
        items={[
          { id: 'horizonte', label: 'Horizonte' },
          { id: 'enlace', label: 'Presupuesto de enlace' }
        ]}
      />
      {q.tab === 'horizonte' && (
        <>
          <Articulo titulo="Línea de vista con k = 4/3">
            <Formula>
              <p>d (km) ≈ 4,12 × (√h1 + √h2)</p>
            </Formula>
            <p className="text-justify">
              El modelo asume terreno despejado y refracción estándar. No
              considera cerros, bosques ni curvatura local: en la zona del Maule
              la obstrucción por relieve suele ser el factor dominante.
            </p>
          </Articulo>
          <Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="h1" className={labelClass}>
                  Altura antena propia (m)
                </label>
                <input
                  id="h1"
                  className={inputClass}
                  value={q.h1}
                  onChange={e => setQ({ h1: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="h2" className={labelClass}>
                  Altura antena contraparte (m)
                </label>
                <input
                  id="h2"
                  className={inputClass}
                  value={q.h2}
                  onChange={e => setQ({ h2: e.target.value })}
                />
              </div>
            </div>
          </Campo>
          {alcance !== null && (
            <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
              <dl className="space-y-3 text-sm">
                <Fila
                  etiqueta="Alcance de línea de vista"
                  valor={`${formatearNumero(alcance, 1)} km`}
                  resaltar
                />
              </dl>
            </div>
          )}
        </>
      )}
      {q.tab === 'enlace' && (
        <>
          <Articulo titulo="Pérdida de espacio libre">
            <Formula>
              <p>FSPL (dB) = 32,44 + 20·log10(f MHz) + 20·log10(d km)</p>
              <p>Prx = Ptx + Gtx − Lcable tx − FSPL + Grx − Lcable rx</p>
            </Formula>
            <Nota>
              El presupuesto ignora desvanecimiento, polarización y obstáculos.
              Recorte expectativas con un estudio de perfil de terreno.
            </Nota>
          </Articulo>
          <Campo>
            <label className={labelClass}>Presets de repetidora</label>
            <PresetsRepetidoras
              onSelect={r =>
                setQ({ f: formatearFrecuenciaMhz(r.frecuenciaMhz) })
              }
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="f-enlace" className={labelClass}>
                  Frecuencia (MHz)
                </label>
                <input
                  id="f-enlace"
                  className={inputClass}
                  value={q.f}
                  onChange={e => setQ({ f: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="d-enlace" className={labelClass}>
                  Distancia (km)
                </label>
                <input
                  id="d-enlace"
                  className={inputClass}
                  value={q.d}
                  onChange={e => setQ({ d: e.target.value })}
                  placeholder={alcance ? formatearNumero(alcance, 1) : 'Ej: 25'}
                />
              </div>
              <div>
                <label htmlFor="ptx" className={labelClass}>
                  Potencia TX (W)
                </label>
                <input
                  id="ptx"
                  className={inputClass}
                  value={q.ptx}
                  onChange={e => setQ({ ptx: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="sens" className={labelClass}>
                  Sensibilidad RX (dBm)
                </label>
                <input
                  id="sens"
                  className={inputClass}
                  value={q.sens}
                  onChange={e => setQ({ sens: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="gtx" className={labelClass}>
                  Ganancia TX (dBi)
                </label>
                <input
                  id="gtx"
                  className={inputClass}
                  value={q.gtx}
                  onChange={e => setQ({ gtx: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="grx" className={labelClass}>
                  Ganancia RX (dBi)
                </label>
                <input
                  id="grx"
                  className={inputClass}
                  value={q.grx}
                  onChange={e => setQ({ grx: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="ltx" className={labelClass}>
                  Pérdida cable TX (dB)
                </label>
                <input
                  id="ltx"
                  className={inputClass}
                  value={q.ltx}
                  onChange={e => setQ({ ltx: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="lrx" className={labelClass}>
                  Pérdida cable RX (dB)
                </label>
                <input
                  id="lrx"
                  className={inputClass}
                  value={q.lrx}
                  onChange={e => setQ({ lrx: e.target.value })}
                />
              </div>
            </div>
          </Campo>
          {enlace && (
            <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
              <dl className="space-y-3 text-sm">
                <Fila
                  etiqueta="FSPL"
                  valor={`${formatearNumero(enlace.fspl, 1)} dB`}
                />
                <Fila
                  etiqueta="Potencia en RX"
                  valor={`${formatearNumero(enlace.prx, 1)} dBm`}
                />
                {enlace.margen !== null && (
                  <Fila
                    etiqueta="Margen sobre sensibilidad"
                    valor={`${formatearNumero(enlace.margen, 1)} dB`}
                    resaltar
                  />
                )}
              </dl>
            </div>
          )}
        </>
      )}
    </CalculadoraLayout>
  )
}

export default Horizonte
