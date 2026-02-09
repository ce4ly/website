import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'

const STORAGE_KEY = 'theme'

const ThemeSwitch = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-stone-900 transition-colors hover:border-blue-950 hover:text-blue-950 dark:border-indigo-800 dark:bg-indigo-900 dark:text-white dark:hover:border-indigo-300 dark:hover:text-indigo-300"
      aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
    >
      {theme === 'light' ? (
        <FontAwesomeIcon icon={faSun} className="size-4" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="size-4" />
      )}
    </button>
  )
}

export default ThemeSwitch
