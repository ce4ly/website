import { Link } from 'react-router-dom'
import { CURSOS, CURSOS_INTRO, asuntoConsultaCurso } from '../lib/cursos.js'

const botonClass =
  'inline-flex items-center justify-center rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-900 dark:bg-indigo-600 dark:hover:bg-indigo-500'

const Cursos = () => {
  return (
    <section className="my-16 space-y-10">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          {CURSOS_INTRO.titulo}
        </h1>
        <p className="mx-auto max-w-3xl text-justify text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          {CURSOS_INTRO.texto}
        </p>
      </header>

      <ul className="grid gap-8 md:grid-cols-1">
        {CURSOS.map(curso => {
          const asunto = asuntoConsultaCurso(curso.nombre)
          return (
            <li
              key={curso.slug}
              className="overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
            >
              <article className="grid gap-0 sm:grid-cols-[minmax(0,18rem)_1fr]">
                <figure className="m-0">
                  <img
                    src={curso.imagen}
                    alt={curso.alt}
                    width={curso.width}
                    height={curso.height}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="px-3 py-1.5 text-[11px] leading-snug text-stone-500 dark:text-indigo-300/80">
                    Foto:{' '}
                    <a
                      href={curso.credito.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100"
                    >
                      {curso.credito.autor}
                    </a>{' '}
                    / Pexels
                  </figcaption>
                </figure>
                <div className="flex flex-col gap-4 p-5 sm:p-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-serif font-semibold text-stone-900 dark:text-white">
                      {curso.nombre}
                    </h2>
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-indigo-400">
                      Próxima versión: {curso.fecha}
                    </p>
                    <p className="text-sm text-stone-700 dark:text-indigo-100">
                      {curso.descripcion}
                    </p>
                  </div>
                  <div>
                    <Link
                      to={`/contacto?asunto=${encodeURIComponent(asunto)}`}
                      className={botonClass}
                    >
                      Consultar este curso
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Cursos
