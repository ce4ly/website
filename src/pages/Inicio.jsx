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
        <div
          className={`${
            BLOQUE_PORTADA.oculto ? 'hidden' : 'flex'
          } w-full max-w-2xl flex-col items-center justify-center bg-blue-950 p-4 text-center text-white shadow shadow-lg shadow-stone-600`}
        >
          <h2 className="font-black font-serif mb-4">
            {BLOQUE_PORTADA.titulo}
          </h2>
          {BLOQUE_PORTADA.lineas.map(linea => (
            <p key={linea} className="font-mono">
              {linea}
            </p>
          ))}
        </div>
        <p className="font-serif">Sitio web en constante actualización.</p>
      </div>
    </section>
  )
}

export default Inicio
