import { Fragment } from 'react'

import { formatearFijo } from '../../lib/calculadoras'
import { BANDAS, CATEGORIAS, MODOS, type Segmento } from '../../lib/espectro'
import { TARJETA } from '../partials/estilos'
import Encabezado from '../partials/Encabezado'
import { CajaTabla, EnlaceFuente, NotaFuente, Tabla } from '../referencia/TablaReferencia'
import { tdClass, tdNotaClass, thClass } from '../referencia/estilos'

const formatearFreq = (valor: number, unidad: string, decimales: number) =>
  `${formatearFijo(valor, decimales)} ${unidad}`

/** «7,000 – 7,300 MHz», o una sola frecuencia si el rango es un punto. */
const formatearRango = (min: number, max: number, unidad: string, decimales: number) =>
  min === max
    ? formatearFreq(min, unidad, decimales)
    : `${formatearFijo(min, decimales)} – ${formatearFreq(max, unidad, decimales)}`

/** Modos presentes en algún segmento, en el orden de `MODOS`. */
const modosUnicos = (segmentos: readonly Segmento[]) =>
  MODOS.filter((modo) => segmentos.some((seg) => seg.modos.includes(modo)))

const CeldaPermiso = ({ permitido }: { permitido: boolean }) => (
  <td className={`${tdClass} text-center`}>
    {permitido ? (
      <span className='font-mono text-green-700 dark:text-green-400' aria-label='Permitido'>
        ✓
      </span>
    ) : (
      <span className='text-stone-400 dark:text-indigo-500' aria-label='No permitido'>
        —
      </span>
    )}
  </td>
)

const EtiquetasModo = ({ modos }: { modos: readonly string[] }) => (
  <div className='flex flex-wrap gap-1'>
    {modos.map((modo) => (
      <span
        key={modo}
        className='rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-stone-700 dark:bg-indigo-900/70 dark:text-indigo-100'
      >
        {modo}
      </span>
    ))}
  </div>
)

const SubtablaSegmentos = ({
  segmentos,
  unidad,
  decimales,
}: {
  segmentos: readonly Segmento[]
  unidad: string
  decimales: number
}) => (
  <div className='overflow-x-auto rounded-lg border border-stone-200 bg-stone-50/80 dark:border-indigo-900 dark:bg-indigo-950/50'>
    <table className='w-full text-xs'>
      <thead>
        <tr>
          <th className={`${thClass} py-2`}>Segmento</th>
          {MODOS.map((modo) => (
            <th key={modo} className={`${thClass} py-2 text-center`}>
              {modo}
            </th>
          ))}
          <th className={`${thClass} py-2`}>Nota</th>
        </tr>
      </thead>
      <tbody>
        {segmentos.map((seg) => (
          <tr key={`${seg.min}-${seg.max}`}>
            <td className={`${tdClass} py-2 font-mono`}>
              {formatearRango(seg.min, seg.max, unidad, decimales)}
            </td>
            {MODOS.map((modo) => (
              <CeldaPermiso key={modo} permitido={seg.modos.includes(modo)} />
            ))}
            <td className={`${tdNotaClass} py-2`}>{seg.nota ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const COLUMNAS = [
  'Banda',
  'Rango',
  'Frecuencia media',
  'Modos',
  ...['CD', 'CA', 'CE', 'XQ'].map((clase) => (
    <span key={clase} className='block text-center'>
      {clase}
    </span>
  )),
]

const EspectroRadioelectrico = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Espectro Radioeléctrico'>
      Bandas de frecuencia autorizadas para radioaficionados según el Reglamento del Servicio de
      Aficionados a las Radiocomunicaciones (Decreto Nº 523) y el Plan General de Uso del Espectro
      Radioeléctrico, regulados por la SUBTEL. Los segmentos de modo siguen el plan voluntario de
      IARU Región 2, recortado a las atribuciones chilenas.
    </Encabezado>

    <div className='mx-auto grid max-w-4xl gap-4 sm:grid-cols-2'>
      {CATEGORIAS.map(({ prefijo, nombre, descripcion }) => (
        <article key={prefijo} className={`${TARJETA} p-4`}>
          <h2 className='font-mono text-lg font-semibold text-blue-950 dark:text-indigo-200'>
            {prefijo}
            <span className='ml-2 font-sans text-sm font-medium text-stone-600 dark:text-indigo-300'>
              — {nombre}
            </span>
          </h2>
          <p className='mt-2 text-sm text-stone-700 dark:text-indigo-100'>{descripcion}</p>
        </article>
      ))}
    </div>

    <CajaTabla className='mx-auto max-w-6xl'>
      <Tabla columnas={COLUMNAS}>
        {BANDAS.map((banda) => {
          const { min, max, unidad, decimales, segmentos, nota } = banda
          return (
            <Fragment key={banda.banda}>
              <tr className='transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30'>
                <td className={`${tdClass} font-mono font-semibold`}>
                  {banda.banda}
                  {nota && (
                    <span className='mt-0.5 block text-xs font-normal text-red-700 dark:text-red-400'>
                      {nota}
                    </span>
                  )}
                </td>
                <td className={`${tdClass} font-mono text-xs sm:text-sm`}>
                  {formatearRango(min, max, unidad, decimales)}
                </td>
                <td className={`${tdClass} font-mono text-xs sm:text-sm`}>
                  {formatearFreq((min + max) / 2, unidad, decimales)}
                </td>
                <td className={tdClass}>
                  <EtiquetasModo modos={modosUnicos(segmentos)} />
                </td>
                <CeldaPermiso permitido={banda.cd} />
                <CeldaPermiso permitido={banda.ca} />
                <CeldaPermiso permitido={banda.ce} />
                <CeldaPermiso permitido={banda.xq} />
              </tr>
              {segmentos.length > 1 && (
                <tr>
                  <td colSpan={8} className='bg-stone-50/40 px-3 py-3 dark:bg-indigo-950/20'>
                    <p className='mb-2 text-xs font-medium text-stone-500 dark:text-indigo-300/80'>
                      Segmentos de {banda.banda}
                    </p>
                    <SubtablaSegmentos
                      segmentos={segmentos}
                      unidad={unidad}
                      decimales={decimales}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          )
        })}
      </Tabla>
    </CajaTabla>

    <NotaFuente>
      La frecuencia media es el punto medio del rango: un buen punto de partida para cortar una
      antena monobanda que cubra toda la asignación. Debajo de 10 MHz la fonía se hace en LSB; por
      encima, en USB. El CW se admite en casi toda la banda, pero el plan reserva el borde bajo a
      telegrafía. Los segmentos son la guía voluntaria de IARU Región 2 (2020), recortada a lo que
      atribuye SUBTEL en Chile; no sustituyen al reglamento. Fuente: Decreto Nº 523 (2007),
      Resolución Exenta Nº 175 (2014), Plan General de Uso del Espectro y{' '}
      <EnlaceFuente href='https://iaru-r2.org/wp-content/uploads/2020/02/IARU-R2-Plan-de-Bandas.pdf'>
        plan de bandas IARU R2
      </EnlaceFuente>
      . Consulte la normativa vigente en{' '}
      <EnlaceFuente href='https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radio-aficionados/'>
        SUBTEL
      </EnlaceFuente>
      .
    </NotaFuente>
  </section>
)

export default EspectroRadioelectrico
