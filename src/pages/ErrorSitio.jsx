import { Link } from 'react-router-dom'

const linkClass =
  'font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100'

const ErrorSitio = ({ tipo = 'no-encontrado' }) => {
  const servidor = tipo === 'servidor'

  return (
    <section className="my-16 space-y-6 text-center">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-stone-500 dark:text-indigo-400">
          {servidor ? 'Error 500' : 'Error 404'}
        </p>
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          {servidor ? 'No pudimos cargar esta página' : 'Esta página no existe'}
        </h1>
        <p className="mx-auto max-w-xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          {servidor
            ? 'Ocurrió un error en el servidor. Puede intentar de nuevo en unos minutos o escribirnos si el problema continúa.'
            : 'La dirección no corresponde a ninguna página del sitio.'}
        </p>
      </header>
      <nav
        aria-label="Ir a otra página"
        className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
      >
        <Link to="/" className={linkClass}>
          Inicio
        </Link>
        <Link to="/herramientas" className={linkClass}>
          Herramientas
        </Link>
        <Link to="/contacto" className={linkClass}>
          Contacto
        </Link>
      </nav>
    </section>
  )
}

export default ErrorSitio
