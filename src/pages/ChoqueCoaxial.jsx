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
  frecuenciaValida,
  formatearNumero,
  inputClass,
  inductanciaWheelerUh,
  labelClass,
  parseNumero,
  vueltasParaInductancia
} from '../lib/calculadoras.js'

const ChoqueCoaxial = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('40')
  const [xl, setXl] = useState('1000')
  const mhz = parseNumero(frecuencia)
  const d = parseNumero(diametro)
  const x = parseNumero(xl)
  const ok = frecuenciaValida(mhz) && d > 5 && x > 0
  const lUh = ok ? x / (2 * Math.PI * mhz) : null
  const paso = 6
  const vueltas = ok ? vueltasParaInductancia(lUh, d, paso) : null
  const largo = ok && vueltas ? vueltas * paso : null
  const lCheck = ok && vueltas ? inductanciaWheelerUh(d, largo, vueltas) : null

  return (
    <CalculadoraLayout
      titulo="Choque de coaxial (balun 1:1)"
      intro="Vueltas y diámetro del formero para que la reactancia del choque sea alta en la banda de trabajo."
    >
      <Articulo titulo="Corriente en la malla">
        <p className="text-justify">
          Un choque de aire (o sobre PVC) presenta XL alta a la corriente que
          quiere volver por fuera de la malla. Se busca XL ≥ 10 × Z₀, a menudo
          500–1000 Ω. En VHF bastan pocas vueltas; en 80 m hacen falta más o
          feritas (31/43).
        </p>
        <Formula>
          <p>L (µH) = XL / (2π f) &nbsp;&nbsp; Vueltas según Wheeler</p>
        </Formula>
        <Nota>
          Paso de 6 mm, típico de RG-58. Si al tocar el coaxial bajo el choque
          cambia el SWR, faltan vueltas o hay que usar toroide.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="ch-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="ch-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ch-d" className={labelClass}>
            Diámetro del formero (mm)
          </label>
          <input
            id="ch-d"
            className={inputClass}
            inputMode="decimal"
            value={diametro}
            onChange={e => setDiametro(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ch-x" className={labelClass}>
            XL objetivo (Ω)
          </label>
          <input
            id="ch-x"
            className={inputClass}
            inputMode="decimal"
            value={xl}
            onChange={e => setXl(e.target.value)}
          />
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta="Inductancia necesaria"
            valor={`${formatearNumero(lUh, 2)} µH`}
          />
          <Fila
            etiqueta="Vueltas (RG-58, paso 6 mm)"
            valor={formatearNumero(vueltas, 1)}
          />
          <Fila
            etiqueta="Largo de la bobina"
            valor={`${formatearNumero(largo, 0)} mm`}
          />
          <Fila
            etiqueta="Wheeler resultante"
            valor={`${formatearNumero(lCheck, 2)} µH`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default ChoqueCoaxial
