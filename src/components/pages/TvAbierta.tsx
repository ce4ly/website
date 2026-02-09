import { useMemo, useState } from 'react'

import { CANALES_TV_ABIERTA } from '../../lib/tvAbierta'
import Encabezado from '../partials/Encabezado'
import { CajaTabla, FiltroReferencia, NotaFuente, Tabla } from '../referencia/TablaReferencia'
import { filaClass, fmtFreq, normalizarBusqueda, tdClass, tdNotaClass } from '../referencia/estilos'

const TvAbierta = () => {
  const [filtro, setFiltro] = useState('')

  const canales = useMemo(() => {
    const q = normalizarBusqueda(filtro.trim())
    if (!q) return CANALES_TV_ABIERTA
    return CANALES_TV_ABIERTA.filter((c) =>
      normalizarBusqueda(
        [c.canal, c.banda, c.min, c.max, c.centro, c.nota ?? ''].join(' '),
      ).includes(q),
    )
  }, [filtro])

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Frecuencias de TV Abierta'>
        Canalización de 6 MHz para televisión de libre recepción en Chile (ISDB-Tb). El número que
        muestra el televisor (13.1, 7.1) es virtual: el canal de radiofrecuencia es el de esta
        tabla.
      </Encabezado>

      <FiltroReferencia
        id='tv-filtro'
        label='Buscar canal o frecuencia'
        placeholder='Ej: 24, 533, UHF…'
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla>
        <Tabla
          columnas={['Canal RF', 'Banda', 'Rango', 'Centro', 'Nota']}
          vacia={canales.length === 0}
        >
          {canales.map((c) => (
            <tr key={c.canal} className={filaClass()}>
              <td className={`${tdClass} font-mono font-semibold`}>{c.canal}</td>
              <td className={tdClass}>{c.banda}</td>
              <td className={`${tdClass} font-mono`}>
                {fmtFreq(c.min, 0)} – {fmtFreq(c.max, 0)}
              </td>
              <td className={`${tdClass} font-mono`}>{fmtFreq(c.centro, 0)}</td>
              <td className={tdNotaClass}>{c.nota ?? '—'}</td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <NotaFuente>
        Plan de televisión de Chile (6 MHz, mismo raster que NTSC-M). La TDT usa sobre todo UHF
        14–51 (470–698 MHz); el apagón analógico ya ocurrió. El canal 37 suele reservarse. Qué
        multiplex hay en cada ciudad lo publica SUBTEL / CNTV y cambia por zona.
      </NotaFuente>
    </section>
  )
}

export default TvAbierta
