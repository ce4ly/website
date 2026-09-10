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
  moxonCebik,
  parseNumero
} from '../lib/calculadoras.js'

const MoxonDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 280"
        className="h-auto w-full"
        aria-labelledby="moxon-diagrama-titulo"
        role="img"
      >
        <title id="moxon-diagrama-titulo">
          Diagrama esquemático de antena Moxon (vista cenital)
        </title>

        {/* Reflector (lado posterior) */}
        <line
          x1="70"
          y1="36"
          x2="270"
          y2="36"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Colas D del reflector */}
        <line
          x1="70"
          y1="36"
          x2="70"
          y2="88"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="270"
          y1="36"
          x2="270"
          y2="88"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="70" cy="88" r="4" fill="currentColor" />
        <circle cx="270" cy="88" r="4" fill="currentColor" />

        {/* Colas B del excitado */}
        <line
          x1="70"
          y1="132"
          x2="70"
          y2="200"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="270"
          y1="132"
          x2="270"
          y2="200"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="70" cy="132" r="4" fill="currentColor" />
        <circle cx="270" cy="132" r="4" fill="currentColor" />

        {/* Excitado A */}
        <line
          x1="70"
          y1="200"
          x2="158"
          y2="200"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="182"
          y1="200"
          x2="270"
          y2="200"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Feed en el centro de A */}
        <circle
          cx="170"
          cy="200"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Cota A */}
        <line
          x1="70"
          y1="232"
          x2="270"
          y2="232"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="70"
          y1="228"
          x2="70"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="270"
          y1="228"
          x2="270"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="170"
          y="250"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          A
        </text>

        {/* Cota B (cola excitado, izquierda) */}
        <line
          x1="48"
          y1="132"
          x2="48"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="132"
          x2="52"
          y2="132"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="200"
          x2="52"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="172"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          B
        </text>

        {/* Cota C (gap) */}
        <line
          x1="48"
          y1="88"
          x2="48"
          y2="132"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="88"
          x2="52"
          y2="88"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="132"
          x2="52"
          y2="132"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="116"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          C
        </text>

        {/* Cota D (cola reflector) */}
        <line
          x1="48"
          y1="36"
          x2="48"
          y2="88"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="36"
          x2="52"
          y2="36"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="88"
          x2="52"
          y2="88"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="68"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          D
        </text>

        {/* Cota E (profundidad) */}
        <line
          x1="300"
          y1="36"
          x2="300"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="296"
          y1="36"
          x2="304"
          y2="36"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="296"
          y1="200"
          x2="304"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="318"
          y="124"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          E
        </text>
      </svg>
      <PieDiagrama>
        Vista cenital (no a escala). Las letras coinciden con las medidas.
      </PieDiagrama>
    </figure>
  )
}

const Moxon = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('2')
  const mhz = parseNumero(frecuencia)
  const d = parseNumero(diametro)
  const ok = frecuenciaValida(mhz) && d > 0
  const m = ok ? moxonCebik(mhz, d) : null

  return (
    <CalculadoraLayout
      titulo="Calculadora Moxon"
      intro="Rectángulo de Moxon con las ecuaciones de Cebik (W4RNL): directiva compacta de 2 elementos y cerca de 50 Ω."
    >
      <Articulo titulo="A, B, C, D y E">
        <p className="text-justify">
          La Moxon dobla las puntas del excitado y del reflector hasta casi
          tocarse. Cabe en menos de la mitad del vano de una yagi de 2
          elementos, da ~6 dBi y un F/B notable, y se alimenta en 50 Ω. Las
          cotas dependen del diámetro del alambre o tubo.
        </p>

        <MoxonDiagrama />

        <Formula>
          <p>A = ancho (excitado) &nbsp; E = profundidad (B+C+D)</p>
          <p>
            B = cola del excitado &nbsp; C = gap &nbsp; D = cola del reflector
          </p>
        </Formula>
        <Nota>
          Coeficientes de Cebik / MoxGen. Válidos sobre todo con el mismo
          diámetro en todo el rectángulo. D1 = log₁₀(d/λ).
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="mx-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="mx-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="mx-d" className={labelClass}>
            <Cota letra="d">Diámetro del conductor (mm)</Cota>
          </label>
          <input
            id="mx-d"
            className={inputClass}
            inputMode="decimal"
            value={diametro}
            onChange={e => setDiametro(e.target.value)}
          />
        </div>
      </Campo>
      {ok && m && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="A">Ancho del excitado</Cota>}
            valor={formatearLongitud(m.A)}
          />
          <Fila
            etiqueta={<Cota letra="B">Cola del excitado</Cota>}
            valor={formatearLongitud(m.B)}
          />
          <Fila
            etiqueta={<Cota letra="C">Separación entre colas</Cota>}
            valor={formatearLongitud(m.C)}
          />
          <Fila
            etiqueta={<Cota letra="D">Cola del reflector</Cota>}
            valor={formatearLongitud(m.D)}
          />
          <Fila
            etiqueta={<Cota letra="E">Profundidad B+C+D</Cota>}
            valor={formatearLongitud(m.E)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Moxon
