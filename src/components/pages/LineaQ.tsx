import { useState } from 'react'

import {
  CABLES,
  esPositivo,
  formatearLongitud,
  formatearNumero,
  frecuenciaValida,
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
import { CampoNumero, Selector } from '../calculadora/Campos'
import Diagrama, { CotaSvg, Etiqueta, Linea } from '../calculadora/Diagrama'

const OPCIONES_CABLE = CABLES.map((c) => ({ value: c.id, label: `${c.nombre} — VF ${c.vf}` }))

/** Carga o fuente de impedancia `z`, dibujada como un bloque. */
const Bloque = ({ x, z }: { x: number; z: string }) => (
  <>
    <rect
      x={x}
      y='48'
      width='64'
      height='40'
      rx='6'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <Etiqueta x={x + 32} y={74}>
      {z}
    </Etiqueta>
  </>
)

const LineaQDiagrama = () => (
  <Diagrama titulo='Diagrama de línea Q de cuarto de onda' viewBox='0 0 340 160'>
    <Bloque x={16} z='Z₁' />
    <Bloque x={260} z='Z₂' />
    <Linea x1={80} y1={64} x2={260} y2={64} strokeWidth={3} />
    <Linea x1={80} y1={72} x2={260} y2={72} strokeWidth={3} />
    <Etiqueta x={170} y={56}>
      Zq
    </Etiqueta>
    <CotaSvg x1={80} y1={112} x2={260} y2={112} letra='L' lx={170} ly={132} />
  </Diagrama>
)

const LineaQ = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [z1, setZ1] = useState('50')
  const [z2, setZ2] = useState('112')
  const [cableId, setCableId] = useState('rg59')
  const mhz = parseNumero(frecuencia)
  const a = parseNumero(z1)
  const b = parseNumero(z2)
  const cable = CABLES.find((c) => c.id === cableId) ?? CABLES[0]
  const ok = frecuenciaValida(mhz) && esPositivo(a) && esPositivo(b)

  return (
    <CalculadoraLayout
      titulo='Línea Q (λ/4 de Adaptación)'
      intro='Tramo de cuarto de onda cuya impedancia es la media geométrica de las dos que quiere unir. VF según el cable.'
    >
      <Articulo titulo='Transformador de cuarto de onda'>
        <p className='text-justify'>
          Un λ/4 de impedancia Zq transforma Zin en Zout si Zq = √(Zin × Zout). El ejemplo clásico
          es un loop de ~112 Ω a 50 Ω con RG-59/RG-11 de 75 Ω.
        </p>
        <LineaQDiagrama />
        <Formula>
          <p>Zq = √(Z₁ Z₂) &nbsp;&nbsp; L = VF × 75 / f</p>
        </Formula>
        <Nota>
          El largo es eléctrico: use el VF del cable, no el del aire. La adaptación es estrecha (una
          banda); para varias bandas no sirve.
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
        <CampoNumero id='q-1' etiqueta={<Cota letra='Z₁'>(Ω)</Cota>} value={z1} onChange={setZ1} />
        <CampoNumero id='q-2' etiqueta={<Cota letra='Z₂'>(Ω)</Cota>} value={z2} onChange={setZ2} />
        <Selector
          id='q-c'
          etiqueta='Tipo de cable'
          value={cableId}
          onChange={setCableId}
          opciones={OPCIONES_CABLE}
        />
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='Zq'>Impedancia de la línea</Cota>}
            valor={`${formatearNumero(Math.sqrt(a * b), 1)} Ω`}
          />
          <Fila
            etiqueta={<Cota letra='L'>{`Largo λ/4 (${cable.nombre})`}</Cota>}
            valor={formatearLongitud((cable.vf * 75) / mhz)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default LineaQ
