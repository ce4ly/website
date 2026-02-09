import { useMemo, useState } from 'react'

import { PAISES_INDICATIVOS, banderaEmoji } from '../../lib/indicativos'
import Encabezado from '../partials/Encabezado'
import {
  CajaTabla,
  EnlaceFuente,
  FiltroReferencia,
  NotaFuente,
  Tabla,
} from '../referencia/TablaReferencia'
import { normalizarBusqueda, tdClass } from '../referencia/estilos'

/** Chile primero; el resto por orden alfabético. */
const PAISES = [...PAISES_INDICATIVOS].sort((a, b) => {
  if (a.iso === 'CL') return -1
  if (b.iso === 'CL') return 1
  return a.pais.localeCompare(b.pais, 'es')
})

const IndicativosPais = () => {
  const [filtro, setFiltro] = useState('')

  const paises = useMemo(() => {
    const q = normalizarBusqueda(filtro.trim())
    if (!q) return PAISES
    return PAISES.filter((p) =>
      normalizarBusqueda(
        [p.pais, p.indicativo, p.iso, ...p.series, p.nota ?? ''].join(' '),
      ).includes(q),
    )
  }, [filtro])

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Indicativos por País'>
        Prefijo con el que se reconoce un país en el aire y las series de letras que usan sus
        estaciones. En Chile el indicativo habitual es CE; las clases son CD, CA, CE y XQ.
      </Encabezado>

      <FiltroReferencia
        id='ind-filtro'
        label='Buscar país o prefijo'
        placeholder='Ej: Chile, CE, LU, Japón…'
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla>
        <Tabla columnas={['País', 'Indicativo', 'Series / clases']} vacia={paises.length === 0}>
          {paises.map((p) => (
            <tr
              key={`${p.iso}-${p.indicativo}`}
              className={`transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30 ${
                p.iso === 'CL' ? 'bg-blue-50/70 dark:bg-indigo-900/30' : ''
              }`}
            >
              <td className={`${tdClass} whitespace-nowrap`}>
                <span className='mr-2 text-lg leading-none' aria-hidden>
                  {banderaEmoji(p.iso)}
                </span>
                {p.pais}
              </td>
              <td className={`${tdClass} font-mono font-semibold`}>{p.indicativo}</td>
              <td className={tdClass}>
                <span className='font-mono text-xs sm:text-sm'>{p.series.join(', ')}</span>
                {p.nota && (
                  <span className='mt-0.5 block text-xs text-stone-500 dark:text-indigo-300/80'>
                    {p.nota}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <NotaFuente>
        El indicativo es el prefijo con el que suele anunciarse el país. Las series son los bloques
        que emiten las estaciones (clases de licencia o asignaciones UIT). Chile está primero; el
        resto va por orden alfabético. Consulte siempre la autoridad nacional: en Chile,{' '}
        <EnlaceFuente href='https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radio-aficionados/'>
          SUBTEL
        </EnlaceFuente>
        .
      </NotaFuente>
    </section>
  )
}

export default IndicativosPais
