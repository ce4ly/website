export const SECCION = {
  guias: 'Guías de Referencia',
  convertidores: 'Convertidores',
  frecuencias: 'Canales y Frecuencias',
  hf: 'Antenas HF',
  vhf: 'Antenas VHF/UHF',
  directivas: 'Antenas Directivas',
  auxiliares: 'Calculadoras Auxiliares'
}

const SECCIONES_MENU = [
  SECCION.guias,
  SECCION.convertidores,
  SECCION.frecuencias
]

const SECCIONES_PAGINA = [
  SECCION.guias,
  SECCION.frecuencias,
  SECCION.hf,
  SECCION.vhf,
  SECCION.directivas,
  SECCION.auxiliares
]

/** Catálogo único de herramientas. Una entrada por ruta. */
export const TOOLS = [
  {
    slug: 'buscador',
    path: '/buscador',
    title: 'Buscador de Licencias',
    shortTitle: 'Buscador de Licencias',
    description:
      'Consulta las licencias de radioaficionado publicadas por SUBTEL por nombre, indicativo o número de licencia.',
    section: SECCION.guias,
    keywords: ['licencias', 'subtel', 'indicativo', 'buscador']
  },
  {
    slug: 'espectro-radioelectrico',
    path: '/herramientas/espectro-radioelectrico',
    title: 'Espectro Radioeléctrico',
    shortTitle: 'Espectro Radioeléctrico',
    description:
      'Bandas de radioaficionado en Chile con límites, modos habituales y notas de uso para HF, VHF y UHF.',
    section: SECCION.guias,
    keywords: ['espectro', 'bandas', 'hf', 'vhf', 'uhf']
  },
  {
    slug: 'alfabeto-fonetico',
    path: '/herramientas/alfabeto-fonetico',
    title: 'Alfabeto Fonético OTAN',
    shortTitle: 'Alfabeto Fonético OTAN',
    description:
      'Tabla del alfabeto fonético ICAO/OTAN para deletrear indicativos y mensajes en radiocomunicaciones.',
    section: SECCION.guias,
    keywords: ['alfabeto', 'otan', 'icao', 'deletreo']
  },
  {
    slug: 'codigos-q',
    path: '/herramientas/codigos-q',
    title: 'Códigos Q',
    shortTitle: 'Código Q',
    description:
      'Lista de códigos Q de uso habitual en radioafición, con su significado en pregunta y en respuesta.',
    section: SECCION.guias,
    keywords: ['codigo q', 'qth', 'qrm', 'qso']
  },
  {
    slug: 'tonos-ctcss-dcs',
    path: '/herramientas/tonos-ctcss-dcs',
    title: 'Tonos CTCSS y DCS',
    shortTitle: 'Tonos CTCSS y DCS',
    description:
      'Tablas de tonos CTCSS, códigos DCS y color code DMR, con la nota del tono 67,0 Hz de los repetidores del club.',
    section: SECCION.guias,
    keywords: ['ctcss', 'dcs', 'dmr', 'tono', '67.0']
  },
  {
    slug: 'indicativos',
    path: '/herramientas/indicativos',
    title: 'Indicativos por País',
    shortTitle: 'Indicativos por País',
    description:
      'Prefijos de indicativo amateur por país para identificar el origen de una estación al vuelo.',
    section: SECCION.guias,
    keywords: ['indicativos', 'prefijos', 'dxcc']
  },
  {
    slug: 'locator',
    path: '/herramientas/locator',
    title: 'Grid Maidenhead',
    shortTitle: 'Grid Maidenhead',
    description:
      'Convierte locator Maidenhead y coordenadas, calcula distancia por gran círculo y azimut entre dos cuadrículas.',
    section: SECCION.guias,
    keywords: ['maidenhead', 'locator', 'qth', 'azimut', 'distancia']
  },
  {
    slug: 'morse',
    path: '/herramientas/morse',
    title: 'Código Morse',
    shortTitle: 'Código Morse',
    description:
      'Tabla de Morse, traductor bidireccional, reproducción de audio y entrenador con temporización Farnsworth.',
    section: SECCION.guias,
    keywords: ['morse', 'cw', 'farnsworth', 'entrenador']
  },
  {
    slug: 'reloj',
    path: '/herramientas/reloj',
    title: 'Hora UTC y Propagación',
    shortTitle: 'Hora UTC y Propagación',
    description:
      'Reloj UTC junto a la hora de Chile e índices solares SFI, manchas, A y K para estimar la propagación HF.',
    section: SECCION.guias,
    keywords: ['utc', 'sfi', 'manchas', 'índice a', 'índice k', 'propagación']
  },
  {
    slug: 'potencia',
    path: '/convertidor/potencia',
    title: 'Convertidor de Potencia',
    shortTitle: 'Potencia',
    description:
      'Calcula voltios, amperios y watts a partir de dos de los tres valores, para fuentes y estaciones.',
    section: SECCION.auxiliares,
    menuSection: SECCION.convertidores,
    keywords: ['potencia', 'voltios', 'amperios', 'watts']
  },
  {
    slug: 'frecuencia',
    path: '/convertidor/frecuencia',
    title: 'Convertidor de Frecuencia',
    shortTitle: 'Frecuencia',
    description:
      'Convierte entre hertz, kilohertz, megahertz y gigahertz, y obtiene la longitud de onda asociada.',
    section: SECCION.auxiliares,
    menuSection: SECCION.convertidores,
    keywords: ['frecuencia', 'mhz', 'longitud de onda']
  },
  {
    slug: 'electronica',
    path: '/herramientas/electronica',
    title: 'Electrónica Básica',
    shortTitle: 'Electrónica Básica',
    description:
      'Ley de Ohm, código de colores de resistencias, divisor de tensión y resonancia LC para el curso del club.',
    section: SECCION.auxiliares,
    menuSection: SECCION.convertidores,
    keywords: ['ohm', 'resistencias', 'divisor', 'lc', 'electrónica']
  },
  {
    slug: 'banda-ciudadana',
    path: '/frecuencias/banda-ciudadana',
    title: 'Banda Ciudadana',
    shortTitle: 'Banda Ciudadana',
    description:
      'Los 40 canales de CB de 27 MHz con frecuencia de cada canal para uso en Chile.',
    section: SECCION.frecuencias,
    keywords: ['cb', '27 mhz', 'banda ciudadana']
  },
  {
    slug: 'marinas',
    path: '/frecuencias/marinas',
    title: 'Canales Marinos VHF',
    shortTitle: 'Marinas',
    description:
      'Canales del Apéndice 18 de VHF marina, con simplex, dúplex y usos habituales.',
    section: SECCION.frecuencias,
    keywords: ['marina', 'vhf', 'canal 16']
  },
  {
    slug: 'radio-comercial',
    path: '/frecuencias/radio-comercial',
    title: 'Radio Comercial',
    shortTitle: 'Radio Comercial',
    description:
      'Plan de canales de radiodifusión AM, FM y onda corta, no un directorio de emisoras locales.',
    section: SECCION.frecuencias,
    keywords: ['am', 'fm', 'oc', 'radiodifusión']
  },
  {
    slug: 'tv-abierta',
    path: '/frecuencias/tv-abierta',
    title: 'TV Abierta',
    shortTitle: 'TV Abierta',
    description:
      'Canales de televisión abierta de 6 MHz (ISDB-Tb) con frecuencia central de cada canal.',
    section: SECCION.frecuencias,
    keywords: ['tv', 'isdb-tb', 'canales']
  },
  {
    slug: 'emergencia',
    path: '/frecuencias/emergencia',
    title: 'Frecuencias de Emergencia',
    shortTitle: 'Emergencia',
    description:
      'Frecuencias de emergencia amateur CE3SER e IARU Región 2 para tráfico de socorro y bienestar.',
    section: SECCION.frecuencias,
    keywords: ['emergencia', 'ce3ser', 'iaru', 'sea']
  },
  {
    slug: 'dipolo',
    path: '/calculadoras/dipolo',
    title: 'Calculadora de Antena Dipolo HF',
    shortTitle: 'Dipolo',
    description:
      'Dimensiones de un dipolo de media onda a partir de la frecuencia, con factor de velocidad de alambre.',
    section: SECCION.hf,
    keywords: ['dipolo', 'hf', 'media onda']
  },
  {
    slug: 'v-invertida',
    path: '/calculadoras/v-invertida',
    title: 'Calculadora de V Invertida',
    shortTitle: 'V Invertida',
    description:
      'Largo de brazos y altura de una antena en V invertida según frecuencia y ángulo de apertura.',
    section: SECCION.hf,
    keywords: ['v invertida', 'dipolo', 'hf']
  },
  {
    slug: 'efhw',
    path: '/calculadoras/efhw',
    title: 'Calculadora de EFHW 49:1',
    shortTitle: 'EFHW 49:1',
    description:
      'Largo del hilo de una EFHW resonante y consideraciones del transformador 49:1.',
    section: SECCION.hf,
    oculto: true,
    keywords: ['efhw', 'end fed', '49:1']
  },
  {
    slug: 'vertical-cuarto-onda',
    path: '/calculadoras/vertical-cuarto-onda',
    title: 'Calculadora de Vertical λ/4 con Radiales',
    shortTitle: 'Vertical λ/4 con Radiales',
    description:
      'Radiador de cuarto de onda y radiales para una vertical HF, como punto de partida de recorte.',
    section: SECCION.hf,
    keywords: ['vertical', 'radiales', 'cuarto de onda']
  },
  {
    slug: 'loop-delta',
    path: '/calculadoras/loop-delta',
    title: 'Calculadora de Loop Delta / Cuadro',
    shortTitle: 'Loop Delta / Cuadro',
    description:
      'Perímetro y lados de un loop delta o cuadro de una longitud de onda en HF.',
    section: SECCION.hf,
    oculto: true,
    keywords: ['loop', 'delta', 'cuadro']
  },
  {
    slug: 'ocfd',
    path: '/calculadoras/ocfd',
    title: 'Calculadora de OCFD / Windom',
    shortTitle: 'OCFD / Windom',
    description:
      'Largos de cada brazo de un dipolo alimentado fuera de centro (OCFD o Windom).',
    section: SECCION.hf,
    oculto: true,
    keywords: ['ocfd', 'windom']
  },
  {
    slug: 'g5rv',
    path: '/calculadoras/g5rv',
    title: 'Calculadora de G5RV y Doble Zepp',
    shortTitle: 'G5RV y Doble Zepp',
    description:
      'Dimensiones clásicas del G5RV y del doble Zepp, incluyendo el tramo de línea adaptadora.',
    section: SECCION.hf,
    oculto: true,
    keywords: ['g5rv', 'zepp']
  },
  {
    slug: 'loop-magnetico',
    path: '/calculadoras/loop-magnetico',
    title: 'Calculadora de Loop Magnético (STL)',
    shortTitle: 'Loop Magnético (STL)',
    description:
      'Diámetro, conductor y condensador de un loop magnético pequeño (STL) para HF.',
    section: SECCION.hf,
    keywords: ['loop magnético', 'stl', 'q']
  },
  {
    slug: 'hilo-largo',
    path: '/calculadoras/hilo-largo',
    title: 'Calculadora de Hilo Largo con Unun 9:1',
    shortTitle: 'Hilo Largo 9:1',
    description:
      'Elige un largo no resonante para un hilo largo con unun 9:1, lejos de múltiplos de media onda.',
    section: SECCION.hf,
    keywords: ['hilo largo', 'unun', '9:1', 'random wire']
  },
  {
    slug: 'j-pole',
    path: '/calculadoras/j-pole',
    title: 'Calculadora de J-Pole',
    shortTitle: 'J-Pole',
    description:
      'Radiador, stub y punto de alimentación de una J-Pole para VHF o UHF.',
    section: SECCION.vhf,
    keywords: ['j-pole', 'vhf', 'uhf']
  },
  {
    slug: 'slim-jim',
    path: '/calculadoras/slim-jim',
    title: 'Calculadora de Slim Jim',
    shortTitle: 'Slim Jim',
    description:
      'Dimensiones de una Slim Jim, variante de la J-Pole con radiador plegado.',
    section: SECCION.vhf,
    keywords: ['slim jim', 'j-pole']
  },
  {
    slug: 'flowerpot',
    path: '/calculadoras/flowerpot',
    title: 'Calculadora de Flowerpot',
    shortTitle: 'Flowerpot',
    description:
      'Medidas de una flowerpot de coaxial, antena vertical discreta para 2 m y 70 cm.',
    section: SECCION.vhf,
    keywords: ['flowerpot', 'coaxial']
  },
  {
    slug: 'ground-plane',
    path: '/calculadoras/ground-plane',
    title: 'Calculadora de Ground Plane λ/4',
    shortTitle: 'Ground Plane λ/4',
    description:
      'Radiador y radiales de una ground plane de cuarto de onda, con caída a 45° hacia 50 Ω.',
    section: SECCION.vhf,
    keywords: ['ground plane', 'radiales']
  },
  {
    slug: 'cinco-octavos',
    path: '/calculadoras/cinco-octavos',
    title: 'Calculadora de 5/8 de Onda',
    shortTitle: '5/8 de Onda',
    description:
      'Largo del radiador 5/8 de onda y de los radiales para VHF o UHF.',
    section: SECCION.vhf,
    keywords: ['5/8', 'cinco octavos']
  },
  {
    slug: 'colineal',
    path: '/calculadoras/colineal',
    title: 'Calculadora de Colineal Coaxial',
    shortTitle: 'Colineal Coaxial',
    description:
      'Secciones de una colineal de coaxial apilada para ganar un poco de ganancia omnidireccional.',
    section: SECCION.vhf,
    keywords: ['colineal', 'coaxial']
  },
  {
    slug: 'turnstile',
    path: '/calculadoras/turnstile',
    title: 'Calculadora de Turnstile / Eggbeater',
    shortTitle: 'Turnstile / Eggbeater',
    description:
      'Dipolos cruzados de una turnstile o eggbeater para satélite y polarización horizontal omnidireccional.',
    section: SECCION.vhf,
    keywords: ['turnstile', 'eggbeater', 'satélite']
  },
  {
    slug: 'discone',
    path: '/calculadoras/discone',
    title: 'Calculadora de Discone',
    shortTitle: 'Discone',
    description:
      'Disco, cono y separación de una discone de banda ancha a partir de la frecuencia mínima, con rangos de la literatura.',
    section: SECCION.vhf,
    keywords: ['discone', 'banda ancha', 'scanner']
  },
  {
    slug: 'yagi',
    path: '/calculadoras/yagi',
    title: 'Calculadora de Yagi',
    shortTitle: 'Yagi',
    description:
      'Largos de elementos y espaciado de una Yagi de 3 a 7 elementos para HF, VHF o UHF.',
    section: SECCION.directivas,
    keywords: ['yagi', 'directiva']
  },
  {
    slug: 'moxon',
    path: '/calculadoras/moxon',
    title: 'Calculadora de Moxon',
    shortTitle: 'Moxon',
    description:
      'Rectángulo Moxon (director y reflector plegados) a partir de la frecuencia de diseño.',
    section: SECCION.directivas,
    oculto: true,
    keywords: ['moxon']
  },
  {
    slug: 'quad',
    path: '/calculadoras/quad',
    title: 'Calculadora de Cuadro Cúbico (Quad)',
    shortTitle: 'Cuadro Cúbico (Quad)',
    description:
      'Perímetros de driver y reflector de una quad cúbica de dos elementos.',
    section: SECCION.directivas,
    oculto: true,
    keywords: ['quad', 'cuadro cúbico']
  },
  {
    slug: 'choque-coaxial',
    path: '/calculadoras/choque-coaxial',
    title: 'Calculadora de Choque de Coaxial',
    shortTitle: 'Choque de Coaxial',
    description:
      'Vueltas y diámetro de un choque de coaxial (balun de corriente) según banda y tipo de cable.',
    section: SECCION.auxiliares,
    keywords: ['choque', 'balun', 'coaxial']
  },
  {
    slug: 'bobina',
    path: '/calculadoras/bobina',
    title: 'Calculadora de Bobina (Wheeler)',
    shortTitle: 'Bobina (Wheeler)',
    description:
      'Inductancia de un solenoide de una capa con la fórmula de Wheeler, en milímetros.',
    section: SECCION.auxiliares,
    keywords: ['bobina', 'wheeler', 'inductancia']
  },
  {
    slug: 'trampas',
    path: '/calculadoras/trampas',
    title: 'Calculadora de Trampas LC',
    shortTitle: 'Trampas LC',
    description:
      'Resonancia de trampas LC para dipolos multibanda, despejando L, C o frecuencia.',
    section: SECCION.auxiliares,
    keywords: ['trampas', 'lc', 'multibanda']
  },
  {
    slug: 'linea-q',
    path: '/calculadoras/linea-q',
    title: 'Calculadora de Línea Q (λ/4)',
    shortTitle: 'Línea Q (λ/4)',
    description:
      'Impedancia y largo de un transformador de cuarto de onda (línea Q) entre dos impedancias.',
    section: SECCION.auxiliares,
    keywords: ['línea q', 'cuarto de onda', 'matching']
  },
  {
    slug: 'gamma-hairpin',
    path: '/calculadoras/gamma-hairpin',
    title: 'Calculadora de Gamma Match y Hairpin',
    shortTitle: 'Gamma Match y Hairpin',
    description:
      'Punto de partida para gamma match y hairpin (match en U) en yagis alimentadas en el centro.',
    section: SECCION.auxiliares,
    keywords: ['gamma', 'hairpin', 'yagi']
  },
  {
    slug: 'perdida-linea',
    path: '/calculadoras/perdida-linea',
    title: 'Calculadora de Pérdida de Línea y ROE',
    shortTitle: 'Pérdida de Línea y ROE',
    description:
      'Atenuación de cables habituales y el efecto de la ROE sobre la pérdida total.',
    section: SECCION.auxiliares,
    keywords: ['pérdida', 'coaxial', 'swr', 'roe']
  },
  {
    slug: 'nvis',
    path: '/calculadoras/nvis',
    title: 'Calculadora de Altura y Ángulo NVIS',
    shortTitle: 'Altura y Ángulo NVIS',
    description:
      'Altura de un dipolo NVIS y ángulo de radiación para cobertura regional en HF.',
    section: SECCION.auxiliares,
    keywords: ['nvis', 'hf', 'ángulo']
  },
  {
    slug: 'horizonte',
    path: '/calculadoras/horizonte',
    title: 'Calculadora de Alcance y Presupuesto de Enlace',
    shortTitle: 'Alcance y Enlace',
    description:
      'Horizonte radioeléctrico con k = 4/3 y presupuesto de enlace (FSPL) para VHF/UHF en terreno despejado.',
    section: SECCION.auxiliares,
    keywords: ['horizonte', 'fspl', 'enlace', 'alcance']
  }
]

export const PAGINAS_ESTATICAS = [
  {
    slug: 'inicio',
    path: '/',
    title: 'Radio Club Lircay de Talca',
    description:
      'Sitio del Radio Club Lircay de Talca (CE4LY): radioafición, cursos, boletines y herramientas para el taller.',
    keywords: ['ce4ly', 'talca', 'radio club', 'radioafición']
  },
  {
    slug: 'acerca',
    path: '/acerca',
    title: 'Acerca del Radio Club',
    description:
      'Misión, objetivos y rol social del Radio Club Lircay, organización comunitaria funcional de Talca.',
    keywords: ['acerca', 'misión', 'estatutos']
  },
  {
    slug: 'boletines',
    path: '/boletines',
    title: 'Boletines',
    description:
      'Boletines informativos del Radio Club Lircay, publicados en SoundCloud y reexpuestos por RSS.',
    keywords: ['boletines', 'soundcloud', 'rss']
  },
  {
    slug: 'cursos',
    path: '/cursos',
    title: 'Cursos',
    description:
      'Cursos abiertos a la comunidad del Radio Club Lircay: electrónica básica, confección de antenas y reglamentación.',
    keywords: ['cursos', 'electrónica', 'antenas', 'reglamentación']
  },
  {
    slug: 'emergencias',
    path: '/emergencias',
    title: 'Radioafición y emergencias',
    description:
      'Rol del Radio Club Lircay en emergencias: qué hacer si es vecino o radioaficionado, y cómo coordinar con el club.',
    keywords: ['emergencias', 'sea', 'senapred']
  },
  {
    slug: 'contacto',
    path: '/contacto',
    title: 'Contacto',
    description:
      'Formulario y correo del Radio Club Lircay de Talca (contacto@ce4ly.cl) para consultas sobre radioafición y cursos.',
    keywords: ['contacto']
  },
  {
    slug: 'error-404',
    path: '/404',
    title: 'Página no encontrada',
    description:
      'La dirección no corresponde a ninguna página del Radio Club Lircay.',
    keywords: ['404'],
    enSitemap: false
  },
  {
    slug: 'error-500',
    path: '/500',
    title: 'Error del servidor',
    description: 'No se pudo cargar esta página del Radio Club Lircay.',
    keywords: ['500'],
    enSitemap: false
  },
  {
    slug: 'terminos',
    path: '/terminos',
    title: 'Términos de Servicio',
    description:
      'Términos de servicio del sitio web del Radio Club Lircay (CE4LY).',
    keywords: ['términos']
  },
  {
    slug: 'privacidad',
    path: '/privacidad',
    title: 'Política de Privacidad',
    description:
      'Política de privacidad del sitio web del Radio Club Lircay (CE4LY).',
    keywords: ['privacidad']
  },
  {
    slug: 'herramientas',
    path: '/herramientas',
    title: 'Todas las Herramientas',
    description:
      'Referencias, canales y calculadoras de antenas del Radio Club Lircay. Puntos de partida: recorte con analizador o ROE.',
    keywords: ['herramientas', 'calculadoras']
  },
  {
    slug: 'ex-directorio',
    path: '/ExDirectorio',
    title: 'Directorio',
    description: 'Directorio del Radio Club Lircay de Talca.',
    keywords: ['directorio'],
    enSitemap: false
  },
  {
    slug: 'ca5nfs',
    path: '/ca5nfs',
    title: 'CA5NFS',
    description: 'Página personal de Rodrigo Fuentealba Cartes, CA5NFS.',
    keywords: ['ca5nfs'],
    enSitemap: false
  }
]

const seccionMenu = herramienta =>
  herramienta.menuSection || herramienta.section

export const herramientaPorRuta = path => TOOLS.find(t => t.path === path)

export const paginaPorRuta = path => {
  const limpio =
    path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return (
    PAGINAS_ESTATICAS.find(p => p.path === limpio) ||
    herramientaPorRuta(limpio) ||
    null
  )
}

export const PAGINAS_SITEMAP = [
  ...PAGINAS_ESTATICAS.filter(p => p.enSitemap !== false),
  ...TOOLS
]

export const RUTAS_PRERENDER = [
  ...PAGINAS_ESTATICAS.map(p => p.path),
  ...TOOLS.map(t => t.path)
]

/** Reloj de propagación: índices solares en vivo, no va al precache. */
export const RUTA_PROPAGACION = '/herramientas/reloj'

export const RUTAS_OFFLINE = [
  '/',
  '/herramientas',
  '/cursos',
  '/emergencias',
  ...TOOLS.filter(t => t.path !== RUTA_PROPAGACION).map(t => t.path)
]

const aEnlace = herramienta => ({
  to: herramienta.path,
  label: herramienta.shortTitle,
  oculto: herramienta.oculto,
  description: herramienta.description,
  title: herramienta.title,
  slug: herramienta.slug,
  keywords: herramienta.keywords
})

const agrupar = (secciones, { paraMenu }) =>
  secciones
    .map(title => ({
      title,
      links: TOOLS.filter(t => seccionMenu(t) === title)
        .filter(t => (paraMenu ? !t.oculto : true))
        .map(aEnlace)
    }))
    .filter(grupo => grupo.links.length > 0)

export const HERRAMIENTA_GRUPOS = agrupar(
  [...new Set([...SECCIONES_PAGINA, ...SECCIONES_MENU])],
  { paraMenu: false }
)

export const HERRAMIENTA_GRUPOS_MENU = agrupar(SECCIONES_MENU, {
  paraMenu: true
})

export const HERRAMIENTA_GRUPOS_PAGINA = agrupar(SECCIONES_PAGINA, {
  paraMenu: false
})

export const HERRAMIENTA_LINKS = TOOLS.map(aEnlace)
