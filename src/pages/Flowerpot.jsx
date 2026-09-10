import { useState } from 'react'
import { Cota, PieDiagrama } from '../components/CalculadoraLayout.jsx'
import PresetsRepetidoras from '../components/PresetsRepetidoras.jsx'
import { formatearFrecuenciaMhz } from '../lib/repetidoras.js'
import {
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  redondear
} from '../lib/calculadoras.js'

const FACTOR_VELOCIDAD = 0.95
const FACTOR_COAX = 0.66

const FlowerpotDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 280 300"
        className="h-auto w-full"
        aria-labelledby="flowerpot-diagrama-titulo"
        role="img"
      >
        <title id="flowerpot-diagrama-titulo">
          Diagrama esquemático de antena flowerpot
        </title>

        {/* A: elemento superior (vivo, λ/4) */}
        <line
          x1="160"
          y1="22"
          x2="160"
          y2="108"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="160" cy="22" r="4" fill="currentColor" />

        {/* Alimentación (corte de la malla) */}
        <circle
          cx="160"
          cy="116"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* B: elemento inferior (malla, λ/4) */}
        <line
          x1="160"
          y1="124"
          x2="160"
          y2="198"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* C: choque (espiras del coaxial) */}
        <ellipse
          cx="160"
          cy="216"
          rx="30"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <ellipse
          cx="160"
          cy="226"
          rx="30"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <ellipse
          cx="160"
          cy="236"
          rx="30"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Bajada de coaxial */}
        <line
          x1="160"
          y1="236"
          x2="160"
          y2="278"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Cota T (A+B) */}
        <line
          x1="40"
          y1="22"
          x2="40"
          y2="198"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="22"
          x2="44"
          y2="22"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="198"
          x2="44"
          y2="198"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="28"
          y="114"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          T
        </text>

        {/* Cota A */}
        <line
          x1="100"
          y1="22"
          x2="100"
          y2="108"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="96"
          y1="22"
          x2="104"
          y2="22"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="96"
          y1="108"
          x2="104"
          y2="108"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="88"
          y="70"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          A
        </text>

        {/* Cota B */}
        <line
          x1="100"
          y1="124"
          x2="100"
          y2="198"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="96"
          y1="124"
          x2="104"
          y2="124"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="96"
          y1="198"
          x2="104"
          y2="198"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="88"
          y="166"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          B
        </text>

        {/* Cota C (junto al choque) */}
        <line
          x1="210"
          y1="205"
          x2="210"
          y2="247"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="206"
          y1="205"
          x2="214"
          y2="205"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="206"
          y1="247"
          x2="214"
          y2="247"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="224"
          y="230"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          C
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const Flowerpot = () => {
  const [frecuencia, setFrecuencia] = useState('')

  const frecuenciaMhz = parseFloat(frecuencia.replace(',', '.'))
  const esValida =
    frecuencia !== '' && !Number.isNaN(frecuenciaMhz) && frecuenciaMhz > 0

  const elementoA = esValida ? (FACTOR_VELOCIDAD * 75) / frecuenciaMhz : null
  const elementoB = esValida ? (FACTOR_VELOCIDAD * 75) / frecuenciaMhz : null
  const radiadorT =
    elementoA !== null && elementoB !== null
      ? (redondear(elementoA * 100, 1) + redondear(elementoB * 100, 1)) / 100
      : null
  const choqueC = esValida ? (FACTOR_COAX * 75) / frecuenciaMhz : null
  const lambda = esValida ? 300 / frecuenciaMhz : null

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Calculadora de Flowerpot
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Calcula las dimensiones de una antena flowerpot de media onda a partir
          de la frecuencia de operación deseada.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-6">
        <article className="space-y-4 rounded-xl border border-stone-300/70 bg-white p-6 text-sm text-stone-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            ¿Qué es una flowerpot?
          </h2>
          <p className="text-justify">
            La flowerpot (o «macetero») es un dipolo vertical de media onda
            construido con un solo tramo de coaxial, popularizada por John
            Honniball (VK2ZOI). Se llama así porque el diseño original se
            montaba dentro de una maceta de plástico. Hoy suele alojarse en un
            tubo de PVC.
          </p>

          <FlowerpotDiagrama />

          <p className="text-justify">
            El coaxial se corta de modo que el conductor central forma el
            elemento superior A (λ/4) y la malla, el inferior B (λ/4). En el
            punto de unión —donde se retira la malla— está la alimentación.
            Debajo se enrolla un choque C (bobina del propio coaxial) para que
            la bajada no irradie. Es una antena omnidireccional, barata y
            habitual en 2 m y 70 cm. Las fórmulas prácticas de construcción son:
          </p>
          <div className="space-y-2 rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100">
            <p>A (m) ≈ 71 / f (MHz)</p>
            <p>B (m) ≈ 71 / f (MHz)</p>
            <p>T (m) ≈ 142,5 / f (MHz)</p>
            <p>C (m) ≈ 50 / f (MHz)</p>
          </div>
          <p className="text-justify text-xs text-stone-500 dark:text-indigo-300/80">
            Se aplica un factor de velocidad de 0,95 a los elementos radiadores.
            El choque usa 0,66, típico del dieléctrico del RG-58: es la longitud
            de coaxial a enrollar, no la altura de la bobina. En 2 m, VK2ZOI
            sugiere unas 8 a 9 vueltas sobre conduit de 25 mm, resonando un 5–6
            % bajo la frecuencia de trabajo. Dentro de PVC las medidas salen un
            poco más cortas; deje margen y ajuste con analizador o medidor SWR.
          </p>
        </article>

        <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div>
            <label htmlFor="flowerpot-frecuencia" className={labelClass}>
              Frecuencia de operación (MHz)
            </label>
            <input
              id="flowerpot-frecuencia"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 146,380"
              value={frecuencia}
              onChange={e => setFrecuencia(e.target.value)}
              className={inputClass}
            />
            <PresetsRepetidoras
              onSelect={r =>
                setFrecuencia(formatearFrecuenciaMhz(r.frecuenciaMhz))
              }
            />
          </div>
        </div>

        {esValida && (
          <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
            <h2 className="mb-4 text-lg font-serif font-semibold text-stone-900 dark:text-white">
              Dimensiones calculadas
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="A">Elemento superior (vivo, λ/4)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitud(elementoA)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="B">Elemento inferior (malla, λ/4)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitud(elementoB)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="T">Radiador total (A + B, λ/2)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitud(radiadorT)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="C">Choque (longitud de coaxial)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitud(choqueC)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-stone-200 pt-3 dark:border-indigo-900">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="λ">Longitud de onda</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitud(lambda)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-stone-500 dark:text-indigo-300/80">
              A + B = T: {formatearNumero(redondear(elementoA * 100, 1), 1)} +{' '}
              {formatearNumero(redondear(elementoB * 100, 1), 1)} ={' '}
              {formatearNumero(redondear(radiadorT * 100, 1), 1)} cm.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Flowerpot
