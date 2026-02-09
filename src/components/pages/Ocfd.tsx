import { useState } from 'react'

import {
  LARGO_MEDIA_ONDA,
  formatearLongitud,
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
  Linea,
  Punta,
  Rotulo,
} from '../calculadora/Diagrama'

const OcfdDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de dipolo alimentado fuera de centro'
    viewBox='0 0 340 180'
  >
    <CotaSvg x1={28} y1={28} x2={312} y2={28} letra='T' lx={170} ly={22} />

    {/* Brazo corto C y brazo largo L, alimentados en el offset */}
    <Alambre x1={28} y1={72} x2={118} y2={72} />
    <Punta cx={28} cy={72} />
    <Alambre x1={142} y1={72} x2={312} y2={72} />
    <Punta cx={312} cy={72} />
    <Alimentacion cx={130} cy={72} />

    {/* Bajada coaxial */}
    <Linea x1={124} y1={79} x2={124} y2={148} strokeWidth={2} />
    <Linea x1={136} y1={79} x2={136} y2={148} strokeWidth={2} />
    <Rotulo x={146} y={140}>
      alimentación
    </Rotulo>

    <CotaSvg x1={28} y1={100} x2={118} y2={100} letra='C' lx={73} ly={116} />
    <CotaSvg x1={142} y1={100} x2={312} y2={100} letra='L' lx={227} ly={116} />
  </Diagrama>
)

/** Offset ~33 % → balun 4:1; más cerca del extremo (~20 %) → 6:1. */
const balunSugerido = (pct: number) => (pct >= 28 && pct <= 36 ? '4:1 (≈ 200 Ω)' : '6:1 (≈ 300 Ω)')

const Ocfd = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [offset, setOffset] = useState('33')
  const mhz = parseNumero(frecuencia)
  const pct = parseNumero(offset)
  const ok = frecuenciaValida(mhz) && pct !== null && pct > 5 && pct < 49
  const total = ok ? LARGO_MEDIA_ONDA / mhz : null

  return (
    <CalculadoraLayout
      titulo='OCFD / Windom'
      intro='Dipolo alimentado fuera de centro: brazos al 33 % (o el porcentaje que elija) y balun 4:1 o 6:1.'
    >
      <Articulo titulo='Windom moderno'>
        <p className='text-justify'>
          El OCFD (off-center-fed dipole) se alimenta a un tercio de un extremo, no en el centro.
          Eso permite varias bandas armónicas con un solo alambre. El Windom clásico usaba un solo
          hilo de bajada; el OCFD actual usa balun 4:1 (offset ~33 %) o 6:1 (offset ~20 %).
        </p>
        <OcfdDiagrama />
        <Formula>
          <p>T (m) ≈ 142,5 / f</p>
          <p>C = (p/100) × T &nbsp;&nbsp; L = T − C</p>
        </Formula>
        <Nota>
          El OCFD clásico de 80 m (unos 41 m de largo, entrando 3,5 MHz) al 33 % con balún 4:1 cubre
          de forma típica 80/40/20/10 m. Un choque 1:1 en el coaxial, a unos 0,05–0,1 λ de la caja
          del balun, evita que la malla irradie.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='ocfd-f'
          etiqueta='Frecuencia de media onda (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='ocfd-p'
          etiqueta={<Cota letra='p'>Offset desde un extremo (%)</Cota>}
          value={offset}
          onChange={setOffset}
        />
      </Campo>
      {ok && total !== null && (
        <Resultado>
          <Fila etiqueta={<Cota letra='T'>Largo total</Cota>} valor={formatearLongitud(total)} />
          <Fila
            etiqueta={<Cota letra='C'>Brazo corto</Cota>}
            valor={formatearLongitud(total * (pct / 100))}
          />
          <Fila
            etiqueta={<Cota letra='L'>Brazo largo</Cota>}
            valor={formatearLongitud(total * (1 - pct / 100))}
          />
          <Fila etiqueta='Balun sugerido' valor={balunSugerido(pct)} resaltar />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Ocfd
