import { useState } from 'react'

import {
  LARGO_MEDIA_ONDA,
  VELOCIDAD_LUZ,
  formatearFijo,
  formatearLongitudCm,
  frecuenciaValida,
  parseNumero,
  redondear,
} from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Aviso,
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
  Linea,
  Punta,
  Rotulo,
} from '../calculadora/Diagrama'

/** Separación entre brazos en el aislador central: 2 cm en VHF, 5 cm en HF. */
const separacionCm = (mhz: number) => (mhz >= 30 ? 2 : 5)

const DipoloDiagrama = () => (
  <Diagrama titulo='Diagrama esquemático de antena dipolo de media onda' viewBox='0 0 320 170'>
    <CotaSvg x1={36} y1={28} x2={284} y2={28} letra='T' lx={160} ly={22} />

    <Alambre x1={36} y1={72} x2={148} y2={72} />
    <Alambre x1={172} y1={72} x2={284} y2={72} />
    <Punta cx={36} cy={72} />
    <Punta cx={284} cy={72} />

    <Alimentacion cx={160} cy={72} />
    <CotaSvg x1={148} y1={52} x2={172} y2={52} letra='s' lx={160} ly={46} />

    <CotaSvg x1={36} y1={96} x2={148} y2={96} letra='L' lx={92} ly={112} />
    <CotaSvg x1={172} y1={96} x2={284} y2={96} letra='L' lx={228} ly={112} />

    {/* Bajada coaxial */}
    <Linea x1={154} y1={79} x2={154} y2={148} strokeWidth={2} />
    <Linea x1={166} y1={79} x2={166} y2={148} strokeWidth={2} />
    <Rotulo x={178} y={140}>
      alimentación
    </Rotulo>
  </Diagrama>
)

/** Medidas en cm; `null` si la frecuencia no deja brazos (s mayor que el dipolo). */
const calcularDipolo = (mhz: number) => {
  const totalFormulaCm = (LARGO_MEDIA_ONDA / mhz) * 100
  const s = separacionCm(mhz)
  if (totalFormulaCm <= s) return null
  const brazo = redondear((totalFormulaCm - s) / 2, 1)
  return {
    brazo,
    separacion: s,
    total: redondear(brazo * 2 + s, 1),
    longitudOnda: (VELOCIDAD_LUZ / mhz) * 100,
  }
}

const Dipolo = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const valida = frecuenciaValida(mhz)
  const medidas = valida ? calcularDipolo(mhz) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora Dipolo'
      intro='Calcula las dimensiones de un dipolo de media onda (λ/2) a partir de la frecuencia de operación deseada.'
    >
      <Articulo titulo='¿Qué es un dipolo?'>
        <p className='text-justify'>
          Un dipolo es la antena más simple y fundamental en radioafición. Se compone de dos
          conductores rectos de igual longitud, colocados en línea recta y alimentados en su centro.
          Cada brazo mide aproximadamente un cuarto de longitud de onda (λ/4), de modo que la antena
          completa equivale a media onda (λ/2).
        </p>

        <DipoloDiagrama />

        <p className='text-justify'>
          Es una antena omnidireccional en el plano perpendicular a su eje, con un patrón de
          radiación en forma de «8». Se usa ampliamente por su sencillez de construcción, bajo costo
          y buen rendimiento en frecuencias de HF y VHF. La fórmula práctica para su construcción
          es:
        </p>
        <Formula>T (m) ≈ 142,5 / f (MHz)</Formula>
        <Nota>
          Se aplica un factor de velocidad de 0,95 para compensar el efecto del cable y las
          condiciones reales de instalación. T es la longitud de punta a punta: de ahí se resta s (2
          cm en VHF, 5 cm en HF) y el resto se parte en dos brazos L. Recorte al final con un
          analizador o medidor SWR.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='dipolo-frecuencia'
          etiqueta='Frecuencia de operación (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        />
      </Campo>

      {valida && !medidas && <Aviso>Frecuencia fuera del rango útil de esta calculadora.</Aviso>}

      {medidas && (
        <Resultado
          pie={
            <p className='mt-4 text-xs text-stone-500 dark:text-indigo-300/80'>
              L + L + s = T: {formatearFijo(medidas.brazo, 1)} + {formatearFijo(medidas.brazo, 1)} +{' '}
              {formatearFijo(medidas.separacion, 1)} = {formatearFijo(medidas.total, 1)} cm. s se
              resta de la fórmula y el resto se parte en dos brazos.
            </p>
          }
        >
          <Fila
            etiqueta={<Cota letra='L'>Cada brazo</Cota>}
            valor={formatearLongitudCm(medidas.brazo)}
          />
          <Fila
            etiqueta={<Cota letra='s'>Separación entre brazos</Cota>}
            valor={formatearLongitudCm(medidas.separacion)}
          />
          <Fila
            etiqueta={<Cota letra='T'>Longitud total (2L + s)</Cota>}
            valor={formatearLongitudCm(medidas.total)}
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

export default Dipolo
