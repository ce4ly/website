import { useMemo, useState } from 'react'

import { useJson } from '../../hooks/useJson'
import { useQueryState } from '../../hooks/useQueryState'

import {
  LISTADO_URL,
  SOCIOS_URL,
  adornosLicencia,
  buscarLicencias,
  listarSocios,
  normalizar,
  vencida,
  type Adornos,
  type Licencia,
  type Listado,
  type ListadoSocios,
} from '../../lib/licencias'
import Encabezado from '../partials/Encabezado'
import { filaClass, tdClass } from '../referencia/estilos'
import { CajaTabla, FiltroReferencia, NotaFuente, Tabla } from '../referencia/TablaReferencia'

const CATEGORIA: Record<string, string> = {
  aspirante: 'Aspirante',
  novicio: 'Novicio',
  general: 'General',
  superior: 'Superior',
}

/** Máximo de filas que se muestran. */
const MAX = 80

const COLUMNAS = ['Indicativo', 'Nombre', 'Licencia', 'Categoría', 'Comuna', 'Región', 'Vence']

/** Fila de un socio en la búsqueda general: degradado rosado a celeste. */
const FILA_SOCIO =
  'bg-linear-to-r from-pink-100 to-sky-100 dark:from-pink-950/50 dark:to-sky-950/50'

const avisoClass = 'text-center text-sm text-stone-500 dark:text-indigo-300/80'

const casillaClass = 'inline-flex items-center gap-2 text-sm text-stone-700 dark:text-indigo-100'

const EtiquetaSocio = () => (
  <span className='mt-1 block w-fit rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-pink-700 dark:bg-indigo-950/60 dark:text-pink-300'>
    Socio del Radio Club Lircay
  </span>
)

const FilaLicencia = ({
  licencia: l,
  socio,
  adornos,
}: {
  licencia: Licencia
  /** Resalta la fila como socio del club. */
  socio: boolean
  adornos: Adornos
}) => {
  const caduca = vencida(l.vencimiento)
  return (
    <tr className={socio ? FILA_SOCIO : filaClass(caduca)}>
      <td className={`${tdClass} font-mono font-semibold`}>{l.indicativo}</td>
      <td className={tdClass}>
        {l.nombre}
        {adornos.corazon && (
          <span className='ml-1 text-red-600 dark:text-red-400' aria-hidden>
            ♥
          </span>
        )}
        {adornos.nota && (
          <span className='ml-1 text-stone-500 italic dark:text-indigo-300'>{adornos.nota}</span>
        )}
        {socio && <EtiquetaSocio />}
      </td>
      <td className={`${tdClass} whitespace-nowrap font-mono`}>{l.licencia}</td>
      <td className={tdClass}>{CATEGORIA[l.categoria] ?? l.categoria}</td>
      <td className={tdClass}>{l.comuna}</td>
      <td className={tdClass}>{l.region}</td>
      <td className={`${tdClass} font-mono ${caduca ? 'text-red-700 dark:text-red-400' : ''}`}>
        {l.vencimiento}
        {caduca ? ' · vencida' : ''}
      </td>
    </tr>
  )
}

/** Socio cuyo indicativo no aparece en el listado de SUBTEL. */
const FilaSinLicencia = ({ indicativo }: { indicativo: string }) => (
  <tr className={filaClass()}>
    <td className={`${tdClass} font-mono font-semibold`}>{indicativo}</td>
    <td colSpan={COLUMNAS.length - 1} className={`${tdClass} italic text-stone-500`}>
      No figura en el listado de SUBTEL.
    </td>
  </tr>
)

/** `?q=` llega desde el buscador de la portada (y permite compartir una búsqueda). */
const DEFAULTS = { q: '' }

const BuscadorLicencias = () => {
  const [{ q: filtro }, setQuery] = useQueryState(DEFAULTS)
  const [soloSocios, setSoloSocios] = useState(false)
  const [soloIndicativos, setSoloIndicativos] = useState(false)
  const listado = useJson<Partial<Listado>>(LISTADO_URL)
  // Sin la lista de socios el buscador sigue funcionando, sin la casilla.
  const listaSocios = useJson<Partial<ListadoSocios>>(SOCIOS_URL)
  const sociosOk = listaSocios.tipo === 'ok' ? listaSocios.datos.indicativos : undefined

  const datos = useMemo(
    () =>
      listado.tipo === 'ok'
        ? {
            fuente: listado.datos.fuente ?? '',
            licencias: listado.datos.licencias ?? [],
            socios: new Set<string>(sociosOk ?? []),
          }
        : null,
    [listado, sociosOk],
  )

  const consulta = normalizar(filtro.trim())
  const haySocios = !!datos && datos.socios.size > 0
  const modoSocios = soloSocios && haySocios

  const resultados = useMemo(() => {
    if (!datos) return null
    const opciones = { soloIndicativos }
    if (modoSocios)
      return { socios: listarSocios(datos.licencias, [...datos.socios], filtro, opciones) }
    if (consulta.length < 2) return null
    return { licencias: buscarLicencias(datos.licencias, filtro, opciones) }
  }, [datos, modoSocios, consulta, filtro, soloIndicativos])

  const total = resultados ? (resultados.socios ?? resultados.licencias).length : 0
  const resumen = modoSocios
    ? consulta
      ? `${total} de ${datos?.socios.size} socios coinciden.`
      : `${total} socios del Radio Club Lircay, por apellido.`
    : total === 0
      ? 'Sin coincidencias.'
      : `${total.toLocaleString('es-CL')} coincidencia${total === 1 ? '' : 's'}${
          total > MAX ? ` (se muestran ${MAX})` : ''
        }.`

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Buscador de Licencias'>
        Listado de radioaficionados de Chile publicado por SUBTEL. Busque por nombre, indicativo o
        número de licencia.
      </Encabezado>

      <div className='mx-auto max-w-4xl space-y-3'>
        <FiltroReferencia
          id='lic-filtro'
          label={
            modoSocios
              ? 'Buscar entre los socios'
              : soloIndicativos
                ? 'Indicativo'
                : 'Nombre, indicativo o licencia'
          }
          placeholder='Ej: VQX, Landaeta, 906146…'
          value={filtro}
          onChange={(q) => setQuery({ q })}
        />
        <div className='flex flex-wrap gap-x-6 gap-y-2'>
          <label className={casillaClass}>
            <input
              type='checkbox'
              checked={soloIndicativos}
              onChange={(e) => setSoloIndicativos(e.target.checked)}
            />
            Buscar sólo por indicativos
          </label>
          {haySocios && (
            <label className={casillaClass}>
              <input
                type='checkbox'
                checked={soloSocios}
                onChange={(e) => setSoloSocios(e.target.checked)}
              />
              Solo socios del Radio Club Lircay
            </label>
          )}
        </div>
      </div>

      {listado.tipo === 'cargando' && <p className={avisoClass}>Cargando listado…</p>}
      {listado.tipo === 'error' && (
        <p className='text-center text-sm text-red-700 dark:text-red-400'>
          No se pudo cargar el listado de licencias.
        </p>
      )}

      {datos && !resultados && (
        <p className={avisoClass}>
          Escriba al menos dos caracteres. Hay {datos.licencias.length.toLocaleString('es-CL')}{' '}
          licencias en el listado.
        </p>
      )}

      {datos && resultados && (
        <>
          <p className='mx-auto max-w-5xl text-sm text-stone-600 dark:text-indigo-300/80'>
            {resumen}
          </p>
          {total > 0 && (
            <CajaTabla className='mx-auto max-w-5xl'>
              <Tabla columnas={COLUMNAS}>
                {resultados.socios?.map(({ indicativo, licencia }) =>
                  licencia ? (
                    <FilaLicencia
                      key={indicativo}
                      licencia={licencia}
                      socio={false}
                      adornos={adornosLicencia(licencia, filtro)}
                    />
                  ) : (
                    <FilaSinLicencia key={indicativo} indicativo={indicativo} />
                  ),
                )}
                {resultados.licencias?.slice(0, MAX).map((l) => (
                  <FilaLicencia
                    key={`${l.licencia}-${l.indicativo}`}
                    licencia={l}
                    socio={datos.socios.has(l.indicativo)}
                    adornos={adornosLicencia(l, filtro)}
                  />
                ))}
              </Tabla>
            </CajaTabla>
          )}
          {!modoSocios && consulta === 'nfs' && (
            <p className='flex justify-center pt-2'>
              <img src='/nfs.webp' alt='' className='h-40 w-auto' />
            </p>
          )}
        </>
      )}

      <NotaFuente>
        {datos?.fuente || 'SUBTEL'}. No sustituye al registro oficial: las fechas cambian cuando se
        renueva o se caduca una licencia.
      </NotaFuente>
    </section>
  )
}

export default BuscadorLicencias
