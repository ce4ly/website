import { Link } from 'react-router-dom'

import { CLUB, CONTACTO_EMAIL } from '../../lib/club'
import { rutaDe } from '../../lib/paginas'
import { DocumentoLegal, ListaLegal, SeccionLegal } from '../partials/DocumentoLegal'
import { enlaceClass } from '../partials/estilos'

const Terminos = () => (
  <DocumentoLegal titulo='Términos de servicio' actualizado='29 de octubre de 2026'>
    <p>
      Estos términos regulan el uso del sitio web del {CLUB.nombre} ({CLUB.indicativo}),
      organización comunitaria funcional regida por la Ley Nº 19.418, con domicilio en {CLUB.ciudad}
      , {CLUB.region}. Al usar el sitio, usted los acepta.
    </p>

    <SeccionLegal titulo='1. Qué es este sitio'>
      <p>
        Es un sitio informativo, gratuito y sin fines de lucro, que difunde las actividades del club
        y ofrece herramientas y material de referencia para la radioafición. No requiere registro.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='2. Calculadoras y herramientas'>
      <p>
        <strong>
          La información que entregan las calculadoras es solo de referencia. El club no se hace
          responsable de antenas u otros proyectos construidos con estos valores que no den los
          resultados esperados.
        </strong>
      </p>
      <p>
        Los resultados son valores teóricos que sirven como punto de partida. El comportamiento real
        de una antena (resonancia, ROE, impedancia, ganancia, diagrama de radiación) depende de los
        materiales, la altura, el suelo, los objetos cercanos, la línea de alimentación y la forma
        de armarla, que ninguna calculadora puede prever por completo. Toda antena o circuito debe
        ajustarse y comprobarse con instrumentos (medidor de ROE, analizador de antenas, multímetro)
        antes de usarse.
      </p>
      <p>
        Al instalar antenas, tome las precauciones de seguridad necesarias: aléjese de las líneas
        eléctricas, trabaje con ayuda en altura y respete los límites de exposición a
        radiofrecuencia.
      </p>
      <p>
        Opere siempre dentro de las bandas, potencias y modos que autoriza su licencia, según la
        normativa de SUBTEL. El club no responde por daños a equipos, instalaciones o personas, ni
        por infracciones, que deriven del uso de los resultados del sitio.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='3. Información de referencia'>
      <p>
        Las tablas de frecuencias, el buscador de licencias, los índices solares y el estado del
        tiempo provienen de fuentes de terceros (SUBTEL, hamqsl.com, Open-Meteo, entre otras).
        Procuramos mantenerlos al día, pero pueden contener errores o estar desactualizados, y no
        reemplazan a los registros ni a las publicaciones oficiales.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='4. No es un servicio de emergencias'>
      <p>
        El {CLUB.nombre} no es un servicio de emergencias ni recibe denuncias. Ante una emergencia,
        llame primero a los servicios de urgencia (131 SAMU, 132 Bomberos, 133 Carabineros). Más
        información en{' '}
        <Link to={rutaDe('emergencias')} className={enlaceClass}>
          Radioafición y emergencias
        </Link>
        .
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='5. Contenido y servicios de terceros'>
      <ListaLegal>
        <li>Los boletines se publican y se reproducen desde SoundCloud.</li>
        <li>
          Las emisoras que se pueden escuchar desde la portada pertenecen a sus respectivos
          titulares; el sitio solo reproduce la transmisión pública que ellas ofrecen por internet,
          sin almacenarla ni modificarla.
        </li>
        <li>
          Los enlaces a otros sitios se ofrecen como referencia. No controlamos su contenido ni
          respondemos por él.
        </li>
      </ListaLegal>
    </SeccionLegal>

    <SeccionLegal titulo='6. Propiedad intelectual'>
      <p>
        Los textos, el diseño, el logo y el nombre del {CLUB.nombre} pertenecen al club. Puede citar
        y compartir los contenidos con fines no comerciales, mencionando la fuente y enlazando al
        sitio. Las fotografías de los cursos son de autores de Pexels y se usan según su licencia;
        las marcas y logos de terceros pertenecen a sus dueños.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='7. Uso aceptable'>
      <p>Al usar el sitio, usted se compromete a no:</p>
      <ListaLegal>
        <li>
          enviar mensajes masivos, publicidad no solicitada o contenido ofensivo por el formulario;
        </li>
        <li>intentar acceder sin autorización al sitio o interferir con su funcionamiento;</li>
        <li>
          usar los datos del buscador de licencias para enviar publicidad, acosar a otras personas o
          con cualquier otro fin ilícito.
        </li>
      </ListaLegal>
    </SeccionLegal>

    <SeccionLegal titulo='8. Disponibilidad'>
      <p>
        Hacemos lo posible para que el sitio esté siempre disponible, pero no lo garantizamos: puede
        interrumpirse por mantención, fallas propias o de los servicios de terceros de los que
        depende.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='9. Datos personales'>
      <p>
        El tratamiento de los datos que nos envía por el formulario de contacto se rige por nuestra{' '}
        <Link to={rutaDe('privacidad')} className={enlaceClass}>
          Política de privacidad
        </Link>
        .
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='10. Cambios'>
      <p>
        Podemos modificar estos términos. La versión vigente es siempre la publicada en esta página,
        con su fecha de actualización.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='11. Ley aplicable y contacto'>
      <p>
        Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia se
        someterá a los tribunales competentes de {CLUB.ciudad}. Para consultas, escríbanos a{' '}
        <a href={`mailto:${CONTACTO_EMAIL}`} className={enlaceClass}>
          {CONTACTO_EMAIL}
        </a>
        .
      </p>
    </SeccionLegal>
  </DocumentoLegal>
)

export default Terminos
