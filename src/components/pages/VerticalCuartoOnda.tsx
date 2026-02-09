import { useState } from 'react'

import {
  VF_ALAMBRE,
  formatearLongitud,
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
import Diagrama, { Alambre, Alimentacion, CotaSvg, Punta, Suelo } from '../calculadora/Diagrama'

const VerticalCuartoOndaDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de vertical λ/4 con radiales'
    viewBox='0 0 320 270'
    ancho='max-w-sm'
  >
    {/* L: radiador λ/4 */}
    <Alambre x1={160} y1={18} x2={160} y2={118} />
    <Punta cx={160} cy={18} />
    <Alimentacion cx={160} cy={118} r={5} />

    {/* Re: radiales elevados (~90°) */}
    <Alambre x1={48} y1={118} x2={152} y2={118} />
    <Alambre x1={168} y1={118} x2={272} y2={118} />
    <Punta cx={48} cy={118} />
    <Punta cx={272} cy={118} />

    <Suelo x1={24} x2={296} y={188} marcas={[40, 64, 88, 220, 244, 268]} />

    {/* Rt: radial enterrado sugerido */}
    <Alambre x1={160} y1={204} x2={48} y2={204} grosor={2} strokeDasharray='5 4' />

    <CotaSvg x1={72} y1={18} x2={72} y2={118} letra='L' lx={60} ly={72} />
    <CotaSvg x1={168} y1={96} x2={272} y2={96} letra='Re' lx={220} ly={90} />
    <CotaSvg x1={48} y1={224} x2={160} y2={224} letra='Rt' lx={104} ly={242} />
  </Diagrama>
)

const VerticalCuartoOnda = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const lambda = ok ? longitudOnda(mhz) : null

  return (
    <CalculadoraLayout
      titulo='Vertical λ/4 con Radiales'
      intro='Largo del radiador y de los radiales, y la diferencia entre radiales elevados y enterrados.'
    >
      <Articulo titulo='Elevados vs enterrados'>
        <p className='text-justify'>
          Una vertical de cuarto de onda sobre un plano de tierra ideal presenta unos 36 Ω. Con
          radiales elevados (2–4 m sobre suelo, 3 o 4 hilos de λ/4) el plano es más eficiente y la
          impedancia sube hacia 50 Ω. Con radiales enterrados hace falta cantidad: 16 ya funcionan,
          32–60 son mejores; el largo importa menos que el número.
        </p>

        <VerticalCuartoOndaDiagrama />

        <Formula>
          <p>L (m) ≈ 71 / f</p>
          <p>Re (m) ≈ 74 / f (un 4 % más largo)</p>
          <p>Rt = 0,25 λ &nbsp;&nbsp; Rc = 0,15 λ</p>
        </Formula>
        <Nota>
          Radiales elevados: 4 suelen bastar, simétricos. Enterrados: no los corte exactamente a
          λ/4; 0,15–0,40 λ y muchos. Con pocos radiales a tierra el radiador hay que acortarlo un
          poco y baja la eficiencia.
        </Nota>
      </Articulo>

      <Campo>
        <CampoNumero
          id='v4-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
      </Campo>

      {ok && lambda !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='L'>Radiador λ/4</Cota>}
            valor={formatearLongitud((VF_ALAMBRE * 75) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='Re'>Radial elevado (4 recomendados)</Cota>}
            valor={formatearLongitud((VF_ALAMBRE * 78) / mhz)}
          />
          <Fila
            etiqueta={<Cota letra='Rt'>Radial enterrado 0,25 λ</Cota>}
            valor={formatearLongitud(0.25 * lambda)}
          />
          <Fila
            etiqueta={<Cota letra='Rc'>Radial enterrado corto 0,15 λ</Cota>}
            valor={formatearLongitud(0.15 * lambda)}
          />
          <Fila etiqueta='Cantidad sugerida enterrada' valor='16 a 32 (mejor 60)' resaltar />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default VerticalCuartoOnda
