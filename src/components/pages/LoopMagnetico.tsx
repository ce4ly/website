import { useState } from 'react'

import {
  esPositivo,
  formatearLongitud,
  formatearNumero,
  frecuenciaValida,
  loopMagneticoAa5tb,
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
import Diagrama, { Alimentacion, CotaSvg, Etiqueta, Linea } from '../calculadora/Diagrama'

const LoopMagneticoDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de loop magnético con capacitor'
    viewBox='0 0 260 280'
    ancho='max-w-sm'
  >
    {/* Loop con abertura en la base */}
    <path
      d='M 96.2 190.5 A 80 80 0 1 1 163.8 190.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='5'
      strokeLinecap='round'
    />
    <CotaSvg x1={50} y1={118} x2={210} y2={118} letra='D' lx={130} ly={112} />
    <Etiqueta x={36} y={80}>
      P
    </Etiqueta>

    {/* d: diámetro del tubo, radial sobre el arco */}
    <Linea x1={184.8} y1={63.2} x2={188.3} y2={59.7} />
    <Linea x1={182.5} y1={61.5} x2={187} y2={66} />
    <Linea x1={186.1} y1={57.4} x2={190.6} y2={61.9} />
    <Etiqueta x={204} y={52}>
      d
    </Etiqueta>

    {/* Placas del capacitor C */}
    <Linea x1={90} y1={194} x2={90} y2={226} strokeWidth={3} strokeLinecap='round' />
    <Linea x1={170} y1={194} x2={170} y2={226} strokeWidth={3} strokeLinecap='round' />
    <Etiqueta x={130} y={250}>
      C
    </Etiqueta>

    <Alimentacion cx={130} cy={210} r={6} />
  </Diagrama>
)

const LoopMagnetico = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('1')
  const [tubo, setTubo] = useState('22')
  const [potencia, setPotencia] = useState('100')
  const mhz = parseNumero(frecuencia)
  const dLoop = parseNumero(diametro)
  const dTubo = parseNumero(tubo)
  const p = parseNumero(potencia)
  const ok =
    frecuenciaValida(mhz) && dLoop !== null && dLoop > 0.1 && esPositivo(dTubo) && esPositivo(p)
  const r = ok
    ? loopMagneticoAa5tb({ mhz, diametroLoopM: dLoop, diametroConductorMm: dTubo, potenciaW: p })
    : null
  // El modelo de loop pequeño vale mientras el perímetro sea menor que λ/4.
  const fraccionLambda = ok ? (Math.PI * dLoop) / (300 / mhz) : null

  return (
    <CalculadoraLayout
      titulo='Loop Magnético (STL)'
      intro='Capacidad de resonancia, Q, eficiencia, ancho de banda, corriente y tensión en el capacitor (AA5TB / ARRL).'
    >
      <Articulo titulo='Small transmitting loop'>
        <p className='text-justify'>
          Un loop pequeño (perímetro &lt; 0,25 λ, mejor ~0,1 λ) es un circuito RLC de Q altísimo.
          Irradia por la resistencia de radiación, minúscula frente a la reactancia; por eso el
          capacitor ve kilovoltios incluso con 100 W. El tubo grueso de cobre baja la resistencia
          óhmica y sube la eficiencia.
        </p>
        <LoopMagneticoDiagrama />
        <Formula>
          <p>Rr = 3,38×10⁻⁸ (f² A)²</p>
          <p>η = Rr / (Rr + Rl) &nbsp;&nbsp; Vc = √(P × XL × Q)</p>
        </Formula>
        <Nota>
          Fórmulas de AA5TB (unidades convertidas desde pies/pulgadas). No incluyen pérdidas del
          capacitor ni uniones: la eficiencia real será algo menor. Use capacitor de vacío o de aire
          de alta tensión; el variable de receptor suele arquear.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='stl-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='stl-d'
          etiqueta={<Cota letra='D'>Diámetro del loop (m)</Cota>}
          value={diametro}
          onChange={setDiametro}
        />
        <CampoNumero
          id='stl-t'
          etiqueta={<Cota letra='d'>Diámetro del conductor o tubo (mm)</Cota>}
          value={tubo}
          onChange={setTubo}
        />
        <CampoNumero id='stl-p' etiqueta='Potencia (W)' value={potencia} onChange={setPotencia} />
      </Campo>
      {r && fraccionLambda !== null && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra='P'>Perímetro (πD)</Cota>}
            valor={formatearLongitud(r.perimetro)}
          />
          <Fila
            etiqueta='Perímetro / λ'
            valor={`${formatearNumero(fraccionLambda, 3)}${
              fraccionLambda > 0.25 ? ' (grande: sale del modelo STL)' : ''
            }`}
          />
          <Fila etiqueta='Inductancia' valor={`${formatearNumero(r.Luh, 3)} µH`} />
          <Fila
            etiqueta={<Cota letra='C'>Capacitor de resonancia</Cota>}
            valor={`${formatearNumero(r.ctPf, 1)} pF`}
          />
          <Fila etiqueta='Resistencia de radiación' valor={`${formatearNumero(r.rr, 4)} Ω`} />
          <Fila
            etiqueta='Resistencia de pérdidas (cobre)'
            valor={`${formatearNumero(r.rl, 4)} Ω`}
          />
          <Fila
            etiqueta='Eficiencia'
            valor={`${formatearNumero(r.eta * 100, 1)} % (${formatearNumero(r.etaDb, 1)} dB)`}
          />
          <Fila etiqueta='Q' valor={formatearNumero(r.q, 0)} />
          <Fila etiqueta='Ancho de banda a −3 dB' valor={`${formatearNumero(r.bwKhz, 2)} kHz`} />
          <Fila etiqueta='Corriente circulante' valor={`${formatearNumero(r.iRms, 1)} A RMS`} />
          <Fila
            etiqueta='Tensión en el capacitor'
            valor={`${formatearNumero(r.vc, 0)} V`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default LoopMagnetico
