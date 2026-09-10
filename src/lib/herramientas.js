export const HERRAMIENTA_GRUPOS = [
  {
    title: 'Referencia',
    links: [
      { to: '/buscador', label: 'Buscador' },
      { to: '/herramientas/espectro-radioelectrico', label: 'Espectro' },
      { to: '/herramientas/alfabeto-fonetico', label: 'Alfabeto' },
      { to: '/herramientas/codigos-q', label: 'Código Q' },
      { to: '/herramientas/indicativos', label: 'Indicativos' }
    ]
  },
  {
    title: 'Convertidores',
    links: [
      { to: '/convertidor/potencia', label: 'Potencia' },
      { to: '/convertidor/frecuencia', label: 'Frecuencia' }
    ]
  },
  {
    title: 'HF alambre',
    links: [
      { to: '/calculadoras/dipolo', label: 'Dipolo' },
      { to: '/calculadoras/v-invertida', label: 'V invertida' },
      { to: '/calculadoras/efhw', label: 'EFHW 49:1', oculto: true },
      {
        to: '/calculadoras/vertical-cuarto-onda',
        label: 'Vertical λ/4 con radiales'
      },
      {
        to: '/calculadoras/loop-delta',
        label: 'Loop delta / cuadro',
        oculto: true
      },
      { to: '/calculadoras/ocfd', label: 'OCFD / Windom', oculto: true },
      { to: '/calculadoras/g5rv', label: 'G5RV y Doble Zepp', oculto: true },
      { to: '/calculadoras/loop-magnetico', label: 'Loop magnético (STL)' }
    ]
  },
  {
    title: 'VHF/UHF',
    links: [
      { to: '/calculadoras/j-pole', label: 'J-Pole' },
      { to: '/calculadoras/slim-jim', label: 'Slim Jim' },
      { to: '/calculadoras/flowerpot', label: 'Flowerpot' },
      { to: '/calculadoras/ground-plane', label: 'Ground plane λ/4' },
      { to: '/calculadoras/cinco-octavos', label: '5/8 de onda' },
      { to: '/calculadoras/colineal', label: 'Colineal coaxial' },
      { to: '/calculadoras/turnstile', label: 'Turnstile / eggbeater' }
    ]
  },
  {
    title: 'Directivas',
    links: [
      { to: '/calculadoras/yagi', label: 'Yagi' },
      { to: '/calculadoras/moxon', label: 'Moxon', oculto: true },
      { to: '/calculadoras/quad', label: 'Cuadro cúbico (quad)', oculto: true }
    ]
  },
  {
    title: 'Auxiliares',
    links: [
      { to: '/choque-coaxial', label: 'Choque de coaxial' },
      { to: '/bobina', label: 'Bobina (Wheeler)' },
      { to: '/trampas', label: 'Trampas LC' },
      { to: '/linea-q', label: 'Línea Q (λ/4)' },
      { to: '/gamma-hairpin', label: 'Gamma match y hairpin' },
      { to: '/perdida-linea', label: 'Pérdida de línea y ROE' },
      { to: '/nvis', label: 'Altura y ángulo NVIS' }
    ]
  },
  {
    title: 'Canales y frecuencias',
    links: [
      { to: '/frecuencias/banda-ciudadana', label: 'Banda ciudadana' },
      { to: '/frecuencias/marinas', label: 'Marinas' },
      { to: '/frecuencias/radio-comercial', label: 'Radio comercial' },
      { to: '/frecuencias/tv-abierta', label: 'TV abierta' },
      { to: '/frecuencias/emergencia', label: 'Emergencia' }
    ]
  }
]

export const HERRAMIENTA_LINKS = HERRAMIENTA_GRUPOS.flatMap(g => g.links)

export const HERRAMIENTA_GRUPOS_PUBLICOS = HERRAMIENTA_GRUPOS.map(grupo => ({
  ...grupo,
  links: grupo.links.filter(link => !link.oculto)
})).filter(grupo => grupo.links.length > 0)
