import { useState } from 'react'

import {
  LARGO_MEDIA_ONDA,
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
import { CampoNumero } from '../calculadora/Campos'
import Diagrama, {
  Alambre,
  Alimentacion,
  CotaSvg,
  Etiqueta,
  Linea,
  Punta,
  Suelo,
} from '../calculadora/Diagrama'

const VInvertidaDiagrama = () => (
  <Diagrama titulo='Diagrama esquemático de antena en V invertida' viewBox='0 0 340 230'>
    <Suelo x1={20} x2={320} y={200} marcas={[36, 56, 252, 272]} />

    {/* Mástil */}
    <Linea x1={160} y1={42} x2={160} y2={200} strokeWidth={1.5} strokeDasharray='5 4' />

    <Alambre x1={48} y1={172} x2={160} y2={42} />
    <Alambre x1={272} y1={172} x2={160} y2={42} />
    <Punta cx={48} cy={172} />
    <Punta cx={272} cy={172} />
    <Alimentacion cx={160} cy={42} />

    {/* Ángulo θ en el ápex */}
    <path d='M 138 68 A 36 36 0 0 0 182 68' fill='none' stroke='currentColor' strokeWidth='1.5' />
    <Etiqueta x={160} y={90}>
      θ
    </Etiqueta>

    <CotaSvg x1={28} y1={42} x2={28} y2={200} letra='H' lx={16} ly={126} />

    <Etiqueta x={86} y={96} transform='rotate(-49 86 96)'>
      L
    </Etiqueta>
    <Etiqueta x={234} y={96} transform='rotate(49 234 96)'>
      L
    </Etiqueta>

    <CotaSvg x1={48} y1={188} x2={272} y2={188} letra='V' lx={160} ly={184} />
    <CotaSvg x1={304} y1={172} x2={304} y2={200} letra='h' lx={318} ly={190} />

    {/* Bajada */}
    <Linea x1={160} y1={49} x2={176} y2={72} strokeWidth={1.5} />
  </Diagrama>
)

/** Corrección del largo por el ángulo incluido θ: 1 a 180° (dipolo plano), +4 % a 90°. */
const correccionAngulo = (thetaDeg: number) => 1 + 0.04 * ((180 - thetaDeg) / 90)

const calcularVInvertida = (mhz: number, thetaDeg: number, hApex: number) => {
  const correccion = correccionAngulo(thetaDeg)
  const largoTotal = (LARGO_MEDIA_ONDA / mhz) * correccion
  const largoBrazo = largoTotal / 2
  const mitadTheta = (thetaDeg * Math.PI) / 180 / 2
  return {
    correccion,
    largoTotal,
    largoBrazo,
    vano: 2 * largoBrazo * Math.sin(mitadTheta),
    alturaPuntas: hApex - largoBrazo * Math.cos(mitadTheta),
  }
}

const InvertedV = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [angulo, setAngulo] = useState('120')
  const [altura, setAltura] = useState('10')

  const mhz = parseNumero(frecuencia)
  const thetaDeg = parseNumero(angulo)
  const hApex = parseNumero(altura)
  const ok =
    frecuenciaValida(mhz) &&
    thetaDeg !== null &&
    thetaDeg > 60 &&
    thetaDeg <= 180 &&
    esPositivo(hApex)

  const medidas = ok ? calcularVInvertida(mhz, thetaDeg, hApex) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora de V Invertida'
      intro='Dipolo en V invertida: corrige el largo por el ángulo de apertura y calcula vano y altura de las puntas.'
    >
      <Articulo titulo='¿Qué es una V invertida?'>
        <p className='text-justify'>
          Es un dipolo de media onda cuyo vértice está en lo alto y las puntas bajan. Ocupa menos
          vano que un dipolo plano, sube un poco la impedancia hacia 50 Ω cuando el ángulo incluido
          está cerca de 90–120° y se usa muchísimo en HF de club y portable.
        </p>

        <VInvertidaDiagrama />

        <Formula>
          <p>2L (m) ≈ (142,5 / f) × (1 + 0,04 × (180 − θ) / 90)</p>
        </Formula>
        <Nota>
          A 180° coincide con el dipolo plano (VF 0,95). A 90° el alambre sale unos 4 % más largo.
          Es la corrección que usa el radio club y que ha dado buen resultado en instalaciones
          reales. Si h queda bajo 2 m, suba H o abra θ.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='inv-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='inv-a'
          etiqueta={<Cota letra='θ'>Ángulo incluido en el ápex (°)</Cota>}
          value={angulo}
          onChange={setAngulo}
        />
        <CampoNumero
          id='inv-h'
          etiqueta={<Cota letra='H'>Altura del ápex (m)</Cota>}
          value={altura}
          onChange={setAltura}
        />
      </Campo>

      {medidas && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='2L'>Largo total de alambre</Cota>}
            valor={formatearLongitud(medidas.largoTotal)}
          />
          <Fila
            etiqueta={<Cota letra='L'>Cada brazo</Cota>}
            valor={formatearLongitud(medidas.largoBrazo)}
          />
          <Fila
            etiqueta={<Cota letra='V'>Vano entre puntas</Cota>}
            valor={formatearLongitud(medidas.vano)}
          />
          <Fila
            etiqueta={<Cota letra='h'>Altura de las puntas</Cota>}
            valor={formatearLongitud(medidas.alturaPuntas)}
          />
          <Fila
            etiqueta='Corrección vs dipolo plano'
            valor={`× ${formatearNumero(medidas.correccion, 3)}`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default InvertedV
