import { describe, expect, it } from 'vitest'
import { morseATexto, textoAMorse } from './morse.js'

describe('morse', () => {
  it('CQ DE CE4LY ida y vuelta', () => {
    const codigo = textoAMorse('CQ DE CE4LY')
    expect(codigo).toContain('-.-.')
    expect(morseATexto(codigo).replace(/\s+/g, ' ').trim()).toBe('CQ DE CE4LY')
  })

  it('incluye Ñ y prosignos', () => {
    expect(textoAMorse('Ñ')).toBe('--.--')
    expect(textoAMorse('AR')).toBe('.-.-.')
    expect(morseATexto('...-.-')).toBe('SK')
  })
})
