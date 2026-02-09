import { useState } from 'react'

import {
  VELOCIDAD_LUZ,
  VF_ALAMBRE,
  formatearLongitud,
  formatearNumero,
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

/** Factor de velocidad del dieléctrico del RG-58 (para el choque). */
const VF_COAXIAL = 0.66

const FlowerpotDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena flowerpot'
    viewBox='0 0 280 300'
    ancho='max-w-sm'
  >
    {/* A: elemento superior (vivo, λ/4), alimentación y B: elemento inferior (malla, λ/4) */}
    <Alambre x1={160} y1={22} x2={160} y2={108} />
    <Punta cx={160} cy={22} />
    <Alimentacion cx={160} cy={116} r={5} />
    <Alambre x1={160} y1={124} x2={160} y2={198} />

    {/* C: choque (espiras del coaxial) y bajada */}
    {[216, 226, 236].map((cy) => (
      <ellipse
        key={cy}
        cx='160'
        cy={cy}
        rx='30'
        ry='11'
        fill='none'
        stroke='currentColor'
        strokeWidth='3'
      />
    ))}
    <Alambre x1={160} y1={236} x2={160} y2={278} grosor={3} />

    <CotaSvg x1={40} y1={22} x2={40} y2={198} letra='T' lx={28} ly={114} />
    <CotaSvg x1={100} y1={22} x2={100} y2={108} letra='A' lx={88} ly={70} />
    <CotaSvg x1={100} y1={124} x2={100} y2={198} letra='B' lx={88} ly={166} />
    <CotaSvg x1={210} y1={205} x2={210} y2={247} letra='C' lx={224} ly={230} />
  </Diagrama>
)

const Flowerpot = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  // A y B miden lo mismo (λ/4 cada uno); T se suma en cm redondeados, como se mide en la práctica.
  const elementoCm = ok ? redondear(((VF_ALAMBRE * 75) / mhz) * 100, 1) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora de Flowerpot'
      intro='Calcula las dimensiones de una antena flowerpot de media onda a partir de la frecuencia de operación deseada.'
    >
      <Articulo titulo='¿Qué es una flowerpot?'>
        <p className='text-justify'>
          La flowerpot (o «macetero») es un dipolo vertical de media onda construido con un solo
          tramo de coaxial, popularizada por John Honniball (VK2ZOI). Se llama así porque el diseño
          original se montaba dentro de una maceta de plástico. Hoy suele alojarse en un tubo de
          PVC.
        </p>
        <FlowerpotDiagrama />
        <p className='text-justify'>
          El coaxial se corta de modo que el conductor central forma el elemento superior A (λ/4) y
          la malla, el inferior B (λ/4). En el punto de unión —donde se retira la malla— está la
          alimentación. Debajo se enrolla un choque C (bobina del propio coaxial) para que la bajada
          no irradie. Es una antena omnidireccional, barata y habitual en 2 m y 70 cm. Las fórmulas
          prácticas de construcción son:
        </p>
        <Formula>
          <p>A (m) ≈ 71 / f (MHz) &nbsp; B (m) ≈ 71 / f (MHz)</p>
          <p>T = A + B ≈ 142,5 / f (MHz)</p>
          <p>C (m) ≈ 99 / f (MHz) &nbsp; (coaxial a devanar)</p>
        </Formula>
        <Nota>
          Se aplica un factor de velocidad de 0,95 a los elementos radiadores. El choque usa 0,66,
          típico del dieléctrico del RG-58: es la longitud de coaxial a enrollar, no la altura de la
          bobina. En 2 m equivale a unas 8 a 9 vueltas sobre conduit de 25 mm, con la bobina
          resonando un 5–6 % bajo la frecuencia de trabajo. Dentro de PVC las medidas salen un poco
          más cortas; deje margen y ajuste con analizador o medidor SWR.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='flowerpot-frecuencia'
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

      {ok && elementoCm !== null && (
        <Resultado
          pie={
            <p className='mt-4 text-xs text-stone-500 dark:text-indigo-300/80'>
              A + B = T: {formatearNumero(elementoCm, 1)} + {formatearNumero(elementoCm, 1)} ={' '}
              {formatearNumero(redondear(elementoCm * 2, 1), 1)} cm.
            </p>
          }
        >
          <Fila
            etiqueta={<Cota letra='A'>Elemento superior (vivo, λ/4)</Cota>}
            valor={formatearLongitud((VF_ALAMBRE * 75) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='B'>Elemento inferior (malla, λ/4)</Cota>}
            valor={formatearLongitud((VF_ALAMBRE * 75) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='T'>Radiador total (A + B, λ/2)</Cota>}
            valor={formatearLongitud((elementoCm * 2) / 100)}
          />
          {/* Choque de VK2ZOI: no es un λ/4 resonante sino ~8 vueltas del propio coaxial en 2 m.
              Se aproxima como λ/2 eléctrica del coaxial. */}
          <Fila
            etiqueta={<Cota letra='C'>Choque (longitud de coaxial)</Cota>}
            valor={formatearLongitud((VF_COAXIAL * 150) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='λ'>Longitud de onda</Cota>}
            valor={formatearLongitud(VELOCIDAD_LUZ / mhz)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Flowerpot
