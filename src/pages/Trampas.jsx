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
  formatearNumero,
  frecuenciaValida,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const Trampas = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [c, setC] = useState('50')
  const [l, setL] = useState('')
  const mhz = parseNumero(frecuencia)
  const cPf = parseNumero(c)
  const lUh = parseNumero(l)

  const lCalc =
    frecuenciaValida(mhz) && cPf > 0
      ? 1e6 / ((2 * Math.PI * mhz) ** 2 * cPf)
      : null
  const cCalc =
    frecuenciaValida(mhz) && lUh > 0
      ? 1e6 / ((2 * Math.PI * mhz) ** 2 * lUh)
      : null
  const lUsar = lUh > 0 ? lUh : lCalc
  const cUsar = cPf > 0 ? cPf : cCalc
  const xl = frecuenciaValida(mhz) && lUsar ? 2 * Math.PI * mhz * lUsar : null

  return (
    <CalculadoraLayout
      titulo="Trampas LC Resonantes"
      intro="Calcule L o C para que el paralelo resuene en la banda que quiere rechazar."
    >
      <Articulo titulo="Trampa en paralelo">
        <p className="text-justify">
          En la frecuencia de la trampa el paralelo LC es un circuito abierto y
          «corta» el alambre. Debajo de esa frecuencia la trampa se ve como una
          inductancia y alarga eléctricamente el resto. Típico: trampa de 40 m
          en un dipolo 80/40.
        </p>
        <Formula>
          <p>f = 1 / (2π √(LC))</p>
        </Formula>
        <Nota>
          Deje L o C vacío para calcularlo. Capacitores de alta tensión y Q;
          evite cerámicos de receptor. Una trampa coaxial es el mismo circuito
          con C y L del propio cable.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="tr-f" className={labelClass}>
            Frecuencia de resonancia (MHz)
          </label>
          <input
            id="tr-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tr-c" className={labelClass}>
            C (pF) — vacío para calcularlo
          </label>
          <input
            id="tr-c"
            className={inputClass}
            inputMode="decimal"
            value={c}
            onChange={e => setC(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tr-l" className={labelClass}>
            L (µH) — vacío para calcularlo
          </label>
          <input
            id="tr-l"
            className={inputClass}
            inputMode="decimal"
            value={l}
            onChange={e => setL(e.target.value)}
          />
        </div>
      </Campo>
      {frecuenciaValida(mhz) && (lCalc || cCalc) && (
        <Resultado>
          {cPf > 0 && (
            <Fila
              etiqueta="L necesaria"
              valor={`${formatearNumero(lCalc, 3)} µH`}
            />
          )}
          {lUh > 0 && (
            <Fila
              etiqueta="C necesaria"
              valor={`${formatearNumero(cCalc, 1)} pF`}
            />
          )}
          {xl && (
            <Fila
              etiqueta="XL = XC en resonancia"
              valor={`${formatearNumero(xl, 1)} Ω`}
              resaltar
            />
          )}
          {cUsar && lUsar && (
            <Fila
              etiqueta="Comprobación f"
              valor={`${formatearNumero(
                1000 / (2 * Math.PI * Math.sqrt(lUsar * cUsar)),
                3
              )} MHz`}
            />
          )}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Trampas
