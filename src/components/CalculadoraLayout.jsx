const CalculadoraLayout = ({ titulo, intro, children }) => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          {titulo}
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          {intro}
        </p>
      </header>
      <div className="mx-auto max-w-3xl space-y-6">{children}</div>
    </section>
  )
}

export const Articulo = ({ titulo, children }) => (
  <article className="space-y-4 rounded-xl border border-stone-300/70 bg-white p-6 text-sm text-stone-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
    {titulo && (
      <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
        {titulo}
      </h2>
    )}
    {children}
  </article>
)

export const Fila = ({ etiqueta, valor, resaltar = false }) => (
  <div
    className={`flex justify-between gap-4 ${
      resaltar ? 'border-t border-stone-200 pt-3 dark:border-indigo-900' : ''
    }`}
  >
    <dt className="text-stone-600 dark:text-indigo-300">{etiqueta}</dt>
    <dd className="font-mono font-semibold text-stone-900 dark:text-white">
      {valor}
    </dd>
  </div>
)

export const Resultado = ({ children }) => (
  <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
    <h2 className="mb-4 text-lg font-serif font-semibold text-stone-900 dark:text-white">
      Dimensiones calculadas
    </h2>
    <dl className="space-y-3 text-sm">{children}</dl>
  </div>
)

export const Formula = ({ children }) => (
  <div className="space-y-2 rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-sm text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100">
    {children}
  </div>
)

export const Nota = ({ children }) => (
  <p className="text-justify text-xs text-stone-500 dark:text-indigo-300/80">
    {children}
  </p>
)

export const Campo = ({ children }) => (
  <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
    {children}
  </div>
)

export const Cota = ({ letra, children }) => (
  <>
    <span className="mr-1.5 font-serif font-semibold text-stone-900 dark:text-white">
      {letra}
    </span>
    {children}
  </>
)

export const PieDiagrama = ({ children }) => (
  <figcaption className="mt-2 text-center text-xs text-stone-500 dark:text-indigo-300/80">
    {children ||
      'Vista de frente (no a escala). Las letras coinciden con las medidas.'}
  </figcaption>
)

export default CalculadoraLayout
