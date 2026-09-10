import { useState } from 'react'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Cota,
  Fila,
  Formula,
  Nota,
  PieDiagrama,
  Resultado
} from '../components/CalculadoraLayout.jsx'
import {
  CABLES,
  frecuenciaValida,
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const LineaQDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 160"
        className="h-auto w-full"
        aria-labelledby="lineaq-diagrama-titulo"
        role="img"
      >
        <title id="lineaq-diagrama-titulo">
          Diagrama de línea Q de cuarto de onda
        </title>

        <rect
          x="16"
          y="48"
          width="64"
          height="40"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="48"
          y="74"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Z₁
        </text>

        <rect
          x="260"
          y="48"
          width="64"
          height="40"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="292"
          y="74"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Z₂
        </text>

        <line
          x1="80"
          y1="64"
          x2="260"
          y2="64"
          stroke="currentColor"
          strokeWidth="3"
        />
        <line
          x1="80"
          y1="72"
          x2="260"
          y2="72"
          stroke="currentColor"
          strokeWidth="3"
        />
        <text
          x="170"
          y="56"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Zq
        </text>

        <line
          x1="80"
          y1="112"
          x2="260"
          y2="112"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="80"
          y1="108"
          x2="80"
          y2="116"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="260"
          y1="108"
          x2="260"
          y2="116"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="170"
          y="132"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const LineaQ = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [z1, setZ1] = useState('50')
  const [z2, setZ2] = useState('112')
  const [cableId, setCableId] = useState('rg59')
  const mhz = parseNumero(frecuencia)
  const a = parseNumero(z1)
  const b = parseNumero(z2)
  const cable = CABLES.find(c => c.id === cableId) || CABLES[0]
  const ok = frecuenciaValida(mhz) && a > 0 && b > 0
  const zq = ok ? Math.sqrt(a * b) : null
  const largo = ok ? (cable.vf * 75) / mhz : null

  return (
    <CalculadoraLayout
      titulo="Línea Q (λ/4 de adaptación)"
      intro="Tramo de cuarto de onda cuya impedancia es la media geométrica de las dos que quiere unir. VF según el cable."
    >
      <Articulo titulo="Transformador de cuarto de onda">
        <p className="text-justify">
          Un λ/4 de impedancia Zq transforma Zin en Zout si Zq = √(Zin × Zout).
          El ejemplo clásico es un loop de ~112 Ω a 50 Ω con RG-59/RG-11 de 75
          Ω.
        </p>

        <LineaQDiagrama />

        <Formula>
          <p>Zq = √(Z₁ Z₂) &nbsp;&nbsp; L = VF × 75 / f</p>
        </Formula>
        <Nota>
          El largo es eléctrico: use el VF del cable, no el del aire. La
          adaptación es estrecha (una banda); para varias bandas no sirve.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="q-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="q-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="q-1" className={labelClass}>
            <Cota letra="Z₁">(Ω)</Cota>
          </label>
          <input
            id="q-1"
            className={inputClass}
            inputMode="decimal"
            value={z1}
            onChange={e => setZ1(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="q-2" className={labelClass}>
            <Cota letra="Z₂">(Ω)</Cota>
          </label>
          <input
            id="q-2"
            className={inputClass}
            inputMode="decimal"
            value={z2}
            onChange={e => setZ2(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="q-c" className={labelClass}>
            Tipo de cable
          </label>
          <select
            id="q-c"
            className={inputClass}
            value={cableId}
            onChange={e => setCableId(e.target.value)}
          >
            {CABLES.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} — VF {c.vf}
              </option>
            ))}
          </select>
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="Zq">Impedancia de la línea</Cota>}
            valor={`${formatearNumero(zq, 1)} Ω`}
          />
          <Fila
            etiqueta={<Cota letra="L">{`Largo λ/4 (${cable.nombre})`}</Cota>}
            valor={formatearLongitud(largo)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default LineaQ
