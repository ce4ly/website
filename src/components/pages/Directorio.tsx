import { DIRECTORIO, LADO_FOTO, urlQrz } from '../../lib/directorio'
import Encabezado from '../partials/Encabezado'
import { TARJETA } from '../partials/estilos'

/** Tarjetas con foto, nombre, indicativo (enlace a QRZ) y cargo de cada integrante. */
const Directorio = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Directorio'>Conoce al directorio del Radio Club Lircay.</Encabezado>
    <div className='mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {DIRECTORIO.map((persona) => (
        <article key={persona.indicativo} className={`overflow-hidden ${TARJETA}`}>
          <img
            src={persona.foto}
            alt={`Fotografía de ${persona.nombre}`}
            width={LADO_FOTO}
            height={LADO_FOTO}
            loading='lazy'
            className='aspect-square w-full object-cover'
          />
          <div className='space-y-1 p-4'>
            <h2 className='text-lg font-semibold text-stone-900 dark:text-white'>
              {persona.nombre}
            </h2>
            <a
              href={urlQrz(persona.indicativo)}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block font-mono text-sm text-blue-950 underline underline-offset-4 transition-colors hover:text-blue-700 dark:text-indigo-200 dark:hover:text-indigo-100'
            >
              {persona.indicativo}
            </a>
            <p className='text-sm text-stone-700 dark:text-indigo-100'>{persona.cargo}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
)

export default Directorio
