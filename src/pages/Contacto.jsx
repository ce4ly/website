import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CONTACTO_EMAIL, jsonLdContactPoint } from '../lib/club.js'

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

const inputErrorClass =
  'border-red-400 focus:border-red-600 focus:ring-red-600/20 dark:border-red-700 dark:focus:border-red-400'

const labelClass =
  'block text-sm font-medium text-stone-800 dark:text-indigo-100'

const enlaceClass =
  'font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100'

const ENHANCE_SCRIPT = `(function(){var t=document.getElementById('contact-t0');if(t&&!t.value)t.value=String(Date.now());var q=new URLSearchParams(location.search).get('asunto');var a=document.getElementById('contact-asunto');if(q&&a&&!a.value)a.value=q;})();`

const campoError = (fieldErrors, name) =>
  fieldErrors[name] ? (
    <p className="mt-1 text-xs text-red-700 dark:text-red-300" role="alert">
      {fieldErrors[name]}
    </p>
  ) : null

const ContactoForm = ({ asuntoInicial }) => {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [values, setValues] = useState({
    nombre: '',
    correo: '',
    indicativo: '',
    asunto: asuntoInicial,
    mensaje: ''
  })
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    setValues(v => (v.asunto ? v : { ...v, asunto: asuntoInicial }))
  }, [asuntoInicial])

  const handleSubmit = async e => {
    e.preventDefault()
    setErrorMsg('')
    setFieldErrors({})
    setStatus('sending')
    const form = e.target
    const fd = new FormData(form)
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/contacto', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => ({}))
      if (data.values) {
        setValues({
          nombre: data.values.nombre || '',
          correo: data.values.correo || '',
          indicativo: data.values.indicativo || '',
          asunto: data.values.asunto || '',
          mensaje: data.values.mensaje || ''
        })
      }
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fieldErrors || {})
        setErrorMsg(data.error || 'No se pudo enviar el mensaje.')
        setStatus('idle')
        setFormKey(k => k + 1)
        return
      }
      setStatus('success')
      form.reset()
    } catch {
      setErrorMsg(
        `Error de red. Comprueba tu conexión o escríbenos a ${CONTACTO_EMAIL}.`
      )
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="space-y-4 rounded-xl border border-stone-300/70 bg-white p-6 text-center shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
        role="status"
      >
        <p className="text-stone-700 dark:text-indigo-100">
          Gracias. Recibimos tu mensaje y te responderemos lo antes posible.
        </p>
        <button
          type="button"
          className="text-sm font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100"
          onClick={() => {
            setStatus('idle')
            setValues({
              nombre: '',
              correo: '',
              indicativo: '',
              asunto: asuntoInicial,
              mensaje: ''
            })
            setFormKey(k => k + 1)
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form
      key={formKey}
      className="relative space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
      method="POST"
      action="/contacto"
      onSubmit={handleSubmit}
    >
      <script dangerouslySetInnerHTML={{ __html: ENHANCE_SCRIPT }} />
      <div
        className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="contact-website-url">Deja este campo vacío</label>
        <input
          id="contact-website-url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="t0" id="contact-t0" defaultValue="" />

      <div>
        <label htmlFor="contact-nombre" className={labelClass}>
          Nombre
        </label>
        <input
          id="contact-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          defaultValue={values.nombre}
          className={`${inputClass} ${fieldErrors.nombre ? inputErrorClass : ''}`}
          aria-invalid={Boolean(fieldErrors.nombre)}
        />
        {campoError(fieldErrors, 'nombre')}
      </div>
      <div>
        <label htmlFor="contact-correo" className={labelClass}>
          Correo electrónico
        </label>
        <input
          id="contact-correo"
          name="correo"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={values.correo}
          className={`${inputClass} ${fieldErrors.correo ? inputErrorClass : ''}`}
          aria-invalid={Boolean(fieldErrors.correo)}
        />
        {campoError(fieldErrors, 'correo')}
      </div>
      <div>
        <label htmlFor="contact-indicativo" className={labelClass}>
          Indicativo <span className="font-normal">(opcional)</span>
        </label>
        <input
          id="contact-indicativo"
          name="indicativo"
          type="text"
          autoComplete="off"
          maxLength={15}
          defaultValue={values.indicativo}
          className={`${inputClass} ${fieldErrors.indicativo ? inputErrorClass : ''}`}
          aria-invalid={Boolean(fieldErrors.indicativo)}
        />
        {campoError(fieldErrors, 'indicativo')}
      </div>
      <div>
        <label htmlFor="contact-asunto" className={labelClass}>
          Asunto
        </label>
        <input
          id="contact-asunto"
          name="asunto"
          type="text"
          required
          minLength={2}
          maxLength={200}
          defaultValue={values.asunto}
          className={`${inputClass} ${fieldErrors.asunto ? inputErrorClass : ''}`}
          aria-invalid={Boolean(fieldErrors.asunto)}
        />
        {campoError(fieldErrors, 'asunto')}
      </div>
      <div>
        <label htmlFor="contact-mensaje" className={labelClass}>
          Mensaje
        </label>
        <textarea
          id="contact-mensaje"
          name="mensaje"
          required
          minLength={10}
          maxLength={8000}
          rows={6}
          defaultValue={values.mensaje}
          className={`${inputClass} resize-y ${fieldErrors.mensaje ? inputErrorClass : ''}`}
          aria-invalid={Boolean(fieldErrors.mensaje)}
        />
        <p className="mt-1 text-xs text-stone-500 dark:text-indigo-300/80">
          Entre 10 y 8.000 caracteres.
        </p>
        {campoError(fieldErrors, 'mensaje')}
      </div>

      {errorMsg !== '' && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

const Contacto = () => {
  const [params] = useSearchParams()
  const asuntoInicial = params.get('asunto') || ''

  return (
    <section className="my-16 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdContactPoint())
        }}
      />
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Contacto
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Escríbenos con el formulario o directamente a{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} className={enlaceClass}>
            {CONTACTO_EMAIL}
          </a>
          . Radio Club Lircay, Talca, Región del Maule.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-6">
        <p className="text-center text-sm text-stone-600 dark:text-indigo-200">
          Talca, Región del Maule ·{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} className={enlaceClass}>
            {CONTACTO_EMAIL}
          </a>
        </p>
        <ContactoForm asuntoInicial={asuntoInicial} />
      </div>
    </section>
  )
}

export default Contacto
