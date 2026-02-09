import { Link } from 'react-router-dom'

import { CURSOS, CURSOS_INTRO, asuntoConsultaCurso } from '../../lib/cursos'
import { enlaceContacto } from '../../lib/paginas'
import Encabezado from '../partials/Encabezado'
import { botonClass } from '../partials/estilos'

const Cursos = () => {
  return (
    <section className='mb-16 space-y-10'>
      <Encabezado titulo={CURSOS_INTRO.titulo} justificado>
        {CURSOS_INTRO.texto}
      </Encabezado>

      <ul className='grid gap-8 md:grid-cols-1'>
        {CURSOS.map((curso) => {
          const asunto = asuntoConsultaCurso(curso.nombre)
          return (
            <li
              key={curso.slug}
              className='overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40'
            >
              <article className='grid gap-0 sm:grid-cols-[minmax(0,18rem)_1fr]'>
                <figure className='m-0'>
                  <img
                    src={curso.imagen}
                    alt={curso.alt}
                    width={curso.width}
                    height={curso.height}
                    loading='lazy'
                    className='h-full w-full object-cover'
                  />
                  <figcaption className='px-3 py-1.5 text-[11px] leading-snug text-stone-500 dark:text-indigo-300/80'>
                    Foto:{' '}
                    <a
                      href={curso.credito.url}
                      target='_blank'
                      rel='noreferrer noopener'
                      className='underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100'
                    >
                      {curso.credito.autor}
                    </a>{' '}
                    / Pexels
                  </figcaption>
                </figure>
                <div className='flex flex-col gap-4 p-5 sm:p-6'>
                  <div className='space-y-2'>
                    <h2 className='text-xl font-serif font-semibold text-stone-900 dark:text-white'>
                      {curso.nombre}
                    </h2>
                    <p className='text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-indigo-400'>
                      Próxima versión: {curso.fecha}
                    </p>
                    <p className='text-sm text-stone-700 dark:text-indigo-100'>
                      {curso.descripcion}
                    </p>
                  </div>
                  <div>
                    <Link to={enlaceContacto(asunto)} className={botonClass}>
                      Consultar este curso
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Cursos
