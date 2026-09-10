import { describe, expect, it } from 'vitest'
import {
  CAPTCHA_TTL_MS,
  crearCaptcha,
  secretCaptcha,
  verificarCaptcha
} from './contacto-captcha.js'

describe('contacto-captcha', () => {
  const secret = 'prueba-secreta'

  it('prefiere CAPTCHA_SECRET y si no MAILGUN_API_KEY', () => {
    expect(secretCaptcha({ CAPTCHA_SECRET: ' a ', MAILGUN_API_KEY: 'k' })).toBe(
      'a'
    )
    expect(secretCaptcha({ MAILGUN_API_KEY: 'k' })).toBe('k')
    expect(secretCaptcha({})).toBe('ce4ly-captcha-v1')
  })

  it('acepta la suma correcta dentro del plazo', () => {
    const c = crearCaptcha(secret, { ahora: 1_000, aleatorio: () => 0 })
    expect(c.pregunta).toBe('¿Cuánto es 2 + 2?')
    expect(
      verificarCaptcha(secret, c.token, '2', { ahora: 1_000 })
    ).toBe(false)
    expect(
      verificarCaptcha(secret, c.token, '4', { ahora: 1_000 })
    ).toBe(true)
  })

  it('rechaza respuesta incorrecta, token ajeno o caducado', () => {
    const c = crearCaptcha(secret, { ahora: 1_000, aleatorio: () => 0.99 })
    expect(verificarCaptcha(secret, c.token, '99', { ahora: 1_000 })).toBe(
      false
    )
    expect(verificarCaptcha('otro', c.token, '20', { ahora: 1_000 })).toBe(
      false
    )
    expect(
      verificarCaptcha(secret, c.token, '20', {
        ahora: 1_000 + CAPTCHA_TTL_MS + 1
      })
    ).toBe(false)
  })
})
