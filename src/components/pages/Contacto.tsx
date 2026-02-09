import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { CONTACTO_EMAIL, jsonLdContactPoint } from '../../lib/club'
import { rutaDe } from '../../lib/paginas'
import Encabezado from '../partials/Encabezado'
import JsonLd from '../partials/JsonLd'
import { TARJETA, botonClass, enlaceClass } from '../partials/estilos'

/** Nombre del formulario en Netlify Forms (no cambiarlo: ahí se agrupan los envíos). */
const FORM_NAME = 'contacto'

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

const labelClass = 'block text-sm font-medium text-stone-800 dark:text-indigo-100'

const ayudaClass = 'mt-1 text-xs text-stone-500 dark:text-indigo-300/80'

type Estado = 'idle' | 'enviando' | 'exito' | 'error'

const Etiqueta = ({ htmlFor, children }: { htmlFor: string; children: ReactNode }) => (
  <label htmlFor={htmlFor} className={labelClass}>
    {children}
  </label>
)

const Contacto = () => {
  const [estado, setEstado] = useState<Estado>('idle')
  const [params] = useSearchParams()
  const asuntoRef = useRef<HTMLInputElement>(null)
  const asuntoInicial = params.get('asunto') ?? ''

  // El HTML pre-renderizado no conoce el query string: el asunto sugerido por los enlaces de
  // Cursos y Emergencias (`?asunto=…`) se escribe al montar, sin pisar lo que ya haya escrito.
  useEffect(() => {
    const campo = asuntoRef.current
    if (campo && !campo.value) campo.value = asuntoInicial
  }, [asuntoInicial, estado])

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setEstado('enviando')
    const campos = new URLSearchParams()
    for (const [clave, valor] of new FormData(form)) {
      campos.set(clave, typeof valor === 'string' ? valor.trim() : '')
    }

    try {
      // Netlify Forms recibe el POST en la propia página (la URL con barra final, sin redirects).
      const respuesta = await fetch(rutaDe('contacto'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: campos.toString(),
      })
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
      form.reset()
      setEstado('exito')
    } catch {
      setEstado('error')
    }
  }

  const enviando = estado === 'enviando'

  return (
    <section className='mb-16 space-y-8'>
      <JsonLd data={jsonLdContactPoint()} />
      <Encabezado titulo='Contacto'>
        Escríbenos con el formulario o directamente a{' '}
        <a href={`mailto:${CONTACTO_EMAIL}`} className={enlaceClass}>
          {CONTACTO_EMAIL}
        </a>
        . Radio Club Lircay, Talca, Región del Maule.
      </Encabezado>

      <div className='mx-auto max-w-xl space-y-6'>
        <p className='text-center text-sm text-stone-600 dark:text-indigo-200'>
          Talca, Región del Maule ·{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} className={enlaceClass}>
            {CONTACTO_EMAIL}
          </a>
        </p>

        {estado === 'exito' ? (
          <div className={`${TARJETA} space-y-4 p-6 text-center`} role='status'>
            <p className='text-stone-700 dark:text-indigo-100'>
              Gracias. Recibimos tu mensaje y te responderemos lo antes posible.
            </p>
            <button
              type='button'
              className='text-sm font-medium text-blue-950 underline underline-offset-4 hover:text-blue-800 dark:text-indigo-200 dark:hover:text-indigo-100'
              onClick={() => setEstado('idle')}
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          // Sin JavaScript, el formulario se envía igual (POST nativo) y Netlify muestra su
          // página de confirmación. Antispam: honeypot `bot-field` y el filtro de Netlify Forms.
          <form
            name={FORM_NAME}
            method='POST'
            data-netlify='true'
            data-netlify-honeypot='bot-field'
            onSubmit={enviar}
            className={`${TARJETA} relative space-y-5 p-6`}
          >
            <input type='hidden' name='form-name' value={FORM_NAME} />
            <p className='hidden' aria-hidden='true'>
              <label>
                Deja este campo vacío <input name='bot-field' tabIndex={-1} autoComplete='off' />
              </label>
            </p>

            <div>
              <Etiqueta htmlFor='contact-nombre'>Nombre</Etiqueta>
              <input
                id='contact-nombre'
                name='nombre'
                type='text'
                autoComplete='name'
                required
                minLength={2}
                maxLength={120}
                disabled={enviando}
                className={inputClass}
              />
            </div>
            <div>
              <Etiqueta htmlFor='contact-correo'>Correo electrónico</Etiqueta>
              <input
                id='contact-correo'
                name='correo'
                type='email'
                autoComplete='email'
                required
                maxLength={254}
                disabled={enviando}
                className={inputClass}
              />
            </div>
            <div>
              <Etiqueta htmlFor='contact-indicativo'>
                Indicativo <span className='font-normal'>(opcional)</span>
              </Etiqueta>
              <input
                id='contact-indicativo'
                name='indicativo'
                type='text'
                autoComplete='off'
                maxLength={15}
                pattern='[A-Za-z0-9/]*'
                title='Solo letras, números y /.'
                disabled={enviando}
                className={inputClass}
              />
            </div>
            <div>
              <Etiqueta htmlFor='contact-asunto'>Asunto</Etiqueta>
              <input
                ref={asuntoRef}
                id='contact-asunto'
                name='asunto'
                type='text'
                required
                minLength={2}
                maxLength={200}
                disabled={enviando}
                className={inputClass}
              />
            </div>
            <div>
              <Etiqueta htmlFor='contact-mensaje'>Mensaje</Etiqueta>
              <textarea
                id='contact-mensaje'
                name='mensaje'
                required
                minLength={10}
                maxLength={8000}
                rows={6}
                disabled={enviando}
                className={`${inputClass} resize-y`}
              />
              <p className={ayudaClass}>Entre 10 y 8.000 caracteres.</p>
            </div>

            {estado === 'error' && (
              <p
                className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100'
                role='alert'
              >
                No se pudo enviar el mensaje. Comprueba tu conexión o escríbenos a {CONTACTO_EMAIL}.
              </p>
            )}

            <p className={ayudaClass}>
              Usaremos tus datos solo para responderte. Más detalles en la{' '}
              <Link to={rutaDe('privacidad')} className={enlaceClass}>
                política de privacidad
              </Link>
              .
            </p>

            <button type='submit' disabled={enviando} className={`${botonClass} w-full`}>
              {enviando ? 'Enviando…' : 'Enviar mensaje'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Contacto
