import { useBoletines } from '../../hooks/useBoletines'
import { SITE_URL } from '../../lib/club'
import { FEED_BOLETINES } from '../../lib/proxies'
import { fechaIsoRss, formatearFechaRss } from '../../lib/rss'
import { SOUNDCLOUD_RADIO_CLUB_PROFILE } from '../../lib/soundcloud'
import SoundCloudSection from '../SoundCloudSection'
import Encabezado from '../partials/Encabezado'
import { enlaceClass } from '../partials/estilos'

const avisoClass = 'mx-auto max-w-3xl text-sm text-stone-600 dark:text-indigo-300'

const Boletines = () => {
  const estado = useBoletines()

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Boletines Informativos' justificado>
        Los boletines del Radio Club Lircay se publican en SoundCloud. Puede escucharlos aquí o{' '}
        <a href={`${SITE_URL}${FEED_BOLETINES}`} className={enlaceClass}>
          suscribirse al feed RSS
        </a>{' '}
        del club.
      </Encabezado>

      {estado.tipo === 'ok' && estado.episodios.length > 0 && (
        <ol className='mx-auto max-w-3xl space-y-3'>
          {estado.episodios.map((ep) => (
            <li
              key={ep.link || ep.title}
              className='rounded-xl border border-stone-300/70 bg-white px-4 py-3 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40'
            >
              <a
                href={ep.link || SOUNDCLOUD_RADIO_CLUB_PROFILE}
                target='_blank'
                rel='noreferrer noopener'
                className='font-medium text-blue-950 hover:underline dark:text-indigo-100'
              >
                {ep.title}
              </a>
              {ep.pubDate && (
                <p className='mt-1 text-xs text-stone-500 dark:text-indigo-300'>
                  <time dateTime={fechaIsoRss(ep.pubDate)}>{formatearFechaRss(ep.pubDate)}</time>
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      {estado.tipo === 'cargando' && <p className={avisoClass}>Cargando episodios…</p>}

      {estado.tipo === 'error' && (
        <p className={avisoClass}>
          El listado no está disponible ahora. Puede escucharlos en{' '}
          <a
            href={SOUNDCLOUD_RADIO_CLUB_PROFILE}
            target='_blank'
            rel='noreferrer noopener'
            className={enlaceClass}
          >
            SoundCloud
          </a>
          .
        </p>
      )}

      <SoundCloudSection />
    </section>
  )
}

export default Boletines
