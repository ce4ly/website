import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch.jsx'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/acerca', label: 'Acerca' },
  { to: '/directorio', label: 'Directorio' }
]

const Header = () => {
  const [open, setOpen] = useState(false)

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
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'text-blue-950 transition-colors dark:text-indigo-200',
                  'font-medium',
                  isActive
                    ? 'underline underline-offset-4'
                    : 'hover:underline underline-offset-4'
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
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
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3 text-sm">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 text-amber-900 transition-colors dark:text-indigo-200',
                    isActive
                      ? 'bg-stone-100 dark:bg-indigo-900/70 underline underline-offset-4'
                      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70 hover:underline underline-offset-4'
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
