import { useEffect, useState } from 'react'
import { SITE_URL } from '../lib/club.js'
import { FEED_BOLETINES, formatearFechaRss, parsearFeedRss } from '../lib/rss.js'
import { SOUNDCLOUD_RADIO_CLUB_PROFILE } from '../lib/soundcloud.js'
import SoundCloudSection from '../components/SoundCloudSection.jsx'

const enlaceClass =
  'font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100'

const Boletines = () => {
  const [episodios, setEpisodios] = useState(null)
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    let cancelado = false
    const leer = async url => {
      const res = await fetch(url, {
        headers: { Accept: 'application/rss+xml' }
      })
      if (!res.ok) throw new Error(String(res.status))
      const xml = await res.text()
      if (!xml.includes('<rss') && !xml.includes('<item>')) {
        throw new Error('no-rss')
      }
      return xml
    }
    leer(FEED_BOLETINES)
      .catch(() => leer('/api/boletines.php'))
      .then(xml => {
        if (cancelado) return
        const items = parsearFeedRss(xml)
        setEpisodios(items)
        setEstado(items.length > 0 ? 'ok' : 'vacio')
      })
      .catch(() => {
        if (!cancelado) setEstado('error')
      })
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-center text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Boletines Informativos
        </h1>
        <p className="mx-auto max-w-3xl text-justify text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Los boletines del Radio Club Lircay se publican en SoundCloud. Puede
          escucharlos aquí o{' '}
          <a href={`${SITE_URL}${FEED_BOLETINES}`} className={enlaceClass}>
            suscribirse al feed RSS
          </a>{' '}
          del club.
        </p>
      </header>

      {estado === 'ok' && (
        <ol className="mx-auto max-w-3xl space-y-3">
          {episodios.map(ep => (
            <li
              key={ep.link || ep.title}
              className="rounded-xl border border-stone-300/70 bg-white px-4 py-3 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
            >
              <a
                href={ep.link || SOUNDCLOUD_RADIO_CLUB_PROFILE}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-blue-950 hover:underline dark:text-indigo-100"
              >
                {ep.title}
              </a>
              {ep.pubDate && (
                <p className="mt-1 text-xs text-stone-500 dark:text-indigo-300">
                  <time dateTime={ep.pubDate}>
                    {formatearFechaRss(ep.pubDate)}
                  </time>
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      {estado === 'cargando' && (
        <p className="mx-auto max-w-3xl text-sm text-stone-600 dark:text-indigo-300">
          Cargando episodios…
        </p>
      )}

      {estado === 'error' && (
        <p className="mx-auto max-w-3xl text-sm text-stone-600 dark:text-indigo-300">
          El listado no está disponible ahora. Puede escucharlos en{' '}
          <a
            href={SOUNDCLOUD_RADIO_CLUB_PROFILE}
            target="_blank"
            rel="noreferrer noopener"
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
