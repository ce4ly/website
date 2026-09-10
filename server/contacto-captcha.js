import { createHmac, timingSafeEqual } from 'node:crypto'

export const CAPTCHA_TTL_MS = 30 * 60 * 1000
const FALLBACK_SECRET = 'ce4ly-captcha-v1'

export function secretCaptcha(env = {}) {
  return (
    String(env.CAPTCHA_SECRET || '').trim() ||
    String(env.MAILGUN_API_KEY || '').trim() ||
    FALLBACK_SECRET
  )
}

function hmacHex(secret, msg) {
  return createHmac('sha256', secret).update(msg).digest('hex')
}

function igualSeguro(a, b) {
  const ba = Buffer.from(String(a), 'utf8')
  const bb = Buffer.from(String(b), 'utf8')
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export function crearCaptcha(
  secret,
  { ahora = Date.now(), aleatorio = Math.random } = {}
) {
  const a = 2 + Math.floor(aleatorio() * 9)
  const b = 2 + Math.floor(aleatorio() * 9)
  const exp = ahora + CAPTCHA_TTL_MS
  const payload = `${exp}.${a}.${b}`
  const token = `${payload}.${hmacHex(secret, `${payload}.${a + b}`)}`
  return {
    pregunta: `¿Cuánto es ${a} + ${b}?`,
    token
  }
}

export function verificarCaptcha(
  secret,
  token,
  respuesta,
  { ahora = Date.now() } = {}
) {
  const partes = String(token || '').split('.')
  if (partes.length !== 4) return false
  const [expStr, aStr, bStr, sig] = partes
  const exp = Number(expStr)
  const a = Number(aStr)
  const b = Number(bStr)
  if (!Number.isFinite(exp) || exp < ahora) return false
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) {
    return false
  }
  const suma = a + b
  if (String(respuesta ?? '').trim() !== String(suma)) return false
  const esperado = hmacHex(secret, `${expStr}.${aStr}.${bStr}.${suma}`)
  return igualSeguro(sig, esperado)
}
