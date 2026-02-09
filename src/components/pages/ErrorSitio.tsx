import { Link } from 'react-router-dom'

import { rutaDe } from '../../lib/paginas'
import Encabezado from '../partials/Encabezado'

const linkClass =
  'font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100'

const TEXTOS = {
  'no-encontrada': {
    codigo: 'Error 404',
    titulo: 'Esta página no existe',
    detalle: 'La dirección no corresponde a ninguna página del sitio.',
  },
  error: {
    codigo: 'Error',
    titulo: 'No pudimos mostrar esta página',
    detalle:
      'Algo falló al cargar esta página. Puede intentar de nuevo en unos minutos o escribirnos si el problema continúa.',
  },
} as const

/** Página 404 (también `/404.html`) y aviso del ErrorBoundary si una página falla. */
const ErrorSitio = ({ tipo }: { tipo: keyof typeof TEXTOS }) => {
  const { codigo, titulo, detalle } = TEXTOS[tipo]

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo={titulo} etiqueta={codigo}>
        {detalle}
      </Encabezado>
      <nav
        aria-label='Ir a otra página'
        className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm'
      >
        <Link to={rutaDe('inicio')} className={linkClass}>
          Inicio
        </Link>
        <Link to={rutaDe('herramientas')} className={linkClass}>
          Herramientas
        </Link>
        <Link to={rutaDe('contacto')} className={linkClass}>
          Contacto
        </Link>
      </nav>
    </section>
  )
}

export default ErrorSitio
