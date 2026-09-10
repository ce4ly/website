import { CONTACTO_EMAIL } from '../src/lib/contacto-schema.js'

const escape = s =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const inputClass =
  'width:100%;margin-top:0.25rem;padding:0.5rem 0.75rem;border:1px solid #d6d3d1;border-radius:0.5rem;font:inherit'
const labelClass = 'display:block;font-size:0.875rem;font-weight:500'

function campo(
  name,
  label,
  value,
  error,
  { type = 'text', required = true, extra = '' } = {}
) {
  const err = error
    ? `<p style="color:#b91c1c;font-size:0.75rem;margin:0.25rem 0 0">${escape(error)}</p>`
    : ''
  const req = required ? ' required' : ''
  return `<div>
  <label for="contact-${name}" style="${labelClass}">${label}</label>
  <input id="contact-${name}" name="${name}" type="${type}" value="${escape(value)}" style="${inputClass}"${req}${extra} />
  ${err}
</div>`
}

export function renderContactoHtml(result) {
  if (result.ok) {
    return `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mensaje enviado — Radio Club Lircay CE4LY</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;color:#1c1917">
  <h1>Mensaje enviado</h1>
  <p>Gracias. Recibimos tu mensaje y te responderemos lo antes posible.</p>
  <p><a href="/contacto">Enviar otro mensaje</a> · <a href="/">Inicio</a></p>
</body>
</html>`
  }

  const v = result.values || {}
  const e = result.fieldErrors || {}
  return `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contacto — Radio Club Lircay CE4LY</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;color:#1c1917">
  <h1>Contacto</h1>
  <p>Escríbenos a <a href="mailto:${CONTACTO_EMAIL}">${CONTACTO_EMAIL}</a>. Talca, Región del Maule.</p>
  ${result.error ? `<p role="alert" style="background:#fef2f2;border:1px solid #fecaca;padding:0.75rem;border-radius:0.5rem">${escape(result.error)}</p>` : ''}
  <form method="POST" action="/contacto" style="display:flex;flex-direction:column;gap:1rem">
    <div style="position:absolute;left:-9999px" aria-hidden="true">
      <label for="contact-website-url">Deja este campo vacío</label>
      <input id="contact-website-url" name="website_url" type="text" tabindex="-1" autocomplete="off" />
    </div>
    ${campo('nombre', 'Nombre', v.nombre, e.nombre, { extra: ' autocomplete="name" minlength="2" maxlength="120"' })}
    ${campo('correo', 'Correo electrónico', v.correo, e.correo, { type: 'email', extra: ' autocomplete="email" maxlength="254"' })}
    ${campo('indicativo', 'Indicativo (opcional)', v.indicativo, e.indicativo, { required: false, extra: ' maxlength="15"' })}
    ${campo('asunto', 'Asunto', v.asunto, e.asunto, { extra: ' minlength="2" maxlength="200"' })}
    <div>
      <label for="contact-mensaje" style="${labelClass}">Mensaje</label>
      <textarea id="contact-mensaje" name="mensaje" required minlength="10" maxlength="8000" rows="6" style="${inputClass}">${escape(v.mensaje)}</textarea>
      ${e.mensaje ? `<p style="color:#b91c1c;font-size:0.75rem;margin:0.25rem 0 0">${escape(e.mensaje)}</p>` : ''}
    </div>
    <button type="submit" style="background:#172554;color:#fff;border:0;border-radius:0.5rem;padding:0.65rem 1rem;font-weight:600;cursor:pointer">Enviar mensaje</button>
  </form>
</body>
</html>`
}
