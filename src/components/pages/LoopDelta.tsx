import { useState } from 'react'

import { CABLES, formatearLongitud, frecuenciaValida, parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Cota,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, Selector } from '../calculadora/Campos'
import Diagrama, { Alimentacion, CotaSvg, Etiqueta, Linea } from '../calculadora/Diagrama'

/** Coaxiales de 75 Ω que sirven de línea Q (λ/4) para pasar de ~112 Ω a 50 Ω. */
const CABLES_75 = CABLES.filter((c) => c.id === 'rg59' || c.id === 'rg11')
const OPCIONES_CABLE = CABLES_75.map((c) => ({ value: c.id, label: `${c.nombre} (VF ${c.vf})` }))

const LoopDeltaDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de loop delta y cuadro de onda completa'
    viewBox='0 0 360 250'
  >
    {/* Cota P alrededor del delta */}
    <polyline
      points='100,16 8,176 192,176 100,16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1'
    />
    <Etiqueta x={100} y={12}>
      P
    </Etiqueta>

    {/* Triángulo delta, alimentado en el lado inferior */}
    <polygon
      points='100,36 28,168 172,168'
      fill='none'
      stroke='currentColor'
      strokeWidth='5'
      strokeLinejoin='round'
    />
    <Alimentacion cx={100} cy={168} r={6} />
    <CotaSvg x1={28} y1={196} x2={172} y2={196} letra='a' lx={100} ly={214} />

    {/* Línea Q */}
    <Linea x1={94} y1={174} x2={94} y2={236} strokeWidth={2} />
    <Linea x1={106} y1={174} x2={106} y2={236} strokeWidth={2} />
    <Etiqueta x={118} y={232} textAnchor='start'>
      Q
    </Etiqueta>

    {/* Cuadro */}
    <rect
      x='230'
      y='70'
      width='88'
      height='88'
      fill='none'
      stroke='currentColor'
      strokeWidth='5'
      strokeLinejoin='round'
    />
    <CotaSvg x1={334} y1={70} x2={334} y2={158} letra='c' lx={348} ly={118} />
  </Diagrama>
)

const LoopDelta = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [cableId, setCableId] = useState('rg59')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const perimetro = ok ? 306.3 / mhz : null
  const cable = CABLES_75.find((c) => c.id === cableId) ?? CABLES_75[0]

  return (
    <CalculadoraLayout
      titulo='Loop Delta / Cuadro de Onda Completa'
      intro='Perímetro, lados, punto de alimentación según polarización y tramo de λ/4 de 75 Ω para adaptar a 50 Ω.'
    >
      <Articulo titulo='Cuadro y delta'>
        <p className='text-justify'>
          Un loop de una longitud de onda tiene unos 100–120 Ω. Un cuarto de onda de coaxial de 75 Ω
          (línea Q) adapta eso a 50 Ω porque Zq = √(112 × 50) ≈ 75 Ω. El cuadro es cuadrado; el
          delta, triangular.
        </p>
        <p className='text-justify'>
          Alimentación en el centro del lado inferior: polarización horizontal. En un vértice
          lateral o a un tercio de un lado vertical: aparece componente vertical, útil en DX.
        </p>
        <LoopDeltaDiagrama />
        <Formula>
          <p>P (m) ≈ 306 / f</p>
          <p>a = P / 3 &nbsp;&nbsp; c = P / 4</p>
          <p>Q (m) = VF × 75 / f</p>
        </Formula>
        <Nota>
          306/f equivale a 1005/f en pies. Dentro de PVC o cerca de tejados recorte un 1–3 %.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='loop-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <Selector
          id='loop-c'
          etiqueta={<Cota letra='Q'>Coaxial de 75 Ω para la línea Q</Cota>}
          value={cableId}
          onChange={setCableId}
          opciones={OPCIONES_CABLE}
        />
      </Campo>
      {ok && perimetro !== null && (
        <Resultado>
          <Fila etiqueta={<Cota letra='P'>Perímetro</Cota>} valor={formatearLongitud(perimetro)} />
          <Fila
            etiqueta={<Cota letra='a'>Lado del delta</Cota>}
            valor={formatearLongitud(perimetro / 3)}
          />
          <Fila
            etiqueta={<Cota letra='c'>Lado del cuadro</Cota>}
            valor={formatearLongitud(perimetro / 4)}
          />
          <Fila
            etiqueta={<Cota letra='Q'>Línea Q λ/4 ({cable.nombre})</Cota>}
            valor={formatearLongitud((cable.vf * 75) / mhz)}
          />
          <Fila etiqueta='Alimentación horizontal' valor='Centro del lado inferior' resaltar />
          <Fila etiqueta='Alimentación más vertical' valor='Vértice o lado vertical' />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default LoopDelta
