/**
 * Envío del formulario de contacto vía API HTTP de Mailgun (sin SDK).
 * Equivale a un `action` de servidor de React Router: nunca corre en el cliente.
 * @see https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages/post-v3--domain-name--messages
 */

import {
  CONTACTO_EMAIL,
  TIEMPO_MINIMO_MS,
  normalizarCamposContacto,
  validarContacto
} from '../src/lib/contacto-schema.js'
import { permitirEnvio } from './rate-limit.js'

const DEFAULT_API_BASE = 'https://api.mailgun.net'

export function getConfigFromEnv(env) {
  const apiKey = env.MAILGUN_API_KEY?.trim()
  const domain = env.MAILGUN_DOMAIN?.trim()
  const apiBase = (env.MAILGUN_API_BASE || DEFAULT_API_BASE)
    .trim()
    .replace(/\/$/, '')
  const from =
    env.MAILGUN_FROM?.trim() ||
    (domain ? `Radio Club Lircay <noreply@${domain}>` : '')
  const to = (env.CONTACT_TO?.trim() || CONTACTO_EMAIL).trim()

  if (!apiKey || !domain || !from) return null

  return {
    apiKey,
    domain,
    from,
    to,
    endpoint: `${apiBase}/v3/${domain}/messages`
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function valoresPublicos(campos) {
  return {
    nombre: campos.nombre.trim(),
    correo: campos.correo.trim(),
    indicativo: campos.indicativo.trim(),
    asunto: campos.asunto.trim(),
    mensaje: campos.mensaje.trim()
  }
}

export async function sendContactMail(payload, config) {
  const subject = `[CE4LY] ${payload.asunto}`
  const text = [
    `Nombre: ${payload.nombre}`,
    `Correo: ${payload.correo}`,
    payload.indicativo ? `Indicativo: ${payload.indicativo}` : null,
    `Asunto: ${payload.asunto}`,
    '',
    'Mensaje:',
    payload.mensaje
  ]
    .filter(Boolean)
    .join('\n')

  const html = [
    `<p><strong>Nombre:</strong> ${escapeHtml(payload.nombre)}</p>`,
    `<p><strong>Correo:</strong> ${escapeHtml(payload.correo)}</p>`,
    payload.indicativo
      ? `<p><strong>Indicativo:</strong> ${escapeHtml(payload.indicativo)}</p>`
      : '',
    `<p><strong>Asunto:</strong> ${escapeHtml(payload.asunto)}</p>`,
    '<p><strong>Mensaje:</strong></p>',
    `<p>${escapeHtml(payload.mensaje).replaceAll('\n', '<br/>')}</p>`
  ]
    .filter(Boolean)
    .join('\n')

  const body = new URLSearchParams()
  body.set('from', config.from)
  body.set('to', config.to)
  body.set('subject', subject)
  body.set('text', text)
  body.set('html', html)
  body.set('h:Reply-To', payload.correo)

  const auth = Buffer.from(`api:${config.apiKey}`).toString('base64')

  const res = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`
    },
    body
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Mailgun ${res.status}: ${errText.slice(0, 400)}`)
  }

  return res.json().catch(() => ({}))
}

/**
 * Acción de servidor del formulario de contacto.
 */
export async function handleContactPost(parsedBody, env, { ip } = {}) {
  const campos = normalizarCamposContacto(parsedBody)
  const values = valoresPublicos(campos)

  if (campos.website_url.trim() !== '') {
    return { ok: true, discarded: 'honeypot' }
  }

  if (campos.t0.trim() !== '') {
    const t0 = Number(campos.t0)
    if (Number.isFinite(t0) && Date.now() - t0 < TIEMPO_MINIMO_MS) {
      return { ok: true, discarded: 'too-fast' }
    }
  }

  if (!permitirEnvio(ip || 'unknown')) {
    return {
      ok: false,
      status: 429,
      error:
        'Hay muchos envíos desde tu red. Espera un rato o escribe a contacto@ce4ly.cl.',
      fieldErrors: {},
      values
    }
  }

  const validado = validarContacto(campos)
  if (!validado.ok) {
    return {
      ok: false,
      status: 400,
      error: 'Revisa los campos marcados.',
      fieldErrors: validado.fieldErrors,
      values: validado.values
    }
  }

  const config = getConfigFromEnv(env)
  if (!config) {
    return {
      ok: false,
      status: 503,
      error:
        'El servicio de correo no está configurado. Escríbenos a contacto@ce4ly.cl.',
      fieldErrors: {},
      values: validado.values
    }
  }

  try {
    await sendContactMail(validado.values, config)
    return { ok: true }
  } catch (e) {
    console.error('[mailgun]', e)
    return {
      ok: false,
      status: 502,
      error:
        'No se pudo enviar el mensaje. Intenta más tarde o escríbenos directamente a contacto@ce4ly.cl.',
      fieldErrors: {},
      values: validado.values
    }
  }
}
