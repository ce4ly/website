/**
 * Envío de mensajes del formulario de contacto vía Mailgun HTTP API.
 * @see https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages/post-v3--domain-name--messages
 */

const DEFAULT_CONTACT_TO = 'contacto@ce4ly.cl'

export function getConfigFromEnv(env) {
  const apiKey = env.MAILGUN_API_KEY?.trim()
  const domain = env.MAILGUN_DOMAIN?.trim()
  const from = env.MAILGUN_FROM?.trim()
  const to = (env.CONTACT_TO?.trim() || DEFAULT_CONTACT_TO).trim()
  const region = (env.MAILGUN_REGION || 'us').toLowerCase()

  if (!apiKey || !domain || !from) return null

  const base =
    region === 'eu'
      ? 'https://api.eu.mailgun.net/v3'
      : 'https://api.mailgun.net/v3'

  return {
    apiKey,
    domain,
    from,
    to,
    endpoint: `${base}/${domain}/messages`
  }
}

export function validateContactPayload(data) {
  const name = String(data?.name ?? '').trim()
  const email = String(data?.email ?? '').trim()
  const message = String(data?.message ?? '').trim()
  const hp = String(data?.website_url ?? '').trim()

  if (hp !== '') {
    return { error: 'Solicitud no válida' }
  }
  if (name.length < 2 || name.length > 120) {
    return { error: 'Indica un nombre válido (2–120 caracteres).' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: 'Indica un correo electrónico válido.' }
  }
  if (message.length < 10 || message.length > 8000) {
    return { error: 'El mensaje debe tener entre 10 y 8.000 caracteres.' }
  }

  return { name, email, message }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export async function sendContactMail(payload, config) {
  const subject = `Contacto web CE4LY — ${payload.name}`
  const text = [
    `Nombre: ${payload.name}`,
    `Correo: ${payload.email}`,
    '',
    'Mensaje:',
    payload.message
  ].join('\n')

  const html = [
    '<p><strong>Nombre:</strong> ' + escapeHtml(payload.name) + '</p>',
    '<p><strong>Correo:</strong> ' + escapeHtml(payload.email) + '</p>',
    '<p><strong>Mensaje:</strong></p>',
    '<p>' + escapeHtml(payload.message).replaceAll('\n', '<br/>') + '</p>'
  ].join('\n')

  const body = new URLSearchParams()
  body.set('from', config.from)
  body.set('to', config.to)
  body.set('subject', subject)
  body.set('text', text)
  body.set('html', html)
  body.set('h:Reply-To', payload.email)

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

export async function handleContactPost(parsedBody, env) {
  const config = getConfigFromEnv(env)
  if (!config) {
    return {
      ok: false,
      status: 503,
      error: 'El servicio de correo no está configurado (variables MAILGUN_*).'
    }
  }

  const v = validateContactPayload(parsedBody)
  if (v.error) {
    return { ok: false, status: 400, error: v.error }
  }

  try {
    await sendContactMail(v, config)
    return { ok: true }
  } catch (e) {
    console.error('[mailgun]', e)
    return {
      ok: false,
      status: 502,
      error:
        'No se pudo enviar el mensaje. Intenta más tarde o escríbenos directamente.'
    }
  }
}
