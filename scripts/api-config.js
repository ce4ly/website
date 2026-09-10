/** Genera los PHP de config que Apache lee desde dist/api/ tras el deploy. */

export function phpQuote(valor) {
  return `'${String(valor).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

export function mailgunLocalPhp(env) {
  const apiKey = env.MAILGUN_API_KEY?.trim()
  const domain = env.MAILGUN_DOMAIN?.trim()
  if (!apiKey || !domain) return null
  const apiBase = (env.MAILGUN_API_BASE || 'https://api.mailgun.net')
    .trim()
    .replace(/\/$/, '')
  const from =
    env.MAILGUN_FROM?.trim() || `Radio Club Lircay <noreply@${domain}>`
  const to = env.CONTACT_TO?.trim() || 'contacto@ce4ly.cl'
  return `<?php
declare(strict_types=1);
return [
    'apiKey' => ${phpQuote(apiKey)},
    'domain' => ${phpQuote(domain)},
    'apiBase' => ${phpQuote(apiBase)},
    'from' => ${phpQuote(from)},
    'to' => ${phpQuote(to)},
];
`
}

export function boletinesLocalPhp(env) {
  const userId = env.SOUNDCLOUD_USER_ID?.trim()
  if (!userId) return null
  return `<?php
declare(strict_types=1);
return ['userId' => ${phpQuote(userId)}];
`
}

export function cargarEnv(texto, destino = {}) {
  for (const line of texto.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    if (key === '' || destino[key] !== undefined) continue
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    destino[key] = val
  }
  return destino
}
