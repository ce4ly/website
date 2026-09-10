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
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const GroundPlaneDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 300 260"
        className="h-auto w-full"
        aria-labelledby="groundplane-diagrama-titulo"
        role="img"
      >
        <title id="groundplane-diagrama-titulo">
          Diagrama esquemático de antena ground plane a 45°
        </title>

        {/* L: radiador vertical */}
        <line
          x1="150"
          y1="20"
          x2="150"
          y2="122"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="150" cy="20" r="4" fill="currentColor" />

        {/* Alimentación */}
        <circle
          cx="150"
          cy="122"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* R: radiales caídos a 45° */}
        <line
          x1="150"
          y1="122"
          x2="88"
          y2="184"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="150"
          y1="122"
          x2="212"
          y2="184"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="88" cy="184" r="4" fill="currentColor" />
        <circle cx="212" cy="184" r="4" fill="currentColor" />

        {/* Referencia horizontal y arco 45° */}
        <line
          x1="150"
          y1="122"
          x2="198"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <path
          d="M 190 122 A 40 40 0 0 1 178.28 150.28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="204"
          y="148"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          45°
        </text>

        {/* Cota L */}
        <line
          x1="48"
          y1="20"
          x2="48"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="20"
          x2="52"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="122"
          x2="52"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="76"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>

        {/* Cota R (radial izquierdo) */}
        <line
          x1="128"
          y1="108"
          x2="66"
          y2="170"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="124"
          y1="104"
          x2="132"
          y2="112"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="62"
          y1="166"
          x2="70"
          y2="174"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="78"
          y="128"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          R
        </text>

        {/* Cota h (caída vertical) */}
        <line
          x1="250"
          y1="122"
          x2="250"
          y2="184"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="246"
          y1="122"
          x2="254"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="246"
          y1="184"
          x2="254"
          y2="184"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="212"
          y1="184"
          x2="246"
          y2="184"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="262"
          y="158"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          h
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const GroundPlane = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const radiador = ok ? (0.95 * 71) / mhz : null
  const radial = ok ? (0.95 * 75) / mhz : null
  const caida = ok ? radial * Math.sin((45 * Math.PI) / 180) : null

  return (
    <CalculadoraLayout
      titulo="Ground Plane λ/4 a 45°"
      intro="La vertical más básica en VHF/UHF: radiador de cuarto de onda y radiales caídos a 45° para acercar la impedancia a 50 Ω."
    >
      <Articulo titulo="Por qué 45°">
        <p className="text-justify">
          Con radiales horizontales la impedancia queda cerca de 36 Ω. Al
          bajarlos a unos 45° sube hacia 50 Ω y no hace falta matching. Tres o
          cuatro radiales bastan.
        </p>

        <GroundPlaneDiagrama />

        <Formula>
          <p>L (m) ≈ 67,5 / f</p>
          <p>R (m) ≈ 71 / f</p>
          <p>h = R · sin(45°)</p>
        </Formula>
        <Nota>
          El radiador se deja un pelo más corto que el radial. Recorte con SWR;
          cerca de un mástil metálico las medidas cambian.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="gp-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="gp-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 146,380"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="L">Radiador</Cota>}
            valor={formatearLongitud(radiador)}
          />
          <Fila
            etiqueta={<Cota letra="R">Cada radial (3 o 4)</Cota>}
            valor={formatearLongitud(radial)}
          />
          <Fila
            etiqueta={<Cota letra="h">Caída vertical a 45°</Cota>}
            valor={formatearLongitud(caida)}
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default GroundPlane
