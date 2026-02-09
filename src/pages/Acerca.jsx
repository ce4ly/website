function Acerca() {
  return (
    <section className="space-y-6 my-16">
      <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white text-center">
        Acerca del Radio Club
      </h1>
      <div className="space-y-4 text-sm sm:text-base max-w-3xl mx-auto">
        <p className="text-stone-700 dark:text-indigo-100 text-justify">
          El Radio Club Lircay es una organización comunitaria funcional, regida
          por la ley Nº 19.418, con domicilio oficial en la ciudad de Talca,
          Región del Maule. Desde su fundación, se ha consolidado como un punto
          de encuentro para entusiastas de las radiocomunicaciones, operando
          bajo el indicativo institucional <span className="font-semibold">CE4LY</span>.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            Misión
          </h2>
          <p className="text-stone-700 dark:text-indigo-100 text-justify">
            La misión fundamental de la institución es desarrollar, fomentar y
            practicar la radioafición como una actividad recreativa orientada
            hacia el servicio comunitario. El club busca reunir a personas
            interesadas en esta disciplina para propender al mutuo conocimiento,
            el perfeccionamiento técnico y el fortalecimiento de lazos de
            amistad y solidaridad entre sus socios.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            Objetivos Institucionales
          </h2>
          <p className="text-stone-700 dark:text-indigo-100 text-justify">
            De acuerdo con sus estatutos y la gestión de su directiva actual, los
            objetivos principales son:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-stone-700 dark:text-indigo-100">
            <li>
              <span className="font-semibold">Capacitación Continua:</span>{' '}
              Organizar conferencias, talleres y cursos —tales como
              &nbsp;“Electrónica Básica”, “Confección de Antenas” y
              &nbsp;“Reglamentación”— para elevar el nivel técnico de los socios
              y la comunidad.
            </li>
            <li>
              <span className="font-semibold">Excelencia Técnica:</span>{' '}
              Mantener y optimizar una red de repetidores en VHF y UHF para
              garantizar una cobertura amplia y eficiente en la región.
            </li>
            <li>
              <span className="font-semibold">Representatividad:</span>{' '}
              Actuar como el organismo oficial que representa a sus socios en
              todos los asuntos vinculados a los fines de la institución ante
              las autoridades competentes.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
            Funciones y Rol Social
          </h2>
          <p className="text-stone-700 dark:text-indigo-100 text-justify">
            El Radio Club Lircay desempeña funciones que van más allá de la
            práctica radial recreativa:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-stone-700 dark:text-indigo-100">
            <li>
              <span className="font-semibold">Apoyo en Emergencias:</span>{' '}
              Una de sus funciones estatutarias más importantes es prestar
              colaboración en radiocomunicaciones a las autoridades en casos de
              catástrofes o emergencias, utilizando para ello sus recursos
              técnicos y humanos a través del{' '}
              <span className="italic">Sistema de Emergencias (SEA)</span>.
            </li>
            <li>
              <span className="font-semibold">Promoción y Difusión:</span>{' '}
              Realizar ejercicios radiales, boletines informativos y
              actividades como el “Jamboree en el Aire” (JOTA-JOTI) para
              acercar la radioafición a niños y jóvenes Scouts.
            </li>
            <li>
              <span className="font-semibold">Vinculación Comunitaria:</span>{' '}
              Proyectar la radioafición como un agente social, ofreciendo cursos
              abiertos a la comunidad.
            </li>
          </ul>
        </section>

        <p className="text-stone-700 dark:text-indigo-100 text-justify">
          En resumen, el Radio Club Lircay se define como una entidad técnica y
          social que combina la pasión por la tecnología con un profundo
          compromiso de servicio público en la Región del Maule.
        </p>
      </div>
    </section>
  )
}

export default Acerca

