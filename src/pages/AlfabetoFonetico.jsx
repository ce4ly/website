const ALFABETO_NATO = [
  { letra: 'A', palabra: 'Alpha' },
  { letra: 'B', palabra: 'Bravo' },
  { letra: 'C', palabra: 'Charlie' },
  { letra: 'D', palabra: 'Delta' },
  { letra: 'E', palabra: 'Echo' },
  { letra: 'F', palabra: 'Foxtrot' },
  { letra: 'G', palabra: 'Golf' },
  { letra: 'H', palabra: 'Hotel' },
  { letra: 'I', palabra: 'India' },
  { letra: 'J', palabra: 'Juliett' },
  { letra: 'K', palabra: 'Kilo' },
  { letra: 'L', palabra: 'Lima' },
  { letra: 'M', palabra: 'Mike' },
  { letra: 'N', palabra: 'November' },
  { letra: 'O', palabra: 'Oscar' },
  { letra: 'P', palabra: 'Papa' },
  { letra: 'Q', palabra: 'Quebec' },
  { letra: 'R', palabra: 'Romeo' },
  { letra: 'S', palabra: 'Sierra' },
  { letra: 'T', palabra: 'Tango' },
  { letra: 'U', palabra: 'Uniform' },
  { letra: 'V', palabra: 'Victor' },
  { letra: 'W', palabra: 'Whiskey' },
  { letra: 'X', palabra: 'X-ray' },
  { letra: 'Y', palabra: 'Yankee' },
  { letra: 'Z', palabra: 'Zulu' }
]

const thClass =
  'border-b border-stone-300 bg-stone-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100'

const tdClass =
  'border-b border-stone-200 px-4 py-3 text-stone-800 dark:border-indigo-900/60 dark:text-indigo-100'

const Alfabeto = () => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Alfabeto Fonético OTAN
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Tabla de referencia del alfabeto fonético internacional (ICAO/OTAN),
          usado en radiocomunicaciones para deletrear letras con claridad y
          evitar confusiones.
        </p>
      </header>

      <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={thClass}>Letra</th>
                <th className={thClass}>Palabra fonética</th>
              </tr>
            </thead>
            <tbody>
              {ALFABETO_NATO.map(({ letra, palabra }) => (
                <tr
                  key={letra}
                  className="transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30"
                >
                  <td className={`${tdClass} font-mono font-semibold`}>
                    {letra}
                  </td>
                  <td className={tdClass}>{palabra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Alfabeto
