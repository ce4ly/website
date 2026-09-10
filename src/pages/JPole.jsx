import { useState } from 'react'

const FACTOR_VELOCIDAD = 0.95

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

const Cota = ({ letra, children }) => (
  <>
    <span className="mr-1.5 font-serif font-semibold text-stone-900 dark:text-white">
      {letra}
    </span>
    {children}
  </>
)

const JPoleDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 260 280"
        className="h-auto w-full"
        aria-labelledby="jpole-diagrama-titulo"
        role="img"
      >
        <title id="jpole-diagrama-titulo">
          Diagrama esquemático de antena J-Pole
        </title>

        {/* L: elemento radiador λ/2 */}
        <line
          x1="110"
          y1="24"
          x2="110"
          y2="220"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="110" cy="24" r="4" fill="currentColor" />

        {/* S: stub λ/4 */}
        <line
          x1="160"
          y1="122"
          x2="160"
          y2="220"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="160" cy="122" r="4" fill="currentColor" />

        {/* Base en cortocircuito */}
        <line
          x1="110"
          y1="220"
          x2="160"
          y2="220"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* F: alimentación, ~20 % de S desde la base */}
        <circle
          cx="110"
          cy="200"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />
        <circle
          cx="160"
          cy="200"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Cota L */}
        <line
          x1="48"
          y1="24"
          x2="48"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="24"
          x2="52"
          y2="24"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="220"
          x2="52"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="128"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>

        {/* Cota S */}
        <line
          x1="200"
          y1="122"
          x2="200"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="196"
          y1="122"
          x2="204"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="196"
          y1="220"
          x2="204"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="214"
          y="176"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          S
        </text>

        {/* Cota F */}
        <line
          x1="135"
          y1="200"
          x2="135"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="131"
          y1="200"
          x2="139"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="131"
          y1="220"
          x2="139"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="135"
          y="194"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          F
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-stone-500 dark:text-indigo-300/80">
        Vista de frente (no a escala). Las letras coinciden con las medidas.
      </figcaption>
    </figure>
  )
}

const JPole = () => {
  const [frecuencia, setFrecuencia] = useState('')

  const frecuenciaMhz = parseFloat(frecuencia.replace(',', '.'))
  const esValida =
    frecuencia !== '' && !Number.isNaN(frecuenciaMhz) && frecuenciaMhz > 0

  const largoCm = esValida
    ? redondear(((FACTOR_VELOCIDAD * 150) / frecuenciaMhz) * 100, 1)
    : null
  const stubCm = esValida
    ? redondear(((FACTOR_VELOCIDAD * 75) / frecuenciaMhz) * 100, 1)
    : null
  const alimentacionCm = stubCm !== null ? redondear(stubCm * 0.2, 1) : null
  const longitudOndaCm = esValida ? (300 / frecuenciaMhz) * 100 : null

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Calculadora de J-Pole
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Calcula las dimensiones de una antena J-Pole a partir de la
          frecuencia de operación deseada.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-6">
        <article className="space-y-4 rounded-xl border border-stone-300/70 bg-white p-6 text-sm text-stone-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            ¿Qué es una J-Pole?
          </h2>
          <p className="text-justify">
            La J-Pole es una antena vertical de polarización vertical, muy
            popular en VHF y UHF. Se compone de dos conductores paralelos: un
            elemento radiador de media onda (λ/2) y un stub de adaptación de
            cuarto de onda (λ/4) cortocircuitado en su extremo inferior. Su
            nombre proviene de la forma en «J» que adoptan ambos elementos
            vistos de lado.
          </p>

          <JPoleDiagrama />

          <p className="text-justify">
            La alimentación se realiza en el punto de unión entre ambos
            conductores, donde la impedancia se aproxima a 50 Ω. Ofrece
            radiación omnidireccional en azimut, es sencilla de construir con
            tubo de cobre o cable rígido, y se usa habitualmente en repetidores
            y estaciones fijas en 2 m y 70 cm. Las fórmulas prácticas de
            construcción son:
          </p>
          <div className="space-y-2 rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100">
            <p>L (m) ≈ 142,5 / f (MHz)</p>
            <p>S (m) ≈ 71 / f (MHz)</p>
            <p>F ≈ 0,2 × S</p>
          </div>
          <p className="text-justify text-xs text-stone-500 dark:text-indigo-300/80">
            Se aplica un factor de velocidad de 0,95. F se mide desde la base
            del stub; ajústelo con un analizador o medidor SWR para la mejor
            coincidencia de impedancia.
          </p>
        </article>

        <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div>
            <label htmlFor="jpole-frecuencia" className={labelClass}>
              Frecuencia de operación (MHz)
            </label>
            <input
              id="jpole-frecuencia"
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
                  <Cota letra="L">Elemento radiador (λ/2)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(largoCm)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="S">Stub de adaptación (λ/4)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(stubCm)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="F">Alimentación (desde la base)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(alimentacionCm)}
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
          </div>
        )}
      </div>
    </section>
  )
}

export default JPole
