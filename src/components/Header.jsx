import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch.jsx'
import OfflineBadge from './OfflineBadge.jsx'
import {
  HERRAMIENTA_GRUPOS_MENU,
  HERRAMIENTA_LINKS
} from '../lib/herramientas.js'
import { NAV_PRINCIPAL } from '../lib/nav.js'
import Icono from './Icono.jsx'

const groupTitleClass =
  'px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-indigo-400'

const navClass = ({ isActive }) =>
  [
    'inline-flex items-center gap-1 text-blue-950 transition-colors dark:text-indigo-200',
    'font-medium',
    isActive
      ? 'underline underline-offset-4'
      : 'hover:underline underline-offset-4'
  ].join(' ')

const mobileNavClass = ({ isActive }) =>
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-amber-900 transition-colors dark:text-indigo-200',
    isActive
      ? 'bg-stone-100 dark:bg-indigo-900/70 underline underline-offset-4'
      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70 hover:underline underline-offset-4'
  ].join(' ')

const menuItemClass = ({ isActive }) =>
  [
    'block px-4 py-1.5 text-sm text-blue-950 no-underline transition-colors dark:text-indigo-200',
    isActive
      ? 'bg-stone-100 dark:bg-indigo-900/70'
      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70'
  ].join(' ')

const Header = () => {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const location = useLocation()
  const menuId = useId()
  const toolsWrapRef = useRef(null)
  const toolsLinkRef = useRef(null)
  const itemRefs = useRef([])
  const toolsActive =
    location.pathname === '/herramientas' ||
    HERRAMIENTA_LINKS.some(link => location.pathname === link.to)

  const menuHrefs = [
    ...HERRAMIENTA_GRUPOS_MENU.flatMap(g => g.links.map(l => l.to)),
    '/herramientas'
  ]

  const focusItem = index => {
    const i = (index + menuHrefs.length) % menuHrefs.length
    itemRefs.current[i]?.focus()
  }

  const closeTools = () => setToolsOpen(false)

  useEffect(() => {
    closeTools()
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onDoc = e => {
      if (!toolsWrapRef.current?.contains(e.target)) closeTools()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const onToolsKeyDown = e => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeTools()
      toolsLinkRef.current?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!toolsOpen) setToolsOpen(true)
      requestAnimationFrame(() => focusItem(0))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!toolsOpen) setToolsOpen(true)
      requestAnimationFrame(() => focusItem(menuHrefs.length - 1))
    }
  }

  const onPanelKeyDown = e => {
    const actual = itemRefs.current.findIndex(
      el => el === document.activeElement
    )
    if (e.key === 'Escape') {
      e.preventDefault()
      closeTools()
      toolsLinkRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusItem(actual + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusItem(actual - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusItem(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusItem(menuHrefs.length - 1)
    }
  }

  const onToolsBlur = e => {
    if (!toolsWrapRef.current?.contains(e.relatedTarget)) closeTools()
  }

  let itemIndex = -1
  const nextRef = () => {
    itemIndex += 1
    const i = itemIndex
    return node => {
      itemRefs.current[i] = node
    }
  }

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
        <nav
          className="hidden items-center gap-2.5 text-sm lg:gap-3 lg:flex"
          aria-label="Principal"
        >
          {NAV_PRINCIPAL.map(item =>
            item.to === '/herramientas' ? (
          <div
            key={item.to}
            ref={toolsWrapRef}
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={closeTools}
            onBlur={onToolsBlur}
          >
            <NavLink
              ref={toolsLinkRef}
              to="/herramientas"
              id="nav-herramientas"
              aria-expanded={toolsOpen}
              aria-controls={menuId}
              aria-haspopup="true"
              className={navClass({ isActive: toolsActive })}
              onKeyDown={onToolsKeyDown}
              onClick={e => {
                if (window.matchMedia('(hover: none)').matches && !toolsOpen) {
                  e.preventDefault()
                  setToolsOpen(true)
                }
              }}
            >
              <Icono nombre={item.icono} />
              {item.label}
              <Icono nombre="chevron" className="size-3.5 shrink-0 opacity-70" />
            </NavLink>
            <div
              id={menuId}
              hidden={!toolsOpen}
              className="absolute right-0 top-full z-20 max-h-[80vh] w-80 overflow-y-auto rounded-lg border border-stone-200 bg-white py-2 shadow-lg dark:border-indigo-800 dark:bg-indigo-950"
              onKeyDown={onPanelKeyDown}
            >
              {HERRAMIENTA_GRUPOS_MENU.map(({ title, links }) => (
                <div key={title}>
                  <p className={groupTitleClass}>{title}</p>
                  {links.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      ref={nextRef()}
                      className={menuItemClass}
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              ))}
              <NavLink
                to="/herramientas"
                end
                ref={nextRef()}
                className={({ isActive }) =>
                  [
                    'mx-2 mt-2 block rounded-md px-3 py-2 text-sm font-medium text-blue-950 no-underline dark:text-indigo-100',
                    isActive
                      ? 'bg-stone-100 dark:bg-indigo-900/70'
                      : 'hover:bg-stone-100 dark:hover:bg-indigo-900/70'
                  ].join(' ')
                }
              >
                <span className="inline-flex items-center gap-2">
                  <Icono nombre="herramientas" />
                  Todas las Herramientas
                </span>
              </NavLink>
            </div>
          </div>
            ) : (
              <NavLink key={item.to} to={item.to} className={navClass}>
                <Icono nombre={item.icono} />
                {item.label}
              </NavLink>
            )
          )}
          <OfflineBadge />
          <ThemeSwitch />
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <OfflineBadge />
          <ThemeSwitch />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-stone-900 transition-colors hover:border-blue-950 hover:text-blue-950 dark:border-indigo-800 dark:bg-indigo-900 dark:text-white dark:hover:border-indigo-300 dark:hover:text-indigo-300"
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-controls="nav-movil"
            aria-label="Abrir menú de navegación"
          >
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
            <Icono nombre={open ? 'cerrar' : 'menu'} className="size-5" />
          </button>
        </div>
      </div>
      <nav
        id="nav-movil"
        hidden={!open}
        className="border-t border-stone-200 bg-white dark:border-indigo-900 dark:bg-indigo-950/95 lg:hidden"
        aria-label="Principal móvil"
      >
        <div className="mx-auto flex max-h-[70vh] max-w-5xl flex-col gap-1 overflow-y-auto px-4 py-3 text-sm">
          {NAV_PRINCIPAL.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={mobileNavClass}
            >
              <Icono nombre={item.icono} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Header
