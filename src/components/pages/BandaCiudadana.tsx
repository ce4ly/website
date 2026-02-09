import { useMemo, useState } from 'react'

import { CANALES_BANDA_CIUDADANA } from '../../lib/bandaCiudadana'
import Encabezado from '../partials/Encabezado'
import {
  CajaTabla,
  EnlaceFuente,
  FiltroReferencia,
  NotaFuente,
  Tabla,
} from '../referencia/TablaReferencia'
import { filaClass, fmtFreq, normalizarBusqueda, tdClass, tdNotaClass } from '../referencia/estilos'

const BandaCiudadana = () => {
  const [filtro, setFiltro] = useState('')

  const canales = useMemo(() => {
    const q = normalizarBusqueda(filtro.trim())
    if (!q) return CANALES_BANDA_CIUDADANA
    return CANALES_BANDA_CIUDADANA.filter((c) =>
      normalizarBusqueda([c.ch, fmtFreq(c.mhz, 3), c.nota ?? ''].join(' ')).includes(q),
    )
  }, [filtro])

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Canales de Banda Ciudadana'>
        Los 40 canales del Servicio de Banda Local en 27 MHz, según la canalización de SUBTEL. En
        Chile se necesita permiso; no es la banda de radioaficionado.
      </Encabezado>

      <FiltroReferencia
        id='cb-filtro'
        label='Buscar canal o frecuencia'
        placeholder='Ej: 9, 27,065, emergencia…'
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla>
        <Tabla columnas={['Canal', 'Frecuencia', 'Nota']} vacia={canales.length === 0}>
          {canales.map((c) => (
            <tr key={c.ch} className={filaClass(c.destacar)}>
              <td className={`${tdClass} font-mono font-semibold`}>{c.ch}</td>
              <td className={`${tdClass} font-mono`}>{fmtFreq(c.mhz, 3)}</td>
              <td className={tdNotaClass}>{c.nota ?? '—'}</td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <NotaFuente>
        Canalización 26,965–27,405 MHz (Resolución Exenta Nº 1261 y Decreto Nº 315). El canal 9 es
        el de emergencia internacional. Los canales 23–25 no siguen el orden numérico de frecuencia:
        es el plan histórico de 40 canales. Consulte equipos autorizados y el trámite en{' '}
        <EnlaceFuente href='https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-banda-local/'>
          SUBTEL
        </EnlaceFuente>
        .
      </NotaFuente>
    </section>
  )
}

export default BandaCiudadana
