/** ITU-R M.1677-1 más Ñ y prosignos de tráfico amateur. */
export const MORSE: Readonly<Record<string, string>> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  Ñ: '--.--',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
  AR: '.-.-.',
  SK: '...-.-',
  BT: '-...-',
  KN: '-.--.',
}

const ACENTOS: Readonly<Record<string, string>> = {
  Á: 'A',
  É: 'E',
  Í: 'I',
  Ó: 'O',
  Ú: 'U',
  Ü: 'U',
  À: 'A',
  È: 'E',
  Ì: 'I',
  Ò: 'O',
  Ù: 'U',
}

const INVERSO: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k]),
)

/** Prosignos de tráfico, con su significado en operación amateur. */
export const PROSIGNOS: readonly { simbolo: string; significado: string }[] = [
  {
    simbolo: 'AR',
    significado: 'Fin del mensaje (signo +); el corresponsal aún debe responder.',
  },
  {
    simbolo: 'SK',
    significado: 'Fin del contacto (también VA); última transmisión del QSO.',
  },
  {
    simbolo: 'BT',
    significado: 'Separación de párrafo (signo =); pausa dentro de un mensaje.',
  },
  {
    simbolo: 'KN',
    significado: 'Adelante, solo la estación llamada (a diferencia de K, abierto a todos).',
  },
]

export type FilaMorse = {
  grupo: 'letras' | 'números' | 'signos' | 'prosignos'
  simbolo: string
  codigo: string
  significado?: string
}

export const TABLA_MORSE: readonly FilaMorse[] = [
  ...Object.entries(MORSE)
    .filter(([k]) => k.length === 1 && /[A-ZÑ]/.test(k))
    .map(([simbolo, codigo]) => ({ grupo: 'letras' as const, simbolo, codigo })),
  ...Object.entries(MORSE)
    .filter(([k]) => k.length === 1 && /[0-9]/.test(k))
    .map(([simbolo, codigo]) => ({ grupo: 'números' as const, simbolo, codigo })),
  ...Object.entries(MORSE)
    .filter(([k]) => k.length === 1 && !/[A-ZÑ0-9]/.test(k))
    .map(([simbolo, codigo]) => ({ grupo: 'signos' as const, simbolo, codigo })),
  ...PROSIGNOS.map(({ simbolo, significado }) => ({
    grupo: 'prosignos' as const,
    simbolo,
    codigo: MORSE[simbolo],
    significado,
  })),
]

const normalizarCaracter = (ch: string) => {
  const u = ch.toUpperCase()
  return ACENTOS[u] || u
}

export const textoAMorse = (texto: string): string => {
  const tokens: string[] = []
  const raw = texto
  let i = 0
  while (i < raw.length) {
    if (raw[i] === ' ' || raw[i] === '\n' || raw[i] === '\t') {
      tokens.push('/')
      i += 1
      continue
    }
    const resto = raw.slice(i).toUpperCase()
    const pro = ['AR', 'SK', 'BT', 'KN'].find((p) => resto.startsWith(p))
    if (pro && (i === 0 || /\s/.test(raw[i - 1]))) {
      tokens.push(MORSE[pro])
      i += pro.length
      continue
    }
    const ch = normalizarCaracter(raw[i])
    if (MORSE[ch]) tokens.push(MORSE[ch])
    i += 1
  }
  return tokens
    .join(' ')
    .replace(/(\/ )+/g, '/ ')
    .replace(/( \/)+/g, ' /')
    .replace(/\/ \//g, '/')
    .trim()
}

export const morseATexto = (codigo: string): string => {
  return codigo
    .trim()
    .split(/\s*\/\s*/)
    .map((palabra) =>
      palabra
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((sim) => INVERSO[sim] || '�')
        .join(''),
    )
    .join(' ')
}

/** Duración del dit en segundos a una velocidad de carácter en PPM. */
export const ditSegundos = (ppmCaracter: number): number => 1.2 / ppmCaracter

/**
 * Temporización Farnsworth: elementos al PPM de carácter; el espacio extra
 * entre símbolos y palabras baja la velocidad efectiva.
 */
export const tiemposFarnsworth = (ppmCaracter: number, ppmEfectivo: number) => {
  const char = Math.max(ppmCaracter, 5)
  const efectivo = Math.min(Math.max(ppmEfectivo, 5), char)
  const dit = ditSegundos(char)
  const tCaracter = 60 / char
  const tEfectivo = 60 / efectivo
  const extra = Math.max(0, tEfectivo - tCaracter)
  const extraSimbolo = extra * (3 / 19)
  const extraPalabra = extra * (7 / 19)
  return {
    dit,
    dah: dit * 3,
    intra: dit,
    letra: dit * 3 + extraSimbolo,
    palabra: dit * 7 + extraPalabra,
  }
}

export const grupoAleatorio = (simbolos: readonly string[] | string, largo = 5): string => {
  if (!simbolos.length) return ''
  let out = ''
  for (let i = 0; i < largo; i += 1) {
    out += simbolos[Math.floor(Math.random() * simbolos.length)]
  }
  return out
}

export const aciertoPorCaracter = (esperado: string, oido: string) => {
  const a = esperado.toUpperCase()
  const b = oido.toUpperCase()
  const largo = Math.max(a.length, b.length, 1)
  const conteo: Record<string, { ok: number; total: number }> = {}
  let ok = 0
  for (let i = 0; i < largo; i += 1) {
    const ch = a[i]
    if (!ch) continue
    if (!conteo[ch]) conteo[ch] = { ok: 0, total: 0 }
    conteo[ch].total += 1
    if (a[i] === b[i]) {
      conteo[ch].ok += 1
      ok += 1
    }
  }
  return {
    porcentaje: (ok / Math.max(a.length, 1)) * 100,
    porCaracter: conteo,
  }
}
