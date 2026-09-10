import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch.jsx'
import {
  HERRAMIENTA_GRUPOS_PUBLICOS,
  HERRAMIENTA_LINKS
} from '../lib/herramientas.js'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/acerca', label: 'Acerca' },
  { to: '/boletines', label: 'Boletines' }
]

const groupTitleClass =
  'px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-indigo-400'

const navClass = ({ isActive }) =>
  [
    'text-blue-950 transition-colors dark:text-indigo-200',
    'font-medium',
    isActive
      ? 'underline underline-offset-4'
      : 'hover:underline underline-offset-4'
  ].join(' ')

const mobileNavClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-amber-900 transition-colors dark:text-indigo-200',
    isActive
      ? 'bg-stone-100 dark:bg-indigo-900/70 underline underline-offset-4'
      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70 hover:underline underline-offset-4'
  ].join(' ')

const Header = () => {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const location = useLocation()
  const toolsActive =
    location.pathname === '/herramientas' ||
    HERRAMIENTA_LINKS.some(link => location.pathname === link.to)

  return (
    <header className="border-b border-stone-200 bg-white backdrop-blur dark:border-indigo-900 dark:bg-indigo-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo Radio Club Lircay de Talca CE4LY"
            className="h-10 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-blue-950 dark:text-white">
              Radio Club Lircay
            </span>
            <span className="text-sm font-semibold text-blue-950 dark:text-indigo-300">
              Donde Cada Voz Importa
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navClass}>
              {label}
            </NavLink>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              className={[
                'text-blue-950 transition-colors dark:text-indigo-200',
                'font-medium',
                toolsActive
                  ? 'underline underline-offset-4'
                  : 'hover:underline underline-offset-4'
              ].join(' ')}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              onClick={() => setToolsOpen(prev => !prev)}
            >
              Herramientas
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full z-20 max-h-[80vh] w-80 overflow-y-auto rounded-lg border border-stone-200 bg-white py-2 shadow-lg dark:border-indigo-800 dark:bg-indigo-950">
                <NavLink
                  to="/herramientas"
                  end
                  onClick={() => setToolsOpen(false)}
                  className={({ isActive }) =>
                    [
                      'mx-2 mb-1 block rounded-md px-3 py-2 text-sm font-medium text-blue-950 no-underline dark:text-indigo-100',
                      isActive
                        ? 'bg-stone-100 dark:bg-indigo-900/70'
                        : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70'
                    ].join(' ')
                  }
                >
                  Ver todas
                </NavLink>
                {HERRAMIENTA_GRUPOS_PUBLICOS.map(({ title, links }) => (
                  <div key={title}>
                    <p className={groupTitleClass}>{title}</p>
                    {links.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setToolsOpen(false)}
                        className={({ isActive }) =>
                          [
                            'block px-4 py-1.5 text-sm text-blue-950 no-underline transition-colors dark:text-indigo-200',
                            isActive
                              ? 'bg-stone-100 dark:bg-indigo-900/70'
                              : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70'
                          ].join(' ')
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <ThemeSwitch />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitch />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-stone-900 transition-colors hover:border-blue-950 hover:text-blue-950 dark:border-indigo-800 dark:bg-indigo-900 dark:text-white dark:hover:border-indigo-300 dark:hover:text-indigo-300"
            onClick={() => setOpen(prev => !prev)}
            aria-label="Abrir menú de navegación"
          >
            <span className="sr-only">Abrir menú</span>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span className="h-[2px] w-4 rounded bg-current" />
              <span className="h-[2px] w-4 rounded bg-current" />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-stone-200 bg-white dark:border-indigo-900 dark:bg-indigo-950/95 md:hidden">
          <div className="mx-auto flex max-h-[70vh] max-w-5xl flex-col gap-1 overflow-y-auto px-4 py-3 text-sm">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={mobileNavClass}
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/herramientas"
              end
              onClick={() => setOpen(false)}
              className={mobileNavClass}
            >
              Ver todas las herramientas
            </NavLink>
            {HERRAMIENTA_GRUPOS_PUBLICOS.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-1">
                <p className={groupTitleClass}>{title}</p>
                {links.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={mobileNavClass}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
