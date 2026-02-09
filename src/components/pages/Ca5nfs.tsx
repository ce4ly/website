import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

import { DIRECTORIO, LADO_FOTO, urlQrz } from '../../lib/directorio'
import Encabezado from '../partials/Encabezado'
import Icon from '../partials/Icon'

const PERSONA = DIRECTORIO.find(({ indicativo }) => indicativo === 'CA5NFS')!

const ENLACES = [
  { titulo: 'Sitio Web', href: 'https://www.devrfc83.com/', icono: faGlobe },
  { titulo: 'Instagram', href: 'https://www.instagram.com/devrfc83', icono: faInstagram },
  { titulo: 'GitHub', href: 'https://github.com/devrfc83', icono: faGithub },
]

const Ca5nfs = () => {
  return (
    <section className='mb-16 space-y-8'>
      <Encabezado
        titulo={
          <>
            Rodrigo Fabián Andrés
            <br />
            Fuentealba Cartes
          </>
        }
        etiqueta={`${PERSONA.cargo} · Radio Club Lircay`}
        pie={
          <ul className='flex flex-wrap gap-2 pt-1' aria-label='Enlaces'>
            {ENLACES.map(({ titulo, href, icono }) => (
              <li key={titulo}>
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10 hover:no-underline'
                >
                  <Icon icon={icono} />
                  {titulo}
                </a>
              </li>
            ))}
          </ul>
        }
      >
        <a
          href={urlQrz(PERSONA.indicativo)}
          target='_blank'
          rel='noopener noreferrer'
          className='font-mono text-lg underline underline-offset-4'
        >
          {PERSONA.indicativo}
        </a>
      </Encabezado>
      <img
        src={PERSONA.foto}
        alt={`Fotografía de ${PERSONA.nombre}`}
        width={LADO_FOTO}
        height={LADO_FOTO}
        className='mx-auto h-48 w-48 rounded-full object-cover sm:h-56 sm:w-56'
      />
      <div className='mx-auto max-w-3xl space-y-4 text-sm sm:text-base'>
        <p className='text-justify text-stone-700 dark:text-indigo-100'>
          Mi nombre es Rodrigo Fuentealba Cartes. Nací el día 22 de febrero de 1983 en la ciudad de
          Talcahuano, en la Región del Bío-Bío, en Chile. Mi mujer, Paloma, también es
          radioaficionada y tiene como indicativo CD4EYT. Formo parte del Radio Club Lircay de
          Talca, del cual además mantengo el Sitio Web y el Repositorio de Aplicaciones.
        </p>
        <p className='text-justify text-stone-700 dark:text-indigo-100'>
          En la actualidad poseo una Licenciatura en Ciencias de la Ingeniería y el título de
          Ingeniero en Computación e Informática, ambos los obtuve con distinción Cum Laude durante
          la contingencia global por la pandemia de COVID-19. No obstante lo reciente de mi título
          profesional, cuento con más de 20 años de experiencia trabajando con empresas y
          organizaciones de diferentes tamaños como analista, programador, consultor en tecnología
          de información y jefe de proyectos, además de ejercer como docente e instructor de
          capacitación en diferentes establecimientos educacionales profesionales. Hoy en día me
          desempeño como Data Scientist en una institución pública en Chile.
        </p>
        <p className='text-justify text-stone-700 dark:text-indigo-100'>
          Siempre tuve contacto con la radioafición: viví en Puerto Williams, en la Región de
          Magallanes, de Chile. Dada su ubicación, la única manera de recibir señales de televisión
          abierta era a través del ajuste fino de una antena Yagi de 5 elementos que se encontraba a
          un costado de la casa donde vivía. Luego hice mi Servicio Militar Obligatorio como
          estudiante, en la Compañía de Telecomunicaciones del Ejército de Chile, donde aprendí a
          construir antenas dipolo y a operar equipos VHF, entre otras cosas. Sin embargo no fue
          hasta una vez finalizados mis estudios de ingeniería que decidí obtener licencia de
          radioaficionado, como una manera de estudiar electricidad y electrónica sin necesidad de
          pasar nuevamente por la academia.
        </p>
        <p className='text-justify text-stone-700 dark:text-indigo-100'>
          Tengo variados hobbies e intereses personales: idiomas, viajes, fotografía, motociclismo,
          ciclismo, básquetbol, calistenia, halterofilia, ajedrez, streaming vía Web, piano,
          guitarra, desarrollo en tecnologías de código abierto, y por supuesto, la radio amateur.
          Mi filosofía es la de compartir conocimiento en lugar de enriquecerme y de dar lo mejor de
          mí en lo que hago.
        </p>
        <p className='text-justify text-stone-700 dark:text-indigo-100'>
          Me considero una persona sociable y empática, de fácil conversación. Creo que el respeto
          es un privilegio que se gana y la gentileza es un derecho que se pierde. Normalmente me
          conduzco con humildad, pero puedo dejar mi actitud de lado y hablar con pasión y energía
          cuando la situación lo requiere.
        </p>
        <p className='text-stone-700 dark:text-indigo-100'>73!</p>
      </div>
    </section>
  )
}

export default Ca5nfs
