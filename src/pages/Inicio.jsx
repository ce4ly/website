import { Link } from 'react-router-dom'
import { jsonLdOrganization } from '../lib/club.js'
import { BLOQUE_PORTADA } from '../lib/portada.js'
import {
  faFacebook,
  faInstagram,
  faSoundcloud
} from '@fortawesome/free-brands-svg-icons'
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Inicio = () => {
  return (
    <section className="space-y-4 items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdOrganization())
        }}
      />
      <img
        src="/banner.jpg"
        alt=""
        className="rounded-b-lg border border-1 border-t-0 border-stone-400/60 shadow shadow-lg shadow-stone-600"
      />
      <div className="flex flex-col flex-nowrap items-center gap-8 my-12">
        <img
          src="/logo-frontpage.png"
          alt="Logo Radio Club Lircay de Talca CE4LY"
          className="size-64 rounded-full shadow shadow-lg shadow-stone-600"
        />
        <ul className="flex flex-row flex-nowrap justify-center gap-4">
          <li>
            <a
              href="https://www.facebook.com/Ce4rly"
              target="_blank"
              rel="noreferrer noopener"
              title="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} size="3x" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/radioclublircay"
              target="_blank"
              rel="noreferrer noopener"
              title="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} size="3x" />
            </a>
          </li>
          <li>
            <a
              href="https://www.qrz.com/db/ce4ly"
              target="_blank"
              rel="noreferrer noopener"
              title="QRZ"
            >
              <FontAwesomeIcon icon={faSatelliteDish} size="3x" />
            </a>
          </li>
          <li>
            <a
              href="https://soundcloud.com/radio-club-lircay"
              target="_blank"
              rel="noreferrer noopener"
              title="SoundCloud"
            >
              <FontAwesomeIcon icon={faSoundcloud} size="3x" />
            </a>
          </li>
        </ul>
        <div className="w-full max-w-2xl flex-col items-center justify-center bg-blue-950 p-6 text-center text-white shadow shadow-lg shadow-stone-600">
          <h2 className="font-black font-serif mb-3 text-xl">
            {BLOQUE_PORTADA.titulo}
          </h2>
          <p className="mb-5 text-sm sm:text-base text-white/90">
            {BLOQUE_PORTADA.texto}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BLOQUE_PORTADA.enlaces.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-950 no-underline transition-colors hover:bg-stone-100"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <p className="font-serif">Sitio web en constante actualización.</p>
      </div>
    </section>
  )
}

export default Inicio
