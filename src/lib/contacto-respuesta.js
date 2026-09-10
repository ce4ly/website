/**
 * Interpreta la respuesta del POST de contacto.
 * Mailgun puede haber enviado el correo aunque el cuerpo no sea JSON puro
 * (HTML de éxito o avisos de PHP delante del JSON).
 */
function extraerJson(cuerpo) {
  const texto = String(cuerpo || '')
    .replace(/^\uFEFF/, '')
    .trim()
  if (!texto) return null
  try {
    const parsed = JSON.parse(texto)
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    /* buscar el objeto más adelante */
  }
  const inicio = texto.indexOf('{')
  if (inicio <= 0) {
    if (/\{\s*"ok"\s*:\s*true\s*\}/.test(texto)) return { ok: true }
    return null
  }
  try {
    const parsed = JSON.parse(texto.slice(inicio))
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    if (/\{\s*"ok"\s*:\s*true\s*\}/.test(texto)) return { ok: true }
  }
  return null
}

export function interpretarRespuestaContacto(status, _contentType, text) {
  const cuerpo = String(text || '')
  const data = extraerJson(cuerpo) || {}

  const htmlExito =
    status >= 200 &&
    status < 300 &&
    /Mensaje enviado/i.test(cuerpo) &&
    !/id="root"/.test(cuerpo)

  if (data.ok === true || htmlExito) {
    return { ok: true, data }
  }

  return {
    ok: false,
    data,
    error:
      typeof data.error === 'string' && data.error
        ? data.error
        : 'No se pudo enviar el mensaje.',
    fieldErrors:
      data.fieldErrors && typeof data.fieldErrors === 'object'
        ? data.fieldErrors
        : {},
    values: data.values && typeof data.values === 'object' ? data.values : {},
    captcha: data.captcha
  }
}
