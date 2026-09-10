export const SITE_URL = 'https://www.ce4ly.cl'

export const CLUB = {
  nombre: 'Radio Club Lircay',
  indicativo: 'CE4LY',
  slogan: 'Donde Cada Voz Importa',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  ogImage: `${SITE_URL}/og-default.png`,
  ciudad: 'Talca',
  region: 'Región del Maule',
  pais: 'CL',
  /** Plaza de Armas de Talca, aprox. */
  latitud: -35.4264,
  longitud: -71.6556,
  /** Maidenhead 6 caracteres; se recalcula en tests. */
  locator: 'FF44en',
  sameAs: [
    'https://www.facebook.com/Ce4rly',
    'https://www.instagram.com/radioclublircay',
    'https://www.qrz.com/db/ce4ly',
    'https://soundcloud.com/radio-club-lircay'
  ]
}

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
    addressCountry: CLUB.pais
  },
  sameAs: CLUB.sameAs
})
