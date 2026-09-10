import { describe, expect, it } from 'vitest'
import { validarContacto } from './contacto-schema.js'

describe('validarContacto', () => {
  const valido = {
    nombre: 'Ana Pérez',
    correo: 'ana@example.com',
    indicativo: 'CE4ABC',
    asunto: 'Consulta curso Electrónica Básica',
    mensaje: 'Hola, quiero saber cuándo se dicta el curso.'
  }

  it('acepta un envío completo', () => {
    const r = validarContacto(valido)
    expect(r.ok).toBe(true)
    expect(r.values.indicativo).toBe('CE4ABC')
  })

  it('acepta indicativo vacío', () => {
    const r = validarContacto({ ...valido, indicativo: '' })
    expect(r.ok).toBe(true)
    expect(r.values.indicativo).toBe('')
  })

  it('devuelve errores por campo y conserva valores', () => {
    const r = validarContacto({
      nombre: 'A',
      correo: 'no-es-correo',
      asunto: '',
      mensaje: 'corto',
      name: 'ignorado'
    })
    expect(r.ok).toBe(false)
    expect(r.fieldErrors.nombre).toBeTruthy()
    expect(r.fieldErrors.correo).toBeTruthy()
    expect(r.fieldErrors.asunto).toBeTruthy()
    expect(r.fieldErrors.mensaje).toBeTruthy()
    expect(r.values.nombre).toBe('A')
  })

  it('entiende alias name/email/message', () => {
    const r = validarContacto({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      subject: 'Hola',
      message: 'Mensaje de prueba con más de diez letras.'
    })
    expect(r.ok).toBe(true)
    expect(r.values.nombre).toBe('Ana Pérez')
  })
})
