import { Link } from 'react-router-dom'
import { LINEAS_AYUDA, NUMEROS_URGENCIA } from '../lib/numeros-emergencia.js'
import Icono from '../components/Icono.jsx'

const botonClass =
  'inline-flex items-center justify-center rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-900 dark:bg-indigo-600 dark:hover:bg-indigo-500'

const Emergencias = () => {
  return (
    <section className="my-16 space-y-10">
      <article className="mx-auto max-w-3xl space-y-8 text-sm text-stone-700 sm:text-base dark:text-indigo-100">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
            Radioafición y emergencias
          </h1>
        </header>

        <div className="space-y-4 text-justify">
          <p>
            Cuando un terremoto, un incendio forestal o un temporal deja sin
            servicio a la telefonía y a internet, la radioafición sigue
            funcionando. No depende de antenas celulares, ni de cables, ni de un
            proveedor: basta un equipo, una antena y una batería. Por eso, desde
            hace décadas, los radioaficionados cumplen un rol de apoyo en las
            emergencias en Chile.
          </p>
          <p>
            El Radio Club Lircay tiene esta función establecida en sus
            estatutos: prestar colaboración en radiocomunicaciones a las
            autoridades en caso de catástrofe o emergencia, poniendo a
            disposición sus recursos técnicos y humanos a través del Sistema de
            Emergencias (SEA).
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-stone-900 dark:text-white">
            Si usted es vecino o vecina
          </h2>
          <p className="text-justify">
            <strong>
              Ante una emergencia, llame siempre primero a los servicios de
              urgencia.
            </strong>
          </p>
          <aside
            className="rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-justify dark:border-indigo-800 dark:bg-indigo-950/60"
            role="note"
          >
            <p>
              <strong>
                El Radio Club Lircay no es un servicio de emergencias.
              </strong>{' '}
              No reemplaza a ningún organismo oficial ni recibe denuncias. Solo
              podemos actuar como apoyo a las comunicaciones de emergencia
              cuando el Servicio Nacional de Prevención y Respuesta ante
              Desastres (SENAPRED), en coordinación con la Subsecretaría de
              Telecomunicaciones (SUBTEL), nos autoriza para ese fin.
            </p>
          </aside>
          <ul className="space-y-2">
            {NUMEROS_URGENCIA.map(({ numero, nombre }) => (
              <li key={numero} className="flex items-baseline gap-2">
                <Icono
                  nombre="telefono"
                  className="size-4 shrink-0 translate-y-0.5 text-blue-950 dark:text-indigo-300"
                />
                <span>
                  {nombre}:{' '}
                  <a
                    href={`tel:${numero}`}
                    className="font-semibold text-blue-950 underline-offset-2 hover:underline dark:text-indigo-100"
                  >
                    {numero}
                  </a>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-stone-600 dark:text-indigo-300">
            Otras líneas oficiales:
          </p>
          <ul className="space-y-2">
            {LINEAS_AYUDA.map(({ numero, tel, nombre }) => (
              <li key={numero} className="flex items-baseline gap-2">
                <Icono
                  nombre="telefono"
                  className="size-4 shrink-0 translate-y-0.5 text-blue-950 dark:text-indigo-300"
                />
                <span>
                  {nombre}:{' '}
                  <a
                    href={`tel:${tel || numero.replace(/\s/g, '')}`}
                    className="font-semibold text-blue-950 underline-offset-2 hover:underline dark:text-indigo-100"
                  >
                    {numero}
                  </a>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-justify">
            La información oficial sobre alertas y evacuaciones la entrega
            SENAPRED a través de sus canales y del Sistema de Alerta de
            Emergencias en los teléfonos móviles.
          </p>
          <p className="text-justify">
            Nuestro aporte, cuando está autorizado, es otro: si los canales
            habituales de información dejan de funcionar, ayudamos a que la
            información llegue de todas formas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-stone-900 dark:text-white">
            Si usted es radioaficionado
          </h2>
          <p className="text-justify">
            En una emergencia, lo más útil que puede hacer un operador es{' '}
            <strong>escuchar</strong>. Algunas reglas básicas:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-justify">
            <li>
              No transmita sobre una frecuencia con tráfico de emergencia en
              curso. El silencio de los demás es lo que permite que se escuche
              la estación débil.
            </li>
            <li>
              Si tiene información relevante, espere el llamado del control de
              red y entréguela en forma breve y concreta.
            </li>
            <li>
              No retransmita rumores. En emergencia, un dato sin confirmar hace
              más daño que el silencio.
            </li>
            <li>
              Mantenga sus equipos con energía autónoma y sus antenas en
              condiciones. La emergencia no avisa.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-stone-900 dark:text-white">
            Súmese
          </h2>
          <p className="text-justify">
            Si quiere participar del trabajo de emergencia del club, o coordinar
            con nosotros desde una institución, escríbanos.
          </p>
          <p>
            <Link to="/contacto?asunto=Emergencias" className={botonClass}>
              Escribir sobre emergencias
            </Link>
          </p>
        </section>
      </article>
    </section>
  )
}

export default Emergencias
