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
  longitudOnda,
  parseNumero
} from '../lib/calculadoras.js'

const VerticalCuartoOndaDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 320 270"
        className="h-auto w-full"
        aria-labelledby="vertical-diagrama-titulo"
        role="img"
      >
        <title id="vertical-diagrama-titulo">
          Diagrama esquemático de vertical λ/4 con radiales
        </title>

        {/* L: radiador λ/4 */}
        <line
          x1="160"
          y1="18"
          x2="160"
          y2="118"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="160" cy="18" r="4" fill="currentColor" />

        {/* Alimentación */}
        <circle
          cx="160"
          cy="118"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Re: radiales elevados (~90°) */}
        <line
          x1="48"
          y1="118"
          x2="152"
          y2="118"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="168"
          y1="118"
          x2="272"
          y2="118"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="118" r="4" fill="currentColor" />
        <circle cx="272" cy="118" r="4" fill="currentColor" />

        {/* Suelo */}
        <line
          x1="24"
          y1="188"
          x2="296"
          y2="188"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="196"
          x2="52"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="64"
          y1="196"
          x2="76"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="88"
          y1="196"
          x2="100"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="220"
          y1="196"
          x2="232"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="244"
          y1="196"
          x2="256"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="268"
          y1="196"
          x2="280"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Rt: radial enterrado sugerido */}
        <line
          x1="160"
          y1="204"
          x2="48"
          y2="204"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* Cota L */}
        <line
          x1="72"
          y1="18"
          x2="72"
          y2="118"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="68"
          y1="18"
          x2="76"
          y2="18"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="68"
          y1="118"
          x2="76"
          y2="118"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="60"
          y="72"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>

        {/* Cota Re */}
        <line
          x1="168"
          y1="96"
          x2="272"
          y2="96"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="168"
          y1="92"
          x2="168"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="272"
          y1="92"
          x2="272"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="220"
          y="90"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Re
        </text>

        {/* Cota Rt */}
        <line
          x1="48"
          y1="224"
          x2="160"
          y2="224"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="48"
          y1="220"
          x2="48"
          y2="228"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="160"
          y1="220"
          x2="160"
          y2="228"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="104"
          y="242"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Rt
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const VerticalCuartoOnda = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const lambda = ok ? longitudOnda(mhz) : null
  const radiador = ok ? (0.95 * 75) / mhz : null
  const radialElevado = ok ? (0.95 * 78) / mhz : null
  const radialEnterrado = ok ? 0.25 * lambda : null
  const radialCorto = ok ? 0.15 * lambda : null

  return (
    <CalculadoraLayout
      titulo="Vertical λ/4 con radiales"
      intro="Largo del radiador y de los radiales, y la diferencia entre radiales elevados y enterrados."
    >
      <Articulo titulo="Elevados vs enterrados">
        <p className="text-justify">
          Una vertical de cuarto de onda sobre un plano de tierra ideal presenta
          unos 36 Ω. Con radiales elevados (2–4 m sobre suelo, 3 o 4 hilos de
          λ/4) el plano es más eficiente y la impedancia sube hacia 50 Ω. Con
          radiales enterrados hace falta cantidad: 16 ya funcionan, 32–60 son
          mejores; el largo importa menos que el número.
        </p>

        <VerticalCuartoOndaDiagrama />

        <Formula>
          <p>L (m) ≈ 71 / f</p>
          <p>Re (m) ≈ 74 / f (un 5 % más largo)</p>
          <p>Rt = 0,25 λ &nbsp;&nbsp; Rc = 0,15 λ</p>
        </Formula>
        <Nota>
          Radiales elevados: 4 suelen bastar, simétricos. Enterrados: no los
          corte exactamente a λ/4; 0,15–0,40 λ y muchos. Con pocos radiales a
          tierra el radiador hay que acortarlo un poco y baja la eficiencia.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="v4-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="v4-f"
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
            etiqueta={<Cota letra="L">Radiador λ/4</Cota>}
            valor={formatearLongitud(radiador)}
          />
          <Fila
            etiqueta={<Cota letra="Re">Radial elevado (4 recomendados)</Cota>}
            valor={formatearLongitud(radialElevado)}
          />
          <Fila
            etiqueta={<Cota letra="Rt">Radial enterrado 0,25 λ</Cota>}
            valor={formatearLongitud(radialEnterrado)}
          />
          <Fila
            etiqueta={<Cota letra="Rc">Radial enterrado corto 0,15 λ</Cota>}
            valor={formatearLongitud(radialCorto)}
          />
          <Fila
            etiqueta="Cantidad sugerida enterrada"
            valor="16 a 32 (mejor 60)"
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default VerticalCuartoOnda
