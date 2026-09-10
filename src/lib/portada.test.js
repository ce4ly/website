import { describe, expect, it } from 'vitest'
import { BLOQUE_PORTADA } from './portada.js'

describe('BLOQUE_PORTADA', () => {
  it('apunta a herramientas y cursos, no a frecuencias de repetidora', () => {
    const hrefs = BLOQUE_PORTADA.enlaces.map(e => e.href)
    expect(hrefs).toContain('/herramientas')
    expect(hrefs).toContain('/cursos')
    expect(BLOQUE_PORTADA.texto.toLowerCase()).not.toMatch(/repetidor/)
  })
})
