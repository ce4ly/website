/**
 * Easter egg de la portada: radios de Talca que se pueden escuchar desde la pantalla de la
 * repetidora (clic en «FM»). Los streams van directo al servidor de la emisora —un proxy de
 * Netlify cortaría un stream que no termina—, así que sus orígenes van en `media-src` de la CSP
 * (netlify.toml); tests/netlify.test.ts lo comprueba.
 */
export type Emisora = {
  id: string
  nombre: string
  /** MHz */
  frecuenciaMhz: number
  ciudad: string
  stream: string
}

export const EMISORAS: readonly Emisora[] = [
  {
    id: 'paloma',
    nombre: 'Radio Paloma',
    frecuenciaMhz: 97.5,
    ciudad: 'Talca',
    stream: 'https://audio3.tustreaming.cl/7320/stream',
  },
  {
    id: 'fmmas',
    nombre: 'FM+',
    frecuenciaMhz: 92.3,
    ciudad: 'Talca',
    stream: 'https://audio5.tustreaming.cl/8010/fmmas',
  },
  {
    id: 'marisol',
    nombre: 'Radio Marisol',
    frecuenciaMhz: 101.5,
    ciudad: 'Talca',
    stream: 'https://audio0.tustreaming.cl/7620/stream',
  },
]
