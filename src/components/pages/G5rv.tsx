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
import { CampoNumero } from '../calculadora/Campos'
import Diagrama, {
  Alambre,
  Alimentacion,
  CotaSvg,
  Etiqueta,
  Linea,
  Punta,
  Rotulo,
} from '../calculadora/Diagrama'

/** Frecuencia para la que Louis Varney diseñó la G5RV (3λ/2 en 20 m). */
const MHZ_G5RV = 14.15

/** Línea de escalera bajo el centro del dipolo: dos conductores y sus separadores. */
const Escalera = ({ y1, y2, peldanos }: { y1: number; y2: number; peldanos: number[] }) => (
  <>
    <Linea x1={162} y1={y1} x2={162} y2={y2} strokeWidth={2} />
    <Linea x1={178} y1={y1} x2={178} y2={y2} strokeWidth={2} />
    {peldanos.map((y) => (
      <Linea key={y} x1={162} y1={y} x2={178} y2={y} />
    ))}
  </>
)

/** Dipolo de dos brazos con alimentación central, a la altura `y`. */
const DipoloCentral = ({ y }: { y: number }) => (
  <>
    <Alambre x1={24} y1={y} x2={158} y2={y} />
    <Alambre x1={182} y1={y} x2={316} y2={y} />
    <Punta cx={24} cy={y} />
    <Punta cx={316} cy={y} />
    <Alimentacion cx={170} cy={y} r={6} />
  </>
)

const G5rvDiagrama = () => (
  <Diagrama titulo='Diagrama esquemático de G5RV y doble Zepp extendida' viewBox='0 0 340 300'>
    {/* G5RV */}
    <CotaSvg x1={24} y1={22} x2={316} y2={22} letra='F' lx={170} ly={16} />
    <DipoloCentral y={48} />
    <Escalera y1={54} y2={118} peldanos={[68, 88, 108]} />
    <CotaSvg x1={198} y1={54} x2={198} y2={118} letra='E' lx={214} ly={90} />
    <Linea x1={166} y1={118} x2={166} y2={148} strokeWidth={2} />
    <Linea x1={174} y1={118} x2={174} y2={148} strokeWidth={2} />
    <Rotulo x={184} y={142}>
      coaxial
    </Rotulo>
    <Rotulo x={36} y={142}>
      G5RV
    </Rotulo>

    {/* Doble Zepp extendida */}
    <Rotulo x={36} y={178}>
      EDZ
    </Rotulo>
    <CotaSvg x1={24} y1={190} x2={316} y2={190} letra='2Z' lx={170} ly={184} />
    <DipoloCentral y={214} />
    <Etiqueta x={91} y={208}>
      Z
    </Etiqueta>
    <Etiqueta x={249} y={208}>
      Z
    </Etiqueta>
    <Escalera y1={220} y2={268} peldanos={[234, 252]} />
    <CotaSvg x1={198} y1={220} x2={198} y2={268} letra='e' lx={214} ly={248} />
  </Diagrama>
)

const G5rv = () => {
  const [frecuencia, setFrecuencia] = useState('7,148')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  // La G5RV clásica (31,09 m + 10,36 m) escalada a la frecuencia pedida.
  const factor = ok ? MHZ_G5RV / mhz : 1
  const zeppBrazo = ok ? (0.64 * 300 * 0.95) / mhz : null

  return (
    <CalculadoraLayout
      titulo='G5RV y Doble Zepp Extendida'
      intro='Largos del flattop y de la línea de escalera: ahí es donde más se equivoca la gente.'
    >
      <Articulo titulo='G5RV clásica'>
        <p className='text-justify'>
          La G5RV de Louis Varney es un doublet de 31,09 m (102 ft) con 10,36 m (34 ft) de línea de
          300–450 Ω, y después coaxial de 50 Ω. El tramo de escalera es un transformador: no lo
          corte «a ojo» ni lo reemplace por coaxial. La original está pensada alrededor de 14,15 MHz
          como 3λ/2; aquí puede escalarla a otra frecuencia.
        </p>
        <G5rvDiagrama />
        <Formula>
          <p>F = 31,09 m &nbsp; E = 10,36 m (clásico, escalable)</p>
          <p>Z ≈ 0,64 λ × 0,95 &nbsp;&nbsp; 2Z = 2 × Z</p>
          <p>e ≈ 0,125 λ × 0,91</p>
        </Formula>
        <Nota>
          La doble Zepp extendida (EDZ) tiene algo más de 5/8 de onda por lado (≈ 0,64 λ) y se
          alimenta con escalera más acoplador. La línea de 1/8 λ (VF 0,91) es el punto de partida;
          el largo exacto se afina con el tuner.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='g5-f'
          etiqueta='Frecuencia de diseño (MHz) — la G5RV original es 14,15'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
      </Campo>
      {ok && zeppBrazo !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='F'>Flattop G5RV (3λ/2 escalado)</Cota>}
            valor={formatearLongitud(31.09 * factor)}
          />
          <Fila
            etiqueta={<Cota letra='E'>Línea de escalera G5RV</Cota>}
            valor={formatearLongitud(10.36 * factor)}
          />
          <Fila
            etiqueta={<Cota letra='Z'>Cada brazo EDZ (≈ 0,64 λ)</Cota>}
            valor={formatearLongitud(zeppBrazo)}
          />
          <Fila
            etiqueta={<Cota letra='2Z'>EDZ total</Cota>}
            valor={formatearLongitud(2 * zeppBrazo)}
          />
          <Fila
            etiqueta={<Cota letra='e'>Escalera EDZ (λ/8, VF 0,91)</Cota>}
            valor={formatearLongitud((0.125 * 300 * 0.91) / mhz)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default G5rv
