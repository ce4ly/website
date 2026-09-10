export const HERRAMIENTA_GRUPOS = [
  {
    title: 'Guías de Referencia',
    links: [
      { to: '/buscador', label: 'Buscador de Licencias' },
      {
        to: '/herramientas/espectro-radioelectrico',
        label: 'Espectro Radioeléctrico'
      },
      {
        to: '/herramientas/alfabeto-fonetico',
        label: 'Alfabeto Fonético OTAN'
      },
      { to: '/herramientas/codigos-q', label: 'Código Q' },
      { to: '/herramientas/tonos-ctcss-dcs', label: 'Tonos CTCSS y DCS' },
      { to: '/herramientas/indicativos', label: 'Indicativos por País' }
    ]
  },
  {
    title: 'Convertidores',
    enPagina: false,
    links: [
      { to: '/convertidor/potencia', label: 'Potencia' },
      { to: '/convertidor/frecuencia', label: 'Frecuencia' }
    ]
  },
  {
    title: 'Canales y Frecuencias',
    links: [
      { to: '/frecuencias/banda-ciudadana', label: 'Banda Ciudadana' },
      { to: '/frecuencias/marinas', label: 'Marinas' },
      { to: '/frecuencias/radio-comercial', label: 'Radio Comercial' },
      { to: '/frecuencias/tv-abierta', label: 'TV Abierta' },
      { to: '/frecuencias/emergencia', label: 'Emergencia' }
    ]
  },
  {
    title: 'Antenas HF',
    enMenu: false,
    links: [
      { to: '/calculadoras/dipolo', label: 'Dipolo' },
      { to: '/calculadoras/v-invertida', label: 'V Invertida' },
      { to: '/calculadoras/efhw', label: 'EFHW 49:1', oculto: true },
      {
        to: '/calculadoras/vertical-cuarto-onda',
        label: 'Vertical λ/4 con Radiales'
      },
      {
        to: '/calculadoras/loop-delta',
        label: 'Loop Delta / Cuadro',
        oculto: true
      },
      { to: '/calculadoras/ocfd', label: 'OCFD / Windom', oculto: true },
      { to: '/calculadoras/g5rv', label: 'G5RV y Doble Zepp', oculto: true },
      { to: '/calculadoras/loop-magnetico', label: 'Loop Magnético (STL)' }
    ]
  },
  {
    title: 'Antenas VHF/UHF',
    enMenu: false,
    links: [
      { to: '/calculadoras/j-pole', label: 'J-Pole' },
      { to: '/calculadoras/slim-jim', label: 'Slim Jim' },
      { to: '/calculadoras/flowerpot', label: 'Flowerpot' },
      { to: '/calculadoras/ground-plane', label: 'Ground Plane λ/4' },
      { to: '/calculadoras/cinco-octavos', label: '5/8 de Onda' },
      { to: '/calculadoras/colineal', label: 'Colineal Coaxial' },
      { to: '/calculadoras/turnstile', label: 'Turnstile / Eggbeater' }
    ]
  },
  {
    title: 'Antenas Directivas',
    enMenu: false,
    links: [
      { to: '/calculadoras/yagi', label: 'Yagi' },
      { to: '/calculadoras/moxon', label: 'Moxon', oculto: true },
      { to: '/calculadoras/quad', label: 'Cuadro Cúbico (Quad)', oculto: true }
    ]
  },
  {
    title: 'Calculadoras Auxiliares',
    enMenu: false,
    links: [
      { to: '/convertidor/potencia', label: 'Potencia' },
      { to: '/convertidor/frecuencia', label: 'Frecuencia' },
      { to: '/calculadoras/choque-coaxial', label: 'Choque de Coaxial' },
      { to: '/calculadoras/bobina', label: 'Bobina (Wheeler)' },
      { to: '/calculadoras/trampas', label: 'Trampas LC' },
      { to: '/calculadoras/linea-q', label: 'Línea Q (λ/4)' },
      { to: '/calculadoras/gamma-hairpin', label: 'Gamma Match y Hairpin' },
      { to: '/calculadoras/perdida-linea', label: 'Pérdida de Línea y ROE' },
      { to: '/calculadoras/nvis', label: 'Altura y Ángulo NVIS' }
    ]
  }
]

const enlacesUnicos = enlaces => [
  ...new Map(enlaces.map(enlace => [enlace.to, enlace])).values()
]

export const HERRAMIENTA_LINKS = enlacesUnicos(
  HERRAMIENTA_GRUPOS.flatMap(g => g.links)
)

export const HERRAMIENTA_GRUPOS_MENU = HERRAMIENTA_GRUPOS.filter(
  grupo => grupo.enMenu !== false
)
  .map(grupo => ({
    ...grupo,
    links: grupo.links.filter(link => !link.oculto)
  }))
  .filter(grupo => grupo.links.length > 0)

export const HERRAMIENTA_GRUPOS_PAGINA = HERRAMIENTA_GRUPOS.filter(
  grupo => grupo.enPagina !== false
)
