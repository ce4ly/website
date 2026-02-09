import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { Link, useNavigate } from 'react-router-dom'

import { useBoletines } from '../../hooks/useBoletines'
import { useJson } from '../../hooks/useJson'
import { jsonLdOrganization } from '../../lib/club'
import { CURSOS, asuntoConsultaCurso } from '../../lib/cursos'
import { DIRECTORIO, urlQrz } from '../../lib/directorio'
import {
  LISTADO_URL,
  adornosLicencia,
  buscarLicencias,
  normalizar,
  type Listado,
} from '../../lib/licencias'
import { enlaceContacto, rutaDe } from '../../lib/paginas'
import { HORARIO_BOLETINES, PORTADA, QUE_HACEMOS, REPETIDORAS_EN_AIRE } from '../../lib/portada'
import { fechaIsoRss, formatearFechaRss } from '../../lib/rss'
import { SOUNDCLOUD_RADIO_CLUB_PROFILE } from '../../lib/soundcloud'
import Clima from '../Clima'
import IndicesSolares from '../IndicesSolares'
import Repetidora from '../Repetidora'
import Icon from '../partials/Icon'
import Icono, { type NombreIcono } from '../partials/Icono'
import JsonLd from '../partials/JsonLd'
import Ondas from '../partials/Ondas'
import { TARJETA, botonClass, enlaceClass } from '../partials/estilos'

const tituloSeccionClass =
  'font-serif text-2xl font-semibold tracking-tight text-stone-900 dark:text-white'

const tituloTarjetaClass = 'font-serif text-lg font-semibold text-stone-900 dark:text-white'

const enlaceSiguienteClass =
  'inline-flex items-center gap-1 text-sm font-medium text-blue-950 dark:text-indigo-200'

const EnlaceSiguiente = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className={enlaceSiguienteClass}>
    {children}
    <Icono nombre='siguiente' className='size-4' />
  </Link>
)

const Seccion = ({
  titulo,
  verTodo,
  children,
}: {
  titulo: string
  verTodo?: { to: string; texto: string }
  children: ReactNode
}) => (
  <section className='space-y-5'>
    <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
      <h2 className={tituloSeccionClass}>{titulo}</h2>
      {verTodo && <EnlaceSiguiente to={verTodo.to}>{verTodo.texto}</EnlaceSiguiente>}
    </div>
    {children}
  </section>
)

const Portada = () => (
  <section className='relative overflow-hidden rounded-b-2xl bg-blue-950 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14 dark:bg-indigo-950 dark:ring-1 dark:ring-indigo-800'>
    <Ondas className='-right-24 -bottom-32 size-[30rem] sm:-right-16' />
    <div className='relative grid items-center gap-10 md:grid-cols-[1fr_auto]'>
      <div className='space-y-5'>
        <p className='text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase'>
          {PORTADA.ubicacion}
        </p>
        <div className='space-y-2'>
          <h1 className='font-serif text-4xl font-bold tracking-tight sm:text-5xl'>
            Radio Club Lircay
          </h1>
          <p className='font-serif text-xl text-indigo-200 italic sm:text-2xl'>{PORTADA.lema}</p>
        </div>
        <p className='max-w-xl text-base leading-relaxed text-indigo-100'>{PORTADA.presentacion}</p>
        <div className='flex flex-wrap gap-3'>
          <Link
            to={rutaDe('acerca')}
            className='inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-950 no-underline shadow transition-colors hover:bg-amber-100 hover:no-underline'
          >
            Conoce el club
            <Icono nombre='siguiente' className='size-4' />
          </Link>
          <Link
            to={rutaDe('contacto')}
            className='inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10 hover:no-underline'
          >
            <Icono nombre='contacto' className='size-4' />
            Escríbenos
          </Link>
        </div>
      </div>
      <img
        src='/logo-frontpage.svg'
        alt='Logo Radio Club Lircay de Talca CE4LY'
        width={256}
        height={256}
        className='mx-auto size-48 rounded-full shadow-2xl ring-4 ring-white/15 sm:size-56 md:size-64'
      />
    </div>
  </section>
)

/** Parte de arriba de las tarjetas de «Qué hacemos»: en vez de foto, el icono en amarillo. */
const CabeceraIcono = ({ icono }: { icono: NombreIcono }) => (
  <div className='relative flex h-36 items-center justify-center overflow-hidden bg-blue-950 dark:bg-indigo-900/70'>
    <Ondas className='inset-0 m-auto size-80' />
    <span className='relative inline-flex size-20 items-center justify-center rounded-full bg-white/5 ring-2 ring-amber-300/40'>
      <Icono nombre={icono} className='size-10 text-amber-300' />
    </span>
  </div>
)

const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

/** Semana con los días de boletín destacados y el horario. */
const CalendarioBoletines = () => (
  <div className={`${TARJETA} space-y-4 p-4`}>
    <h3 className={`${tituloTarjetaClass} flex items-center gap-2`}>
      <Icono nombre='calendario' className='size-5 text-blue-950 dark:text-indigo-300' />
      Calendario de boletines
    </h3>
    <ol className='grid grid-cols-7 gap-1.5' aria-hidden='true'>
      {DIAS_SEMANA.map((dia, i) => {
        const hay = (HORARIO_BOLETINES.dias as readonly number[]).includes(i)
        return (
          <li
            key={i}
            className={`flex aspect-square items-center justify-center rounded-md text-sm font-semibold ${
              hay
                ? 'bg-blue-950 text-amber-300 shadow dark:bg-indigo-600 dark:text-amber-200'
                : 'bg-stone-200/70 text-stone-400 dark:bg-indigo-900/50 dark:text-indigo-400'
            }`}
          >
            {dia}
          </li>
        )
      })}
    </ol>
    <div>
      <p className='flex items-center gap-2 text-2xl font-semibold text-stone-900 dark:text-white'>
        <Icono nombre='reloj' className='size-6 text-blue-950 dark:text-amber-300' />
        {HORARIO_BOLETINES.inicio} – {HORARIO_BOLETINES.fin}
      </p>
      <p className='mt-1 text-sm text-stone-600 dark:text-indigo-200'>
        {HORARIO_BOLETINES.descripcion}, hora de Chile.
      </p>
    </div>
    <p className='flex gap-2 border-t border-stone-200 pt-3 text-sm text-stone-700 dark:border-indigo-900 dark:text-indigo-100'>
      <Icono nombre='lista' className='mt-0.5 size-4 shrink-0 text-blue-950 dark:text-amber-300' />
      <span>
        ¿Eres control de un operativo y quieres anotar las estaciones presentes?{' '}
        <Link to={rutaDe('operativo')} className={enlaceClass}>
          Hazlo aquí
        </Link>
        .
      </span>
    </p>
  </div>
)

const UltimosBoletines = () => {
  const estado = useBoletines()

  return (
    <div className={`${TARJETA} flex flex-col p-4`}>
      <h3 className={`${tituloTarjetaClass} mb-3 flex items-center gap-2`}>
        <Icono nombre='play' className='size-5 text-blue-950 dark:text-indigo-300' />
        Últimos boletines
      </h3>
      {estado.tipo === 'cargando' && (
        <p className='text-sm text-stone-600 dark:text-indigo-300'>Cargando episodios…</p>
      )}
      {estado.tipo === 'error' && (
        <p className='text-sm text-stone-600 dark:text-indigo-300'>
          Escúchalos en{' '}
          <a
            href={SOUNDCLOUD_RADIO_CLUB_PROFILE}
            target='_blank'
            rel='noreferrer noopener'
            className={enlaceClass}
          >
            SoundCloud
          </a>
          .
        </p>
      )}
      {estado.tipo === 'ok' && (
        <ol className='divide-y divide-stone-200 dark:divide-indigo-900'>
          {estado.episodios.slice(0, 5).map((ep) => (
            <li key={ep.link || ep.title} className='py-2.5 first:pt-0 last:pb-0'>
              <a
                href={ep.link || SOUNDCLOUD_RADIO_CLUB_PROFILE}
                target='_blank'
                rel='noreferrer noopener'
                className='inline-flex items-start gap-1.5 text-sm font-medium text-blue-950 dark:text-indigo-100'
              >
                <Icono nombre='play' className='mt-0.5 size-4 shrink-0' />
                {ep.title}
              </a>
              {ep.pubDate && (
                <p className='pl-5.5 text-xs text-stone-500 dark:text-indigo-300'>
                  <time dateTime={fechaIsoRss(ep.pubDate)}>{formatearFechaRss(ep.pubDate)}</time>
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
      <div className='mt-auto pt-4'>
        <EnlaceSiguiente to={rutaDe('boletines')}>Todos los boletines</EnlaceSiguiente>
      </div>
    </div>
  )
}

const QueHacemos = () => (
  <ul className='grid gap-4 md:grid-cols-3'>
    {QUE_HACEMOS.map((tarjeta) => (
      <li key={tarjeta.titulo}>
        <article className={`${TARJETA} flex h-full flex-col overflow-hidden`}>
          <CabeceraIcono icono={tarjeta.icono} />
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <h3 className={tituloTarjetaClass}>{tarjeta.titulo}</h3>
            <p className='text-sm text-stone-700 dark:text-indigo-100'>{tarjeta.texto}</p>
            <div className='mt-auto pt-1'>
              {'pagina' in tarjeta ? (
                <EnlaceSiguiente to={rutaDe(tarjeta.pagina)}>{tarjeta.enlace}</EnlaceSiguiente>
              ) : (
                <a
                  href={tarjeta.url}
                  target='_blank'
                  rel='noreferrer noopener'
                  className={enlaceSiguienteClass}
                >
                  <Icon icon={faInstagram} />
                  {tarjeta.enlace}
                  <Icono nombre='siguiente' className='size-4' />
                </a>
              )}
            </div>
          </div>
        </article>
      </li>
    ))}
  </ul>
)

const Cursos = () => (
  <ul className='grid gap-4 md:grid-cols-3'>
    {CURSOS.map((curso) => (
      <li key={curso.slug}>
        <article className={`${TARJETA} flex h-full flex-col overflow-hidden`}>
          <img
            src={curso.imagen}
            alt={curso.alt}
            width={curso.width}
            height={curso.height}
            loading='lazy'
            className='aspect-[3/2] w-full object-cover'
          />
          <div className='flex flex-1 flex-col gap-3 p-4'>
            <h3 className={tituloTarjetaClass}>{curso.nombre}</h3>
            <p className='text-sm text-stone-700 dark:text-indigo-100'>{curso.resumen}</p>
            <Link
              to={enlaceContacto(asuntoConsultaCurso(curso.nombre))}
              className={`${botonClass} mt-auto no-underline hover:no-underline`}
            >
              Consultar disponibilidad
            </Link>
          </div>
        </article>
      </li>
    ))}
  </ul>
)

const Integrante = ({ persona }: { persona: (typeof DIRECTORIO)[number] }) => (
  <li className='flex w-32 flex-col items-center text-center sm:w-40'>
    <img
      src={persona.foto}
      alt={`Fotografía de ${persona.nombre}`}
      width={160}
      height={160}
      loading='lazy'
      className='size-24 rounded-full object-cover shadow-md ring-4 ring-white sm:size-28 dark:ring-indigo-800'
    />
    <p className='mt-3 text-sm leading-snug font-semibold text-stone-900 dark:text-white'>
      {persona.nombre}
    </p>
    <a
      href={urlQrz(persona.indicativo)}
      target='_blank'
      rel='noopener noreferrer'
      className='mt-0.5 font-mono text-xs font-semibold text-blue-950 dark:text-indigo-200'
    >
      {persona.indicativo}
    </a>
    <p className='text-xs text-stone-600 dark:text-indigo-300'>{persona.cargo}</p>
  </li>
)

/** Mesa directiva arriba (presidente, secretario, tesorero); directores abajo, centrados. */
const Directiva = () => (
  <div className={`${TARJETA} flex flex-col p-4`}>
    <h3 className={`${tituloTarjetaClass} mb-6 flex items-center gap-2`}>
      <Icono nombre='usuarios' className='size-5 text-blue-950 dark:text-indigo-300' />
      Directorio
    </h3>
    <ul className='flex flex-wrap justify-center gap-x-4 gap-y-6 sm:gap-x-6'>
      {DIRECTORIO.slice(0, 3).map((persona) => (
        <Integrante key={persona.indicativo} persona={persona} />
      ))}
    </ul>
    <ul className='mt-6 flex flex-wrap justify-center gap-x-4 gap-y-6 sm:gap-x-6'>
      {DIRECTORIO.slice(3).map((persona) => (
        <Integrante key={persona.indicativo} persona={persona} />
      ))}
    </ul>
    <div className='mt-auto pt-6'>
      <EnlaceSiguiente to={rutaDe('directorio')}>Conoce al directorio</EnlaceSiguiente>
    </div>
  </div>
)

/** Sugerencias que se muestran mientras se escribe. */
const MAX_SUGERENCIAS = 6

const urlBuscador = (q: string) =>
  q ? `${rutaDe('buscador')}?${new URLSearchParams({ q })}` : rutaDe('buscador')

/**
 * Buscador de indicativos. El listado de SUBTEL (≈2 MB) se descarga al enfocar el campo, no al
 * abrir la portada. «Buscar» y cada sugerencia llevan al buscador completo con la consulta en la
 * URL. Sin JavaScript, el formulario hace el mismo GET.
 */
const BuscadorIndicativos = () => {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  const [activo, setActivo] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const sugerenciaRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const listado = useJson<Partial<Listado>>(activo ? LISTADO_URL : null)

  const consulta = normalizar(texto.trim())
  const sugerencias = useMemo(
    () =>
      listado.tipo === 'ok' && consulta.length >= 2
        ? buscarLicencias(listado.datos.licencias ?? [], texto).slice(0, MAX_SUGERENCIAS)
        : [],
    [listado, consulta, texto],
  )
  const mostrar = abierto && consulta.length >= 2

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(urlBuscador(texto.trim()))
  }

  const enfocar = (i: number) => {
    if (i < 0) inputRef.current?.focus()
    else sugerenciaRefs.current[Math.min(i, sugerencias.length - 1)]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const actual = sugerenciaRefs.current.findIndex((el) => el === document.activeElement)
    if (e.key === 'ArrowDown' && sugerencias.length > 0) {
      e.preventDefault()
      setAbierto(true)
      enfocar(actual + 1)
    } else if (e.key === 'ArrowUp' && actual >= 0) {
      e.preventDefault()
      enfocar(actual - 1)
    } else if (e.key === 'Escape') {
      setAbierto(false)
      inputRef.current?.focus()
    }
  }

  return (
    <section className='mx-auto max-w-2xl space-y-5 text-center'>
      <div className='space-y-2'>
        <h2 className={tituloSeccionClass}>Buscador de indicativos</h2>
        <p className='text-sm text-stone-600 dark:text-indigo-200'>
          Busca por indicativo, nombre o número de licencia en el listado de radioaficionados de
          SUBTEL.
        </p>
      </div>
      <form role='search' action={rutaDe('buscador')} method='get' onSubmit={enviar}>
        <div
          ref={contenedorRef}
          className='relative text-left'
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            if (!contenedorRef.current?.contains(e.relatedTarget)) setAbierto(false)
          }}
        >
          <label htmlFor='portada-buscador' className='sr-only'>
            Indicativo, nombre o licencia
          </label>
          <Icono
            nombre='lupa'
            className='pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-stone-400 dark:text-indigo-400'
          />
          <input
            ref={inputRef}
            id='portada-buscador'
            name='q'
            type='search'
            autoComplete='off'
            placeholder='CE4LKY, SLI, Oliva, 907758'
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
              setAbierto(true)
            }}
            onFocus={() => {
              setActivo(true)
              setAbierto(true)
            }}
            aria-expanded={mostrar}
            aria-controls='portada-sugerencias'
            className={`w-full border border-stone-300 bg-white py-3.5 pr-4 pl-12 text-base text-stone-900 shadow-sm transition-shadow placeholder:text-stone-400 hover:shadow-md focus:border-blue-950 focus:shadow-md focus:outline-none dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 ${
              mostrar ? 'rounded-t-3xl' : 'rounded-full'
            }`}
          />
          {mostrar && (
            <div
              id='portada-sugerencias'
              className='absolute inset-x-0 top-full z-20 overflow-hidden rounded-b-3xl border border-t-0 border-stone-300 bg-white pb-2 shadow-lg dark:border-indigo-800 dark:bg-indigo-950'
            >
              {listado.tipo === 'cargando' && (
                <p className='px-5 py-3 text-sm text-stone-500 dark:text-indigo-300'>
                  Cargando listado…
                </p>
              )}
              {listado.tipo === 'error' && (
                <p className='px-5 py-3 text-sm text-stone-500 dark:text-indigo-300'>
                  No se pudo cargar el listado. Pulsa «Buscar» para ir al buscador.
                </p>
              )}
              {listado.tipo === 'ok' && sugerencias.length === 0 && (
                <p className='px-5 py-3 text-sm text-stone-500 dark:text-indigo-300'>
                  Sin coincidencias.
                </p>
              )}
              <ul>
                {sugerencias.map((l, i) => {
                  const { corazon, nota } = adornosLicencia(l, consulta)
                  return (
                    <li key={`${l.licencia}-${l.indicativo}`}>
                      <Link
                        ref={(el) => {
                          sugerenciaRefs.current[i] = el
                        }}
                        to={urlBuscador(l.indicativo)}
                        className='flex items-baseline gap-3 px-5 py-2 text-sm text-stone-800 no-underline hover:bg-stone-100 hover:no-underline focus:bg-stone-100 focus:outline-none dark:text-indigo-100 dark:hover:bg-indigo-900 dark:focus:bg-indigo-900'
                      >
                        <Icono
                          nombre='lupa'
                          className='size-3.5 shrink-0 self-center text-stone-400'
                        />
                        <span className='w-20 shrink-0 font-mono font-semibold text-blue-950 dark:text-white'>
                          {l.indicativo}
                        </span>
                        <span className='truncate'>{l.nombre}</span>
                        {corazon && (
                          <span
                            className='-ml-2 shrink-0 text-red-600 dark:text-red-400'
                            aria-hidden
                          >
                            ♥
                          </span>
                        )}
                        {nota && (
                          <span className='-ml-1.5 shrink-0 text-xs text-stone-500 italic dark:text-indigo-300'>
                            {nota}
                          </span>
                        )}
                        <span className='ml-auto hidden shrink-0 text-xs text-stone-500 sm:inline dark:text-indigo-300'>
                          {l.comuna}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
        <div className='mt-6 flex flex-wrap justify-center gap-3'>
          <button type='submit' className={botonClass}>
            Buscar en CE4LY
          </button>
          <Link
            to={rutaDe('herramientas')}
            className='inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-950 no-underline shadow-sm transition-colors hover:border-blue-950 hover:no-underline dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-100 dark:hover:border-indigo-400'
          >
            Otras herramientas
          </Link>
        </div>
      </form>
    </section>
  )
}

const Inicio = () => (
  <div className='space-y-14 pb-16'>
    <JsonLd data={jsonLdOrganization()} />
    <Portada />

    <Seccion titulo='Qué hacemos'>
      <QueHacemos />
    </Seccion>

    <Seccion titulo='En el aire' verTodo={{ to: rutaDe('reloj'), texto: 'Hora UTC y propagación' }}>
      <Clima />
      <div className='grid items-start gap-4 lg:grid-cols-[2fr_3fr]'>
        <div className='space-y-4'>
          {REPETIDORAS_EN_AIRE.length > 0 && <Repetidora />}
          <CalendarioBoletines />
        </div>
        <IndicesSolares titulo='h3' />
      </div>
    </Seccion>

    <Seccion
      titulo='Cursos abiertos a la comunidad'
      verTodo={{ to: rutaDe('cursos'), texto: 'Ver los cursos' }}
    >
      <Cursos />
    </Seccion>

    <Seccion titulo='El club'>
      <div className='grid gap-4 lg:grid-cols-[2fr_3fr]'>
        <UltimosBoletines />
        <Directiva />
      </div>
    </Seccion>

    <BuscadorIndicativos />

    {/* Banner del club como cierre: invita a escribir para recibir novedades. */}
    <Link to={rutaDe('contacto')} className='block'>
      <img
        src='/banner.jpg'
        alt='¿Eres radioaficionado de la Región del Maule o aún no lo eres? Escríbenos a contacto@ce4ly.cl y recibe información de actividades, cursos, capacitaciones e informativos.'
        width={1200}
        height={421}
        loading='lazy'
        className='w-full rounded-xl shadow-lg transition hover:shadow-xl'
      />
    </Link>
  </div>
)

export default Inicio
