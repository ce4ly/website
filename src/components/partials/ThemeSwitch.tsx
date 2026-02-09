import { useSyncExternalStore } from 'react'

import Icono from './Icono'

/** Misma clave que lee public/tema.js antes de pintar la página. */
const STORAGE_KEY = 'theme'

const oyentes = new Set<() => void>()

const suscribir = (aviso: () => void) => {
  oyentes.add(aviso)
  return () => {
    oyentes.delete(aviso)
  }
}

/** La fuente de verdad es la clase `dark` de `<html>`, que tema.js pone antes del primer pintado. */
const esOscuro = () => document.documentElement.classList.contains('dark')

const ThemeSwitch = () => {
  // El prerender no conoce la preferencia: sale en claro y se corrige al hidratar.
  const oscuro = useSyncExternalStore(suscribir, esOscuro, () => false)

  const alternar = () => {
    const siguiente = !oscuro
    document.documentElement.classList.toggle('dark', siguiente)
    try {
      localStorage.setItem(STORAGE_KEY, siguiente ? 'dark' : 'light')
    } catch {
      // Sin almacenamiento (modo privado estricto): el tema dura lo que dure la página.
    }
    for (const aviso of oyentes) aviso()
  }

  return (
    <button
      type='button'
      onClick={alternar}
      className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-stone-900 transition-colors hover:border-blue-950 hover:text-blue-950 dark:border-indigo-800 dark:bg-indigo-900 dark:text-white dark:hover:border-indigo-300 dark:hover:text-indigo-300'
      aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <Icono nombre={oscuro ? 'luna' : 'sol'} className='size-4' />
    </button>
  )
}

export default ThemeSwitch
