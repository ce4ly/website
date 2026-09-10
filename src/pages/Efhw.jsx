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
  frecuenciaValida,
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  LARGO_MEDIA_ONDA,
  longitudOnda,
  parseNumero
} from '../lib/calculadoras.js'

const EfhwDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 150"
        className="h-auto w-full"
        aria-labelledby="efhw-diagrama-titulo"
        role="img"
      >
        <title id="efhw-diagrama-titulo">
          Diagrama esquemático de antena EFHW con unun y contrapeso
        </title>

        {/* Contrapeso c */}
        <line
          x1="28"
          y1="68"
          x2="108"
          y2="68"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="28" cy="68" r="4" fill="currentColor" />

        {/* Radiador L */}
        <line
          x1="144"
          y1="68"
          x2="316"
          y2="68"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="316" cy="68" r="4" fill="currentColor" />

        {/* Unun */}
        <rect
          x="108"
          y="52"
          width="36"
          height="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="126"
          y="46"
          textAnchor="middle"
          className="fill-current font-sans text-[11px]"
        >
          unun
        </text>

        {/* Alimentación */}
        <circle
          cx="126"
          cy="68"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Cota c */}
        <line
          x1="28"
          y1="100"
          x2="108"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="28"
          y1="96"
          x2="28"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="108"
          y1="96"
          x2="108"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="68"
          y="118"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          c
        </text>

        {/* Cota L */}
        <line
          x1="144"
          y1="100"
          x2="316"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="144"
          y1="96"
          x2="144"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="316"
          y1="96"
          x2="316"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="230"
          y="118"
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

const EFHW = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const lambda = ok ? longitudOnda(mhz) : null
  const largo = ok ? LARGO_MEDIA_ONDA / mhz : null
  const contra05 = ok ? 0.05 * lambda : null
  const contra10 = ok ? 0.1 * lambda : null

  const armonicos = ok
    ? [1, 2, 3, 4, 5, 6, 8].map(n => ({
        n,
        mhz: n * mhz,
        largo: n * largo
      }))
    : []

  return (
    <CalculadoraLayout
      titulo="Calculadora EFHW 49:1"
      intro="End-fed half-wave con unun 49:1: largo del radiador, contrapeso y tramos armónicos."
    >
      <Articulo titulo="¿Qué es una EFHW?">
        <p className="text-justify">
          Una media onda alimentada por el extremo. La impedancia en esa punta
          es del orden de 2–5 kΩ; el unun 49:1 (relación de espiras 7:1) la
          acerca a 50 Ω (50 × 49 = 2450 Ω). Es la antena portable de HF más
          usada hoy: un mástil, un alambre y un pequeño transformador.
        </p>

        <EfhwDiagrama />

        <Formula>
          <p>L (m) ≈ 142,5 / f</p>
          <p>c₁ ≈ 0,05 λ &nbsp;&nbsp; c₂ ≈ 0,10 λ</p>
        </Formula>
        <Nota>
          El unun típico lleva 2 espiras en el primario y 14 en el secundario
          sobre ferita FT240-43 (HF). El contrapeso no es opcional: sin él el
          coaxial irradia. Recorte el alambre con analizador; en multibanda el
          largo se fija en la banda más baja.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="efhw-f" className={labelClass}>
            Frecuencia de media onda (MHz)
          </label>
          <input
            id="efhw-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
      </Campo>

      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="L">Radiador (λ/2)</Cota>}
            valor={formatearLongitud(largo)}
          />
          <Fila
            etiqueta={<Cota letra="c₁">Contrapeso corto (0,05 λ)</Cota>}
            valor={formatearLongitud(contra05)}
          />
          <Fila
            etiqueta={<Cota letra="c₂">Contrapeso cómodo (0,10 λ)</Cota>}
            valor={formatearLongitud(contra10)}
          />
          <Fila etiqueta="Impedancia del unun" valor="2450 Ω (49:1)" resaltar />
          {armonicos.map(({ n, mhz: fArm, largo: lArm }) => (
            <Fila
              key={n}
              etiqueta={`${n} × λ/2  (${formatearNumero(fArm, 3)} MHz)`}
              valor={formatearLongitud(lArm)}
            />
          ))}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default EFHW
