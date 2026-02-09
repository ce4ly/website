/**
 * Registro central de páginas: ruta, título y descripción de cada una. De aquí salen las rutas de
 * React Router, el prerender, el sitemap, las etiquetas de `<head>` (seo.ts) y los menús.
 *
 * Las rutas llevan barra final: es la URL con que Netlify sirve cada HTML pre-renderizado
 * (`/acerca/index.html` → `/acerca/`); sin ella, Netlify responde primero con un 301.
 */

export const SECCION = {
  guias: 'Guías de Referencia',
  convertidores: 'Convertidores',
  frecuencias: 'Canales y Frecuencias',
  hf: 'Antenas HF',
  vhf: 'Antenas VHF/UHF',
  directivas: 'Antenas Directivas',
  auxiliares: 'Calculadoras Auxiliares',
} as const

export type Seccion = (typeof SECCION)[keyof typeof SECCION]

const SECCIONES_MENU: readonly Seccion[] = [
  SECCION.guias,
  SECCION.convertidores,
  SECCION.frecuencias,
]

const SECCIONES_PAGINA: readonly Seccion[] = [
  SECCION.guias,
  SECCION.frecuencias,
  SECCION.hf,
  SECCION.vhf,
  SECCION.directivas,
  SECCION.auxiliares,
]

export type Pagina = {
  slug: string
  path: string
  title: string
  description: string
  keywords: readonly string[]
  /**
   * `oculta`: fuera del sitemap y de los menús, pero indexable si alguien la enlaza.
   * `borrador`: contenido provisional; fuera del sitemap y con `noindex`.
   */
  visibilidad?: 'oculta' | 'borrador'
}

export type Herramienta = Pagina & {
  shortTitle: string
  section: Seccion
  /** Sección en el menú desplegable, si difiere de la de /herramientas/. */
  menuSection?: Seccion
  /** Fuera del menú desplegable (sigue en /herramientas/). */
  oculto?: boolean
}

/** Catálogo único de herramientas. Una entrada por ruta. */
export const TOOLS = [
  {
    slug: 'buscador',
    path: '/buscador/',
    title: 'Buscador de Licencias',
    shortTitle: 'Buscador de Licencias',
    description:
      'Consulta las licencias de radioaficionado publicadas por SUBTEL por nombre, indicativo o número de licencia.',
    section: SECCION.guias,
    keywords: ['licencias', 'subtel', 'indicativo', 'buscador'],
  },
  {
    slug: 'espectro-radioelectrico',
    path: '/herramientas/espectro-radioelectrico/',
    title: 'Espectro Radioeléctrico',
    shortTitle: 'Espectro Radioeléctrico',
    description:
      'Bandas de radioaficionado en Chile con límites, modos habituales y notas de uso para HF, VHF y UHF.',
    section: SECCION.guias,
    keywords: ['espectro', 'bandas', 'hf', 'vhf', 'uhf'],
  },
  {
    slug: 'alfabeto-fonetico',
    path: '/herramientas/alfabeto-fonetico/',
    title: 'Alfabeto Fonético OTAN',
    shortTitle: 'Alfabeto Fonético OTAN',
    description:
      'Tabla del alfabeto fonético ICAO/OTAN para deletrear indicativos y mensajes en radiocomunicaciones.',
    section: SECCION.guias,
    keywords: ['alfabeto', 'otan', 'icao', 'deletreo'],
  },
  {
    slug: 'codigos-q',
    path: '/herramientas/codigos-q/',
    title: 'Códigos Q',
    shortTitle: 'Código Q',
    description:
      'Lista de códigos Q de uso habitual en radioafición, con su significado en pregunta y en respuesta.',
    section: SECCION.guias,
    keywords: ['codigo q', 'qth', 'qrm', 'qso'],
  },
  {
    slug: 'tonos-ctcss-dcs',
    path: '/herramientas/tonos-ctcss-dcs/',
    title: 'Tonos CTCSS y DCS',
    shortTitle: 'Tonos CTCSS y DCS',
    description:
      'Tablas de tonos CTCSS, códigos DCS y color code DMR, con la nota del tono 67,0 Hz de los repetidores del club.',
    section: SECCION.guias,
    keywords: ['ctcss', 'dcs', 'dmr', 'tono', '67.0'],
  },
  {
    slug: 'indicativos',
    path: '/herramientas/indicativos/',
    title: 'Indicativos por País',
    shortTitle: 'Indicativos por País',
    description:
      'Prefijos de indicativo amateur por país para identificar el origen de una estación al vuelo.',
    section: SECCION.guias,
    keywords: ['indicativos', 'prefijos', 'dxcc'],
  },
  {
    slug: 'locator',
    path: '/herramientas/locator/',
    title: 'Grid Maidenhead',
    shortTitle: 'Grid Maidenhead',
    description:
      'Convierte locator Maidenhead y coordenadas, calcula distancia por gran círculo y azimut entre dos cuadrículas.',
    section: SECCION.guias,
    keywords: ['maidenhead', 'locator', 'qth', 'azimut', 'distancia'],
  },
  {
    slug: 'morse',
    path: '/herramientas/morse/',
    title: 'Código Morse',
    shortTitle: 'Código Morse',
    description:
      'Tabla de Morse, traductor bidireccional, reproducción de audio y entrenador con temporización Farnsworth.',
    section: SECCION.guias,
    keywords: ['morse', 'cw', 'farnsworth', 'entrenador'],
  },
  {
    slug: 'reloj',
    path: '/herramientas/reloj/',
    title: 'Hora UTC y Propagación',
    shortTitle: 'Hora UTC y Propagación',
    description:
      'Reloj UTC junto a la hora de Chile e índices solares SFI, manchas, A y K para estimar la propagación HF.',
    section: SECCION.guias,
    keywords: ['utc', 'sfi', 'manchas', 'índice a', 'índice k', 'propagación'],
  },
  {
    slug: 'operativo',
    path: '/herramientas/operativo/',
    title: 'Control de Operativo',
    shortTitle: 'Control de Operativo',
    description:
      'Registro de estaciones en un operativo: busca cada indicativo por sus letras, anota la hora y descarga el reporte en .txt.',
    section: SECCION.guias,
    keywords: ['operativo', 'control de red', 'emergencia', 'registro', 'estaciones'],
  },
  {
    slug: 'potencia',
    path: '/convertidor/potencia/',
    title: 'Convertidor de Potencia',
    shortTitle: 'Potencia',
    description:
      'Calcula voltios, amperios y watts a partir de dos de los tres valores, para fuentes y estaciones.',
    section: SECCION.auxiliares,
    menuSection: SECCION.convertidores,
    keywords: ['potencia', 'voltios', 'amperios', 'watts'],
  },
  {
    slug: 'frecuencia',
    path: '/convertidor/frecuencia/',
    title: 'Convertidor de Frecuencia',
    shortTitle: 'Frecuencia',
    description:
      'Convierte entre hertz, kilohertz, megahertz y gigahertz, y obtiene la longitud de onda asociada.',
    section: SECCION.auxiliares,
    menuSection: SECCION.convertidores,
    keywords: ['frecuencia', 'mhz', 'longitud de onda'],
  },
  {
    slug: 'electronica',
    path: '/herramientas/electronica/',
    title: 'Electrónica Básica',
    shortTitle: 'Electrónica Básica',
    description:
      'Ley de Ohm, código de colores de resistencias, divisor de tensión y resonancia LC para el curso del club.',
    section: SECCION.auxiliares,
    menuSection: SECCION.convertidores,
    keywords: ['ohm', 'resistencias', 'divisor', 'lc', 'electrónica'],
  },
  {
    slug: 'banda-ciudadana',
    path: '/frecuencias/banda-ciudadana/',
    title: 'Banda Ciudadana',
    shortTitle: 'Banda Ciudadana',
    description: 'Los 40 canales de CB de 27 MHz con frecuencia de cada canal para uso en Chile.',
    section: SECCION.frecuencias,
    keywords: ['cb', '27 mhz', 'banda ciudadana'],
  },
  {
    slug: 'marinas',
    path: '/frecuencias/marinas/',
    title: 'Canales Marinos VHF',
    shortTitle: 'Marinas',
    description: 'Canales del Apéndice 18 de VHF marina, con simplex, dúplex y usos habituales.',
    section: SECCION.frecuencias,
    keywords: ['marina', 'vhf', 'canal 16'],
  },
  {
    slug: 'radio-comercial',
    path: '/frecuencias/radio-comercial/',
    title: 'Radio Comercial',
    shortTitle: 'Radio Comercial',
    description:
      'Plan de canales de radiodifusión AM, FM y onda corta, no un directorio de emisoras locales.',
    section: SECCION.frecuencias,
    keywords: ['am', 'fm', 'oc', 'radiodifusión'],
  },
  {
    slug: 'tv-abierta',
    path: '/frecuencias/tv-abierta/',
    title: 'TV Abierta',
    shortTitle: 'TV Abierta',
    description:
      'Canales de televisión abierta de 6 MHz (ISDB-Tb) con frecuencia central de cada canal.',
    section: SECCION.frecuencias,
    keywords: ['tv', 'isdb-tb', 'canales'],
  },
  {
    slug: 'emergencia',
    path: '/frecuencias/emergencia/',
    title: 'Frecuencias de Emergencia',
    shortTitle: 'Emergencia',
    description:
      'Frecuencias de emergencia amateur CE3SER e IARU Región 2 para tráfico de socorro y bienestar.',
    section: SECCION.frecuencias,
    keywords: ['emergencia', 'ce3ser', 'iaru', 'sea'],
  },
  {
    slug: 'dipolo',
    path: '/calculadoras/dipolo/',
    title: 'Calculadora de Antena Dipolo HF',
    shortTitle: 'Dipolo',
    description:
      'Dimensiones de un dipolo de media onda a partir de la frecuencia, con factor de velocidad de alambre.',
    section: SECCION.hf,
    keywords: ['dipolo', 'hf', 'media onda'],
  },
  {
    slug: 'v-invertida',
    path: '/calculadoras/v-invertida/',
    title: 'Calculadora de V Invertida',
    shortTitle: 'V Invertida',
    description:
      'Largo de brazos y altura de una antena en V invertida según frecuencia y ángulo de apertura.',
    section: SECCION.hf,
    keywords: ['v invertida', 'dipolo', 'hf'],
  },
  {
    slug: 'efhw',
    path: '/calculadoras/efhw/',
    title: 'Calculadora de EFHW 49:1',
    shortTitle: 'EFHW 49:1',
    description: 'Largo del hilo de una EFHW resonante y consideraciones del transformador 49:1.',
    section: SECCION.hf,
    oculto: true,
    keywords: ['efhw', 'end fed', '49:1'],
  },
  {
    slug: 'vertical-cuarto-onda',
    path: '/calculadoras/vertical-cuarto-onda/',
    title: 'Calculadora de Vertical λ/4 con Radiales',
    shortTitle: 'Vertical λ/4 con Radiales',
    description:
      'Radiador de cuarto de onda y radiales para una vertical HF, como punto de partida de recorte.',
    section: SECCION.hf,
    keywords: ['vertical', 'radiales', 'cuarto de onda'],
  },
  {
    slug: 'loop-delta',
    path: '/calculadoras/loop-delta/',
    title: 'Calculadora de Loop Delta / Cuadro',
    shortTitle: 'Loop Delta / Cuadro',
    description: 'Perímetro y lados de un loop delta o cuadro de una longitud de onda en HF.',
    section: SECCION.hf,
    oculto: true,
    keywords: ['loop', 'delta', 'cuadro'],
  },
  {
    slug: 'ocfd',
    path: '/calculadoras/ocfd/',
    title: 'Calculadora de OCFD / Windom',
    shortTitle: 'OCFD / Windom',
    description: 'Largos de cada brazo de un dipolo alimentado fuera de centro (OCFD o Windom).',
    section: SECCION.hf,
    oculto: true,
    keywords: ['ocfd', 'windom'],
  },
  {
    slug: 'g5rv',
    path: '/calculadoras/g5rv/',
    title: 'Calculadora de G5RV y Doble Zepp',
    shortTitle: 'G5RV y Doble Zepp',
    description:
      'Dimensiones clásicas del G5RV y del doble Zepp, incluyendo el tramo de línea adaptadora.',
    section: SECCION.hf,
    oculto: true,
    keywords: ['g5rv', 'zepp'],
  },
  {
    slug: 'loop-magnetico',
    path: '/calculadoras/loop-magnetico/',
    title: 'Calculadora de Loop Magnético (STL)',
    shortTitle: 'Loop Magnético (STL)',
    description: 'Diámetro, conductor y condensador de un loop magnético pequeño (STL) para HF.',
    section: SECCION.hf,
    keywords: ['loop magnético', 'stl', 'q'],
  },
  {
    slug: 'hilo-largo',
    path: '/calculadoras/hilo-largo/',
    title: 'Calculadora de Hilo Largo con Unun 9:1',
    shortTitle: 'Hilo Largo 9:1',
    description:
      'Elige un largo no resonante para un hilo largo con unun 9:1, lejos de múltiplos de media onda.',
    section: SECCION.hf,
    keywords: ['hilo largo', 'unun', '9:1', 'random wire'],
  },
  {
    slug: 'j-pole',
    path: '/calculadoras/j-pole/',
    title: 'Calculadora de J-Pole',
    shortTitle: 'J-Pole',
    description: 'Radiador, stub y punto de alimentación de una J-Pole para VHF o UHF.',
    section: SECCION.vhf,
    keywords: ['j-pole', 'vhf', 'uhf'],
  },
  {
    slug: 'slim-jim',
    path: '/calculadoras/slim-jim/',
    title: 'Calculadora de Slim Jim',
    shortTitle: 'Slim Jim',
    description: 'Dimensiones de una Slim Jim, variante de la J-Pole con radiador plegado.',
    section: SECCION.vhf,
    keywords: ['slim jim', 'j-pole'],
  },
  {
    slug: 'flowerpot',
    path: '/calculadoras/flowerpot/',
    title: 'Calculadora de Flowerpot',
    shortTitle: 'Flowerpot',
    description: 'Medidas de una flowerpot de coaxial, antena vertical discreta para 2 m y 70 cm.',
    section: SECCION.vhf,
    keywords: ['flowerpot', 'coaxial'],
  },
  {
    slug: 'ground-plane',
    path: '/calculadoras/ground-plane/',
    title: 'Calculadora de Ground Plane λ/4',
    shortTitle: 'Ground Plane λ/4',
    description:
      'Radiador y radiales de una ground plane de cuarto de onda, con caída a 45° hacia 50 Ω.',
    section: SECCION.vhf,
    keywords: ['ground plane', 'radiales'],
  },
  {
    slug: 'cinco-octavos',
    path: '/calculadoras/cinco-octavos/',
    title: 'Calculadora de 5/8 de Onda',
    shortTitle: '5/8 de Onda',
    description: 'Largo del radiador 5/8 de onda y de los radiales para VHF o UHF.',
    section: SECCION.vhf,
    keywords: ['5/8', 'cinco octavos'],
  },
  {
    slug: 'colineal',
    path: '/calculadoras/colineal/',
    title: 'Calculadora de Colineal Coaxial',
    shortTitle: 'Colineal Coaxial',
    description:
      'Secciones de una colineal de coaxial apilada para ganar un poco de ganancia omnidireccional.',
    section: SECCION.vhf,
    keywords: ['colineal', 'coaxial'],
  },
  {
    slug: 'turnstile',
    path: '/calculadoras/turnstile/',
    title: 'Calculadora de Turnstile / Eggbeater',
    shortTitle: 'Turnstile / Eggbeater',
    description:
      'Dipolos cruzados de una turnstile o eggbeater para satélite y polarización horizontal omnidireccional.',
    section: SECCION.vhf,
    keywords: ['turnstile', 'eggbeater', 'satélite'],
  },
  {
    slug: 'discone',
    path: '/calculadoras/discone/',
    title: 'Calculadora de Discone',
    shortTitle: 'Discone',
    description:
      'Disco, cono y separación de una discone de banda ancha a partir de la frecuencia mínima, con rangos de la literatura.',
    section: SECCION.vhf,
    keywords: ['discone', 'banda ancha', 'scanner'],
  },
  {
    slug: 'yagi',
    path: '/calculadoras/yagi/',
    title: 'Calculadora de Yagi',
    shortTitle: 'Yagi',
    description:
      'Largos de elementos y espaciado de una Yagi de 3 a 7 elementos para HF, VHF o UHF.',
    section: SECCION.directivas,
    keywords: ['yagi', 'directiva'],
  },
  {
    slug: 'moxon',
    path: '/calculadoras/moxon/',
    title: 'Calculadora de Moxon',
    shortTitle: 'Moxon',
    description:
      'Rectángulo Moxon (director y reflector plegados) a partir de la frecuencia de diseño.',
    section: SECCION.directivas,
    oculto: true,
    keywords: ['moxon'],
  },
  {
    slug: 'quad',
    path: '/calculadoras/quad/',
    title: 'Calculadora de Cuadro Cúbico (Quad)',
    shortTitle: 'Cuadro Cúbico (Quad)',
    description: 'Perímetros de driver y reflector de una quad cúbica de dos elementos.',
    section: SECCION.directivas,
    oculto: true,
    keywords: ['quad', 'cuadro cúbico'],
  },
  {
    slug: 'choque-coaxial',
    path: '/calculadoras/choque-coaxial/',
    title: 'Calculadora de Choque de Coaxial',
    shortTitle: 'Choque de Coaxial',
    description:
      'Vueltas y diámetro de un choque de coaxial (balun de corriente) según banda y tipo de cable.',
    section: SECCION.auxiliares,
    keywords: ['choque', 'balun', 'coaxial'],
  },
  {
    slug: 'bobina',
    path: '/calculadoras/bobina/',
    title: 'Calculadora de Bobina (Wheeler)',
    shortTitle: 'Bobina (Wheeler)',
    description:
      'Inductancia de un solenoide de una capa con la fórmula de Wheeler, en milímetros.',
    section: SECCION.auxiliares,
    keywords: ['bobina', 'wheeler', 'inductancia'],
  },
  {
    slug: 'trampas',
    path: '/calculadoras/trampas/',
    title: 'Calculadora de Trampas LC',
    shortTitle: 'Trampas LC',
    description: 'Resonancia de trampas LC para dipolos multibanda, despejando L, C o frecuencia.',
    section: SECCION.auxiliares,
    keywords: ['trampas', 'lc', 'multibanda'],
  },
  {
    slug: 'linea-q',
    path: '/calculadoras/linea-q/',
    title: 'Calculadora de Línea Q (λ/4)',
    shortTitle: 'Línea Q (λ/4)',
    description:
      'Impedancia y largo de un transformador de cuarto de onda (línea Q) entre dos impedancias.',
    section: SECCION.auxiliares,
    keywords: ['línea q', 'cuarto de onda', 'matching'],
  },
  {
    slug: 'gamma-hairpin',
    path: '/calculadoras/gamma-hairpin/',
    title: 'Calculadora de Gamma Match y Hairpin',
    shortTitle: 'Gamma Match y Hairpin',
    description:
      'Punto de partida para gamma match y hairpin (match en U) en yagis alimentadas en el centro.',
    section: SECCION.auxiliares,
    keywords: ['gamma', 'hairpin', 'yagi'],
  },
  {
    slug: 'perdida-linea',
    path: '/calculadoras/perdida-linea/',
    title: 'Calculadora de Pérdida de Línea y ROE',
    shortTitle: 'Pérdida de Línea y ROE',
    description: 'Atenuación de cables habituales y el efecto de la ROE sobre la pérdida total.',
    section: SECCION.auxiliares,
    keywords: ['pérdida', 'coaxial', 'swr', 'roe'],
  },
  {
    slug: 'nvis',
    path: '/calculadoras/nvis/',
    title: 'Calculadora de Altura y Ángulo NVIS',
    shortTitle: 'Altura y Ángulo NVIS',
    description: 'Altura de un dipolo NVIS y ángulo de radiación para cobertura regional en HF.',
    section: SECCION.auxiliares,
    keywords: ['nvis', 'hf', 'ángulo'],
  },
  {
    slug: 'horizonte',
    path: '/calculadoras/horizonte/',
    title: 'Calculadora de Alcance y Presupuesto de Enlace',
    shortTitle: 'Alcance y Enlace',
    description:
      'Horizonte radioeléctrico con k = 4/3 y presupuesto de enlace (FSPL) para VHF/UHF en terreno despejado.',
    section: SECCION.auxiliares,
    keywords: ['horizonte', 'fspl', 'enlace', 'alcance'],
  },
] as const satisfies readonly Herramienta[]

export const PAGINAS_ESTATICAS = [
  {
    slug: 'inicio',
    path: '/',
    title: 'Radio Club Lircay de Talca',
    description:
      'Sitio del Radio Club Lircay de Talca (CE4LY): radioafición, cursos, boletines y herramientas para el taller.',
    keywords: ['ce4ly', 'talca', 'radio club', 'radioafición'],
  },
  {
    slug: 'acerca',
    path: '/acerca/',
    title: 'Acerca del Radio Club',
    description:
      'Misión, objetivos y rol social del Radio Club Lircay, organización comunitaria funcional de Talca.',
    keywords: ['acerca', 'misión', 'estatutos'],
  },
  {
    slug: 'directorio',
    path: '/directorio/',
    title: 'Directorio',
    description:
      'Directorio vigente del Radio Club Lircay de Talca (CE4LY): presidente, secretario, tesorero y directores.',
    keywords: ['directorio', 'presidente', 'socios'],
  },
  {
    slug: 'boletines',
    path: '/boletines/',
    title: 'Boletines',
    description:
      'Boletines informativos del Radio Club Lircay, publicados en SoundCloud y reexpuestos por RSS.',
    keywords: ['boletines', 'soundcloud', 'rss'],
  },
  {
    slug: 'cursos',
    path: '/cursos/',
    title: 'Cursos',
    description:
      'Cursos abiertos a la comunidad del Radio Club Lircay: electrónica básica, confección de antenas y reglamentación.',
    keywords: ['cursos', 'electrónica', 'antenas', 'reglamentación'],
  },
  {
    slug: 'emergencias',
    path: '/emergencias/',
    title: 'Radioafición y emergencias',
    description:
      'Rol del Radio Club Lircay en emergencias: qué hacer si es vecino o radioaficionado, y cómo coordinar con el club.',
    keywords: ['emergencias', 'sea', 'senapred'],
  },
  {
    slug: 'contacto',
    path: '/contacto/',
    title: 'Contacto',
    description:
      'Formulario y correo del Radio Club Lircay de Talca (contacto@ce4ly.cl) para consultas sobre radioafición y cursos.',
    keywords: ['contacto'],
  },
  {
    slug: 'terminos',
    path: '/terminos/',
    title: 'Términos de Servicio',
    description:
      'Condiciones de uso del sitio del Radio Club Lircay (CE4LY): calculadoras de referencia, información de terceros y uso aceptable.',
    keywords: ['términos', 'condiciones de uso'],
  },
  {
    slug: 'privacidad',
    path: '/privacidad/',
    title: 'Política de Privacidad',
    description:
      'Qué datos recoge el sitio del Radio Club Lircay (CE4LY): solo el formulario de contacto. Para qué se usan y cómo ejercer sus derechos.',
    keywords: ['privacidad', 'datos personales'],
  },
  {
    slug: 'herramientas',
    path: '/herramientas/',
    title: 'Todas las Herramientas',
    description:
      'Referencias, canales y calculadoras de antenas del Radio Club Lircay. Puntos de partida: recorte con analizador o ROE.',
    keywords: ['herramientas', 'calculadoras'],
  },
  {
    slug: 'ca5nfs',
    path: '/ca5nfs/',
    title: 'CA5NFS',
    description: 'Página personal de Rodrigo Fuentealba Cartes, CA5NFS.',
    keywords: ['ca5nfs'],
    visibilidad: 'borrador',
  },
] as const satisfies readonly Pagina[]

export type PaginaId = (typeof PAGINAS_ESTATICAS)[number]['slug'] | (typeof TOOLS)[number]['slug']

export const PAGINAS: readonly (Pagina & { slug: PaginaId })[] = [...PAGINAS_ESTATICAS, ...TOOLS]

const PAGINA_POR_ID = new Map(PAGINAS.map((pagina) => [pagina.slug, pagina]))

/** Ruta (con barra final) de una página del catálogo. */
export function rutaDe(id: PaginaId): string {
  return PAGINA_POR_ID.get(id)!.path
}

/** `/acerca` y `/acerca/` son la misma página; la ruta de las páginas lleva siempre barra final. */
export function normalizarRuta(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function paginaPorRuta(pathname: string): (Pagina & { slug: PaginaId }) | undefined {
  const ruta = normalizarRuta(pathname)
  return PAGINAS.find((pagina) => pagina.path === ruta)
}

/** Enlace al formulario de contacto con el asunto ya escrito. */
export function enlaceContacto(asunto: string): string {
  return `${rutaDe('contacto')}?${new URLSearchParams({ asunto })}`
}

export const PAGINAS_SITEMAP = PAGINAS.filter((pagina) => !pagina.visibilidad)

/** Ruta que no corresponde a ninguna página: el prerender la usa para generar `/404.html`. */
export const RUTA_NO_ENCONTRADA = '/404/'

/** Reloj de propagación: índices solares en vivo, se pide primero a la red (sw.js). */
export const RUTA_PROPAGACION = rutaDe('reloj')

/** Páginas que el service worker precachea para usarlas sin conexión. */
export const RUTAS_OFFLINE = [
  rutaDe('inicio'),
  rutaDe('herramientas'),
  rutaDe('cursos'),
  rutaDe('emergencias'),
  ...TOOLS.map((herramienta) => herramienta.path).filter((ruta) => ruta !== RUTA_PROPAGACION),
]

export type EnlaceHerramienta = {
  to: string
  label: string
  description: string
}

export type GrupoHerramientas = { title: Seccion; links: EnlaceHerramienta[] }

const aEnlace = (herramienta: Herramienta): EnlaceHerramienta => ({
  to: herramienta.path,
  label: herramienta.shortTitle,
  description: herramienta.description,
})

const agrupar = (secciones: readonly Seccion[], { paraMenu }: { paraMenu: boolean }) =>
  secciones
    .map((title): GrupoHerramientas => ({
      title,
      links: (TOOLS as readonly Herramienta[])
        .filter((t) => (paraMenu ? (t.menuSection ?? t.section) : t.section) === title)
        .filter((t) => !(paraMenu && t.oculto))
        .map(aEnlace),
    }))
    .filter((grupo) => grupo.links.length > 0)

/** Menú desplegable de «Herramientas» en la cabecera. */
export const HERRAMIENTA_GRUPOS_MENU = agrupar(SECCIONES_MENU, { paraMenu: true })

/** Índice completo en /herramientas/. */
export const HERRAMIENTA_GRUPOS_PAGINA = agrupar(SECCIONES_PAGINA, { paraMenu: false })

/** ¿La ruta es /herramientas/ o una de sus herramientas? (marca el menú como activo). */
export function esRutaDeHerramienta(pathname: string): boolean {
  const ruta = normalizarRuta(pathname)
  return ruta === rutaDe('herramientas') || TOOLS.some((t) => t.path === ruta)
}
