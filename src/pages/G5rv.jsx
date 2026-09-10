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

const G5rvDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 300"
        className="h-auto w-full"
        aria-labelledby="g5rv-diagrama-titulo"
        role="img"
      >
        <title id="g5rv-diagrama-titulo">
          Diagrama esquemático de G5RV y doble Zepp extendida
        </title>

        {/* Cota F */}
        <line
          x1="24"
          y1="22"
          x2="316"
          y2="22"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="18"
          x2="24"
          y2="26"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="316"
          y1="18"
          x2="316"
          y2="26"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="170"
          y="16"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          F
        </text>

        {/* Flattop G5RV */}
        <line
          x1="24"
          y1="48"
          x2="158"
          y2="48"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="182"
          y1="48"
          x2="316"
          y2="48"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="48" r="4" fill="currentColor" />
        <circle cx="316" cy="48" r="4" fill="currentColor" />
        <circle
          cx="170"
          cy="48"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Escalera E */}
        <line
          x1="162"
          y1="54"
          x2="162"
          y2="118"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="178"
          y1="54"
          x2="178"
          y2="118"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="162"
          y1="68"
          x2="178"
          y2="68"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="162"
          y1="88"
          x2="178"
          y2="88"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="162"
          y1="108"
          x2="178"
          y2="108"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Cota E */}
        <line
          x1="198"
          y1="54"
          x2="198"
          y2="118"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="194"
          y1="54"
          x2="202"
          y2="54"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="194"
          y1="118"
          x2="202"
          y2="118"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="214"
          y="90"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          E
        </text>

        {/* Hint de coaxial */}
        <line
          x1="166"
          y1="118"
          x2="166"
          y2="148"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="174"
          y1="118"
          x2="174"
          y2="148"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="184"
          y="142"
          textAnchor="start"
          className="fill-current font-sans text-[11px]"
        >
          coaxial
        </text>

        <text
          x="36"
          y="142"
          textAnchor="start"
          className="fill-current font-sans text-[11px]"
        >
          G5RV
        </text>

        {/* EDZ */}
        <text
          x="36"
          y="178"
          textAnchor="start"
          className="fill-current font-sans text-[11px]"
        >
          EDZ
        </text>

        {/* Cota 2Z */}
        <line
          x1="24"
          y1="190"
          x2="316"
          y2="190"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="186"
          x2="24"
          y2="194"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="316"
          y1="186"
          x2="316"
          y2="194"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="170"
          y="184"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          2Z
        </text>

        <line
          x1="24"
          y1="214"
          x2="158"
          y2="214"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="182"
          y1="214"
          x2="316"
          y2="214"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="214" r="4" fill="currentColor" />
        <circle cx="316" cy="214" r="4" fill="currentColor" />
        <circle
          cx="170"
          cy="214"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        <text
          x="91"
          y="208"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Z
        </text>
        <text
          x="249"
          y="208"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Z
        </text>

        {/* Escalera e */}
        <line
          x1="162"
          y1="220"
          x2="162"
          y2="268"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="178"
          y1="220"
          x2="178"
          y2="268"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="162"
          y1="234"
          x2="178"
          y2="234"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="162"
          y1="252"
          x2="178"
          y2="252"
          stroke="currentColor"
          strokeWidth="1"
        />

        <line
          x1="198"
          y1="220"
          x2="198"
          y2="268"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="194"
          y1="220"
          x2="202"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="194"
          y1="268"
          x2="202"
          y2="268"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="214"
          y="248"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          e
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const G5RV = () => {
  const [frecuencia, setFrecuencia] = useState('7,148')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const factor = ok ? 14.15 / mhz : 1
  const flattop = 31.09 * factor
  const escalera = 10.36 * factor
  const zeppBrazo = ok ? (0.64 * 300 * 0.95) / mhz : null
  const zeppTotal = ok ? 2 * zeppBrazo : null
  const zeppEscalera = ok ? (0.125 * 300 * 0.91) / mhz : null

  return (
    <CalculadoraLayout
      titulo="G5RV y Doble Zepp Extendida"
      intro="Largos del flattop y de la línea de escalera: ahí es donde más se equivoca la gente."
    >
      <Articulo titulo="G5RV clásica">
        <p className="text-justify">
          La G5RV de Louis Varney es un doublet de 31,09 m (102 ft) con 10,36 m
          (34 ft) de línea de 300–450 Ω, y después coaxial de 50 Ω. El tramo de
          escalera es un transformador: no lo corte «a ojo» ni lo reemplace por
          coaxial. La original está pensada alrededor de 14,15 MHz como 3λ/2;
          aquí puede escalarla a otra frecuencia.
        </p>

        <G5rvDiagrama />

        <Formula>
          <p>F = 31,09 m &nbsp; E = 10,36 m (clásico, escalable)</p>
          <p>Z ≈ 0,64 λ × 0,95 &nbsp;&nbsp; 2Z = 2 × Z</p>
          <p>e ≈ 0,125 λ × 0,91</p>
        </Formula>
        <Nota>
          La doble Zepp extendida (EDZ) tiene algo más de 5/8 de onda por lado
          (≈ 0,64 λ) y se alimenta con escalera más acoplador. La línea de 1/8 λ
          (VF 0,91) es el punto de partida; el largo exacto se afina con el
          tuner.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="g5-f" className={labelClass}>
            Frecuencia de diseño (MHz) — la G5RV original es 14,15
          </label>
          <input
            id="g5-f"
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
            etiqueta={<Cota letra="F">Flattop G5RV (3λ/2 escalado)</Cota>}
            valor={formatearLongitud(flattop)}
          />
          <Fila
            etiqueta={<Cota letra="E">Línea de escalera G5RV</Cota>}
            valor={formatearLongitud(escalera)}
          />
          <Fila
            etiqueta={<Cota letra="Z">Cada brazo EDZ (≈ 0,64 λ)</Cota>}
            valor={formatearLongitud(zeppBrazo)}
          />
          <Fila
            etiqueta={<Cota letra="2Z">EDZ total</Cota>}
            valor={formatearLongitud(zeppTotal)}
          />
          <Fila
            etiqueta={<Cota letra="e">Escalera EDZ (λ/8, VF 0,91)</Cota>}
            valor={formatearLongitud(zeppEscalera)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default G5RV
