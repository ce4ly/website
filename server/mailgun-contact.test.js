import { describe, expect, it } from 'vitest'
import { getConfigFromEnv, handleContactPost } from './mailgun-contact.js'
import { resetRateLimit } from './rate-limit.js'

describe('getConfigFromEnv', () => {
  it('usa MAILGUN_API_BASE para EU o US', () => {
    const eu = getConfigFromEnv({
      MAILGUN_API_KEY: 'key-test',
      MAILGUN_DOMAIN: 'mg.ce4ly.cl',
      MAILGUN_API_BASE: 'https://api.eu.mailgun.net',
      CONTACT_TO: 'contacto@ce4ly.cl'
    })
    expect(eu.endpoint).toBe(
      'https://api.eu.mailgun.net/v3/mg.ce4ly.cl/messages'
    )
    const us = getConfigFromEnv({
      MAILGUN_API_KEY: 'key-test',
      MAILGUN_DOMAIN: 'mg.ce4ly.cl'
    })
    expect(us.endpoint).toBe('https://api.mailgun.net/v3/mg.ce4ly.cl/messages')
  })
})

describe('handleContactPost', () => {
  it('descarta honeypot como éxito silencioso', async () => {
    resetRateLimit()
    const r = await handleContactPost(
      {
        nombre: 'Bot',
        correo: 'bot@example.com',
        asunto: 'Spam',
        mensaje: 'Mensaje largo de prueba.',
        website_url: 'https://spam.example'
      },
      {},
      { ip: '10.0.0.1' }
    )
    expect(r.ok).toBe(true)
    expect(r.discarded).toBe('honeypot')
  })

  it('devuelve errores por campo', async () => {
    resetRateLimit()
    const r = await handleContactPost(
      { nombre: 'A', correo: 'x', asunto: '', mensaje: 'corto' },
      {},
      { ip: '10.0.0.2' }
    )
    expect(r.ok).toBe(false)
    expect(r.fieldErrors.nombre).toBeTruthy()
    expect(r.fieldErrors.correo).toBeTruthy()
    expect(r.values.nombre).toBe('A')
  })
})
