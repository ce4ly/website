import {
  IARU_R2,
  REDES_CE3SER,
  SOCORRO_INTERNACIONAL
} from '../lib/emergencia.js'
import {
  CajaTabla,
  EncabezadoReferencia,
  NotaFuente,
  filaClass,
  tdClass,
  thClass
} from '../components/TablaReferencia.jsx'

const Emergencia = () => {
  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Frecuencias de emergencia">
        Puntos de encuentro de radioaficionados en Chile (CE3SER), centros de
        actividad de IARU Región 2 y frecuencias internacionales de socorro. En
        emergencia real se usan las que indique el control de red.
      </EncabezadoReferencia>

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
          Radioaficionados en Chile (CE3SER)
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          Redes periódicas del Servicio de Emergencia del Radio Club de Chile.
          Horarios en hora de Chile.
        </p>
      </div>

      <CajaTabla className="mx-auto max-w-5xl">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Red</th>
              <th className={thClass}>Banda</th>
              <th className={thClass}>Frecuencia</th>
              <th className={thClass}>Modo</th>
              <th className={thClass}>Cuándo</th>
            </tr>
          </thead>
          <tbody>
            {REDES_CE3SER.map(r => (
              <tr key={`${r.red}-${r.freq}`} className={filaClass(false)}>
                <td className={`${tdClass} font-semibold`}>{r.red}</td>
                <td className={`${tdClass} font-mono`}>{r.banda}</td>
                <td className={`${tdClass} font-mono`}>{r.freq}</td>
                <td className={tdClass}>{r.modo}</td>
                <td className={tdClass}>{r.cuando}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CajaTabla>

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
          IARU Región 2
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          Centros de actividad: la emergencia puede estar ±20 kHz. Deje esas
          frecuencias libres si hay tráfico de socorro.
        </p>
      </div>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Banda</th>
              <th className={thClass}>Frecuencia</th>
              <th className={thClass}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {IARU_R2.map(r => (
              <tr key={r.banda} className={filaClass(false)}>
                <td className={`${tdClass} font-mono font-semibold`}>
                  {r.banda}
                </td>
                <td className={`${tdClass} font-mono`}>{r.freq}</td>
                <td
                  className={`${tdClass} text-stone-500 dark:text-indigo-300/80`}
                >
                  {r.nota}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CajaTabla>

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
          Socorro internacional
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          No se transmite aquí con licencia de aficionado. Sirven para reconocer
          el tráfico de otros servicios.
        </p>
      </div>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Servicio</th>
              <th className={thClass}>Frecuencia</th>
              <th className={thClass}>Uso</th>
            </tr>
          </thead>
          <tbody>
            {SOCORRO_INTERNACIONAL.map(r => (
              <tr key={r.servicio} className={filaClass(true)}>
                <td className={`${tdClass} font-semibold`}>{r.servicio}</td>
                <td className={`${tdClass} font-mono`}>{r.freq}</td>
                <td className={tdClass}>{r.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CajaTabla>

      <NotaFuente>
        Redes chilenas según{' '}
        <a
          href="https://www.ce3ser.cl/"
          className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          CE3SER
        </a>
        . En un evento real activarán las frecuencias que correspondan. Los
        centros IARU R2 son de referencia; 3,985 MHz no existe en la atribución
        chilena de 80 m (3,500–3,750). No se listan frecuencias tácticas de
        Carabineros, Bomberos ni otros servicios restringidos.
      </NotaFuente>
    </section>
  )
}

export default Emergencia
