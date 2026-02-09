import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { TOOLS, normalizarRuta } from '../../lib/paginas'
import { PORTADA } from '../../lib/portada'
import Ondas from './Ondas'

/**
 * `<h1>` y bajada de cada página, en una franja azul como la portada de Inicio. La etiqueta de
 * arriba es la sección de la herramienta o, en las demás páginas, la misma de la portada.
 */
const Encabezado = ({
  titulo,
  children,
  justificado = false,
  etiqueta,
  pie,
}: {
  titulo: ReactNode
  children?: ReactNode
  /** Bajada larga en párrafo justificado (Boletines, Cursos). */
  justificado?: boolean
  /** Reemplaza la etiqueta de arriba (p. ej. el código de error). */
  etiqueta?: ReactNode
  /** Bajo la bajada, dentro de la franja (p. ej. enlaces). */
  pie?: ReactNode
}) => {
  const { pathname } = useLocation()
  const ruta = normalizarRuta(pathname)
  const seccion = TOOLS.find((tool) => tool.path === ruta)?.section

  return (
    <header className='relative overflow-hidden rounded-b-2xl bg-blue-950 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10 dark:bg-indigo-950 dark:ring-1 dark:ring-indigo-800'>
      <Ondas className='-right-24 -bottom-36 size-[26rem] sm:-right-16' />
      {/* Arriba y no centrado: así el título no cambia de altura entre páginas. */}
      <div className='relative flex items-start gap-8'>
        <div className='min-w-0 flex-1 space-y-3'>
          <p className='text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase'>
            {etiqueta ?? seccion ?? PORTADA.ubicacion}
          </p>
          <h1 className='font-serif text-3xl font-bold tracking-tight sm:text-4xl'>{titulo}</h1>
          {children && (
            // Los enlaces de la bajada usan enlaceClass, pensado para fondo claro.
            <p
              className={`max-w-2xl ${justificado ? 'text-justify ' : ''}text-sm leading-relaxed text-indigo-100 sm:text-base [&_a]:text-amber-200 [&_a:hover]:text-white`}
            >
              {children}
            </p>
          )}
          {pie}
        </div>
        {/* Chico en móvil. */}
        <img
          src='/logo-frontpage.svg'
          alt=''
          width={256}
          height={256}
          className='size-20 shrink-0 rounded-full shadow-2xl ring-2 ring-white/15 sm:size-32 sm:ring-4 md:size-40'
        />
      </div>
    </header>
  )
}

export default Encabezado
