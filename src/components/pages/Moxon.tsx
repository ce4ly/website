import { useState } from 'react'

import {
  esPositivo,
  formatearLongitud,
  frecuenciaValida,
  moxonCebik,
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
import Diagrama, { Alambre, Alimentacion, CotaSvg, Punta } from '../calculadora/Diagrama'

const MoxonDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena Moxon (vista cenital)'
    viewBox='0 0 340 280'
    pie='Vista cenital (no a escala). Las letras coinciden con las medidas.'
  >
    {/* Reflector (lado posterior) y sus colas D */}
    <Alambre x1={70} y1={36} x2={270} y2={36} />
    <Alambre x1={70} y1={36} x2={70} y2={88} />
    <Alambre x1={270} y1={36} x2={270} y2={88} />
    <Punta cx={70} cy={88} />
    <Punta cx={270} cy={88} />

    {/* Colas B y excitado A, alimentado en el centro */}
    <Alambre x1={70} y1={132} x2={70} y2={200} />
    <Alambre x1={270} y1={132} x2={270} y2={200} />
    <Punta cx={70} cy={132} />
    <Punta cx={270} cy={132} />
    <Alambre x1={70} y1={200} x2={158} y2={200} />
    <Alambre x1={182} y1={200} x2={270} y2={200} />
    <Alimentacion cx={170} cy={200} />

    <CotaSvg x1={70} y1={232} x2={270} y2={232} letra='A' lx={170} ly={250} />
    <CotaSvg x1={48} y1={132} x2={48} y2={200} letra='B' lx={36} ly={172} />
    <CotaSvg x1={48} y1={88} x2={48} y2={132} letra='C' lx={36} ly={116} />
    <CotaSvg x1={48} y1={36} x2={48} y2={88} letra='D' lx={36} ly={68} />
    <CotaSvg x1={300} y1={36} x2={300} y2={200} letra='E' lx={318} ly={124} />
  </Diagrama>
)

const Moxon = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('2')
  const mhz = parseNumero(frecuencia)
  const d = parseNumero(diametro)
  const m = frecuenciaValida(mhz) && esPositivo(d) ? moxonCebik(mhz, d) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora Moxon'
      intro='Rectángulo de Moxon con las ecuaciones de Cebik (W4RNL): directiva compacta de 2 elementos y cerca de 50 Ω.'
    >
      <Articulo titulo='A, B, C, D y E'>
        <p className='text-justify'>
          La Moxon dobla las puntas del excitado y del reflector hasta casi tocarse. Cabe en menos
          de la mitad del vano de una yagi de 2 elementos, da ~6 dBi y un F/B notable, y se alimenta
          en 50 Ω. Las cotas dependen del diámetro del alambre o tubo.
        </p>
        <MoxonDiagrama />
        <Formula>
          <p>A = ancho (excitado) &nbsp; E = profundidad (B+C+D)</p>
          <p>B = cola del excitado &nbsp; C = gap &nbsp; D = cola del reflector</p>
        </Formula>
        <Nota>
          Coeficientes de Cebik / MoxGen. Válidos sobre todo con el mismo diámetro en todo el
          rectángulo. D1 = log₁₀(d/λ).
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='mx-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='mx-d'
          etiqueta={<Cota letra='d'>Diámetro del conductor (mm)</Cota>}
          value={diametro}
          onChange={setDiametro}
        />
      </Campo>
      {m && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='A'>Ancho del excitado</Cota>}
            valor={formatearLongitud(m.A)}
          />
          <Fila
            etiqueta={<Cota letra='B'>Cola del excitado</Cota>}
            valor={formatearLongitud(m.B)}
          />
          <Fila
            etiqueta={<Cota letra='C'>Separación entre colas</Cota>}
            valor={formatearLongitud(m.C)}
          />
          <Fila
            etiqueta={<Cota letra='D'>Cola del reflector</Cota>}
            valor={formatearLongitud(m.D)}
          />
          <Fila
            etiqueta={<Cota letra='E'>Profundidad B+C+D</Cota>}
            valor={formatearLongitud(m.E)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Moxon
