import { describe, expect, it } from 'vitest'
import {
  boletinesLocalPhp,
  cargarEnv,
  mailgunLocalPhp,
  phpQuote
} from './api-config.js'

describe('api-config', () => {
  it('escapa comillas para PHP', () => {
    expect(phpQuote("O'Higgins")).toBe("'O\\'Higgins'")
  })

  it('no escribe Mailgun si faltan clave o dominio', () => {
    expect(mailgunLocalPhp({})).toBeNull()
    expect(mailgunLocalPhp({ MAILGUN_API_KEY: 'k' })).toBeNull()
  })

  it('genera mailgun.local.php desde el env', () => {
    const php = mailgunLocalPhp({
      MAILGUN_API_KEY: 'key-test',
      MAILGUN_DOMAIN: 'mg.ce4ly.cl',
      MAILGUN_API_BASE: 'https://api.eu.mailgun.net'
    })
    expect(php).toContain("'apiKey' => 'key-test'")
    expect(php).toContain("'apiBase' => 'https://api.eu.mailgun.net'")
    expect(php).toContain("'to' => 'contacto@ce4ly.cl'")
  })

  it('genera boletines.local.php si hay ID', () => {
    expect(boletinesLocalPhp({})).toBeNull()
    expect(boletinesLocalPhp({ SOUNDCLOUD_USER_ID: '1676930966' })).toContain(
      "'userId' => '1676930966'"
    )
  })

  it('carga .env sin pisar variables ya definidas', () => {
    const dest = { MAILGUN_DOMAIN: 'ya' }
    cargarEnv('MAILGUN_DOMAIN=otro\nSOUNDCLOUD_USER_ID=1\n', dest)
    expect(dest.MAILGUN_DOMAIN).toBe('ya')
    expect(dest.SOUNDCLOUD_USER_ID).toBe('1')
  })
})
