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

const SlimJimDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 280 300"
        className="h-auto w-full"
        aria-labelledby="slimjim-diagrama-titulo"
        role="img"
      >
        <title id="slimjim-diagrama-titulo">
          Diagrama esquemático de antena Slim Jim
        </title>

        {/* Conductor continuo */}
        <line
          x1="118"
          y1="28"
          x2="118"
          y2="236"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* L: radiador λ/2 */}
        <line
          x1="168"
          y1="28"
          x2="168"
          y2="152"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Unión superior */}
        <line
          x1="118"
          y1="28"
          x2="168"
          y2="28"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* S: stub λ/4 */}
        <line
          x1="168"
          y1="172"
          x2="168"
          y2="236"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Base en cortocircuito */}
        <line
          x1="118"
          y1="236"
          x2="168"
          y2="236"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* G: gap */}
        <line
          x1="180"
          y1="154"
          x2="180"
          y2="170"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* F: alimentación */}
        <circle
          cx="118"
          cy="220"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />
        <circle
          cx="168"
          cy="220"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Cota T */}
        <line
          x1="48"
          y1="28"
          x2="48"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="28"
          x2="52"
          y2="28"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="236"
          x2="52"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="138"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          T
        </text>

        {/* Cota L */}
        <line
          x1="214"
          y1="28"
          x2="214"
          y2="152"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="210"
          y1="28"
          x2="218"
          y2="28"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="210"
          y1="152"
          x2="218"
          y2="152"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="228"
          y="96"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>

        {/* Cota G */}
        <text
          x="196"
          y="166"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          G
        </text>

        {/* Cota S */}
        <line
          x1="214"
          y1="172"
          x2="214"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="210"
          y1="172"
          x2="218"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="210"
          y1="236"
          x2="218"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="228"
          y="210"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          S
        </text>

        {/* Cota d */}
        <line
          x1="118"
          y1="88"
          x2="168"
          y2="88"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="118"
          y1="84"
          x2="118"
          y2="92"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="168"
          y1="84"
          x2="168"
          y2="92"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="143"
          y="82"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          d
        </text>

        {/* Cota F */}
        <line
          x1="143"
          y1="220"
          x2="143"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="139"
          y1="220"
          x2="147"
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="139"
          y1="236"
          x2="147"
          y2="236"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="143"
          y="214"
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

const SlimJim = () => {
  const [frecuencia, setFrecuencia] = useState('')

  const frecuenciaMhz = parseFloat(frecuencia.replace(',', '.'))
  const esValida =
    frecuencia !== '' && !Number.isNaN(frecuenciaMhz) && frecuenciaMhz > 0

  const radiadorCm = esValida
    ? redondear(((FACTOR_VELOCIDAD * 150) / frecuenciaMhz) * 100, 1)
    : null
  const stubCm = esValida
    ? redondear(((FACTOR_VELOCIDAD * 75) / frecuenciaMhz) * 100, 1)
    : null
  const gapCm = esValida
    ? redondear((300 / frecuenciaMhz / 100) * 100, 1)
    : null
  const totalCm =
    radiadorCm !== null && stubCm !== null && gapCm !== null
      ? redondear(radiadorCm + stubCm + gapCm, 1)
      : null
  const alimentacionCm = esValida
    ? redondear(((FACTOR_VELOCIDAD * (300 / frecuenciaMhz)) / 40) * 100, 1)
    : null
  const separacionCm = esValida
    ? redondear(0.02175 * (300 / frecuenciaMhz) * 100, 1)
    : null
  const longitudOndaCm = esValida ? (300 / frecuenciaMhz) * 100 : null

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Calculadora de Slim Jim
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Calcula las dimensiones de una antena Slim Jim a partir de la
          frecuencia de operación deseada.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-6">
        <article className="space-y-4 rounded-xl border border-stone-300/70 bg-white p-6 text-sm text-stone-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            ¿Qué es una Slim Jim?
          </h2>
          <p className="text-justify">
            La Slim Jim, diseñada por Fred Judd (G2BCX), es una variante de la
            J-Pole: un dipolo de media onda alimentado por el extremo, plegado
            sobre sí mismo, con un stub de adaptación de cuarto de onda. Se
            distingue por un pequeño gap en uno de los conductores, entre el
            radiador y el stub. El nombre proviene de «J Integrated Matching».
          </p>

          <SlimJimDiagrama />

          <p className="text-justify">
            Es muy usada en VHF y UHF como antena portable: se construye con
            línea bifilar de 300 Ω o 450 Ω, se cuelga de un árbol o mástil y se
            enrolla para guardarla. También puede hacerse con tubo de cobre.
            Ofrece radiación omnidireccional y se alimenta en 50 Ω sobre el
            stub. Las fórmulas prácticas de construcción son:
          </p>
          <div className="space-y-2 rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100">
            <p>L (m) ≈ 142,5 / f (MHz)</p>
            <p>S (m) ≈ 71 / f (MHz)</p>
            <p>G (m) ≈ 3 / f (MHz)</p>
            <p>T = L + G + S</p>
            <p>F ≈ 0,95 × λ / 40</p>
          </div>
          <p className="text-justify text-xs text-stone-500 dark:text-indigo-300/80">
            Se aplica un factor de velocidad de 0,95 (cobre o aluminio
            desnudo). Si usa línea bifilar aislada, pruebe con 0,90 y recorte
            según el SWR. F se mide desde la base: es un punto de partida;
            ajústelo con un analizador o medidor SWR. d no es crítica; en 2 m
            suele usarse unos 4 a 5 cm.
          </p>
        </article>

        <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div>
            <label htmlFor="slimjim-frecuencia" className={labelClass}>
              Frecuencia de operación (MHz)
            </label>
            <input
              id="slimjim-frecuencia"
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
                  <Cota letra="L">Radiador (λ/2)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(radiadorCm)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="G">Gap entre radiador y stub</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(gapCm)}
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
                  <Cota letra="T">Longitud total (L + G + S)</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(totalCm)}
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
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600 dark:text-indigo-300">
                  <Cota letra="d">Separación entre conductores</Cota>
                </dt>
                <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                  {formatearLongitudCm(separacionCm)}
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
              L + G + S = T: {formatearNumero(radiadorCm, 1)} +{' '}
              {formatearNumero(gapCm, 1)} + {formatearNumero(stubCm, 1)} ={' '}
              {formatearNumero(totalCm, 1)} cm.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SlimJim
