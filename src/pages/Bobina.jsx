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
  inputClass,
  inductanciaWheelerUh,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const Bobina = () => {
  const [vueltas, setVueltas] = useState('10')
  const [diametro, setDiametro] = useState('25')
  const [largo, setLargo] = useState('20')
  const n = parseNumero(vueltas)
  const d = parseNumero(diametro)
  const l = parseNumero(largo)
  const ok = n > 0 && d > 0 && l > 0
  const lUh = ok ? inductanciaWheelerUh(d, l, n) : null
  const ratio = ok ? l / d : null

  return (
    <CalculadoraLayout
      titulo="Inductancia de solenoide (Wheeler)"
      intro="Bobinas de carga y trampas: L a partir de vueltas, diámetro y largo."
    >
      <Articulo titulo="Fórmula de Wheeler">
        <p className="text-justify">
          La fórmula de 1928 de H. A. Wheeler es precisa cuando el largo es al
          menos ~0,4 veces el diámetro. Sirve para cargas de verticales, trampas
          y choques de aire.
        </p>
        <Formula>
          <p>L (µH) = d² n² / (18d + 40ℓ) &nbsp; (d y ℓ en pulgadas)</p>
        </Formula>
        <Nota>
          No incluye capacidad parásita ni frecuencia de autorresonancia. Para
          trampas, mida después con dipmeter o VNA.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="bo-n" className={labelClass}>
            Vueltas
          </label>
          <input
            id="bo-n"
            className={inputClass}
            inputMode="decimal"
            value={vueltas}
            onChange={e => setVueltas(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bo-d" className={labelClass}>
            Diámetro (mm)
          </label>
          <input
            id="bo-d"
            className={inputClass}
            inputMode="decimal"
            value={diametro}
            onChange={e => setDiametro(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bo-l" className={labelClass}>
            Largo de la bobina (mm)
          </label>
          <input
            id="bo-l"
            className={inputClass}
            inputMode="decimal"
            value={largo}
            onChange={e => setLargo(e.target.value)}
          />
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta="Inductancia"
            valor={`${formatearNumero(lUh, 3)} µH`}
          />
          <Fila
            etiqueta="Relación largo/diámetro"
            valor={formatearNumero(ratio, 2)}
          />
          {ratio < 0.4 && (
            <Fila
              etiqueta="Aviso"
              valor="ℓ/d < 0,4: Wheeler pierde precisión"
              resaltar
            />
          )}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Bobina
