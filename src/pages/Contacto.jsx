import { useState } from 'react'

/**
 * Cambia a true cuando el backend (Mailgun / PHP) esté listo en producción.
 */
const SHOW_CONTACT_FORM = false

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

const labelClass =
  'block text-sm font-medium text-stone-800 dark:text-indigo-100'

const ContactoForm = () => {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setErrorMsg('')
    setStatus('sending')
    const form = e.target
    const fd = new FormData(form)
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      message: fd.get('message'),
      website_url: fd.get('website_url')
    }
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'No se pudo enviar el mensaje.')
        setStatus('idle')
        return
      }
      setStatus('success')
      form.reset()
    } catch {
      setErrorMsg(
        'Error de red. Comprueba tu conexión o escríbenos a contacto@ce4ly.cl.'
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
          Gracias. Hemos recibido tu mensaje y te responderemos lo antes
          posible.
        </p>
        <button
          type="button"
          className="text-sm font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100"
          onClick={() => setStatus('idle')}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form
      className="relative space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
      onSubmit={handleSubmit}
      noValidate
    >
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

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Nombre
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Correo electrónico
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={8000}
          rows={6}
          className={`${inputClass} resize-y`}
        />
        <p className="mt-1 text-xs text-stone-500 dark:text-indigo-300/80">
          Entre 10 y 8.000 caracteres.
        </p>
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
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Contacto
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          {SHOW_CONTACT_FORM ? (
            <>
              Envíanos un mensaje con el formulario o escribe directamente a{' '}
              <a
                href="mailto:contacto@ce4ly.cl"
                className="font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100"
              >
                contacto@ce4ly.cl
              </a>
              .
            </>
          ) : (
            <>
              Por ahora puedes escribirnos directamente a{' '}
              <a
                href="mailto:contacto@ce4ly.cl"
                className="font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100"
              >
                contacto@ce4ly.cl
              </a>
              . Habilitaremos el formulario web cuando el sitio esté publicado
              por completo.
            </>
          )}
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-6">
        {SHOW_CONTACT_FORM ? (
          <ContactoForm />
        ) : (
          <div className="rounded-xl border border-stone-300/70 bg-white p-6 text-center text-sm text-stone-600 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            Formulario en preparación.
          </div>
        )}
      </div>
    </section>
  )
}

export default Contacto
