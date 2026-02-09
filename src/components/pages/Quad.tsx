import { useState } from 'react'

import { formatearLongitud, frecuenciaValida, parseNumero } from '../../lib/calculadoras'
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
import Diagrama, { Alimentacion, CotaSvg, Etiqueta } from '../calculadora/Diagrama'

/** Un elemento de la quad, visto de frente: un cuadro de alambre. */
const Cuadro = ({ x, y, lado }: { x: number; y: number; lado: number }) => (
  <rect x={x} y={y} width={lado} height={lado} fill='none' stroke='currentColor' strokeWidth='5' />
)

const QuadDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de cuadro cúbico (quad)'
    viewBox='0 0 360 230'
    pie='Vista esquemática (no a escala). Las letras coinciden con las medidas.'
  >
    {/* Reflector R (más grande, atrás), excitado E y director Dir (más chico) */}
    <Cuadro x={28} y={36} lado={100} />
    <Etiqueta x={78} y={28}>
      R
    </Etiqueta>
    <Cuadro x={148} y={46} lado={80} />
    <Alimentacion cx={188} cy={126} />
    <Etiqueta x={188} y={38}>
      E
    </Etiqueta>
    <Cuadro x={256} y={56} lado={60} />
    <Etiqueta x={286} y={48}>
      Dir
    </Etiqueta>

    <CotaSvg x1={128} y1={168} x2={148} y2={168} letra='s' lx={138} ly={186} />
    <CotaSvg x1={228} y1={168} x2={256} y2={168} letra='s' lx={242} ly={186} />
  </Diagrama>
)

const OPCIONES_ELEMENTOS = [
  { value: '2', label: '2 (reflector + excitado)' },
  { value: '3', label: '3 (+ director)' },
  { value: '4', label: '4 (+ 2 directores)' },
] as const

type Elementos = (typeof OPCIONES_ELEMENTOS)[number]['value']

/** «perímetro / lado» de un cuadro. */
const perimetroYLado = (perimetro: number) =>
  `${formatearLongitud(perimetro)} / ${formatearLongitud(perimetro / 4)}`

const Quad = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [elementos, setElementos] = useState<Elementos>('2')
  const mhz = parseNumero(frecuencia)
  const n = Number(elementos)
  const ok = frecuenciaValida(mhz)
  const director = ok ? 297.2 / mhz : null

  return (
    <CalculadoraLayout
      titulo='Cuadro Cúbico (Quad)'
      intro='Perímetros de reflector, radiador y director, y el espaciado típico de 0,20 λ.'
    >
      <Articulo titulo='Loops en fase'>
        <p className='text-justify'>
          Cada elemento es un cuadro de aproximadamente una onda. El reflector es un 2,5 % más
          grande y el director un 3 % más chico. Dos elementos ya son una directiva seria en HF;
          tres o cuatro en VHF.
        </p>
        <QuadDiagrama />
        <Formula>
          <p>E ≈ 306 / f &nbsp; R ≈ 314 / f &nbsp; Dir ≈ 297 / f</p>
          <p>s ≈ 0,20 λ</p>
        </Formula>
        <Nota>
          Equivale a 1005/f, 1030/f y 975/f en pies. Alimente el cuadro excitado en el centro del
          lado inferior (H) o en un lado (V).
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='q-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <Selector
          id='q-n'
          etiqueta='Elementos'
          value={elementos}
          onChange={setElementos}
          opciones={OPCIONES_ELEMENTOS}
        />
      </Campo>
      {ok && director !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='R'>Reflector (perímetro / lado)</Cota>}
            valor={perimetroYLado(313.9 / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='E'>Excitado (perímetro / lado)</Cota>}
            valor={perimetroYLado(306.3 / mhz)}
          />
          {n >= 3 && (
            <Fila
              etiqueta={<Cota letra='Dir'>Director (perímetro / lado)</Cota>}
              valor={perimetroYLado(director)}
            />
          )}
          {n >= 4 && (
            <Fila
              etiqueta='2.º director (~1 % más corto)'
              valor={perimetroYLado(director * 0.99)}
            />
          )}
          <Fila
            etiqueta={<Cota letra='s'>Espacio entre cuadros</Cota>}
            valor={formatearLongitud((0.2 * 300) / mhz)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Quad
