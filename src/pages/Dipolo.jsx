import { useState } from 'react'

import { LARGO_MEDIA_ONDA } from '../lib/calculadoras.js'

const LONGITUD_DIPOLO = LARGO_MEDIA_ONDA

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

const labelClass =
  'block text-sm font-medium text-stone-800 dark:text-indigo-100'

const formatearNumero = (valor, decimales = 1) => {
  return valor.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  })
}

const redondear = (valor, decimales) => {
  const factor = 10 ** decimales
  return Math.round(valor * factor) / factor
}

const formatearLongitudCm = cm => {
  if (cm >= 300) {
    return `${formatearNumero(cm / 100, 2)} m`
  }
  return `${formatearNumero(cm, 1)} cm`
}

const separarBrazosCm = mhz => (mhz >= 30 ? 2 : 5)

const Cota = ({ letra, children }) => (
  <>
    <span className="mr-1.5 font-serif font-semibold text-stone-900 dark:text-white">
      {letra}
    </span>
    {children}
  </>
)

const DipoloDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 320 170"
        className="h-auto w-full"
        aria-labelledby="dipolo-diagrama-titulo"
        role="img"
      >
        <title id="dipolo-diagrama-titulo">
          Diagrama esquemático de antena dipolo de media onda
        </title>

        {/* Cota total λ/2 */}
        <line
          x1="36"
          y1="28"
          x2="284"
          y2="28"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="24"
          x2="36"
          y2="32"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="284"
          y1="24"
          x2="284"
          y2="32"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="160"
          y="22"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          T
        </text>

        {/* Brazos */}
        <line
          x1="36"
          y1="72"
          x2="148"
          y2="72"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="172"
          y1="72"
          x2="284"
          y2="72"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="36" cy="72" r="4" fill="currentColor" />
        <circle cx="284" cy="72" r="4" fill="currentColor" />

        {/* Alimentación central */}
        <circle
          cx="160"
          cy="72"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />
        <line
          x1="148"
          y1="52"
          x2="172"
          y2="52"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="148"
          y1="48"
          x2="148"
          y2="56"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="172"
          y1="48"
          x2="172"
          y2="56"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="160"
          y="46"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          s
        </text>

        {/* Cotas de cada brazo λ/4 */}
        <line
          x1="36"
          y1="96"
          x2="148"
          y2="96"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="92"
          x2="36"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="148"
          y1="92"
          x2="148"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="92"
          y="112"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>
        <line
          x1="172"
          y1="96"
          x2="284"
          y2="96"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="172"
          y1="92"
          x2="172"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="284"
          y1="92"
          x2="284"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="228"
          y="112"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>

        {/* Bajada coaxial */}
        <line
          x1="154"
          y1="79"
          x2="154"
          y2="148"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="166"
          y1="79"
          x2="166"
          y2="148"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="178"
          y="140"
          textAnchor="start"
          className="fill-current font-sans text-[11px]"
        >
          alimentación
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-stone-500 dark:text-indigo-300/80">
        Vista de frente (no a escala). Las letras coinciden con las medidas.
      </figcaption>
    </figure>
  )
}

const Dipolo = () => {
  const [frecuencia, setFrecuencia] = useState('')

  const frecuenciaMhz = parseFloat(frecuencia.replace(',', '.'))
  const esValida =
    frecuencia !== '' && !Number.isNaN(frecuenciaMhz) && frecuenciaMhz > 0

  const totalFormulaCm = esValida
    ? (LONGITUD_DIPOLO / frecuenciaMhz) * 100
    : null
  const separacionCm = esValida ? separarBrazosCm(frecuenciaMhz) : null
  const brazoCm =
    esValida && totalFormulaCm > separacionCm
      ? redondear((totalFormulaCm - separacionCm) / 2, 1)
      : null
  const totalCm =
    brazoCm !== null ? redondear(brazoCm * 2 + separacionCm, 1) : null
  const longitudOndaCm = esValida ? (300 / frecuenciaMhz) * 100 : null

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Calculadora Dipolo
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Calcula las dimensiones de un dipolo de media onda (λ/2) a partir de
          la frecuencia de operación deseada.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-6">
        <article className="space-y-4 rounded-xl border border-stone-300/70 bg-white p-6 text-sm text-stone-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            ¿Qué es un dipolo?
          </h2>
          <p className="text-justify">
            Un dipolo es la antena más simple y fundamental en radioafición. Se
            compone de dos conductores rectos de igual longitud, colocados en
            línea recta y alimentados en su centro. Cada brazo mide
            aproximadamente un cuarto de longitud de onda (λ/4), de modo que la
            antena completa equivale a media onda (λ/2).
          </p>

          <DipoloDiagrama />

          <p className="text-justify">
            Es una antena omnidireccional en el plano perpendicular a su eje,
            con un patrón de radiación en forma de «8». Se usa ampliamente por
            su sencillez de construcción, bajo costo y buen rendimiento en
            frecuencias de HF y VHF. La fórmula práctica para su construcción
            es:
          </p>
          <p className="rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100">
            T (m) ≈ 142,5 / f (MHz)
          </p>
          <p className="text-justify text-xs text-stone-500 dark:text-indigo-300/80">
            Se aplica un factor de velocidad de 0,95 para compensar el efecto
            del cable y las condiciones reales de instalación. T es la longitud
            de punta a punta: de ahí se resta s (2 cm en VHF, 5 cm en HF) y el
            resto se parte en dos brazos L. Recorte al final con un analizador
            o medidor SWR.
          </p>
        </article>

        <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div>
            <label htmlFor="dipolo-frecuencia" className={labelClass}>
              Frecuencia de operación (MHz)
            </label>
            <input
              id="dipolo-frecuencia"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 146,380"
              value={frecuencia}
              onChange={e => setFrecuencia(e.target.value)}
              className={inputClass}
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
                  <Cota letra="L">Cada brazo</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(brazoCm)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="s">Separación entre brazos</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(separacionCm)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="T">Longitud total (2L + s)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(totalCm)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-stone-200 pt-3 dark:border-indigo-900">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="λ">Longitud de onda</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(longitudOndaCm)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-stone-500 dark:text-indigo-300/80">
              L + L + s = T: {formatearNumero(brazoCm, 1)} +{' '}
              {formatearNumero(brazoCm, 1)} + {formatearNumero(separacionCm, 1)}{' '}
              = {formatearNumero(totalCm, 1)} cm. s se resta de la fórmula y el
              resto se parte en dos brazos.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Dipolo
