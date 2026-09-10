import { describe, expect, it } from 'vitest'
import { permitirEnvio, resetRateLimit } from './rate-limit.js'

describe('permitirEnvio', () => {
  it('deja pasar hasta 5 envíos por hora y bloquea el sexto', () => {
    resetRateLimit()
    const t0 = 1_000_000
    for (let i = 0; i < 5; i += 1) {
      expect(permitirEnvio('1.2.3.4', { ahora: t0 + i })).toBe(true)
    }
    expect(permitirEnvio('1.2.3.4', { ahora: t0 + 10 })).toBe(false)
    expect(permitirEnvio('9.9.9.9', { ahora: t0 + 10 })).toBe(true)
  })

  it('vuelve a permitir después de la ventana', () => {
    resetRateLimit()
    const t0 = 1_000_000
    for (let i = 0; i < 5; i += 1) {
      permitirEnvio('8.8.8.8', { ahora: t0 })
    }
    expect(permitirEnvio('8.8.8.8', { ahora: t0 + 60 * 60 * 1000 + 1 })).toBe(
      true
    )
  })
})
