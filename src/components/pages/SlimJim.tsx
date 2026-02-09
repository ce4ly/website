import { useState } from 'react'

import {
  VELOCIDAD_LUZ,
  VF_ALAMBRE,
  formatearFijo,
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
import Diagrama, { Alambre, Alimentacion, CotaSvg, Etiqueta, Linea } from '../calculadora/Diagrama'
import PresetsRepetidoras from '../calculadora/PresetsRepetidoras'

const SlimJimDiagrama = () => (
  <Diagrama titulo='Diagrama esquemático de antena Slim Jim' viewBox='0 0 280 300' ancho='max-w-sm'>
    {/* Conductor continuo, radiador L, unión superior, stub S y base en cortocircuito */}
    <Alambre x1={118} y1={28} x2={118} y2={236} />
    <Alambre x1={168} y1={28} x2={168} y2={152} />
    <Alambre x1={118} y1={28} x2={168} y2={28} />
    <Alambre x1={168} y1={172} x2={168} y2={236} />
    <Alambre x1={118} y1={236} x2={168} y2={236} />

    {/* G: gap */}
    <Linea x1={180} y1={154} x2={180} y2={170} strokeWidth={1.5} strokeDasharray='3 3' />

    {/* F: alimentación */}
    <Alimentacion cx={118} cy={220} r={5} />
    <Alimentacion cx={168} cy={220} r={5} />

    <CotaSvg x1={48} y1={28} x2={48} y2={236} letra='T' lx={36} ly={138} />
    <CotaSvg x1={214} y1={28} x2={214} y2={152} letra='L' lx={228} ly={96} />
    <Etiqueta x={196} y={166}>
      G
    </Etiqueta>
    <CotaSvg x1={214} y1={172} x2={214} y2={236} letra='S' lx={228} ly={210} />
    <CotaSvg x1={118} y1={88} x2={168} y2={88} letra='d' lx={143} ly={82} />
    <CotaSvg x1={143} y1={220} x2={143} y2={236} letra='F' lx={143} ly={214} />
  </Diagrama>
)

/** Medidas en cm de la Slim Jim (Fred Judd, G2BCX). */
const calcularSlimJim = (mhz: number) => {
  const lambdaCm = (VELOCIDAD_LUZ / mhz) * 100
  const radiador = redondear(((VF_ALAMBRE * 150) / mhz) * 100, 1)
  const stub = redondear(((VF_ALAMBRE * 75) / mhz) * 100, 1)
  const gap = redondear(lambdaCm / 100, 1)
  return {
    radiador,
    stub,
    gap,
    total: redondear(radiador + stub + gap, 1),
    alimentacion: redondear((VF_ALAMBRE * lambdaCm) / 40, 1),
    separacion: redondear(0.02175 * lambdaCm, 1),
    longitudOnda: lambdaCm,
  }
}

const SlimJim = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const m = frecuenciaValida(mhz) ? calcularSlimJim(mhz) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora de Slim Jim'
      intro='Calcula las dimensiones de una antena Slim Jim a partir de la frecuencia de operación deseada.'
    >
      <Articulo titulo='¿Qué es una Slim Jim?'>
        <p className='text-justify'>
          La Slim Jim, diseñada por Fred Judd (G2BCX), es una variante de la J-Pole: un dipolo de
          media onda alimentado por el extremo, plegado sobre sí mismo, con un stub de adaptación de
          cuarto de onda. Se distingue por un pequeño gap en uno de los conductores, entre el
          radiador y el stub. El nombre proviene de «J Integrated Matching».
        </p>
        <SlimJimDiagrama />
        <p className='text-justify'>
          Es muy usada en VHF y UHF como antena portable: se construye con línea bifilar de 300 Ω o
          450 Ω, se cuelga de un árbol o mástil y se enrolla para guardarla. También puede hacerse
          con tubo de cobre. Ofrece radiación omnidireccional y se alimenta en 50 Ω sobre el stub.
          Las fórmulas prácticas de construcción son:
        </p>
        <Formula>
          <p>L (m) ≈ 142,5 / f (MHz)</p>
          <p>S (m) ≈ 71 / f (MHz)</p>
          <p>G (m) ≈ 3 / f (MHz)</p>
          <p>T = L + G + S</p>
          <p>F ≈ 0,95 × λ / 40</p>
        </Formula>
        <Nota>
          Se aplica un factor de velocidad de 0,95 (cobre o aluminio desnudo). Si usa línea bifilar
          aislada, pruebe con 0,90 y recorte según el SWR. F se mide desde la base: es un punto de
          partida; ajústelo con un analizador o medidor SWR. d no es crítica; en 2 m suele usarse
          unos 4 a 5 cm.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='slimjim-frecuencia'
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

      {m && (
        <Resultado
          pie={
            <p className='mt-4 text-xs text-stone-500 dark:text-indigo-300/80'>
              L + G + S = T: {formatearFijo(m.radiador, 1)} + {formatearFijo(m.gap, 1)} +{' '}
              {formatearFijo(m.stub, 1)} = {formatearFijo(m.total, 1)} cm.
            </p>
          }
        >
          <Fila
            etiqueta={<Cota letra='L'>Radiador (λ/2)</Cota>}
            valor={formatearLongitudCm(m.radiador)}
          />
          <Fila
            etiqueta={<Cota letra='G'>Gap entre radiador y stub</Cota>}
            valor={formatearLongitudCm(m.gap)}
          />
          <Fila
            etiqueta={<Cota letra='S'>Stub de adaptación (λ/4)</Cota>}
            valor={formatearLongitudCm(m.stub)}
          />
          <Fila
            etiqueta={<Cota letra='T'>Longitud total (L + G + S)</Cota>}
            valor={formatearLongitudCm(m.total)}
          />
          <Fila
            etiqueta={<Cota letra='F'>Alimentación (desde la base)</Cota>}
            valor={formatearLongitudCm(m.alimentacion)}
          />
          <Fila
            etiqueta={<Cota letra='d'>Separación entre conductores</Cota>}
            valor={formatearLongitudCm(m.separacion)}
          />
          <Fila
            etiqueta={<Cota letra='λ'>Longitud de onda</Cota>}
            valor={formatearLongitudCm(m.longitudOnda)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default SlimJim
