import { useState } from 'react'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado
} from '../components/CalculadoraLayout.jsx'
import {
  CABLES,
  formatearNumero,
  frecuenciaValida,
  inputClass,
  labelClass,
  parseNumero,
  perdidaCableDbPor100m,
  perdidaLinea
} from '../lib/calculadoras.js'

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
  const cable = CABLES.find(c => c.id === cableId) || CABLES[0]
  const ok = frecuenciaValida(mhz) && len > 0 && s >= 1 && p > 0
  const db100 = ok ? perdidaCableDbPor100m(cable, mhz) : null
  const matched = ok ? (db100 * len) / 100 : null
  const r = ok ? perdidaLinea({ matchedDb: matched, swrCarga: s }) : null
  const pAntena = ok && r ? p * 10 ** (-r.totalDb / 10) : null

  return (
    <CalculadoraLayout
      titulo="Pérdida de Línea y ROE Real"
      intro="La ROE que ve el equipo no es la de la antena: el coaxial pierde ida y vuelta. Aquí se separan ambas."
    >
      <Articulo titulo="Pérdida extra por ROE">
        <p className="text-justify">
          Con línea sin pérdidas la ROE es igual en los dos extremos. Con
          pérdidas, la onda reflejada se atenúa y el equipo «ve» una ROE mejor
          de la que hay en la antena. Además, la pérdida total sube porque la
          potencia recorre el cable más de una vez.
        </p>
        <Formula>
          <p>α ≈ k₁√f + k₂ f &nbsp; (dB/100 m)</p>
          <p>|Γeq| = |Γant| × 10^(−αℓ/20)</p>
        </Formula>
        <Nota>
          Coeficientes aproximados de cables típicos; no reemplazan la hoja del
          fabricante. Útil para entender por qué 30 m de RG-58 en 70 cm
          «arreglan» el SWR y se comen la potencia.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="pe-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="pe-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 146,380"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pe-c" className={labelClass}>
            Cable
          </label>
          <select
            id="pe-c"
            className={inputClass}
            value={cableId}
            onChange={e => setCableId(e.target.value)}
          >
            {CABLES.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pe-l" className={labelClass}>
            Largo (m)
          </label>
          <input
            id="pe-l"
            className={inputClass}
            inputMode="decimal"
            value={largo}
            onChange={e => setLargo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pe-s" className={labelClass}>
            ROE en la antena
          </label>
          <input
            id="pe-s"
            className={inputClass}
            inputMode="decimal"
            value={swr}
            onChange={e => setSwr(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pe-p" className={labelClass}>
            Potencia del equipo (W)
          </label>
          <input
            id="pe-p"
            className={inputClass}
            inputMode="decimal"
            value={potencia}
            onChange={e => setPotencia(e.target.value)}
          />
        </div>
      </Campo>
      {ok && r && (
        <Resultado>
          <Fila
            etiqueta="Pérdida a ROE 1:1"
            valor={`${formatearNumero(r.matchedDb, 2)} dB`}
          />
          <Fila
            etiqueta="Pérdida extra por ROE"
            valor={`${formatearNumero(r.extraDb, 2)} dB`}
          />
          <Fila
            etiqueta="Pérdida total"
            valor={`${formatearNumero(r.totalDb, 2)} dB`}
          />
          <Fila
            etiqueta="Potencia que llega a la antena"
            valor={`${formatearNumero(pAntena, 1)} W`}
          />
          <Fila
            etiqueta="ROE que ve el equipo"
            valor={`${formatearNumero(r.swrEquipo, 2)} : 1`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default PerdidaLinea
