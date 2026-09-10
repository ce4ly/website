import { Link } from 'react-router-dom'
import { HERRAMIENTA_GRUPOS_PAGINA } from '../lib/herramientas.js'

const Herramientas = () => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Herramientas
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Referencias, convertidores, canales y calculadoras de antenas para el
          taller del club. Son puntos de partida: recorte siempre con analizador
          o medidor de ROE.
        </p>
      </header>
      <div className="space-y-8">
        {HERRAMIENTA_GRUPOS_PAGINA.map(({ title, links }) => (
          <section key={title} className="space-y-3">
            <h2 className="text-xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
              {title}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {links.map(({ to, label, description }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="block rounded-xl border border-stone-300/70 bg-white px-4 py-3 text-sm font-medium text-blue-950 no-underline shadow-sm transition-colors hover:bg-stone-50 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100 dark:hover:bg-indigo-950/70"
                  >
                    {label}
                    {description && (
                      <span className="mt-1 block text-xs font-normal text-stone-600 dark:text-indigo-300">
                        {description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

export default Herramientas
