import { SOUNDCLOUD_RADIO_CLUB_PROFILE, soundCloudWidgetSrc } from '../lib/soundcloud'
import { TARJETA } from './partials/estilos'

/** Reproductor de SoundCloud con el perfil del club. */
const SoundCloudSection = () => (
  <section
    className={`mx-auto w-full max-w-3xl space-y-3 ${TARJETA} p-4`}
    aria-labelledby='soundcloud-embed-heading'
  >
    <div className='space-y-1'>
      <h2
        id='soundcloud-embed-heading'
        className='text-lg font-serif font-semibold text-stone-900 dark:text-white sm:text-xl'
      >
        Escucha en SoundCloud
      </h2>
      <p className='text-sm text-stone-700 dark:text-indigo-100'>
        Reproducciones y material de{' '}
        <a
          href={SOUNDCLOUD_RADIO_CLUB_PROFILE}
          target='_blank'
          rel='noreferrer noopener'
          className='font-medium text-blue-950 underline underline-offset-4 transition-colors hover:text-blue-700 dark:text-indigo-200 dark:hover:text-indigo-100'
        >
          nuestro perfil en SoundCloud
        </a>
        .
      </p>
    </div>
    <div className='overflow-hidden rounded-md border border-stone-300/80 bg-white dark:border-indigo-800 dark:bg-indigo-950/60'>
      <iframe
        title='Radio Club Lircay en SoundCloud'
        src={soundCloudWidgetSrc()}
        width='100%'
        height={450}
        loading='lazy'
        className='w-full border-0'
        allow='autoplay; encrypted-media'
      />
    </div>
  </section>
)

export default SoundCloudSection
