/** Rutas antiguas → nuevas. */
export const REDIRECCIONES = [
  { from: '/espectro', to: '/herramientas/espectro-radioelectrico' },
  { from: '/alfabeto', to: '/herramientas/alfabeto-fonetico' },
  { from: '/codigo-q', to: '/herramientas/codigos-q' },
  { from: '/indicativos', to: '/herramientas/indicativos' },
  { from: '/convertidor-potencia', to: '/convertidor/potencia' },
  { from: '/convertidor-frecuencia', to: '/convertidor/frecuencia' },
  { from: '/banda-ciudadana', to: '/frecuencias/banda-ciudadana' },
  { from: '/canales-marinos', to: '/frecuencias/marinas' },
  { from: '/radio-comercial', to: '/frecuencias/radio-comercial' },
  { from: '/tv-abierta', to: '/frecuencias/tv-abierta' },
  { from: '/emergencia', to: '/frecuencias/emergencia' },
  { from: '/dipolo', to: '/calculadoras/dipolo' },
  { from: '/v-invertida', to: '/calculadoras/v-invertida' },
  { from: '/efhw', to: '/calculadoras/efhw' },
  { from: '/vertical-cuarto-onda', to: '/calculadoras/vertical-cuarto-onda' },
  { from: '/loop-delta', to: '/calculadoras/loop-delta' },
  { from: '/ocfd', to: '/calculadoras/ocfd' },
  { from: '/g5rv', to: '/calculadoras/g5rv' },
  { from: '/loop-magnetico', to: '/calculadoras/loop-magnetico' },
  { from: '/j-pole', to: '/calculadoras/j-pole' },
  { from: '/slim-jim', to: '/calculadoras/slim-jim' },
  { from: '/flowerpot', to: '/calculadoras/flowerpot' },
  { from: '/ground-plane', to: '/calculadoras/ground-plane' },
  { from: '/cinco-octavos', to: '/calculadoras/cinco-octavos' },
  { from: '/colineal', to: '/calculadoras/colineal' },
  { from: '/turnstile', to: '/calculadoras/turnstile' },
  { from: '/yagi', to: '/calculadoras/yagi' },
  { from: '/moxon', to: '/calculadoras/moxon' },
  { from: '/quad', to: '/calculadoras/quad' }
]

export const destinoRedireccion = pathname => {
  const limpio =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname
  return REDIRECCIONES.find(r => r.from === limpio)?.to
}
