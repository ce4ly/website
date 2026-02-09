import { useState } from 'react'

import {
  VELOCIDAD_LUZ,
  VF_ALAMBRE,
  formatearLongitudCm,
  frecuenciaValida,
  parseNumero,
  redondear,
} from '../../lib/calculadoras'
import { formatearFrecuenciaMhz } from '../../lib/repetidoras'
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
import PresetsRepetidoras from '../calculadora/PresetsRepetidoras'

const JPoleDiagrama = () => (
  <Diagrama titulo='Diagrama esquemático de antena J-Pole' viewBox='0 0 260 280' ancho='max-w-sm'>
    {/* L: radiador λ/2, S: stub λ/4 y base en cortocircuito */}
    <Alambre x1={110} y1={24} x2={110} y2={220} />
    <Punta cx={110} cy={24} />
    <Alambre x1={160} y1={122} x2={160} y2={220} />
    <Punta cx={160} cy={122} />
    <Alambre x1={110} y1={220} x2={160} y2={220} />

    {/* F: alimentación, ~20 % de S desde la base */}
    <Alimentacion cx={110} cy={200} r={5} />
    <Alimentacion cx={160} cy={200} r={5} />

    <CotaSvg x1={48} y1={24} x2={48} y2={220} letra='L' lx={36} ly={128} />
    <CotaSvg x1={200} y1={122} x2={200} y2={220} letra='S' lx={214} ly={176} />
    <CotaSvg x1={135} y1={200} x2={135} y2={220} letra='F' lx={135} ly={194} />
  </Diagrama>
)

/** Medidas en cm: radiador λ/2, stub λ/4 y punto de alimentación al 20 % del stub. */
const calcularJPole = (mhz: number) => {
  const stub = redondear(((VF_ALAMBRE * 75) / mhz) * 100, 1)
  return {
    radiador: redondear(((VF_ALAMBRE * 150) / mhz) * 100, 1),
    stub,
    alimentacion: redondear(stub * 0.2, 1),
    longitudOnda: (VELOCIDAD_LUZ / mhz) * 100,
  }
}

const JPole = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const medidas = frecuenciaValida(mhz) ? calcularJPole(mhz) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora de J-Pole'
      intro='Calcula las dimensiones de una antena J-Pole a partir de la frecuencia de operación deseada.'
    >
      <Articulo titulo='¿Qué es una J-Pole?'>
        <p className='text-justify'>
          La J-Pole es una antena vertical de polarización vertical, muy popular en VHF y UHF. Se
          compone de dos conductores paralelos: un elemento radiador de media onda (λ/2) y un stub
          de adaptación de cuarto de onda (λ/4) cortocircuitado en su extremo inferior. Su nombre
          proviene de la forma en «J» que adoptan ambos elementos vistos de lado.
        </p>
        <JPoleDiagrama />
        <p className='text-justify'>
          La alimentación se realiza en el punto de unión entre ambos conductores, donde la
          impedancia se aproxima a 50 Ω. Ofrece radiación omnidireccional en azimut, es sencilla de
          construir con tubo de cobre o cable rígido, y se usa habitualmente en repetidores y
          estaciones fijas en 2 m y 70 cm. Las fórmulas prácticas de construcción son:
        </p>
        <Formula>
          <p>L (m) ≈ 142,5 / f (MHz)</p>
          <p>S (m) ≈ 71 / f (MHz)</p>
          <p>F ≈ 0,2 × S</p>
        </Formula>
        <Nota>
          Se aplica un factor de velocidad de 0,95. F se mide desde la base del stub; ajústelo con
          un analizador o medidor SWR para la mejor coincidencia de impedancia.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='jpole-frecuencia'
          etiqueta='Frecuencia de operación (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        >
          <PresetsRepetidoras
            onSelect={(r) => setFrecuencia(formatearFrecuenciaMhz(r.frecuenciaMhz))}
          />
        </CampoNumero>
      </Campo>

      {medidas && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='L'>Elemento radiador (λ/2)</Cota>}
            valor={formatearLongitudCm(medidas.radiador)}
          />
          <Fila
            etiqueta={<Cota letra='S'>Stub de adaptación (λ/4)</Cota>}
            valor={formatearLongitudCm(medidas.stub)}
          />
          <Fila
            etiqueta={<Cota letra='F'>Alimentación (desde la base)</Cota>}
            valor={formatearLongitudCm(medidas.alimentacion)}
          />
          <Fila
            etiqueta={<Cota letra='λ'>Longitud de onda</Cota>}
            valor={formatearLongitudCm(medidas.longitudOnda)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default JPole
