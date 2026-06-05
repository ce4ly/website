import { useEffect, useState } from 'react'
import {
  SOUNDCLOUD_RADIO_CLUB_PROFILE,
  fetchSoundCloudOEmbed,
  soundCloudWidgetSrc
} from '../lib/soundcloud.js'

const DEFAULT_HEIGHT = 450

const SoundCloudSection = () => {
  const [oembed, setOembed] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchSoundCloudOEmbed(SOUNDCLOUD_RADIO_CLUB_PROFILE)
      .then(data => {
        if (!cancelled) setOembed(data)
      })
      .catch(() => {
        /* El iframe estático sigue funcionando sin metadatos oEmbed */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const iframeTitle =
    typeof oembed?.title === 'string'
      ? `${oembed.title} (SoundCloud)`
      : 'Radio Club Lircay en SoundCloud'

  const height =
    typeof oembed?.height === 'number' ? oembed.height : DEFAULT_HEIGHT

  return (
    <section
      className="mx-auto w-full max-w-3xl space-y-3 rounded-xl border border-stone-300/70 bg-white p-4 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
      aria-labelledby="soundcloud-embed-heading"
    >
      <div className="space-y-1">
        <h2
          id="soundcloud-embed-heading"
          className="text-lg font-serif font-semibold text-stone-900 dark:text-white sm:text-xl"
        >
          {oembed?.title ?? 'Escucha en SoundCloud'}
        </h2>
        {typeof oembed?.author_name === 'string' && (
          <p className="text-sm text-stone-700 dark:text-indigo-100">
            {oembed.author_name}
          </p>
        )}
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          Reproducciones y material de{' '}
          <a
            href={SOUNDCLOUD_RADIO_CLUB_PROFILE}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-blue-950 underline underline-offset-4 transition-colors hover:text-blue-700 dark:text-indigo-200 dark:hover:text-indigo-100"
          >
            nuestro perfil en SoundCloud
          </a>
          .
        </p>
      </div>
      <div className="overflow-hidden rounded-md border border-stone-300/80 bg-white dark:border-indigo-800 dark:bg-indigo-950/60">
        <iframe
          title={iframeTitle}
          src={soundCloudWidgetSrc(SOUNDCLOUD_RADIO_CLUB_PROFILE)}
          width="100%"
          height={height}
          loading="lazy"
          className="w-full border-0"
          allow="autoplay; encrypted-media"
        />
      </div>
    </section>
  )
}

export default SoundCloudSection
