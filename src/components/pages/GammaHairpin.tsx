import { useState } from 'react'

import { gammaHairpin } from '../../lib/calc/adaptacion'
import {
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
import Diagrama, { Alambre, Alimentacion, Etiqueta, Linea } from '../calculadora/Diagrama'

const GammaHairpinDiagrama = () => (
  <Diagrama titulo='Diagrama esquemático de gamma match y hairpin' viewBox='0 0 360 220'>
    {/* Excitado */}
    <Alambre x1={28} y1={48} x2={168} y2={48} />
    <Alambre x1={192} y1={48} x2={332} y2={48} />
    <Alimentacion cx={180} cy={48} r={6} />

    {/* Gamma, paralelo al brazo derecho, con su capacitor C */}
    <Alambre x1={192} y1={78} x2={268} y2={78} grosor={4} />
    <Linea x1={192} y1={48} x2={192} y2={78} strokeWidth={2} />
    <rect
      x='260'
      y='70'
      width='16'
      height='16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <Etiqueta x={268} y={104}>
      C
    </Etiqueta>
    <Linea x1={192} y1={92} x2={260} y2={92} />
    <Etiqueta x={226} y={108}>
      G
    </Etiqueta>

    {/* Hairpin en U bajo el centro */}
    <path
      d='M 156 140 L 156 188 L 204 188 L 204 140'
      fill='none'
      stroke='currentColor'
      strokeWidth='4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <Linea x1={156} y1={140} x2={168} y2={48} strokeWidth={1.5} />
    <Linea x1={204} y1={140} x2={192} y2={48} strokeWidth={1.5} />
    <Linea x1={156} y1={202} x2={204} y2={202} />
    <Etiqueta x={180} y={216}>
      U
    </Etiqueta>
    <Etiqueta x={40} y={44} textAnchor='start' tamano={13}>
      E
    </Etiqueta>
  </Diagrama>
)

const GammaHairpin = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [ra, setRa] = useState('20')
  const mhz = parseNumero(frecuencia)
  const r = parseNumero(ra)
  const m = frecuenciaValida(mhz) && r !== null ? gammaHairpin(mhz, r) : null

  return (
    <CalculadoraLayout
      titulo='Gamma Match y Hairpin'
      intro='Puntos de partida para adaptar un excitado de yagi (20–30 Ω) a 50 Ω.'
    >
      <Articulo titulo='Dos matching clásicos'>
        <p className='text-justify'>
          El gamma match es un conductor paralelo a una mitad del excitado, con un capacitor en
          serie: alarga el «brazo vivo» hasta encontrar 50 Ω. El hairpin (beta match) es un
          cortocircuito en U en el centro del excitado, que se ha recortado para quedar capacitivo;
          la U aporta la L en paralelo.
        </p>
        <GammaHairpinDiagrama />
        <Formula>
          <p>Xserie = Ra √(50/Ra − 1) &nbsp; (acortar el excitado)</p>
          <p>Xhairpin = 50 / √(50/Ra − 1)</p>
          <p>G ≈ 0,05 λ &nbsp; U ≈ 0,03 λ de varilla</p>
        </Formula>
        <Nota>
          Son valores de partida. El gamma se desliza y se retoca C; el hairpin se abre o se acorta.
          Mida en el lugar de instalación.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='gh-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='gh-r'
          etiqueta={<Cota letra='Ra'>del excitado (Ω), típico 20–25</Cota>}
          value={ra}
          onChange={setRa}
        />
      </Campo>
      {m && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='G'>Largo del gamma (0,05 λ)</Cota>}
            valor={formatearLongitud(m.gammaLargo)}
          />
          <Fila
            etiqueta='Reactancia serie a cancelar (acortar el excitado)'
            valor={`${formatearNumero(m.xSerie, 1)} Ω`}
          />
          <Fila
            etiqueta={<Cota letra='C'>Capacitor de partida del gamma</Cota>}
            valor={`${formatearNumero(m.capacitorPf, 1)} pF`}
          />
          <Fila etiqueta='XL del hairpin' valor={`${formatearNumero(m.xHairpin, 1)} Ω`} />
          <Fila etiqueta='L del hairpin' valor={`${formatearNumero(m.hairpinUh, 3)} µH`} />
          <Fila
            etiqueta={<Cota letra='U'>Largo orientativo de la U</Cota>}
            valor={formatearLongitud(m.hairpinLargo)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default GammaHairpin
