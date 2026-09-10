/** ITU-R M.1677-1 más Ñ y prosignos de tráfico amateur. */
export const MORSE = {
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
  KN: '-.--.'
}

const ACENTOS = {
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
  Ù: 'U'
}

const INVERSO = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
)

export const TABLA_MORSE = [
  ...Object.entries(MORSE)
    .filter(([k]) => k.length === 1 && /[A-ZÑ]/.test(k))
    .map(([simbolo, codigo]) => ({ grupo: 'letras', simbolo, codigo })),
  ...Object.entries(MORSE)
    .filter(([k]) => k.length === 1 && /[0-9]/.test(k))
    .map(([simbolo, codigo]) => ({ grupo: 'números', simbolo, codigo })),
  ...Object.entries(MORSE)
    .filter(([k]) => k.length === 1 && !/[A-ZÑ0-9]/.test(k))
    .map(([simbolo, codigo]) => ({ grupo: 'signos', simbolo, codigo })),
  ...['AR', 'SK', 'BT', 'KN'].map(simbolo => ({
    grupo: 'prosignos',
    simbolo,
    codigo: MORSE[simbolo]
  }))
]

const normalizarCaracter = ch => {
  const u = ch.toUpperCase()
  return ACENTOS[u] || u
}

export const textoAMorse = texto => {
  const tokens = []
  const raw = String(texto || '')
  let i = 0
  while (i < raw.length) {
    if (raw[i] === ' ' || raw[i] === '\n' || raw[i] === '\t') {
      tokens.push('/')
      i += 1
      continue
    }
    const resto = raw.slice(i).toUpperCase()
    const pro = ['AR', 'SK', 'BT', 'KN'].find(p => resto.startsWith(p))
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

export const morseATexto = codigo => {
  return String(codigo || '')
    .trim()
    .split(/\s*\/\s*/)
    .map(palabra =>
      palabra
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(sim => INVERSO[sim] || '�')
        .join('')
    )
    .join(' ')
}

/** Duración del dit en segundos a una velocidad de carácter en PPM. */
export const ditSegundos = ppmCaracter => 1.2 / ppmCaracter

/**
 * Temporización Farnsworth: elementos al PPM de carácter; el espacio extra
 * entre símbolos y palabras baja la velocidad efectiva.
 */
export const tiemposFarnsworth = (ppmCaracter, ppmEfectivo) => {
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
    palabra: dit * 7 + extraPalabra
  }
}

export const grupoAleatorio = (simbolos, largo = 5) => {
  if (!simbolos.length) return ''
  let out = ''
  for (let i = 0; i < largo; i += 1) {
    out += simbolos[Math.floor(Math.random() * simbolos.length)]
  }
  return out
}

export const aciertoPorCaracter = (esperado, oido) => {
  const a = String(esperado || '').toUpperCase()
  const b = String(oido || '').toUpperCase()
  const largo = Math.max(a.length, b.length, 1)
  const conteo = {}
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
    porCaracter: conteo
  }
}
