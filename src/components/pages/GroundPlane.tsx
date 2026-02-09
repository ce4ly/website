import { useState } from 'react'

import {
  VF_ALAMBRE,
  formatearLongitud,
  frecuenciaValida,
  parseNumero,
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
import Diagrama, {
  Alambre,
  Alimentacion,
  CotaSvg,
  Etiqueta,
  Linea,
  Punta,
} from '../calculadora/Diagrama'
import PresetsRepetidoras from '../calculadora/PresetsRepetidoras'

const GroundPlaneDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena ground plane a 45°'
    viewBox='0 0 300 260'
    ancho='max-w-sm'
  >
    {/* L: radiador vertical */}
    <Alambre x1={150} y1={20} x2={150} y2={122} />
    <Punta cx={150} cy={20} />
    <Alimentacion cx={150} cy={122} r={5} />

    {/* R: radiales caídos a 45° */}
    <Alambre x1={150} y1={122} x2={88} y2={184} />
    <Alambre x1={150} y1={122} x2={212} y2={184} />
    <Punta cx={88} cy={184} />
    <Punta cx={212} cy={184} />

    {/* Referencia horizontal y arco de 45° */}
    <Linea x1={150} y1={122} x2={198} y2={122} strokeDasharray='3 3' />
    <path
      d='M 190 122 A 40 40 0 0 1 178.28 150.28'
      fill='none'
      stroke='currentColor'
      strokeWidth='1'
    />
    <Etiqueta x={204} y={148}>
      45°
    </Etiqueta>

    <CotaSvg x1={48} y1={20} x2={48} y2={122} letra='L' lx={36} ly={76} />

    {/* Cota R, paralela al radial izquierdo */}
    <Linea x1={128} y1={108} x2={66} y2={170} />
    <Linea x1={124} y1={104} x2={132} y2={112} />
    <Linea x1={62} y1={166} x2={70} y2={174} />
    <Etiqueta x={78} y={128}>
      R
    </Etiqueta>

    {/* Cota h: caída vertical de la punta del radial */}
    <CotaSvg x1={250} y1={122} x2={250} y2={184} />
    <Linea x1={212} y1={184} x2={246} y2={184} strokeDasharray='3 3' />
    <Etiqueta x={262} y={158}>
      h
    </Etiqueta>
  </Diagrama>
)

const GroundPlane = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const radial = ok ? (VF_ALAMBRE * 75) / mhz : null

  return (
    <CalculadoraLayout
      titulo='Ground Plane λ/4 a 45°'
      intro='La vertical más básica en VHF/UHF: radiador de cuarto de onda y radiales caídos a 45° para acercar la impedancia a 50 Ω.'
    >
      <Articulo titulo='Por qué 45°'>
        <p className='text-justify'>
          Con radiales horizontales la impedancia queda cerca de 36 Ω. Al bajarlos a unos 45° sube
          hacia 50 Ω y no hace falta matching. Tres o cuatro radiales bastan.
        </p>
        <GroundPlaneDiagrama />
        <Formula>
          <p>L (m) ≈ 67,5 / f</p>
          <p>R (m) ≈ 71 / f</p>
          <p>h = R · sin(45°)</p>
        </Formula>
        <Nota>
          El radiador se deja un pelo más corto que el radial. Recorte con SWR; cerca de un mástil
          metálico las medidas cambian.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='gp-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        >
          <PresetsRepetidoras
            onSelect={(r) => setFrecuencia(formatearFrecuenciaMhz(r.frecuenciaMhz))}
          />
        </CampoNumero>
      </Campo>
      {ok && radial !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='L'>Radiador</Cota>}
            valor={formatearLongitud((VF_ALAMBRE * 71) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='R'>Cada radial (3 o 4)</Cota>}
            valor={formatearLongitud(radial)}
          />
          <Fila
            etiqueta={<Cota letra='h'>Caída vertical a 45°</Cota>}
            valor={formatearLongitud(radial * Math.sin(Math.PI / 4))}
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default GroundPlane
