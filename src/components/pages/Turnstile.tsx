import { useState } from 'react'

import {
  CABLES,
  LARGO_MEDIA_ONDA,
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
import { CampoNumero, Selector } from '../calculadora/Campos'
import Diagrama, {
  Alambre,
  Alimentacion,
  CotaSvg,
  Etiqueta,
  Linea,
  Punta,
} from '../calculadora/Diagrama'
import PresetsRepetidoras from '../calculadora/PresetsRepetidoras'

const CABLES_FASE = CABLES.filter((c) => ['rg59', 'rg11', 'rg58', 'lmr400'].includes(c.id))
const OPCIONES_CABLE = CABLES_FASE.map((c) => ({ value: c.id, label: `${c.nombre} (VF ${c.vf})` }))

const TurnstileDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena turnstile y eggbeater'
    viewBox='0 0 360 280'
    pie='Vista de planta (no a escala). Las letras coinciden con las medidas.'
  >
    {/* Loop eggbeater P */}
    <circle cx='292' cy='148' r='52' fill='none' stroke='currentColor' strokeWidth='5' />
    <Etiqueta x={292} y={154}>
      P
    </Etiqueta>

    {/* Dipolos cruzados, alimentados en el cruce */}
    <Alambre x1={28} y1={148} x2={112} y2={148} />
    <Alambre x1={136} y1={148} x2={220} y2={148} />
    <Punta cx={28} cy={148} />
    <Punta cx={220} cy={148} />
    <Alambre x1={124} y1={36} x2={124} y2={120} />
    <Alambre x1={124} y1={176} x2={124} y2={260} />
    <Punta cx={124} cy={36} />
    <Punta cx={124} cy={260} />
    <Alimentacion cx={124} cy={148} />

    {/* Línea de desfase de 90° F */}
    <Linea x1={136} y1={160} x2={168} y2={188} strokeWidth={2} />
    <Linea x1={162} y1={188} x2={174} y2={188} strokeWidth={2} />
    <Etiqueta x={180} y={192} textAnchor='start'>
      F
    </Etiqueta>

    <CotaSvg x1={28} y1={20} x2={220} y2={20} letra='D' lx={124} ly={14} />
    <CotaSvg x1={28} y1={172} x2={112} y2={172} letra='L' lx={70} ly={188} />
  </Diagrama>
)

const Turnstile = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [cableId, setCableId] = useState('rg59')
  const mhz = parseNumero(frecuencia)
  const cable = CABLES_FASE.find((c) => c.id === cableId) ?? CABLES_FASE[0]
  const ok = frecuenciaValida(mhz)
  const dipolo = ok ? LARGO_MEDIA_ONDA / mhz : null

  return (
    <CalculadoraLayout
      titulo='Turnstile / Eggbeater'
      intro='Dos dipolos (turnstile) o dos loops (eggbeater) en cuadratura, para polarización circular en satélites.'
    >
      <Articulo titulo='Polarización circular'>
        <p className='text-justify'>
          El turnstile cruza dos dipolos a 90° y los desfasa 90° con un tramo de coaxial de cuarto
          de onda. El eggbeater hace lo mismo con dos loops de onda completa, más robusto y con buen
          cielo hacia el cénit: ideal para LEO en 2 m y 70 cm.
        </p>
        <TurnstileDiagrama />
        <Formula>
          <p>D ≈ 142,5 / f &nbsp;&nbsp; L = D / 2</p>
          <p>P ≈ 306 / f</p>
          <p>F = VF × 75 / f</p>
        </Formula>
        <Nota>
          Un extremo del tramo de 90° va a un elemento; el otro, al segundo y al coaxial de 50 Ω (a
          veces con T de 75 Ω). El sentido RHCP/LHCP se invierte cruzando las conexiones.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='tu-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        >
          <PresetsRepetidoras
            onSelect={(r) => setFrecuencia(formatearFrecuenciaMhz(r.frecuenciaMhz))}
          />
        </CampoNumero>
        <Selector
          id='tu-c'
          etiqueta={<Cota letra='F'>Coaxial del desfase 90°</Cota>}
          value={cableId}
          onChange={setCableId}
          opciones={OPCIONES_CABLE}
        />
      </Campo>
      {ok && dipolo !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='D'>Cada dipolo del turnstile</Cota>}
            valor={formatearLongitud(dipolo)}
          />
          <Fila
            etiqueta={<Cota letra='L'>Cada brazo del dipolo</Cota>}
            valor={formatearLongitud(dipolo / 2)}
          />
          <Fila
            etiqueta={<Cota letra='P'>Perímetro de cada loop eggbeater</Cota>}
            valor={formatearLongitud(306.3 / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='F'>{`Línea de 90° (${cable.nombre})`}</Cota>}
            valor={formatearLongitud((cable.vf * 75) / mhz)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Turnstile
