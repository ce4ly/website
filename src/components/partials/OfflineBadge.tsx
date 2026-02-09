import { useSyncExternalStore } from 'react'

import Icono from './Icono'

const suscribir = (aviso: () => void) => {
  window.addEventListener('online', aviso)
  window.addEventListener('offline', aviso)
  return () => {
    window.removeEventListener('online', aviso)
    window.removeEventListener('offline', aviso)
  }
}

/** Aviso «Sin conexión» cuando el navegador pierde la red (las calculadoras siguen disponibles). */
const OfflineBadge = () => {
  // En el servidor (prerender) se asume conexión: el aviso solo aparece en el cliente.
  const offline = useSyncExternalStore(
    suscribir,
    () => !navigator.onLine,
    () => false,
  )

  if (!offline) return null

  return (
    <span
      role='status'
      title='Sin red. Las calculadoras siguen disponibles.'
      className='inline-flex items-center gap-1 rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600 dark:bg-indigo-900 dark:text-indigo-200'
    >
      <Icono nombre='sinconexion' className='size-3.5' />
      Sin conexión
    </span>
  )
}

export default OfflineBadge
