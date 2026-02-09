import { useState } from 'react'

import {
  LARGO_MEDIA_ONDA,
  formatearLongitud,
  formatearNumero,
  frecuenciaValida,
  longitudOnda,
  parseNumero,
} from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Cota,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero } from '../calculadora/Campos'
import Diagrama, { Alambre, Alimentacion, CotaSvg, Punta, Rotulo } from '../calculadora/Diagrama'

const EfhwDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena EFHW con unun y contrapeso'
    viewBox='0 0 340 150'
  >
    {/* Contrapeso c y radiador L */}
    <Alambre x1={28} y1={68} x2={108} y2={68} />
    <Punta cx={28} cy={68} />
    <Alambre x1={144} y1={68} x2={316} y2={68} />
    <Punta cx={316} cy={68} />

    {/* Unun */}
    <rect x='108' y='52' width='36' height='32' fill='none' stroke='currentColor' strokeWidth='2' />
    <Rotulo x={126} y={46} textAnchor='middle'>
      unun
    </Rotulo>
    <Alimentacion cx={126} cy={68} r={6} />

    <CotaSvg x1={28} y1={100} x2={108} y2={100} letra='c' lx={68} ly={118} />
    <CotaSvg x1={144} y1={100} x2={316} y2={100} letra='L' lx={230} ly={118} />
  </Diagrama>
)

/** Múltiplos de media onda en los que el mismo alambre también resuena. */
const ARMONICOS = [1, 2, 3, 4, 5, 6, 8]

const Efhw = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const lambda = ok ? longitudOnda(mhz) : null
  const largo = ok ? LARGO_MEDIA_ONDA / mhz : null

  return (
    <CalculadoraLayout
      titulo='Calculadora EFHW 49:1'
      intro='End-fed half-wave con unun 49:1: largo del radiador, contrapeso y tramos armónicos.'
    >
      <Articulo titulo='¿Qué es una EFHW?'>
        <p className='text-justify'>
          Una media onda alimentada por el extremo. La impedancia en esa punta es del orden de 2–5
          kΩ; el unun 49:1 (relación de espiras 7:1) la acerca a 50 Ω (50 × 49 = 2450 Ω). Es la
          antena portable de HF más usada hoy: un mástil, un alambre y un pequeño transformador.
        </p>

        <EfhwDiagrama />

        <Formula>
          <p>L (m) ≈ 142,5 / f</p>
          <p>c₁ ≈ 0,05 λ &nbsp;&nbsp; c₂ ≈ 0,10 λ</p>
        </Formula>
        <Nota>
          El unun típico lleva 2 espiras en el primario y 14 en el secundario sobre ferita FT240-43
          (HF). El contrapeso no es opcional: sin él el coaxial irradia. Recorte el alambre con
          analizador; en multibanda el largo se fija en la banda más baja.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='efhw-f'
          etiqueta='Frecuencia de media onda (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
      </Campo>

      {ok && lambda !== null && largo !== null && (
        <Resultado>
          <Fila etiqueta={<Cota letra='L'>Radiador (λ/2)</Cota>} valor={formatearLongitud(largo)} />
          <Fila
            etiqueta={<Cota letra='c₁'>Contrapeso corto (0,05 λ)</Cota>}
            valor={formatearLongitud(0.05 * lambda)}
          />
          <Fila
            etiqueta={<Cota letra='c₂'>Contrapeso cómodo (0,10 λ)</Cota>}
            valor={formatearLongitud(0.1 * lambda)}
          />
          <Fila etiqueta='Impedancia del unun' valor='2450 Ω (49:1)' resaltar />
          {ARMONICOS.map((n) => (
            <Fila
              key={n}
              etiqueta={`${n} × λ/2  (${formatearNumero(n * mhz, 3)} MHz)`}
              valor={formatearLongitud(n * largo)}
            />
          ))}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Efhw
