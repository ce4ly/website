import { Link } from 'react-router-dom'

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
            </strong>{' '}
            El Radio Club Lircay no reemplaza a ningún organismo oficial ni
            recibe denuncias.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Ambulancia (SAMU): <strong>131</strong>
            </li>
            <li>
              Bomberos: <strong>132</strong>
            </li>
            <li>
              Carabineros: <strong>133</strong>
            </li>
          </ul>
          <p className="text-justify">
            La información oficial sobre alertas y evacuaciones la entrega
            SENAPRED a través de sus canales y del Sistema de Alerta de
            Emergencias en los teléfonos móviles.
          </p>
          <p className="text-justify">
            Nuestro aporte es otro: cuando los canales habituales se caen,
            ayudamos a que la información llegue igual.
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
