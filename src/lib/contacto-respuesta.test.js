import { describe, expect, it } from 'vitest'
import { interpretarRespuestaContacto } from './contacto-respuesta.js'

describe('interpretarRespuestaContacto', () => {
  it('acepta JSON de éxito', () => {
    const r = interpretarRespuestaContacto(
      200,
      'application/json; charset=utf-8',
      '{"ok":true}'
    )
    expect(r.ok).toBe(true)
  })

  it('acepta HTML de éxito si el correo ya salió', () => {
    const r = interpretarRespuestaContacto(
      200,
      'text/html; charset=utf-8',
      '<h1>Mensaje enviado</h1><p>Gracias. Recibimos tu mensaje'
    )
    expect(r.ok).toBe(true)
  })

  it('acepta JSON de éxito con avisos de PHP delante', () => {
    const r = interpretarRespuestaContacto(
      200,
      'text/html',
      'Notice: Undefined index\n{"ok":true}'
    )
    expect(r.ok).toBe(true)
  })

  it('no toma la página React como éxito', () => {
    const r = interpretarRespuestaContacto(
      200,
      'text/html',
      '<div id="root"></div><p>Contacto</p>'
    )
    expect(r.ok).toBe(false)
  })

  it('propaga error y campos del JSON de fallo', () => {
    const r = interpretarRespuestaContacto(
      400,
      'application/json',
      JSON.stringify({
        ok: false,
        error: 'Revisa los campos marcados.',
        fieldErrors: { captcha_respuesta: 'Resuelve la suma para enviar el mensaje.' }
      })
    )
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/Revisa/)
    expect(r.fieldErrors.captcha_respuesta).toBeTruthy()
  })
})
