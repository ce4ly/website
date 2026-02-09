import { SOUNDCLOUD_RADIO_CLUB_PROFILE } from './soundcloud'

export const SITE_URL = 'https://www.ce4ly.cl'

export const CONTACTO_EMAIL = 'contacto@ce4ly.cl'

export const CLUB = {
  nombre: 'Radio Club Lircay',
  indicativo: 'CE4LY',
  slogan: 'Donde Cada Voz Importa',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-frontpage.png`,
  ogImage: `${SITE_URL}/og-default.png`,
  ciudad: 'Talca',
  region: 'Región del Maule',
  pais: 'CL',
  /** Plaza de Armas de Talca, aprox. */
  latitud: -35.4264,
  longitud: -71.6556,
  /** Maidenhead 6 caracteres; se recalcula en tests. */
  locator: 'FF44en',
  redes: {
    facebook: 'https://www.facebook.com/Ce4rly',
    instagram: 'https://www.instagram.com/radioclublircay',
    qrz: 'https://www.qrz.com/db/ce4ly',
    soundcloud: SOUNDCLOUD_RADIO_CLUB_PROFILE,
  },
} as const

export const jsonLdOrganization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: CLUB.nombre,
  alternateName: CLUB.indicativo,
  url: CLUB.url,
  logo: CLUB.logo,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CLUB.ciudad,
    addressRegion: CLUB.region,
    addressCountry: CLUB.pais,
  },
  sameAs: Object.values(CLUB.redes),
})

export const jsonLdContactPoint = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPoint',
  email: CONTACTO_EMAIL,
  contactType: 'customer support',
  areaServed: 'CL',
  availableLanguage: 'es',
  url: `${SITE_URL}/contacto/`,
})
