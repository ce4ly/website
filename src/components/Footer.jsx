import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/acerca', label: 'Acerca' },
  { to: '/boletines', label: 'Boletines' },
  { to: '/herramientas', label: 'Herramientas' },
  { to: '/contacto', label: 'Contacto' }
]

const linkClass =
  'text-blue-700 transition-colors hover:text-blue-950 dark:text-indigo-300 dark:hover:text-indigo-100'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-white dark:border-indigo-900 dark:bg-indigo-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-blue-950 sm:text-sm dark:text-indigo-300">
        <nav
          aria-label="Pie de página"
          className="flex flex-wrap items-center gap-x-4 gap-y-1"
        >
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} Radio Club Lircay. Todos los derechos reservados.
          </span>
          <div className="flex flex-wrap items-center gap-3 text-blue-950 dark:text-indigo-100">
            <span>
              Desarrollado por{' '}
              <a
                href="https://www.seadragon.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Sea Dragon
              </a>{' '}
              /{' '}
              <a
                href="https://www.qrz.com/db/CA4NFS"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                CA5NFS
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
