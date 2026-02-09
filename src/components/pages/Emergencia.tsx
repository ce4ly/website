import { IARU_R2, REDES_CE3SER, SOCORRO_INTERNACIONAL } from '../../lib/emergencia'
import Encabezado from '../partials/Encabezado'
import {
  CajaTabla,
  EnlaceFuente,
  NotaFuente,
  SeccionReferencia,
  Tabla,
} from '../referencia/TablaReferencia'
import { filaClass, tdClass, tdNotaClass } from '../referencia/estilos'

const Emergencia = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Frecuencias de Emergencia'>
      Puntos de encuentro de radioaficionados en Chile (CE3SER), centros de actividad de IARU Región
      2 y frecuencias internacionales de socorro. En emergencia real se usan las que indique el
      control de red.
    </Encabezado>

    <SeccionReferencia titulo='Radioaficionados en Chile (CE3SER)'>
      Redes periódicas del Servicio de Emergencia del Radio Club de Chile. Horarios en hora de
      Chile.
    </SeccionReferencia>

    <CajaTabla className='mx-auto max-w-5xl'>
      <Tabla columnas={['Red', 'Banda', 'Frecuencia', 'Modo', 'Cuándo']}>
        {REDES_CE3SER.map((r) => (
          <tr key={`${r.red}-${r.freq}`} className={filaClass()}>
            <td className={`${tdClass} font-semibold`}>{r.red}</td>
            <td className={`${tdClass} font-mono`}>{r.banda}</td>
            <td className={`${tdClass} font-mono`}>{r.freq}</td>
            <td className={tdClass}>{r.modo}</td>
            <td className={tdClass}>{r.cuando}</td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>

    <SeccionReferencia titulo='IARU Región 2'>
      Centros de actividad: la emergencia puede estar ±20 kHz. Deje esas frecuencias libres si hay
      tráfico de socorro.
    </SeccionReferencia>

    <CajaTabla>
      <Tabla columnas={['Banda', 'Frecuencia', 'Nota']}>
        {IARU_R2.map((r) => (
          <tr key={r.banda} className={filaClass()}>
            <td className={`${tdClass} font-mono font-semibold`}>{r.banda}</td>
            <td className={`${tdClass} font-mono`}>{r.freq}</td>
            <td className={tdNotaClass}>{r.nota}</td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>

    <SeccionReferencia titulo='Socorro internacional'>
      No se transmite aquí con licencia de aficionado. Sirven para reconocer el tráfico de otros
      servicios.
    </SeccionReferencia>

    <CajaTabla>
      <Tabla columnas={['Servicio', 'Frecuencia', 'Uso']}>
        {SOCORRO_INTERNACIONAL.map((r) => (
          <tr key={r.servicio} className={filaClass(true)}>
            <td className={`${tdClass} font-semibold`}>{r.servicio}</td>
            <td className={`${tdClass} font-mono`}>{r.freq}</td>
            <td className={tdClass}>{r.uso}</td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>

    <NotaFuente>
      Redes chilenas según <EnlaceFuente href='https://www.ce3ser.cl/'>CE3SER</EnlaceFuente>. En un
      evento real activarán las frecuencias que correspondan. Los centros IARU R2 son de referencia;
      3,985 MHz no existe en la atribución chilena de 80 m (3,500–3,750). No se listan frecuencias
      tácticas de Carabineros, Bomberos ni otros servicios restringidos.
    </NotaFuente>
  </section>
)

export default Emergencia
