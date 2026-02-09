import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Inicio from './pages/Inicio.jsx'
import Acerca from './pages/Acerca.jsx'
import Contacto from './pages/Contacto.jsx'
import Terminos from './pages/Terminos.jsx'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/acerca', label: 'Acerca' },
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-stone-400/60 bg-stone-100/80 backdrop-blur dark:border-indigo-900 dark:bg-indigo-950/80">
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
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'transition-colors',
                  'font-medium',
                  isActive
                    ? 'underline underline-offset-4'
                    : 'hover:underline underline-offset-4',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-500 bg-stone-200 text-stone-900 hover:border-blue-950 hover:text-blue-950 dark:border-indigo-800 dark:bg-indigo-900 dark:text-white dark:hover:border-indigo-300 dark:hover:text-indigo-300 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menú de navegación"
        >
          <span className="sr-only">Abrir menú</span>
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span className="h-[2px] w-4 rounded bg-current" />
            <span className="h-[2px] w-4 rounded bg-current" />
          </div>
        </button>
      </div>
      {open && (
        <nav className="border-t border-stone-400/60 bg-stone-100/95 dark:border-indigo-900 dark:bg-indigo-950/95 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3 text-sm">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-stone-200/80 dark:bg-indigo-900/70 underline underline-offset-4'
                      : 'hover:bg-stone-200/80 dark:hover:bg-indigo-900/70 hover:underline underline-offset-4',
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

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-indigo-900 bg-indigo-950 text-indigo-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-stone-100 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <span>
          © {year} Radio Club Lircay. Todos los derechos reservados.
        </span>
        <div className="flex flex-wrap items-center gap-3 text-indigo-100">
          <span>
            Desarrollado por <a href="https://www.qrz.com/db/CA4NFS" className="text-indigo-300 transition-colors hover:text-indigo-100">CA4NFS</a>.
          </span>
          {/*<NavLink
            to="/terminos"
            className="text-indigo-300 transition-colors hover:text-indigo-100"
          >
            Términos de Servicio
          </NavLink>
          <span className="h-1 w-1 rounded-full bg-stone-100" />
          <NavLink
            to="/privacidad"
            className="text-indigo-300 transition-colors hover:text-indigo-100"
          >
            Política de Privacidad
          </NavLink>*/}
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/acerca" element={<Acerca />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/privacidad" element={<PoliticaPrivacidad />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
