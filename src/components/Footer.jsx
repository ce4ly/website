import { Link } from 'react-router-dom'
import { NAV_PRINCIPAL } from '../lib/nav.js'
import Icono from './Icono.jsx'

const linkClass =
  'inline-flex items-center gap-1 text-blue-700 transition-colors hover:text-blue-950 dark:text-indigo-300 dark:hover:text-indigo-100'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-white dark:border-indigo-900 dark:bg-indigo-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-blue-950 sm:text-sm dark:text-indigo-300">
        <nav
          aria-label="Pie de página"
          className="hidden flex-wrap items-center gap-x-4 gap-y-2 sm:flex"
        >
          {NAV_PRINCIPAL.map(({ to, label, icono }) => (
            <Link key={to} to={to} className={linkClass}>
              <Icono nombre={icono} className="size-3.5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>
            © {year} Radio Club Lircay. Todos los derechos reservados.
          </span>
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
    </footer>
  )
}

export default Footer
