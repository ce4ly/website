import { useQueryState } from '../../hooks/useQueryState'
import {
  COLORES_RESISTENCIA,
  coloresAValor,
  divisorTension,
  leyOhm,
  resonanciaLc,
  valorAColores,
} from '../../lib/calc/electronica'
import { formatearNumero, parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, Selector } from '../calculadora/Campos'
import Pestanas from '../calculadora/Pestanas'

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
  c: '',
}

type Parametro = keyof typeof DEFAULTS

const PESTANAS = [
  { id: 'ohm', label: 'Ley de Ohm' },
  { id: 'colores', label: 'Resistencias' },
  { id: 'divisor', label: 'Divisor' },
  { id: 'lc', label: 'Resonancia LC' },
] as const

const CAMPOS_OHM: readonly [Parametro, string][] = [
  ['v', 'Tensión (V)'],
  ['i', 'Corriente (A)'],
  ['r', 'Resistencia (Ω)'],
  ['p', 'Potencia (W)'],
]

/** Campo del query string de cada banda de color (b0 … b5). */
const BANDAS = ['b0', 'b1', 'b2', 'b3', 'b4', 'b5'] as const

const OPCIONES_BANDAS = [
  { value: '4', label: '4 bandas' },
  { value: '5', label: '5 bandas' },
  { value: '6', label: '6 bandas' },
]

const OPCIONES_COLOR = COLORES_RESISTENCIA.map((c) => ({ value: c.id, label: c.nombre }))

/** Valor escalado (µH → H, pF → F) o `null` si el campo está vacío. */
const escalar = (texto: string, factor: number) => {
  const valor = parseNumero(texto)
  return valor !== null ? valor * factor : null
}

const ResistenciaSvg = ({ ids }: { ids: readonly string[] }) => {
  const x0 = 40
  const anchoBanda = 12
  const separacion = 10
  return (
    <svg viewBox='0 0 260 80' className='h-20 w-full max-w-sm' role='img'>
      <title>Resistencia de {ids.length} bandas</title>
      <line x1='8' y1='40' x2='252' y2='40' stroke='currentColor' strokeWidth='3' />
      <rect
        x='28'
        y='18'
        width='204'
        height='44'
        rx='12'
        className='fill-amber-100 stroke-stone-400 dark:fill-amber-200/80'
      />
      {ids.map((id, i) => (
        <rect
          key={i}
          x={x0 + i * (anchoBanda + separacion)}
          y='18'
          width={anchoBanda}
          height='44'
          fill={COLORES_RESISTENCIA.find((c) => c.id === id)?.hex ?? '#78716c'}
        />
      ))}
    </svg>
  )
}

const Electronica = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const campo = (id: Parametro) => ({
    value: q[id],
    onChange: (valor: string) => setQ({ [id]: valor }),
  })

  const ohm = leyOhm({
    v: parseNumero(q.v),
    i: parseNumero(q.i),
    r: parseNumero(q.r),
    p: parseNumero(q.p),
  })
  const nBandas = Number(q.bandas) || 4
  const bandas = BANDAS.slice(0, nBandas)
  const ids = bandas.map((banda) => q[banda])
  const desdeColor = coloresAValor(nBandas, ids)
  const divisor = divisorTension({
    vin: parseNumero(q.vin),
    r1: parseNumero(q.r1),
    r2: parseNumero(q.r2),
  })
  const lc = resonanciaLc({ f: parseNumero(q.f), l: escalar(q.l, 1e-6), c: escalar(q.c, 1e-12) })

  /** Al escribir un valor en Ω, se eligen los colores que lo representan. */
  const cambiarValor = (texto: string) => {
    const tolActual = COLORES_RESISTENCIA.find((c) => c.id === q[BANDAS[nBandas - 1]])?.tol
    const valor = parseNumero(texto)
    const colores = valor !== null ? valorAColores(valor, nBandas, tolActual ?? 1) : null
    const patch: Partial<typeof DEFAULTS> = { ohm: texto }
    colores?.forEach((id, i) => {
      patch[BANDAS[i]] = id
    })
    setQ(patch)
  }

  return (
    <CalculadoraLayout
      titulo='Electrónica Básica'
      intro='Acompaña al curso de Electrónica Básica del club: Ohm, código de colores, divisor y resonancia LC.'
    >
      <Pestanas valor={q.tab} onChange={(tab) => setQ({ tab })} items={PESTANAS} />
      {q.tab === 'ohm' && (
        <>
          <Articulo>
            <p>
              Ingresa exactamente dos de V, I, R y P. Las otras dos salen de las identidades V = I·R
              y P = V·I.
            </p>
          </Articulo>
          <Campo>
            <div className='grid gap-4 sm:grid-cols-2'>
              {CAMPOS_OHM.map(([id, etiqueta]) => (
                <CampoNumero key={id} id={`ohm-${id}`} etiqueta={etiqueta} {...campo(id)} />
              ))}
            </div>
          </Campo>
          {'error' in ohm ? (
            <Nota>{ohm.error}</Nota>
          ) : (
            <Resultado titulo={null}>
              <Fila etiqueta='V' valor={`${formatearNumero(ohm.v, 4)} V`} />
              <Fila etiqueta='I' valor={`${formatearNumero(ohm.i, 4)} A`} />
              <Fila etiqueta='R' valor={`${formatearNumero(ohm.r, 4)} Ω`} />
              <Fila etiqueta='P' valor={`${formatearNumero(ohm.p, 4)} W`} resaltar />
            </Resultado>
          )}
        </>
      )}
      {q.tab === 'colores' && (
        <Campo>
          <Selector
            id='bandas'
            etiqueta='Bandas'
            value={q.bandas}
            onChange={(valor) => setQ({ bandas: valor })}
            opciones={OPCIONES_BANDAS}
          />
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {bandas.map((banda, i) => (
              <Selector
                key={banda}
                id={`banda-${i}`}
                etiqueta={`Banda ${i + 1}`}
                value={q[banda]}
                onChange={(valor) => setQ({ [banda]: valor })}
                opciones={OPCIONES_COLOR}
              />
            ))}
          </div>
          <ResistenciaSvg ids={ids} />
          {desdeColor && (
            <dl className='mt-4 space-y-2 text-sm'>
              <Fila etiqueta='Valor' valor={`${formatearNumero(desdeColor.ohm, 4)} Ω`} resaltar />
              {desdeColor.tolerancia !== null && (
                <Fila
                  etiqueta='Tolerancia'
                  valor={`± ${formatearNumero(desdeColor.tolerancia, 2)} %`}
                />
              )}
            </dl>
          )}
          <div className='mt-4'>
            <CampoNumero
              id='ohm-val'
              etiqueta='Valor (Ω) → colores'
              value={q.ohm}
              onChange={cambiarValor}
            />
          </div>
        </Campo>
      )}
      {q.tab === 'divisor' && (
        <>
          <Formula>
            <p>Vout = Vin · R2 / (R1 + R2)</p>
          </Formula>
          <Campo>
            <div className='grid gap-4 sm:grid-cols-3'>
              <CampoNumero id='vin' etiqueta='Vin (V)' {...campo('vin')} />
              <CampoNumero id='r1' etiqueta='R1 (Ω)' {...campo('r1')} />
              <CampoNumero id='r2' etiqueta='R2 (Ω)' {...campo('r2')} />
            </div>
          </Campo>
          {divisor && (
            <Resultado titulo={null}>
              <Fila etiqueta='Vout' valor={`${formatearNumero(divisor.vout, 3)} V`} resaltar />
              <Fila
                etiqueta='Corriente de la rama'
                valor={`${formatearNumero(divisor.corriente * 1000, 3)} mA`}
              />
              <Fila
                etiqueta='Disipación R1'
                valor={`${formatearNumero(divisor.pR1 * 1000, 2)} mW`}
              />
              <Fila
                etiqueta='Disipación R2'
                valor={`${formatearNumero(divisor.pR2 * 1000, 2)} mW`}
              />
            </Resultado>
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
            <div className='grid gap-4 sm:grid-cols-3'>
              <CampoNumero id='lc-f' etiqueta='f (Hz)' {...campo('f')} />
              <CampoNumero id='lc-l' etiqueta='L (µH)' {...campo('l')} />
              <CampoNumero id='lc-c' etiqueta='C (pF)' {...campo('c')} />
            </div>
          </Campo>
          {'error' in lc ? (
            <Nota>{lc.error}</Nota>
          ) : (
            <Resultado titulo={null}>
              <Fila etiqueta='f' valor={`${formatearNumero(lc.f, 3)} Hz`} />
              <Fila etiqueta='L' valor={`${formatearNumero(lc.l * 1e6, 3)} µH`} />
              <Fila etiqueta='C' valor={`${formatearNumero(lc.c * 1e12, 3)} pF`} resaltar />
            </Resultado>
          )}
        </>
      )}
    </CalculadoraLayout>
  )
}

export default Electronica
