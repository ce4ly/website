import { Link } from 'react-router-dom'

import { CLUB, CONTACTO_EMAIL } from '../../lib/club'
import { rutaDe } from '../../lib/paginas'
import { DocumentoLegal, ListaLegal, SeccionLegal } from '../partials/DocumentoLegal'
import { enlaceClass } from '../partials/estilos'

const Correo = () => (
  <a href={`mailto:${CONTACTO_EMAIL}`} className={enlaceClass}>
    {CONTACTO_EMAIL}
  </a>
)

const PoliticaPrivacidad = () => (
  <DocumentoLegal titulo='Política de privacidad' actualizado='29 de octubre de 2026'>
    <p>
      En el sitio del {CLUB.nombre} ({CLUB.indicativo}) recogemos la menor cantidad posible de datos
      personales: solo los que usted escribe en el formulario de contacto. Esta política explica qué
      hacemos con ellos y qué otros servicios intervienen cuando usa el sitio.
    </p>

    <SeccionLegal titulo='1. Quién es responsable'>
      <p>
        El responsable de los datos es el {CLUB.nombre}, organización comunitaria funcional regida
        por la Ley Nº 19.418, con domicilio en {CLUB.ciudad}, {CLUB.region}. Para cualquier consulta
        sobre privacidad, escríbanos a <Correo />.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='2. Qué datos recogemos'>
      <p>
        Cuando envía el{' '}
        <Link to={rutaDe('contacto')} className={enlaceClass}>
          formulario de contacto
        </Link>
        , recibimos:
      </p>
      <ListaLegal>
        <li>su nombre;</li>
        <li>su correo electrónico;</li>
        <li>su indicativo de radioaficionado, si lo escribe (es opcional);</li>
        <li>el asunto y el mensaje.</li>
      </ListaLegal>
      <p>
        El sitio no tiene cuentas de usuario, no usa cookies de seguimiento ni herramientas de
        analítica, y no muestra publicidad.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='3. Para qué los usamos'>
      <p>
        Usamos sus datos solo para leer y responder su mensaje, y para hacer seguimiento de su
        consulta (por ejemplo, avisarle cuando se abra un curso por el que preguntó). No los usamos
        para enviar publicidad, no los agregamos a listas de correo sin su consentimiento y no los
        vendemos ni los cedemos a terceros.
      </p>
      <p>
        La base para tratarlos es su consentimiento: al enviar el formulario, nos pide que le
        respondamos.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='4. Quién más los procesa'>
      <p>
        El sitio está alojado en Netlify, Inc., empresa de Estados Unidos. El formulario se envía a
        su servicio Netlify Forms, que guarda el mensaje, lo filtra contra spam y nos avisa por
        correo a <Correo />. Por eso sus datos se almacenan en servidores fuera de Chile. Netlify
        actúa por encargo nuestro y los trata según su propia política de privacidad.
      </p>
      <p>
        Como cualquier servidor web, Netlify registra datos técnicos de cada visita (dirección IP,
        navegador, página solicitada) para operar y proteger el servicio. Nosotros no usamos esos
        registros para identificar a nadie.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='5. Cuánto tiempo los guardamos'>
      <p>
        Guardamos los mensajes mientras sea necesario para responder y hacer seguimiento de su
        consulta, y los eliminamos a más tardar doce meses después de cerrada. Puede pedirnos que
        los borremos antes en cualquier momento.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='6. Lo que se guarda en su navegador'>
      <p>
        Algunas funciones guardan información en el almacenamiento local de su propio navegador (
        <code>localStorage</code>). Esa información no sale de su dispositivo ni llega a nosotros:
      </p>
      <ListaLegal>
        <li>su preferencia de tema claro u oscuro;</li>
        <li>
          las estaciones que anota en el{' '}
          <Link to={rutaDe('operativo')} className={enlaceClass}>
            Control de Operativo
          </Link>
          ;
        </li>
        <li>una copia de los índices solares, para mostrarlos sin conexión.</li>
      </ListaLegal>
      <p>
        Además, el sitio guarda una copia de sus páginas y herramientas para que funcionen sin
        conexión. Puede borrar todo esto desde la configuración de su navegador.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='7. Servicios de terceros'>
      <ListaLegal>
        <li>
          <strong>SoundCloud:</strong> la página de{' '}
          <Link to={rutaDe('boletines')} className={enlaceClass}>
            Boletines
          </Link>{' '}
          incluye el reproductor de SoundCloud, que puede usar sus propias cookies según su política
          de privacidad.
        </li>
        <li>
          <strong>Radios en la portada:</strong> si reproduce una emisora desde la pantalla de la
          repetidora, su navegador se conecta directamente al servidor de transmisión de esa
          emisora, que recibe su dirección IP.
        </li>
        <li>
          <strong>Mapa del Grid Maidenhead:</strong> el{' '}
          <Link to={rutaDe('locator')} className={enlaceClass}>
            Grid Maidenhead
          </Link>{' '}
          descarga las imágenes del mapa desde OpenStreetMap, y lo que escribe en su buscador de
          ciudades se envía a Nominatim, el buscador de OpenStreetMap. Ambos reciben su dirección
          IP; el buscador, además, el texto que busca.
        </li>
        <li>
          <strong>Clima e índices solares:</strong> los pedimos a Open-Meteo y a hamqsl.com a través
          del propio sitio; esos servicios no reciben datos suyos.
        </li>
        <li>
          <strong>Enlaces externos:</strong> los enlaces a Facebook, Instagram, QRZ y otros sitios
          se rigen por las políticas de cada uno.
        </li>
      </ListaLegal>
    </SeccionLegal>

    <SeccionLegal titulo='8. Buscador de licencias'>
      <p>
        El{' '}
        <Link to={rutaDe('buscador')} className={enlaceClass}>
          Buscador de Licencias
        </Link>{' '}
        muestra el listado de radioaficionados que publica la Subsecretaría de Telecomunicaciones
        (SUBTEL), tal como lo publica: nombre, indicativo, número de licencia, categoría, comuna,
        región y vencimiento. Son datos públicos que no recogemos de usted. Si figura en el listado
        y algún dato está errado, la corrección corresponde a SUBTEL; si quiere que lo revisemos o
        tiene otra inquietud, escríbanos a <Correo />.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='9. Sus derechos'>
      <p>
        Puede pedirnos en cualquier momento acceder a los datos que tenemos sobre usted,
        rectificarlos, eliminarlos u oponerse a su tratamiento, conforme a la Ley Nº 19.628 sobre
        protección de la vida privada y, desde su entrada en vigencia, a la Ley Nº 21.719 sobre
        protección de datos personales. Escríbanos a <Correo /> y le responderemos dentro de los
        plazos legales.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='10. Menores de edad'>
      <p>
        El formulario no está dirigido especialmente a menores. Si tiene menos de 18 años, le
        pedimos escribirnos con conocimiento de su madre, padre o tutor.
      </p>
    </SeccionLegal>

    <SeccionLegal titulo='11. Cambios a esta política'>
      <p>
        Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha de
        actualización. Vea también los{' '}
        <Link to={rutaDe('terminos')} className={enlaceClass}>
          Términos de servicio
        </Link>
        .
      </p>
    </SeccionLegal>
  </DocumentoLegal>
)

export default PoliticaPrivacidad
