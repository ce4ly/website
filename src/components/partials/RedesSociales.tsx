import { faFacebook, faInstagram, faSoundcloud } from '@fortawesome/free-brands-svg-icons'
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons'

import { CLUB } from '../../lib/club'
import Icon from './Icon'

const REDES = [
  { titulo: 'Facebook', href: CLUB.redes.facebook, icono: faFacebook },
  { titulo: 'Instagram', href: CLUB.redes.instagram, icono: faInstagram },
  { titulo: 'QRZ', href: CLUB.redes.qrz, icono: faSatelliteDish },
  { titulo: 'SoundCloud', href: CLUB.redes.soundcloud, icono: faSoundcloud },
]

/** Mismo tamaño que el botón del tema; el icono de Font Awesome mide 1em (text-base). */
const ENLACE = {
  header:
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-base text-blue-950 transition-colors hover:bg-stone-100 hover:text-blue-800 hover:no-underline dark:text-indigo-200 dark:hover:bg-indigo-900 dark:hover:text-white',
  /** Sobre el azul del footer: círculos con borde, más grandes. */
  footer:
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-indigo-100 transition-colors hover:border-amber-300 hover:bg-white/10 hover:text-amber-300 hover:no-underline',
}

/** Iconos con enlace a las redes del club (el nombre queda para lectores de pantalla). */
const RedesSociales = ({
  className = '',
  variante = 'header',
}: {
  className?: string
  variante?: keyof typeof ENLACE
}) => (
  <ul
    className={`flex items-center ${variante === 'footer' ? 'gap-2' : 'gap-0.5'} ${className}`}
    aria-label='Redes sociales'
  >
    {REDES.map(({ titulo, href, icono }) => (
      <li key={titulo}>
        <a
          href={href}
          target='_blank'
          rel='noreferrer noopener'
          title={titulo}
          className={ENLACE[variante]}
        >
          <Icon icon={icono} />
          <span className='sr-only'>{titulo}</span>
        </a>
      </li>
    ))}
  </ul>
)

export default RedesSociales
