import { z } from 'zod'

export const CONTACTO_EMAIL = 'contacto@ce4ly.cl'
export const CONTACTO_API = '/api/contact.php'
export const TIEMPO_MINIMO_MS = 3000
export const TASA_MAXIMA = 5
export const TASA_VENTANA_MS = 60 * 60 * 1000

export const contactoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Indica un nombre (2–120 caracteres).')
    .max(120, 'Indica un nombre (2–120 caracteres).'),
  correo: z
    .string()
    .trim()
    .email('Indica un correo electrónico válido.')
    .max(254, 'Indica un correo electrónico válido.'),
  indicativo: z
    .string()
    .trim()
    .max(15, 'El indicativo es demasiado largo.')
    .regex(/^[A-Za-z0-9/]*$/, 'El indicativo solo admite letras, números y /.')
    .optional()
    .or(z.literal('')),
  asunto: z
    .string()
    .trim()
    .min(2, 'Indica un asunto (2–200 caracteres).')
    .max(200, 'Indica un asunto (2–200 caracteres).'),
  mensaje: z
    .string()
    .trim()
    .min(10, 'El mensaje debe tener entre 10 y 8.000 caracteres.')
    .max(8000, 'El mensaje debe tener entre 10 y 8.000 caracteres.')
})

export function normalizarCamposContacto(data) {
  return {
    nombre: String(data?.nombre ?? data?.name ?? ''),
    correo: String(data?.correo ?? data?.email ?? ''),
    indicativo: String(data?.indicativo ?? data?.callsign ?? ''),
    asunto: String(data?.asunto ?? data?.subject ?? ''),
    mensaje: String(data?.mensaje ?? data?.message ?? ''),
    website_url: String(data?.website_url ?? ''),
    t0: String(data?.t0 ?? '')
  }
}

export function erroresDeZod(error) {
  const fieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (key && fieldErrors[key] === undefined) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

export function validarContacto(data) {
  const campos = normalizarCamposContacto(data)
  const parsed = contactoSchema.safeParse(campos)
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: erroresDeZod(parsed.error),
      values: {
        nombre: campos.nombre.trim(),
        correo: campos.correo.trim(),
        indicativo: campos.indicativo.trim(),
        asunto: campos.asunto.trim(),
        mensaje: campos.mensaje.trim()
      }
    }
  }
  return {
    ok: true,
    values: {
      nombre: parsed.data.nombre,
      correo: parsed.data.correo,
      indicativo: parsed.data.indicativo || '',
      asunto: parsed.data.asunto,
      mensaje: parsed.data.mensaje
    }
  }
}
