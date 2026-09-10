import { useMemo, useState } from 'react'
import {
  CODIGOS_DCS,
  DMR_COLOR_CODES,
  DMR_PARAMETROS,
  TONOS_CTCSS
} from '../lib/tonos.js'
import {
  CajaTabla,
  EncabezadoReferencia,
  FiltroReferencia,
  NotaFuente,
  filaClass,
  tdClass,
  thClass
} from '../components/TablaReferencia.jsx'

const normalizar = texto =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const TonosCtcssDcs = () => {
  const [filtro, setFiltro] = useState('')
  const q = normalizar(filtro.trim())

  const ctcss = useMemo(() => {
    if (!q) return TONOS_CTCSS
    return TONOS_CTCSS.filter(t =>
      normalizar([t.n, t.hz, t.motorola, t.nota || ''].join(' ')).includes(q)
    )
  }, [q])

  const dcs = useMemo(() => {
    if (!q) return CODIGOS_DCS
    return CODIGOS_DCS.filter(c => c.includes(q.replace(/\D/g, '') || q))
  }, [q])

  const dmrCc = useMemo(() => {
    if (!q) return DMR_COLOR_CODES
    return DMR_COLOR_CODES.filter(c =>
      normalizar(`${c.cc} ${c.nota || ''}`).includes(q)
    )
  }, [q])

  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Tonos CTCSS, DCS y DMR">
        En FM analógico el squelch se abre con un tono CTCSS (Hz) o un código
        DCS. En DMR no hay tono: se usa Color Code, Time Slot y Talkgroup.
      </EncabezadoReferencia>

      <FiltroReferencia
        id="tono-filtro"
        label="Buscar tono, código o Color Code"
        placeholder="Ej: 123, 3Z, 023, CC 1…"
        value={filtro}
        onChange={setFiltro}
      />

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
          CTCSS
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          Tono subaudible continuo (también PL). TX y RX deben coincidir. El
          número de tono varía un poco entre marcas; la frecuencia en Hz es la
          que importa.
        </p>
      </div>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Nº</th>
              <th className={thClass}>Frecuencia</th>
              <th className={thClass}>Motorola</th>
              <th className={thClass}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {ctcss.map(t => (
              <tr key={t.n} className={filaClass(Boolean(t.nota))}>
                <td className={`${tdClass} font-mono font-semibold`}>{t.n}</td>
                <td className={`${tdClass} font-mono`}>
                  {t.hz.toLocaleString('es-CL', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })}{' '}
                  Hz
                </td>
                <td className={`${tdClass} font-mono`}>{t.motorola}</td>
                <td
                  className={`${tdClass} text-stone-500 dark:text-indigo-300/80`}
                >
                  {t.nota || '—'}
                </td>
              </tr>
            ))}
            {ctcss.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className={`${tdClass} text-center text-stone-500`}
                >
                  No hay coincidencias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CajaTabla>

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
          DCS
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          Código digital de tres dígitos octales (también DPL). En el equipo
          aparece como 023N (normal) o 023I (invertido): ambos lados deben usar
          la misma polaridad.
        </p>
      </div>

      <CajaTabla>
        <div className="grid grid-cols-4 gap-px bg-stone-200 p-3 sm:grid-cols-8 dark:bg-indigo-900/40">
          {dcs.map(c => (
            <span
              key={c}
              className="rounded bg-white px-2 py-1.5 text-center font-mono text-sm text-stone-800 dark:bg-indigo-950/60 dark:text-indigo-100"
            >
              {c}
            </span>
          ))}
        </div>
        {dcs.length === 0 && (
          <p className={`${tdClass} text-center`}>No hay coincidencias.</p>
        )}
      </CajaTabla>

      <div className="mx-auto max-w-4xl space-y-3">
        <h2 className="text-xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
          DMR
        </h2>
        <p className="text-sm text-stone-700 dark:text-indigo-100">
          No usa CTCSS ni DCS. El acceso al repetidor es el Color Code; el
          tráfico se reparte en dos slots y se dirige a un talkgroup.
        </p>
      </div>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Parámetro</th>
              <th className={thClass}>Valores</th>
              <th className={thClass}>Uso</th>
            </tr>
          </thead>
          <tbody>
            {DMR_PARAMETROS.map(p => (
              <tr key={p.nombre} className={filaClass(false)}>
                <td className={`${tdClass} font-semibold`}>{p.nombre}</td>
                <td className={`${tdClass} font-mono`}>{p.valores}</td>
                <td className={tdClass}>{p.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CajaTabla>

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Color Code</th>
              <th className={thClass}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {dmrCc.map(c => (
              <tr key={c.cc} className={filaClass(Boolean(c.nota))}>
                <td className={`${tdClass} font-mono font-semibold`}>
                  CC {c.cc}
                </td>
                <td
                  className={`${tdClass} text-stone-500 dark:text-indigo-300/80`}
                >
                  {c.nota || '—'}
                </td>
              </tr>
            ))}
            {dmrCc.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className={`${tdClass} text-center text-stone-500`}
                >
                  No hay coincidencias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CajaTabla>

      <NotaFuente>
        CTCSS: 50 tonos EIA/TIA-603. DCS: 104 códigos TIA (octal). DMR: ETSI TS
        102 361; el Color Code va de 0 a 15. El talkgroup 730 es el de Chile en
        BrandMeister; el de cada repetidor local lo publica el club que lo
        opera.
      </NotaFuente>
    </section>
  )
}

export default TonosCtcssDcs
