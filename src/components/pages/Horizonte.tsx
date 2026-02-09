import { useQueryState } from '../../hooks/useQueryState'
import { horizonteRadioKm, presupuestoEnlace, wattsADbm } from '../../lib/calc/horizonte'
import { formatearNumero, parseNumero } from '../../lib/calculadoras'
import { formatearFrecuenciaMhz } from '../../lib/repetidoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, labelClass } from '../calculadora/Campos'
import Pestanas from '../calculadora/Pestanas'
import PresetsRepetidoras from '../calculadora/PresetsRepetidoras'

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
  sens: '-120',
}

type Parametro = keyof typeof DEFAULTS

const PESTANAS = [
  { id: 'horizonte', label: 'Horizonte' },
  { id: 'enlace', label: 'Presupuesto de enlace' },
] as const

/** Campos del presupuesto de enlace después de frecuencia y distancia, en orden de pantalla. */
const CAMPOS_ENLACE: readonly { id: Parametro; etiqueta: string }[] = [
  { id: 'ptx', etiqueta: 'Potencia TX (W)' },
  { id: 'sens', etiqueta: 'Sensibilidad RX (dBm)' },
  { id: 'gtx', etiqueta: 'Ganancia TX (dBi)' },
  { id: 'grx', etiqueta: 'Ganancia RX (dBi)' },
  { id: 'ltx', etiqueta: 'Pérdida cable TX (dB)' },
  { id: 'lrx', etiqueta: 'Pérdida cable RX (dB)' },
]

const Horizonte = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const campo = (id: Parametro) => ({
    value: q[id],
    onChange: (valor: string) => setQ({ [id]: valor }),
  })

  const h1 = parseNumero(q.h1)
  const h2 = parseNumero(q.h2)
  const alcance = h1 !== null && h2 !== null ? horizonteRadioKm(h1, h2) : null
  const f = parseNumero(q.f)
  // Sin distancia escrita se usa el alcance de línea de vista.
  const d = parseNumero(q.d) ?? alcance
  const ptxW = parseNumero(q.ptx)
  const ptxDbm = ptxW !== null ? wattsADbm(ptxW) : null
  const enlace =
    ptxDbm !== null && f !== null && d !== null
      ? presupuestoEnlace({
          ptxDbm,
          gtxDbi: parseNumero(q.gtx),
          lcableTxDb: parseNumero(q.ltx),
          fMhz: f,
          dKm: d,
          grxDbi: parseNumero(q.grx),
          lcableRxDb: parseNumero(q.lrx),
          sensibilidadDbm: parseNumero(q.sens),
        })
      : null

  return (
    <CalculadoraLayout
      titulo='Alcance y Presupuesto de Enlace'
      intro='Horizonte radioeléctrico con refracción estándar (k = 4/3) y pérdidas de espacio libre. Punto de partida: el relieve del Maule suele mandar más que el horizonte.'
    >
      <Pestanas valor={q.tab} onChange={(tab) => setQ({ tab })} items={PESTANAS} />
      {q.tab === 'horizonte' && (
        <>
          <Articulo titulo='Línea de vista con k = 4/3'>
            <Formula>
              <p>d (km) ≈ 4,12 × (√h1 + √h2)</p>
            </Formula>
            <p className='text-justify'>
              El modelo asume terreno despejado y refracción estándar. No considera cerros, bosques
              ni curvatura local: en la zona del Maule la obstrucción por relieve suele ser el
              factor dominante.
            </p>
          </Articulo>
          <Campo>
            <div className='grid gap-4 sm:grid-cols-2'>
              <CampoNumero id='h1' etiqueta='Altura antena propia (m)' {...campo('h1')} />
              <CampoNumero id='h2' etiqueta='Altura antena contraparte (m)' {...campo('h2')} />
            </div>
          </Campo>
          {alcance !== null && (
            <Resultado titulo={null}>
              <Fila
                etiqueta='Alcance de línea de vista'
                valor={`${formatearNumero(alcance, 1)} km`}
                resaltar
              />
            </Resultado>
          )}
        </>
      )}
      {q.tab === 'enlace' && (
        <>
          <Articulo titulo='Pérdida de espacio libre'>
            <Formula>
              <p>FSPL (dB) = 32,44 + 20·log10(f MHz) + 20·log10(d km)</p>
              <p>Prx = Ptx + Gtx − Lcable tx − FSPL + Grx − Lcable rx</p>
            </Formula>
            <Nota>
              El presupuesto ignora desvanecimiento, polarización y obstáculos. Recorte expectativas
              con un estudio de perfil de terreno.
            </Nota>
          </Articulo>
          <Campo>
            <p className={labelClass}>Presets de repetidora</p>
            <PresetsRepetidoras
              onSelect={(r) => setQ({ f: formatearFrecuenciaMhz(r.frecuenciaMhz) })}
            />
            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <CampoNumero id='f-enlace' etiqueta='Frecuencia (MHz)' {...campo('f')} />
              <CampoNumero
                id='d-enlace'
                etiqueta='Distancia (km)'
                placeholder={alcance ? formatearNumero(alcance, 1) : 'Ej: 25'}
                {...campo('d')}
              />
              {CAMPOS_ENLACE.map(({ id, etiqueta }) => (
                <CampoNumero key={id} id={id} etiqueta={etiqueta} {...campo(id)} />
              ))}
            </div>
          </Campo>
          {enlace && (
            <Resultado titulo={null}>
              <Fila etiqueta='FSPL' valor={`${formatearNumero(enlace.fspl, 1)} dB`} />
              <Fila etiqueta='Potencia en RX' valor={`${formatearNumero(enlace.prx, 1)} dBm`} />
              {enlace.margen !== null && (
                <Fila
                  etiqueta='Margen sobre sensibilidad'
                  valor={`${formatearNumero(enlace.margen, 1)} dB`}
                  resaltar
                />
              )}
            </Resultado>
          )}
        </>
      )}
    </CalculadoraLayout>
  )
}

export default Horizonte
