import { useState } from 'react'

import {
  CABLES,
  formatearLongitud,
  formatearNumero,
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
import Diagrama, { Alambre, Alimentacion, CotaSvg, Linea, Punta } from '../calculadora/Diagrama'
import PresetsRepetidoras from '../calculadora/PresetsRepetidoras'

/** Solo coaxiales: las líneas abiertas o de escalera (VF > 0,86) no sirven para una COCO. */
const COAXIALES = CABLES.filter((c) => c.vf <= 0.86)
const OPCIONES_CABLE = COAXIALES.map((c) => ({ value: c.id, label: `${c.nombre} (VF ${c.vf})` }))

const ColinealDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de antena colineal coaxial'
    viewBox='0 0 220 300'
    ancho='max-w-sm'
  >
    {/* Segmentos S apilados */}
    {[24, 86, 148, 210].map((y) => (
      <Alambre key={y} x1={110} y1={y} x2={110} y2={y + 54} />
    ))}
    <Punta cx={110} cy={24} />

    {/* Alimentación en la base */}
    <Alimentacion cx={110} cy={264} />
    <Linea x1={104} y1={271} x2={104} y2={292} strokeWidth={2} />
    <Linea x1={116} y1={271} x2={116} y2={292} strokeWidth={2} />

    <CotaSvg x1={48} y1={24} x2={48} y2={264} letra='T' lx={36} ly={150} />
    <CotaSvg x1={168} y1={86} x2={168} y2={140} letra='S' lx={182} ly={118} />
  </Diagrama>
)

const Colineal = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [secciones, setSecciones] = useState('4')
  const [cableId, setCableId] = useState('rg58')
  const mhz = parseNumero(frecuencia)
  const n = Math.round(parseNumero(secciones) ?? 0)
  const cable = COAXIALES.find((c) => c.id === cableId) ?? COAXIALES[0]
  const ok = frecuenciaValida(mhz) && n >= 2 && n <= 16
  const segmento = ok ? (cable.vf * 150) / mhz : null

  return (
    <CalculadoraLayout
      titulo='Colineal Coaxial (Franklin / COCO)'
      intro='Largo de cada segmento con el factor de velocidad del coaxial, y una estimación de ganancia según el número de secciones.'
    >
      <Articulo titulo='Franklin y COCO'>
        <p className='text-justify'>
          Varias medias ondas en fase, una sobre otra. En coaxial colineal (COCO) cada tramo mide
          λ/2 eléctrica del cable (no del aire): se invierte vivo y malla en cada unión para
          mantener la corriente en fase. Más secciones, más ganancia, pero también más pérdidas y un
          lóbulo más estrecho.
        </p>
        <ColinealDiagrama />
        <Formula>
          <p>S (m) = VF × 150 / f</p>
          <p>T = N × S</p>
          <p>Ganancia ≈ 10 log₁₀(N) − 0,8 dBd</p>
        </Formula>
        <Nota>
          La ganancia es orientativa y cae con coaxial delgado o muchas secciones. 4 a 8 tramos de
          RG-213 o LMR-400 son el rango útil. Un choque en la base evita que la bajada forme parte
          de la antena.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='co-f'
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
          id='co-n'
          etiqueta={<Cota letra='N'>Número de secciones λ/2</Cota>}
          inputMode='numeric'
          value={secciones}
          onChange={setSecciones}
        />
        <Selector
          id='co-c'
          etiqueta='Coaxial'
          value={cableId}
          onChange={setCableId}
          opciones={OPCIONES_CABLE}
        />
      </Campo>
      {ok && segmento !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='S'>Cada segmento (λ/2 del coaxial)</Cota>}
            valor={formatearLongitud(segmento)}
          />
          <Fila
            etiqueta={<Cota letra='T'>Largo radiador total</Cota>}
            valor={formatearLongitud(n * segmento)}
          />
          <Fila
            etiqueta='Ganancia estimada'
            valor={`${formatearNumero(10 * Math.log10(n) - 0.8, 1)} dBd`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Colineal
