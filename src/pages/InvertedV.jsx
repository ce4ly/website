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
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  LARGO_MEDIA_ONDA,
  parseNumero
} from '../lib/calculadoras.js'

const Cota = ({ letra, children }) => (
  <>
    <span className="mr-1.5 font-serif font-semibold text-stone-900 dark:text-white">
      {letra}
    </span>
    {children}
  </>
)

const VInvertidaDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 230"
        className="h-auto w-full"
        aria-labelledby="vinvertida-diagrama-titulo"
        role="img"
      >
        <title id="vinvertida-diagrama-titulo">
          Diagrama esquemático de antena en V invertida
        </title>

        {/* Suelo */}
        <line
          x1="20"
          y1="200"
          x2="320"
          y2="200"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="36"
          y1="208"
          x2="48"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="56"
          y1="208"
          x2="68"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="252"
          y1="208"
          x2="264"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="272"
          y1="208"
          x2="284"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Mástil */}
        <line
          x1="160"
          y1="42"
          x2="160"
          y2="200"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        {/* Brazos */}
        <line
          x1="48"
          y1="172"
          x2="160"
          y2="42"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="272"
          y1="172"
          x2="160"
          y2="42"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Puntas y ápex */}
        <circle cx="48" cy="172" r="4" fill="currentColor" />
        <circle cx="272" cy="172" r="4" fill="currentColor" />
        <circle
          cx="160"
          cy="42"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Arco del ángulo θ */}
        <path
          d="M 138 68 A 36 36 0 0 0 182 68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="90"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          θ
        </text>

        {/* Cota H: altura del ápex */}
        <line
          x1="28"
          y1="42"
          x2="28"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="42"
          x2="32"
          y2="42"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="200"
          x2="32"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="16"
          y="126"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          H
        </text>

        {/* Cota L: cada brazo */}
        <text
          x="86"
          y="96"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
          transform="rotate(-49 86 96)"
        >
          L
        </text>
        <text
          x="234"
          y="96"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
          transform="rotate(49 234 96)"
        >
          L
        </text>

        {/* Cota V: vano entre puntas */}
        <line
          x1="48"
          y1="188"
          x2="272"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="48"
          y1="184"
          x2="48"
          y2="192"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="272"
          y1="184"
          x2="272"
          y2="192"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="160"
          y="184"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          V
        </text>

        {/* Cota h: altura de las puntas */}
        <line
          x1="304"
          y1="172"
          x2="304"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="300"
          y1="172"
          x2="308"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="300"
          y1="200"
          x2="308"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="318"
          y="190"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          h
        </text>

        {/* Bajada */}
        <line
          x1="160"
          y1="49"
          x2="176"
          y2="72"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <figcaption className="mt-2 text-center text-xs text-stone-500 dark:text-indigo-300/80">
        Vista de frente (no a escala). Las letras coinciden con las medidas.
      </figcaption>
    </figure>
  )
}

const VInvertida = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [angulo, setAngulo] = useState('120')
  const [altura, setAltura] = useState('10')

  const mhz = parseNumero(frecuencia)
  const thetaDeg = parseNumero(angulo)
  const hApex = parseNumero(altura)
  const ok =
    frecuenciaValida(mhz) && thetaDeg > 60 && thetaDeg <= 180 && hApex > 0

  const correccion = ok ? 1 + 0.04 * ((180 - thetaDeg) / 90) : null
  const largoTotal = ok ? (LARGO_MEDIA_ONDA / mhz) * correccion : null
  const largoBrazo = ok ? largoTotal / 2 : null
  const theta = ok ? (thetaDeg * Math.PI) / 180 : null
  const vano = ok ? 2 * largoBrazo * Math.sin(theta / 2) : null
  const alturaPuntas = ok ? hApex - largoBrazo * Math.cos(theta / 2) : null

  return (
    <CalculadoraLayout
      titulo="Calculadora de V Invertida"
      intro="Dipolo en V invertida: corrige el largo por el ángulo de apertura y calcula vano y altura de las puntas."
    >
      <Articulo titulo="¿Qué es una V invertida?">
        <p className="text-justify">
          Es un dipolo de media onda cuyo vértice está en lo alto y las puntas
          bajan. Ocupa menos vano que un dipolo plano, sube un poco la
          impedancia hacia 50 Ω cuando el ángulo incluido está cerca de 90–120°
          y se usa muchísimo en HF de club y portable.
        </p>

        <VInvertidaDiagrama />

        <Formula>
          <p>2L (m) ≈ (142,5 / f) × (1 + 0,04 × (180 − θ) / 90)</p>
        </Formula>
        <Nota>
          A 180° coincide con el dipolo plano (VF 0,95). A 90° el alambre sale
          unos 4 % más largo. Si h queda bajo 2 m, suba H o abra θ.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="inv-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="inv-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="inv-a" className={labelClass}>
            <Cota letra="θ">Ángulo incluido en el ápex (°)</Cota>
          </label>
          <input
            id="inv-a"
            className={inputClass}
            inputMode="decimal"
            value={angulo}
            onChange={e => setAngulo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="inv-h" className={labelClass}>
            <Cota letra="H">Altura del ápex (m)</Cota>
          </label>
          <input
            id="inv-h"
            className={inputClass}
            inputMode="decimal"
            value={altura}
            onChange={e => setAltura(e.target.value)}
          />
        </div>
      </Campo>

      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="2L">Largo total de alambre</Cota>}
            valor={formatearLongitud(largoTotal)}
          />
          <Fila
            etiqueta={<Cota letra="L">Cada brazo</Cota>}
            valor={formatearLongitud(largoBrazo)}
          />
          <Fila
            etiqueta={<Cota letra="V">Vano entre puntas</Cota>}
            valor={formatearLongitud(vano)}
          />
          <Fila
            etiqueta={<Cota letra="h">Altura de las puntas</Cota>}
            valor={formatearLongitud(alturaPuntas)}
          />
          <Fila
            etiqueta="Corrección vs dipolo plano"
            valor={`× ${formatearNumero(correccion, 3)}`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default VInvertida
