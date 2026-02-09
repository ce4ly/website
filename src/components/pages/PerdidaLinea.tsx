import { useState } from 'react'

import {
  CABLES,
  esPositivo,
  formatearNumero,
  frecuenciaValida,
  parseNumero,
  perdidaCableDbPor100m,
  perdidaLinea,
} from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, Selector } from '../calculadora/Campos'

const OPCIONES_CABLE = CABLES.map((c) => ({ value: c.id, label: c.nombre }))

const PerdidaLinea = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [largo, setLargo] = useState('30')
  const [swr, setSwr] = useState('2')
  const [potencia, setPotencia] = useState('100')
  const [cableId, setCableId] = useState('rg58')
  const mhz = parseNumero(frecuencia)
  const len = parseNumero(largo)
  const s = parseNumero(swr)
  const p = parseNumero(potencia)
  const cable = CABLES.find((c) => c.id === cableId) ?? CABLES[0]
  const ok = frecuenciaValida(mhz) && esPositivo(len) && s !== null && s >= 1 && esPositivo(p)
  const r = ok
    ? perdidaLinea({ matchedDb: (perdidaCableDbPor100m(cable, mhz) * len) / 100, swrCarga: s })
    : null

  return (
    <CalculadoraLayout
      titulo='Pérdida de Línea y ROE Real'
      intro='La ROE que ve el equipo no es la de la antena: el coaxial pierde ida y vuelta. Aquí se separan ambas.'
    >
      <Articulo titulo='Pérdida extra por ROE'>
        <p className='text-justify'>
          Con línea sin pérdidas la ROE es igual en los dos extremos. Con pérdidas, la onda
          reflejada se atenúa y el equipo «ve» una ROE mejor de la que hay en la antena. Además, la
          pérdida total sube porque la potencia recorre el cable más de una vez.
        </p>
        <Formula>
          <p>α ≈ k₁√f + k₂ f &nbsp; (dB/100 m)</p>
          <p>|Γeq| = |Γant| × 10^(−αℓ/20)</p>
        </Formula>
        <Nota>
          Coeficientes aproximados de cables típicos; no reemplazan la hoja del fabricante. Útil
          para entender por qué 30 m de RG-58 en 70 cm «arreglan» el SWR y se comen la potencia.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='pe-f'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 146,380'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <Selector
          id='pe-c'
          etiqueta='Cable'
          value={cableId}
          onChange={setCableId}
          opciones={OPCIONES_CABLE}
        />
        <CampoNumero id='pe-l' etiqueta='Largo (m)' value={largo} onChange={setLargo} />
        <CampoNumero id='pe-s' etiqueta='ROE en la antena' value={swr} onChange={setSwr} />
        <CampoNumero
          id='pe-p'
          etiqueta='Potencia del equipo (W)'
          value={potencia}
          onChange={setPotencia}
        />
      </Campo>
      {ok && r && (
        <Resultado>
          <Fila etiqueta='Pérdida a ROE 1:1' valor={`${formatearNumero(r.matchedDb, 2)} dB`} />
          <Fila etiqueta='Pérdida extra por ROE' valor={`${formatearNumero(r.extraDb, 2)} dB`} />
          <Fila etiqueta='Pérdida total' valor={`${formatearNumero(r.totalDb, 2)} dB`} />
          <Fila
            etiqueta='Potencia que llega a la antena'
            valor={`${formatearNumero(p * 10 ** (-r.totalDb / 10), 1)} W`}
          />
          <Fila
            etiqueta='ROE que ve el equipo'
            valor={`${formatearNumero(r.swrEquipo, 2)} : 1`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default PerdidaLinea
