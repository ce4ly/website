import { useState } from 'react'

import {
  esPositivo,
  formatearNumero,
  frecuenciaValida,
  inductanciaWheelerUh,
  parseNumero,
  vueltasParaInductancia,
} from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero } from '../calculadora/Campos'

/** Paso entre vueltas (mm), típico de RG-58. */
const PASO_MM = 6

const ChoqueCoaxial = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('40')
  const [xl, setXl] = useState('1000')
  const mhz = parseNumero(frecuencia)
  const d = parseNumero(diametro)
  const x = parseNumero(xl)
  const ok = frecuenciaValida(mhz) && esPositivo(d) && d > 5 && esPositivo(x)
  const lUh = ok ? x / (2 * Math.PI * mhz) : null
  const vueltas = ok && lUh !== null ? vueltasParaInductancia(lUh, d, PASO_MM) : null
  const largo = vueltas ? vueltas * PASO_MM : null

  return (
    <CalculadoraLayout
      titulo='Choque de Coaxial (Balun 1:1)'
      intro='Vueltas y diámetro del formero para que la reactancia del choque sea alta en la banda de trabajo.'
    >
      <Articulo titulo='Corriente en la malla'>
        <p className='text-justify'>
          Un choque de aire (o sobre PVC) presenta XL alta a la corriente que quiere volver por
          fuera de la malla. Se busca XL ≥ 10 × Z₀, a menudo 500–1000 Ω. En VHF bastan pocas
          vueltas; en 80 m hacen falta más o feritas (31/43).
        </p>
        <Formula>
          <p>L (µH) = XL / (2π f) &nbsp;&nbsp; Vueltas según Wheeler</p>
        </Formula>
        <Nota>
          Paso de 6 mm, típico de RG-58. Si al tocar el coaxial bajo el choque cambia el SWR, faltan
          vueltas o hay que usar toroide.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='ch-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='ch-d'
          etiqueta='Diámetro del formero (mm)'
          value={diametro}
          onChange={setDiametro}
        />
        <CampoNumero id='ch-x' etiqueta='XL objetivo (Ω)' value={xl} onChange={setXl} />
      </Campo>
      {ok && (
        <Resultado>
          <Fila etiqueta='Inductancia necesaria' valor={`${formatearNumero(lUh, 2)} µH`} />
          <Fila etiqueta='Vueltas (RG-58, paso 6 mm)' valor={formatearNumero(vueltas, 1)} />
          <Fila etiqueta='Largo de la bobina' valor={`${formatearNumero(largo, 0)} mm`} />
          <Fila
            etiqueta='Wheeler resultante'
            valor={`${formatearNumero(
              vueltas && largo ? inductanciaWheelerUh(d, largo, vueltas) : null,
              2,
            )} µH`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default ChoqueCoaxial
