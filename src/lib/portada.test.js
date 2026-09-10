import { describe, expect, it } from 'vitest'
import { BLOQUE_PORTADA } from './portada.js'

describe('BLOQUE_PORTADA', () => {
  it('tiene las frecuencias del club y sigue oculto mientras no haya repetidora', () => {
    expect(BLOQUE_PORTADA.oculto).toBe(true)
    expect(BLOQUE_PORTADA.titulo).toMatch(/Repetidores/)
    expect(BLOQUE_PORTADA.lineas.join(' ')).toContain('146,380')
    expect(BLOQUE_PORTADA.lineas.join(' ')).toContain('433,100')
  })
})
