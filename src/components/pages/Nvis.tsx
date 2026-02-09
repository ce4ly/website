import { useState } from 'react'

import {
  esPositivo,
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
import Diagrama, { Alambre, Alimentacion, CotaSvg, Etiqueta, Linea } from '../calculadora/Diagrama'

/** Uso que permite la altura del dipolo, en fracciones de λ. */
const regimen = (fraccion: number) => {
  if (fraccion < 0.15) return 'NVIS (ángulo muy alto, cobertura local/regional)'
  if (fraccion < 0.3) return 'Regional / NVIS suave'
  if (fraccion < 0.6) return 'Mixto (regional y algo de DX)'
  return 'DX (ángulo bajo)'
}

/** Ángulo (°) del primer máximo de un dipolo horizontal a `h` m: sin α = λ / (4h). */
const anguloPrimerMaximo = (lambda: number, h: number) => {
  const seno = lambda / (4 * h)
  return seno <= 1 ? (Math.asin(seno) * 180) / Math.PI : 90
}

const NvisDiagrama = () => (
  <Diagrama titulo='Diagrama de altura de un dipolo y ángulo NVIS' viewBox='0 0 340 230'>
    <Linea x1={24} y1={200} x2={316} y2={200} strokeWidth={1.5} />

    {/* Dipolo y mástil */}
    <Alambre x1={70} y1={56} x2={270} y2={56} />
    <Alimentacion cx={170} cy={56} r={6} />
    <Linea x1={170} y1={56} x2={170} y2={200} strokeWidth={1.5} strokeDasharray='5 4' />

    <CotaSvg x1={40} y1={56} x2={40} y2={200} letra='H' lx={28} ly={132} />

    {/* Ángulo α desde el horizonte */}
    <path d='M 210 200 A 48 48 0 0 0 200 156' fill='none' stroke='currentColor' strokeWidth='1.5' />
    <Linea x1={170} y1={200} x2={248} y2={148} strokeDasharray='4 3' />
    <Etiqueta x={228} y={186}>
      α
    </Etiqueta>

    {/* Alturas de referencia NVIS (Hn) y DX (Hd) */}
    <Linea x1={292} y1={168} x2={308} y2={168} />
    <Etiqueta x={318} y={172} textAnchor='start' tamano={13}>
      Hn
    </Etiqueta>
    <Linea x1={292} y1={88} x2={308} y2={88} />
    <Etiqueta x={318} y={92} textAnchor='start' tamano={13}>
      Hd
    </Etiqueta>
    <Etiqueta x={300} y={52} tamano={13}>
      λ
    </Etiqueta>
  </Diagrama>
)

const Nvis = () => {
  const [frecuencia, setFrecuencia] = useState('7,148')
  const [altura, setAltura] = useState('10')
  const mhz = parseNumero(frecuencia)
  const h = parseNumero(altura)
  const lambda = frecuenciaValida(mhz) && esPositivo(h) ? longitudOnda(mhz) : null

  return (
    <CalculadoraLayout
      titulo='Altura sobre el Suelo y Ángulo NVIS'
      intro='En 40 y 80 m la altura del dipolo decide si ilumina el cielo (NVIS) o el horizonte (DX).'
    >
      <Articulo titulo='El primer lóbulo'>
        <p className='text-justify'>
          Un dipolo horizontal sobre tierra tiene el máximo de radiación a un ángulo de elevación
          cuyo seno es λ/(4h). Bajo (~0,1–0,2 λ) el lóbulo apunta al cénit: NVIS, comunicaciones de
          50–400 km saltando la ionosfera. A λ/2 el máximo baja hacia unos 30° y empieza el DX.
        </p>
        <NvisDiagrama />
        <Formula>
          <p>sin(α) = λ / (4H) &nbsp; (primer máximo)</p>
        </Formula>
        <Nota>
          Modelo de tierra plana y dipolo. Techos, árboles y pendientes mueven el diagrama. En 80 m,
          10 m de altura ya es NVIS; para DX de 80 m hace falta un soporte alto de verdad.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='nv-f'
          etiqueta='Frecuencia (MHz)'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='nv-h'
          etiqueta={<Cota letra='H'>Altura del dipolo (m)</Cota>}
          value={altura}
          onChange={setAltura}
        />
      </Campo>
      {lambda !== null && esPositivo(h) && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='λ'>Longitud de onda</Cota>}
            valor={formatearLongitud(lambda)}
          />
          <Fila
            etiqueta={<Cota letra='H/λ'>Altura en longitudes de onda</Cota>}
            valor={formatearNumero(h / lambda, 3)}
          />
          <Fila
            etiqueta={<Cota letra='α'>Ángulo del primer máximo</Cota>}
            valor={`${formatearNumero(anguloPrimerMaximo(lambda, h), 0)} °`}
          />
          <Fila etiqueta='Régimen' valor={regimen(h / lambda)} resaltar />
          <Fila
            etiqueta={<Cota letra='Hn'>Altura NVIS de referencia (0,15 λ)</Cota>}
            valor={formatearLongitud(0.15 * lambda)}
          />
          <Fila
            etiqueta={<Cota letra='Hd'>Altura DX de referencia (0,5 λ)</Cota>}
            valor={formatearLongitud(0.5 * lambda)}
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Nvis
