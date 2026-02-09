import { BANDAS_ONDA_CORTA, BANDAS_RADIO_COMERCIAL } from '../../lib/radioComercial'
import Encabezado from '../partials/Encabezado'
import {
  CajaTabla,
  EnlaceFuente,
  NotaFuente,
  SeccionReferencia,
  Tabla,
} from '../referencia/TablaReferencia'
import { filaClass, fmtFreq, tdClass, tdNotaClass } from '../referencia/estilos'

const RadioComercial = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Frecuencias de Radio Comercial'>
      Bandas de radiodifusión sonora en Chile: ondas medias (AM), FM y las bandas internacionales de
      onda corta. La emisora concreta de cada ciudad la asigna SUBTEL y cambia con el tiempo.
    </Encabezado>

    <CajaTabla>
      <Tabla columnas={['Servicio', 'Rango', 'Paso', 'Nota']}>
        {BANDAS_RADIO_COMERCIAL.map((b) => (
          <tr key={b.servicio} className={filaClass()}>
            <td className={`${tdClass} font-semibold`}>{b.servicio}</td>
            <td className={`${tdClass} font-mono`}>{b.rango}</td>
            <td className={`${tdClass} font-mono`}>{b.paso}</td>
            <td className={tdNotaClass}>{b.nota}</td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>

    <SeccionReferencia titulo='Onda corta internacional'>
      Bandas de radiodifusión de la UIT. Sirven para identificar emisoras internacionales; no son
      atribución de radioaficionado.
    </SeccionReferencia>

    <CajaTabla>
      <Tabla columnas={['Banda', 'Rango']}>
        {BANDAS_ONDA_CORTA.map((b) => (
          <tr key={b.banda} className={filaClass()}>
            <td className={`${tdClass} font-mono font-semibold`}>{b.banda}</td>
            <td className={`${tdClass} font-mono`}>
              {fmtFreq(b.min, 2)} – {fmtFreq(b.max, 2)}
            </td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>

    <NotaFuente>
      Plan General de Uso del Espectro Radioeléctrico (SUBTEL) y bandas de radiodifusión de la UIT.
      El listado de concesiones vigentes está en{' '}
      <EnlaceFuente href='https://www.subtel.gob.cl/'>SUBTEL</EnlaceFuente>.
    </NotaFuente>
  </section>
)

export default RadioComercial
