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
  longitudOnda,
  parseNumero
} from '../lib/calculadoras.js'

const GammaHairpinDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 360 220"
        className="h-auto w-full"
        aria-labelledby="gamma-diagrama-titulo"
        role="img"
      >
        <title id="gamma-diagrama-titulo">
          Diagrama esquemático de gamma match y hairpin
        </title>

        {/* Excitado */}
        <line
          x1="28"
          y1="48"
          x2="168"
          y2="48"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="192"
          y1="48"
          x2="332"
          y2="48"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          cx="180"
          cy="48"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Gamma paralelo al brazo derecho */}
        <line
          x1="192"
          y1="78"
          x2="268"
          y2="78"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="192"
          y1="48"
          x2="192"
          y2="78"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="260"
          y="70"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="268"
          y="104"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          C
        </text>
        <line
          x1="192"
          y1="92"
          x2="260"
          y2="92"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="226"
          y="108"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          G
        </text>

        {/* Hairpin en U bajo el centro */}
        <path
          d="M 156 140 L 156 188 L 204 188 L 204 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="156"
          y1="140"
          x2="168"
          y2="48"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="204"
          y1="140"
          x2="192"
          y2="48"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="156"
          y1="202"
          x2="204"
          y2="202"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="180"
          y="216"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          U
        </text>
        <text
          x="40"
          y="44"
          textAnchor="start"
          className="fill-current font-serif text-[13px] font-semibold"
        >
          E
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const GammaHairpin = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [ra, setRa] = useState('20')
  const mhz = parseNumero(frecuencia)
  const r = parseNumero(ra)
  const ok = frecuenciaValida(mhz) && r > 0 && r < 50
  const lambda = ok ? longitudOnda(mhz) : null
  const gammaLargo = ok ? 0.05 * lambda : null
  const xl = ok ? r * Math.sqrt(50 / r - 1) : null
  const lUh = ok ? xl / (2 * Math.PI * mhz) : null
  const cPf = ok ? 1e6 / (2 * Math.PI * mhz * xl) : null
  const hairpinM = ok ? 0.03 * lambda : null

  return (
    <CalculadoraLayout
      titulo="Gamma Match y Hairpin"
      intro="Puntos de partida para adaptar un excitado de yagi (20–30 Ω) a 50 Ω."
    >
      <Articulo titulo="Dos matching clásicos">
        <p className="text-justify">
          El gamma match es un conductor paralelo a una mitad del excitado, con
          un capacitor en serie: alarga el «brazo vivo» hasta encontrar 50 Ω. El
          hairpin (beta match) es un cortocircuito en U en el centro del
          excitado, que se ha recortado para quedar capacitivo; la U aporta la L
          en paralelo.
        </p>

        <GammaHairpinDiagrama />

        <Formula>
          <p>XL = Ra √(50/Ra − 1)</p>
          <p>G ≈ 0,05 λ &nbsp; U ≈ 0,03 λ de varilla</p>
        </Formula>
        <Nota>
          Son valores de partida. El gamma se desliza y se retoca C; el hairpin
          se abre o se acorta. Mida en el lugar de instalación.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="gh-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="gh-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 146,380"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gh-r" className={labelClass}>
            <Cota letra="Ra">del excitado (Ω), típico 20–25</Cota>
          </label>
          <input
            id="gh-r"
            className={inputClass}
            inputMode="decimal"
            value={ra}
            onChange={e => setRa(e.target.value)}
          />
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="G">Largo del gamma (0,05 λ)</Cota>}
            valor={formatearLongitud(gammaLargo)}
          />
          <Fila
            etiqueta={<Cota letra="C">Capacitor de partida del gamma</Cota>}
            valor={`${formatearNumero(cPf, 1)} pF`}
          />
          <Fila
            etiqueta="XL del hairpin"
            valor={`${formatearNumero(xl, 1)} Ω`}
          />
          <Fila
            etiqueta="L del hairpin"
            valor={`${formatearNumero(lUh, 3)} µH`}
          />
          <Fila
            etiqueta={<Cota letra="U">Largo orientativo de la U</Cota>}
            valor={formatearLongitud(hairpinM)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default GammaHairpin
