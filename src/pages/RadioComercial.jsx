import {
  BANDAS_ONDA_CORTA,
  BANDAS_RADIO_COMERCIAL
} from '../lib/radioComercial.js'
import {
  CajaTabla,
  EncabezadoReferencia,
  NotaFuente,
  filaClass,
  fmtFreq,
  tdClass,
  thClass
} from '../components/TablaReferencia.jsx'

const RadioComercial = () => {
  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Frecuencias de Radio Comercial">
        Bandas de radiodifusión sonora en Chile: ondas medias (AM), FM y las
        bandas internacionales de onda corta. La emisora concreta de cada ciudad
        la asigna SUBTEL y cambia con el tiempo.
      </EncabezadoReferencia>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Servicio</th>
              <th className={thClass}>Rango</th>
              <th className={thClass}>Paso</th>
              <th className={thClass}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {BANDAS_RADIO_COMERCIAL.map(b => (
              <tr key={b.servicio} className={filaClass(false)}>
                <td className={`${tdClass} font-semibold`}>{b.servicio}</td>
                <td className={`${tdClass} font-mono`}>{b.rango}</td>
                <td className={`${tdClass} font-mono`}>{b.paso}</td>
                <td
                  className={`${tdClass} text-stone-500 dark:text-indigo-300/80`}
                >
                  {b.nota}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CajaTabla>

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-white">
          Onda corta internacional
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          Bandas de radiodifusión de la UIT. Sirven para identificar emisoras
          internacionales; no son atribución de radioaficionado.
        </p>
      </div>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Banda</th>
              <th className={thClass}>Rango</th>
            </tr>
          </thead>
          <tbody>
            {BANDAS_ONDA_CORTA.map(b => (
              <tr key={b.banda} className={filaClass(false)}>
                <td className={`${tdClass} font-mono font-semibold`}>
                  {b.banda}
                </td>
                <td className={`${tdClass} font-mono`}>
                  {fmtFreq(b.min, 2)} – {fmtFreq(b.max, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CajaTabla>

      <NotaFuente>
        Plan General de Uso del Espectro Radioeléctrico (SUBTEL) y bandas de
        radiodifusión de la UIT. El listado de concesiones vigentes está en{' '}
        <a
          href="https://www.subtel.gob.cl/"
          className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          SUBTEL
        </a>
        .
      </NotaFuente>
    </section>
  )
}

export default RadioComercial
