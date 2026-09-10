import { handleContactPost } from './mailgun-contact.js'
import { crearCaptcha, secretCaptcha } from './contacto-captcha.js'
import { renderContactoHtml } from './contacto-html.js'
import { clientIp } from './rate-limit.js'

export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export function parseRequestBody(raw, contentType = '') {
  const tipo = contentType.toLowerCase()
  if (tipo.includes('application/json')) {
    if (!String(raw).trim()) return {}
    return JSON.parse(raw)
  }
  const params = new URLSearchParams(raw)
  const obj = {}
  for (const [k, v] of params) obj[k] = v
  return obj
}

export function wantsJson(req) {
  const mode = String(req.headers['sec-fetch-mode'] || '').toLowerCase()
  if (mode === 'cors' || mode === 'same-origin') return true
  const accept = String(req.headers.accept || '')
  const ct = String(req.headers['content-type'] || '')
  const xhr = String(req.headers['x-requested-with'] || '')
  return (
    accept.includes('application/json') ||
    ct.includes('application/json') ||
    xhr.toLowerCase() === 'fetch' ||
    xhr === 'XMLHttpRequest'
  )
}

function sendJson(res, status, obj) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(obj))
}

function sendHtml(res, status, html) {
  res.statusCode = status
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(html)
}

export async function respondContact(req, res, env) {
  if (req.method === 'GET') {
    const captcha = crearCaptcha(secretCaptcha(env))
    if (wantsJson(req)) {
      sendJson(res, 200, { ok: true, ...captcha })
    } else {
      sendHtml(res, 200, renderContactoHtml({ captcha }))
    }
    return
  }

  if (req.method !== 'POST') {
    if (wantsJson(req)) {
      sendJson(res, 405, { ok: false, error: 'Método no permitido' })
    } else {
      res.statusCode = 405
      res.end('Método no permitido')
    }
    return
  }

  const raw = await readRawBody(req)
  let body
  try {
    body = parseRequestBody(raw, req.headers['content-type'])
  } catch {
    const payload = { ok: false, error: 'Cuerpo inválido', fieldErrors: {} }
    if (wantsJson(req)) sendJson(res, 400, payload)
    else sendHtml(res, 400, renderContactoHtml(payload))
    return
  }

  const result = await handleContactPost(body, env, { ip: clientIp(req) })
  const status = result.ok ? 200 : result.status || 400
  if (wantsJson(req)) {
    sendJson(
      res,
      status,
      result.ok
        ? { ok: true }
        : {
            ok: false,
            error: result.error,
            fieldErrors: result.fieldErrors || {},
            values: result.values || {},
            ...(result.captcha ? { captcha: result.captcha } : {})
          }
    )
    return
  }
  sendHtml(res, status, renderContactoHtml(result))
}
