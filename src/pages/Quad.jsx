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

const QuadDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 360 230"
        className="h-auto w-full"
        aria-labelledby="quad-diagrama-titulo"
        role="img"
      >
        <title id="quad-diagrama-titulo">
          Diagrama esquemático de cuadro cúbico (quad)
        </title>

        {/* Reflector R (más grande, atrás) */}
        <rect
          x="28"
          y="36"
          width="100"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <text
          x="78"
          y="28"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          R
        </text>

        {/* Excitado E */}
        <rect
          x="148"
          y="46"
          width="80"
          height="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="188"
          cy="126"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />
        <text
          x="188"
          y="38"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          E
        </text>

        {/* Director Dir (más chico) */}
        <rect
          x="256"
          y="56"
          width="60"
          height="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <text
          x="286"
          y="48"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Dir
        </text>

        {/* Cota s entre R y E */}
        <line
          x1="128"
          y1="168"
          x2="148"
          y2="168"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="128"
          y1="164"
          x2="128"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="148"
          y1="164"
          x2="148"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="138"
          y="186"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          s
        </text>

        {/* Cota s entre E y Dir */}
        <line
          x1="228"
          y1="168"
          x2="256"
          y2="168"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="228"
          y1="164"
          x2="228"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="256"
          y1="164"
          x2="256"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="242"
          y="186"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          s
        </text>
      </svg>
      <PieDiagrama>
        Vista esquemática (no a escala). Las letras coinciden con las medidas.
      </PieDiagrama>
    </figure>
  )
}

const Quad = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [elementos, setElementos] = useState('2')
  const mhz = parseNumero(frecuencia)
  const n = Math.round(parseNumero(elementos) || 0)
  const ok = frecuenciaValida(mhz) && n >= 2 && n <= 4
  const driven = ok ? 306.3 / mhz : null
  const reflector = ok ? 313.9 / mhz : null
  const director = ok ? 297.2 / mhz : null
  const espacio = ok ? (0.2 * 300) / mhz : null

  return (
    <CalculadoraLayout
      titulo="Cuadro cúbico (quad)"
      intro="Perímetros de reflector, radiador y director, y el espaciado típico de 0,20 λ."
    >
      <Articulo titulo="Loops en fase">
        <p className="text-justify">
          Cada elemento es un cuadro de aproximadamente una onda. El reflector
          es un 2,5 % más grande y el director un 3 % más chico. Dos elementos
          ya son una directiva seria en HF; tres o cuatro en VHF.
        </p>

        <QuadDiagrama />

        <Formula>
          <p>E ≈ 306 / f &nbsp; R ≈ 314 / f &nbsp; Dir ≈ 297 / f</p>
          <p>s ≈ 0,20 λ</p>
        </Formula>
        <Nota>
          Equivale a 1005/f, 1030/f y 975/f en pies. Alimente el cuadro excitado
          en el centro del lado inferior (H) o en un lado (V).
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
          <label htmlFor="q-n" className={labelClass}>
            Elementos
          </label>
          <select
            id="q-n"
            className={inputClass}
            value={elementos}
            onChange={e => setElementos(e.target.value)}
          >
            <option value="2">2 (reflector + excitado)</option>
            <option value="3">3 (+ director)</option>
            <option value="4">4 (+ 2 directores)</option>
          </select>
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="R">Reflector (perímetro / lado)</Cota>}
            valor={`${formatearLongitud(reflector)} / ${formatearLongitud(reflector / 4)}`}
          />
          <Fila
            etiqueta={<Cota letra="E">Excitado (perímetro / lado)</Cota>}
            valor={`${formatearLongitud(driven)} / ${formatearLongitud(driven / 4)}`}
          />
          {n >= 3 && (
            <Fila
              etiqueta={<Cota letra="Dir">Director (perímetro / lado)</Cota>}
              valor={`${formatearLongitud(director)} / ${formatearLongitud(director / 4)}`}
            />
          )}
          {n >= 4 && (
            <Fila
              etiqueta="2.º director (~1 % más corto)"
              valor={`${formatearLongitud(director * 0.99)} / ${formatearLongitud((director * 0.99) / 4)}`}
            />
          )}
          <Fila
            etiqueta={<Cota letra="s">Espacio entre cuadros</Cota>}
            valor={formatearLongitud(espacio)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Quad
