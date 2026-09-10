import { useEffect, useState } from 'react'
import Icono from './Icono.jsx'

const OfflineBadge = () => {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  if (!offline) return null

  return (
    <span
      role="status"
      title="Sin red. Las calculadoras siguen disponibles."
      className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600 dark:bg-indigo-900 dark:text-indigo-200"
    >
      <Icono nombre="sinconexion" className="size-3.5" />
      Sin conexión
    </span>
  )
}

export default OfflineBadge
