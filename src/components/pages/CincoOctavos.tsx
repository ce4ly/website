import { useState } from 'react'

import {
  esPositivo,
  formatearLongitud,
  formatearNumero,
  frecuenciaValida,
  inductanciaWheelerUh,
  parseNumero,
  vueltasParaInductancia,
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

const CincoOctavosDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena 5/8 de onda con bobina de base'
    viewBox='0 0 260 320'
    ancho='max-w-sm'
  >
    {/* L: látigo 5/8 λ y alimentación en la unión con la bobina */}
    <Alambre x1={130} y1={16} x2={130} y2={188} />
    <Punta cx={130} cy={16} />
    <Alimentacion cx={130} cy={196} r={5} />

    {/* B: bobina de base, una elipse por espira */}
    {[210, 220, 230, 240].map((cy) => (
      <ellipse
        key={cy}
        cx='130'
        cy={cy}
        rx='26'
        ry='10'
        fill='none'
        stroke='currentColor'
        strokeWidth='3'
      />
    ))}
    <Alambre x1={130} y1={240} x2={130} y2={268} grosor={3} />

    <CotaSvg x1={48} y1={16} x2={48} y2={188} letra='L' lx={36} ly={108} />
    <CotaSvg x1={200} y1={200} x2={200} y2={250} letra='B' lx={214} ly={230} />

    {/* D: diámetro del formero */}
    <CotaSvg x1={104} y1={286} x2={156} y2={286} />
    <Linea x1={104} y1={250} x2={104} y2={282} strokeDasharray='3 3' />
    <Linea x1={156} y1={250} x2={156} y2={282} strokeDasharray='3 3' />
    <Etiqueta x={130} y={306}>
      D
    </Etiqueta>
  </Diagrama>
)

/**
 * Reactancia capacitiva aproximada en la base de un radiador de ~5/8 λ. Depende del grosor del
 * látigo (rango típico 150–250 Ω); 200 Ω es un punto de partida razonable que la bobina de base
 * debe compensar.
 */
const XL_BOBINA_BASE = 200

/** Paso del arrollado de la bobina (mm). */
const PASO_MM = 2

const CincoOctavos = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('12')
  const mhz = parseNumero(frecuencia)
  const d = parseNumero(diametro)
  const ok = frecuenciaValida(mhz) && esPositivo(d)
  const lUh = ok ? XL_BOBINA_BASE / (2 * Math.PI * mhz) : null
  const vueltas = ok && lUh !== null ? vueltasParaInductancia(lUh, d, PASO_MM) : null
  const largoBobina = vueltas ? vueltas * PASO_MM : null

  return (
    <CalculadoraLayout
      titulo='5/8 de Onda con Bobina de Carga'
      intro='Largo del látigo de 5/8 λ y bobina de base para llevar la reactancia a un punto cercano a 50 Ω.'
    >
      <Articulo titulo='Por qué la bobina'>
        <p className='text-justify'>
          El 5/8 de onda comprime el lóbulo hacia el horizonte (útil en VHF móvil) pero no resuena
          solo como un λ/4. En la base se pone una bobina que compensa la reactancia capacitiva del
          látigo —del orden de 150–250 Ω según el grosor— como punto de partida; el ajuste fino es
          recortando el látigo y espaciando espiras.
        </p>
        <CincoOctavosDiagrama />
        <Formula>
          <p>L (m) ≈ 178 / f</p>
          <p>Inductancia (µH) ≈ 200 / (2π f)</p>
        </Formula>
        <Nota>
          Vueltas según Wheeler, arrollado con paso de 2 mm. En 2 m suelen ser unas 4–7 espiras
          sobre 10–15 mm. Un capacitor en serie a veces termina el ajuste.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='c8-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        >
          <PresetsRepetidoras
            onSelect={(r) => setFrecuencia(formatearFrecuenciaMhz(r.frecuenciaMhz))}
          />
        </CampoNumero>
        <CampoNumero
          id='c8-d'
          etiqueta={<Cota letra='D'>Diámetro del formero de la bobina (mm)</Cota>}
          value={diametro}
          onChange={setDiametro}
        />
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='L'>Látigo 5/8 λ</Cota>}
            valor={formatearLongitud((0.625 * 300 * 0.95) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='B'>Largo de la bobina (paso 2 mm)</Cota>}
            valor={formatearLongitud(largoBobina !== null ? largoBobina / 1000 : null)}
          />
          <Fila etiqueta='Inductancia de partida' valor={`${formatearNumero(lUh, 3)} µH`} />
          <Fila etiqueta='Vueltas aproximadas' valor={formatearNumero(vueltas, 1)} />
          <Fila
            etiqueta='Comprobación Wheeler'
            valor={`${formatearNumero(
              vueltas && largoBobina ? inductanciaWheelerUh(d, largoBobina, vueltas) : null,
              3,
            )} µH`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default CincoOctavos
