import { useSyncExternalStore, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { formatearFijo } from '../../lib/calculadoras'
import { CLUB, CONTACTO_EMAIL, SITE_URL } from '../../lib/club'
import { urlQrz } from '../../lib/directorio'
import { TOOLS, rutaDe, type PaginaId } from '../../lib/paginas'
import { HORARIO_BOLETINES, REPETIDORAS_EN_AIRE } from '../../lib/portada'
import { FEED_BOLETINES } from '../../lib/proxies'
import Icono, { type NombreIcono } from './Icono'
import Ondas from './Ondas'
import RedesSociales from './RedesSociales'

const linkClass =
  'text-indigo-100/90 transition-colors hover:text-amber-300 hover:no-underline dark:text-indigo-200'

const tituloClass = 'mb-4 text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase'

const ANCHO_ONDA = 1440
const ALTO_ONDA = 48

/**
 * Onda senoidal (curvas cuadráticas encadenadas) de `periodos` ciclos en `ancho`, rellena hacia
 * abajo. Con un número entero de ciclos, dos copias seguidas empalman sin salto.
 */
const onda = (ancho: number, periodos: number, amplitud: number) => {
  const medio = ALTO_ONDA / 2
  const paso = ancho / periodos / 2
  let d = `M0 ${ALTO_ONDA} L0 ${medio} Q${paso / 2} ${medio - amplitud} ${paso} ${medio}`
  for (let x = paso * 2; x <= ancho + 0.5; x += paso) d += ` T${x} ${medio}`
  return `${d} L${ancho} ${ALTO_ONDA} Z`
}

/** La de atrás mide el doble de ancho y se desplaza en bucle (`.onda-flujo`, app.css). */
const ONDA_ATRAS = onda(ANCHO_ONDA * 2, 8, 14)
const ONDA_FRENTE = onda(ANCHO_ONDA, 3, 10)

/** Borde superior ondulado: el contenido «fluye» hacia el footer en vez de cortarse. */
const BordeOnda = () => (
  <div
    className='pointer-events-none absolute inset-x-0 bottom-full h-12 overflow-hidden'
    aria-hidden='true'
  >
    <svg
      viewBox={`0 0 ${ANCHO_ONDA * 2} ${ALTO_ONDA}`}
      preserveAspectRatio='none'
      className='onda-flujo absolute bottom-0 left-0 h-full w-[200%] fill-blue-900/70 dark:fill-indigo-900/70'
    >
      <path d={ONDA_ATRAS} />
    </svg>
    <svg
      viewBox={`0 0 ${ANCHO_ONDA} ${ALTO_ONDA}`}
      preserveAspectRatio='none'
      className='absolute bottom-0 left-0 h-full w-full fill-blue-950 dark:fill-indigo-950'
    >
      <path d={ONDA_FRENTE} />
    </svg>
  </div>
)

const Columna = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <div>
    <h2 className={tituloClass}>{titulo}</h2>
    <ul className='space-y-2.5 text-sm'>{children}</ul>
  </div>
)

const Enlace = ({ id, children }: { id: PaginaId; children?: ReactNode }) => (
  <li>
    <Link to={rutaDe(id)} className={linkClass}>
      {children ?? TOOLS.find((tool) => tool.slug === id)?.shortTitle}
    </Link>
  </li>
)

const Dato = ({ icono, children }: { icono: NombreIcono; children: ReactNode }) => (
  <li className='flex gap-2.5'>
    <Icono nombre={icono} className='mt-0.5 size-4 shrink-0 text-amber-300' />
    <span>{children}</span>
  </li>
)

const sinSuscripcion = () => () => {}

const anioActual = () => new Date().getFullYear()

const Footer = () => {
  // El HTML pre-renderizado trae el año del build; al hidratar pasa al año del visitante, así un
  // sitio sin publicar desde el año anterior no rompe la hidratación.
  const year = useSyncExternalStore(
    sinSuscripcion,
    anioActual,
    () => import.meta.env.VITE_ANIO_BUILD,
  )

  return (
    <footer className='relative bg-blue-950 text-indigo-100 dark:bg-indigo-950'>
      <BordeOnda />
      <div className='relative overflow-hidden'>
        <Ondas className='-right-40 -bottom-48 size-[34rem]' />
        <div className='relative mx-auto grid max-w-5xl gap-10 px-4 pt-12 pb-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]'>
          <div className='space-y-4'>
            <Link to={rutaDe('inicio')} className='flex items-center gap-3 hover:no-underline'>
              <img
                src='/logo-frontpage.svg'
                alt=''
                width={256}
                height={256}
                loading='lazy'
                className='size-16 rounded-full ring-2 ring-white/20'
              />
              <span>
                <span className='block font-serif text-xl font-bold text-white'>{CLUB.nombre}</span>
                <span className='block text-sm text-amber-300'>
                  {CLUB.indicativo} · {CLUB.slogan}
                </span>
              </span>
            </Link>
            <p className='max-w-xs text-sm leading-relaxed text-indigo-100/80'>
              Organización comunitaria de {CLUB.ciudad}, {CLUB.region}, que fomenta la radioafición
              como servicio a la comunidad.
            </p>
            <RedesSociales variante='footer' />
          </div>

          <Columna titulo='El club'>
            <Enlace id='acerca'>Acerca del club</Enlace>
            <Enlace id='directorio'>Directorio</Enlace>
            <Enlace id='cursos'>Cursos</Enlace>
            <Enlace id='boletines'>Boletines</Enlace>
            <Enlace id='emergencias'>Emergencias</Enlace>
            <Enlace id='contacto'>Contacto</Enlace>
          </Columna>

          <Columna titulo='Herramientas'>
            <Enlace id='buscador' />
            <Enlace id='dipolo' />
            <Enlace id='efhw' />
            <Enlace id='morse' />
            <Enlace id='locator' />
            <Enlace id='herramientas'>Todas las herramientas</Enlace>
          </Columna>

          <Columna titulo='En el aire'>
            {REPETIDORAS_EN_AIRE.map((r) => (
              <Dato key={r.id} icono='senal'>
                {r.nombre}:{' '}
                <span className='font-semibold text-white'>
                  {formatearFijo(r.frecuenciaMhz, 3)}
                </span>{' '}
                MHz, tono {formatearFijo(r.tonoHz, 1)} Hz
              </Dato>
            ))}
            <Dato icono='calendario'>
              Boletines: {HORARIO_BOLETINES.descripcion.toLowerCase()}, {HORARIO_BOLETINES.inicio} –{' '}
              {HORARIO_BOLETINES.fin}
            </Dato>
            <Dato icono='mapa'>
              {CLUB.ciudad}, {CLUB.region} ·{' '}
              <Link to={rutaDe('locator')} className={linkClass}>
                Grid <span className='font-semibold text-white'>{CLUB.locator}</span>
              </Link>
            </Dato>
            <Dato icono='contacto'>
              <a href={`mailto:${CONTACTO_EMAIL}`} className={linkClass}>
                {CONTACTO_EMAIL}
              </a>
            </Dato>
            <Dato icono='rss'>
              <a href={`${SITE_URL}${FEED_BOLETINES}`} className={linkClass}>
                Feed RSS de los boletines
              </a>
            </Dato>
          </Columna>
        </div>

        <div className='relative border-t border-white/10'>
          <div className='mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 text-xs text-indigo-100/70 sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
            <p>
              © {year} {CLUB.nombre} ({CLUB.indicativo}). Organización comunitaria funcional, Ley Nº
              19.418.
            </p>
            <nav aria-label='Legal' className='flex flex-wrap gap-x-4 gap-y-1'>
              <Link to={rutaDe('terminos')} className={linkClass}>
                Términos de servicio
              </Link>
              <Link to={rutaDe('privacidad')} className={linkClass}>
                Política de privacidad
              </Link>
              <span>
                Desarrollado por{' '}
                <a
                  href='https://www.seadragon.cl/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClass}
                >
                  Sea Dragon
                </a>{' '}
                /{' '}
                <a
                  href={urlQrz('CA5NFS')}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClass}
                >
                  CA5NFS
                </a>
              </span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
