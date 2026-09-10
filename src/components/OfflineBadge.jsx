import { useEffect, useState } from 'react'

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
      className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600 dark:bg-indigo-900 dark:text-indigo-200"
    >
      Sin conexión
    </span>
  )
}

export default OfflineBadge
