import { Link } from 'react-router-dom'

import { HERRAMIENTA_GRUPOS_PAGINA } from '../../lib/paginas'
import Encabezado from '../partials/Encabezado'

const Herramientas = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Herramientas'>
      Referencias, convertidores, canales y calculadoras de antenas para el taller del club. Son
      puntos de partida: recorte siempre con analizador o medidor de ROE.
    </Encabezado>
    <div className='space-y-8'>
      {HERRAMIENTA_GRUPOS_PAGINA.map(({ title, links }) => (
        <section key={title} className='space-y-3'>
          <h2 className='text-xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white'>
            {title}
          </h2>
          <ul className='grid gap-3 sm:grid-cols-2'>
            {links.map(({ to, label, description }) => (
              <li key={to}>
                <Link
                  to={to}
                  className='block rounded-xl border border-stone-300/70 bg-white px-4 py-3 text-sm font-medium text-blue-950 no-underline shadow-sm transition-colors hover:bg-stone-50 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100 dark:hover:bg-indigo-950/70'
                >
                  {label}
                  <span className='mt-1 block text-xs font-normal text-stone-600 dark:text-indigo-300'>
                    {description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </section>
)

export default Herramientas
