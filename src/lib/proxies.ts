import { FUENTE_SOLAR } from './calc/solar'
import { FUENTE_CLIMA } from './clima'
import { SOUNDCLOUD_USER_ID, soundCloudFeedUrl } from './soundcloud'

/**
 * Rutas del propio sitio que Netlify reexpone desde otro origen (`[[redirects]]` con `status = 200`
 * en netlify.toml). Así el navegador las pide al mismo origen: sin CORS y con la CSP en `'self'`.
 * `vite.config.ts` replica estos proxies en desarrollo y tests/netlify.test.ts comprueba que
 * netlify.toml coincide.
 */
export const PROXIES = {
  boletines: { ruta: '/boletines.xml', destino: soundCloudFeedUrl(SOUNDCLOUD_USER_ID) },
  solar: { ruta: '/api/solar.xml', destino: FUENTE_SOLAR },
  clima: { ruta: '/api/clima.json', destino: FUENTE_CLIMA },
} as const

/** Feed RSS público de los boletines. */
export const FEED_BOLETINES = PROXIES.boletines.ruta
