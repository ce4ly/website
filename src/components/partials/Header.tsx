import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { NAV_PRINCIPAL } from '../../lib/nav'
import { HERRAMIENTA_GRUPOS_MENU, esRutaDeHerramienta, rutaDe } from '../../lib/paginas'
import Icono from './Icono'
import OfflineBadge from './OfflineBadge'
import RedesSociales from './RedesSociales'
import ThemeSwitch from './ThemeSwitch'

const RUTA_HERRAMIENTAS = rutaDe('herramientas')

/** Grupos del desplegable con el índice de cada enlace para moverse con las flechas. */
const GRUPOS_MENU = (() => {
  let indice = 0
  return HERRAMIENTA_GRUPOS_MENU.map(({ title, links }) => ({
    title,
    links: links.map((link) => ({ ...link, indice: indice++ })),
  }))
})()

/** Enlaces del desplegable más «Todas las Herramientas», que va al final. */
const TOTAL_ITEMS = GRUPOS_MENU.reduce((total, grupo) => total + grupo.links.length, 0) + 1

const groupTitleClass =
  'px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-indigo-400'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center gap-1 text-blue-950 transition-colors dark:text-indigo-200',
    'font-medium',
    isActive ? 'underline underline-offset-4' : 'hover:underline underline-offset-4',
  ].join(' ')

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-amber-900 transition-colors dark:text-indigo-200',
    isActive
      ? 'bg-stone-100 dark:bg-indigo-900/70 underline underline-offset-4'
      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70 hover:underline underline-offset-4',
  ].join(' ')

const menuItemClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block px-4 py-1.5 text-sm text-blue-950 no-underline transition-colors dark:text-indigo-200',
    isActive
      ? 'bg-stone-100 dark:bg-indigo-900/70'
      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70',
  ].join(' ')

const todasClass = ({ isActive }: { isActive: boolean }) =>
  [
    'mx-2 mt-2 block rounded-md px-3 py-2 text-sm font-medium text-blue-950 no-underline dark:text-indigo-100',
    isActive
      ? 'bg-stone-100 dark:bg-indigo-900/70'
      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70',
  ].join(' ')

const Header = () => {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const { pathname } = useLocation()
  const [rutaAnterior, setRutaAnterior] = useState(pathname)
  const menuId = useId()
  const toolsWrapRef = useRef<HTMLDivElement>(null)
  const toolsLinkRef = useRef<HTMLAnchorElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const toolsActive = esRutaDeHerramienta(pathname)

  // Al cambiar de página se cierran los menús (también al volver con el botón «atrás»).
  if (rutaAnterior !== pathname) {
    setRutaAnterior(pathname)
    setOpen(false)
    setToolsOpen(false)
  }

  const focusItem = (index: number) => {
    const i = (index + TOTAL_ITEMS) % TOTAL_ITEMS
    itemRefs.current[i]?.focus()
  }

  const closeTools = () => setToolsOpen(false)

  useEffect(() => {
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!toolsWrapRef.current?.contains(e.target as Node)) setToolsOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const openToolsAndFocus = (index: number) => {
    if (!toolsOpen) setToolsOpen(true)
    // El panel está `hidden` hasta el próximo render: se enfoca en el cuadro siguiente.
    requestAnimationFrame(() => focusItem(index))
  }

  const onToolsKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeTools()
      toolsLinkRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      openToolsAndFocus(0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openToolsAndFocus(TOTAL_ITEMS - 1)
    }
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const actual = itemRefs.current.findIndex((el) => el === document.activeElement)
    const destinos: Record<string, number> = {
      ArrowDown: actual + 1,
      ArrowUp: actual - 1,
      Home: 0,
      End: TOTAL_ITEMS - 1,
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      closeTools()
      toolsLinkRef.current?.focus()
    } else if (e.key in destinos) {
      e.preventDefault()
      focusItem(destinos[e.key])
    }
  }

  const onToolsBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!toolsWrapRef.current?.contains(e.relatedTarget)) closeTools()
  }

  const onToolsClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // En pantallas táctiles el primer toque abre el menú en vez de navegar.
    if (window.matchMedia('(hover: none)').matches && !toolsOpen) {
      e.preventDefault()
      setToolsOpen(true)
    }
  }

  const refItem = (indice: number) => (el: HTMLAnchorElement | null) => {
    itemRefs.current[indice] = el
  }

  return (
    <header className='relative z-30 border-b border-stone-200 bg-white backdrop-blur dark:border-indigo-900 dark:bg-indigo-950/80'>
      <div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6'>
        {/* Sin logo: el logo va en la franja azul de cada página. */}
        <div className='flex flex-col'>
          <span className='text-xl font-semibold text-blue-950 dark:text-white'>
            Radio Club Lircay
          </span>
          <span className='text-sm font-semibold text-blue-950 dark:text-indigo-300'>
            Talca, Región del Maule, Chile
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <OfflineBadge />
          {/* En pantallas angostas no caben junto al logo: van al final del menú móvil. */}
          <RedesSociales className='hidden sm:flex' />
          <ThemeSwitch />
          <button
            type='button'
            className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-stone-900 transition-colors hover:border-blue-950 hover:text-blue-950 dark:border-indigo-800 dark:bg-indigo-900 dark:text-white dark:hover:border-indigo-300 dark:hover:text-indigo-300 lg:hidden'
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls='nav-movil'
            aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          >
            <Icono nombre={open ? 'cerrar' : 'menu'} className='size-5' />
          </button>
        </div>
      </div>
      {/* Menú en su propia barra, bajo el logo, repartido a lo ancho del contenido. */}
      <nav
        className='hidden border-t border-stone-200 dark:border-indigo-900 lg:block'
        aria-label='Principal'
      >
        <div className='mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-2.5 text-sm sm:px-6'>
          {NAV_PRINCIPAL.map((item) =>
            item.to === RUTA_HERRAMIENTAS ? (
              <div
                key={item.to}
                ref={toolsWrapRef}
                className='relative flex'
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={closeTools}
                onBlur={onToolsBlur}
              >
                <NavLink
                  ref={toolsLinkRef}
                  to={RUTA_HERRAMIENTAS}
                  id='nav-herramientas'
                  aria-expanded={toolsOpen}
                  aria-controls={menuId}
                  aria-haspopup='true'
                  className={navClass({ isActive: toolsActive })}
                  onKeyDown={onToolsKeyDown}
                  onClick={onToolsClick}
                >
                  <Icono nombre={item.icono} />
                  {item.label}
                  <Icono nombre='chevron' className='size-3.5 shrink-0 opacity-70' />
                </NavLink>
                <div
                  id={menuId}
                  hidden={!toolsOpen}
                  className='absolute left-0 top-full z-20 max-h-[80vh] w-80 overflow-y-auto rounded-lg border border-stone-200 bg-white py-2 shadow-lg dark:border-indigo-800 dark:bg-indigo-950'
                  onKeyDown={onPanelKeyDown}
                >
                  {GRUPOS_MENU.map(({ title, links }) => (
                    <div key={title}>
                      <p className={groupTitleClass}>{title}</p>
                      {links.map(({ to, label, indice }) => (
                        <NavLink key={to} to={to} ref={refItem(indice)} className={menuItemClass}>
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  ))}
                  <NavLink
                    to={RUTA_HERRAMIENTAS}
                    end
                    ref={refItem(TOTAL_ITEMS - 1)}
                    className={todasClass}
                  >
                    <span className='inline-flex items-center gap-2'>
                      <Icono nombre='herramientas' />
                      Todas las Herramientas
                    </span>
                  </NavLink>
                </div>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
                <Icono nombre={item.icono} />
                {item.label}
              </NavLink>
            ),
          )}
        </div>
      </nav>
      <nav
        id='nav-movil'
        hidden={!open}
        className='border-t border-stone-200 bg-white dark:border-indigo-900 dark:bg-indigo-950/95 lg:hidden'
        aria-label='Principal móvil'
      >
        <div className='mx-auto flex max-h-[70vh] max-w-5xl flex-col gap-1 overflow-y-auto px-4 py-3 text-sm'>
          {NAV_PRINCIPAL.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileNavClass}>
              <Icono nombre={item.icono} />
              {item.label}
            </NavLink>
          ))}
          <RedesSociales className='mt-2 border-t border-stone-200 pt-2 dark:border-indigo-900 sm:hidden' />
        </div>
      </nav>
    </header>
  )
}

export default Header
