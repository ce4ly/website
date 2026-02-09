import { useMemo, useState } from 'react'

import { formatearFijo } from '../../lib/calculadoras'
import { CODIGOS_DCS, DMR_COLOR_CODES, DMR_PARAMETROS, TONOS_CTCSS } from '../../lib/tonos'
import Encabezado from '../partials/Encabezado'
import {
  CajaTabla,
  FiltroReferencia,
  NotaFuente,
  SeccionReferencia,
  Tabla,
} from '../referencia/TablaReferencia'
import { filaClass, normalizarBusqueda, tdClass, tdNotaClass } from '../referencia/estilos'

const TonosCtcssDcs = () => {
  const [filtro, setFiltro] = useState('')
  const q = normalizarBusqueda(filtro.trim())

  const ctcss = useMemo(() => {
    if (!q) return TONOS_CTCSS
    return TONOS_CTCSS.filter((t) =>
      normalizarBusqueda([t.n, t.hz, t.motorola, t.nota ?? ''].join(' ')).includes(q),
    )
  }, [q])

  const dcs = useMemo(() => {
    if (!q) return CODIGOS_DCS
    // «023N» o «D023» buscan el código 023.
    const digitos = q.replace(/\D/g, '') || q
    return CODIGOS_DCS.filter((c) => c.includes(digitos))
  }, [q])

  const dmrCc = useMemo(() => {
    if (!q) return DMR_COLOR_CODES
    return DMR_COLOR_CODES.filter((c) => normalizarBusqueda(`${c.cc} ${c.nota ?? ''}`).includes(q))
  }, [q])

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Tonos CTCSS, DCS y DMR'>
        En FM analógico el squelch se abre con un tono CTCSS (Hz) o un código DCS. En DMR no hay
        tono: se usa Color Code, Time Slot y Talkgroup.
      </Encabezado>

      <FiltroReferencia
        id='tono-filtro'
        label='Buscar tono, código o Color Code'
        placeholder='Ej: 123, 3Z, 023, CC 1…'
        value={filtro}
        onChange={setFiltro}
      />

      <SeccionReferencia titulo='CTCSS' grande>
        Tono subaudible continuo (también PL). TX y RX deben coincidir. El número de tono varía un
        poco entre marcas; la frecuencia en Hz es la que importa.
      </SeccionReferencia>

      <CajaTabla>
        <Tabla columnas={['Nº', 'Frecuencia', 'Motorola', 'Nota']} vacia={ctcss.length === 0}>
          {ctcss.map((t) => (
            <tr key={t.n} className={filaClass(Boolean(t.nota))}>
              <td className={`${tdClass} font-mono font-semibold`}>{t.n}</td>
              <td className={`${tdClass} font-mono`}>{formatearFijo(t.hz, 1)} Hz</td>
              <td className={`${tdClass} font-mono`}>{t.motorola}</td>
              <td className={tdNotaClass}>{t.nota ?? '—'}</td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <SeccionReferencia titulo='DCS' grande>
        Código digital de tres dígitos octales (también DPL). En el equipo aparece como 023N
        (normal) o 023I (invertido): ambos lados deben usar la misma polaridad.
      </SeccionReferencia>

      <CajaTabla>
        <div className='grid grid-cols-4 gap-px bg-stone-200 p-3 sm:grid-cols-8 dark:bg-indigo-900/40'>
          {dcs.map((c) => (
            <span
              key={c}
              className='rounded bg-white px-2 py-1.5 text-center font-mono text-sm text-stone-800 dark:bg-indigo-950/60 dark:text-indigo-100'
            >
              {c}
            </span>
          ))}
        </div>
        {dcs.length === 0 && <p className={`${tdClass} text-center`}>No hay coincidencias.</p>}
      </CajaTabla>

      <SeccionReferencia titulo='DMR' grande>
        No usa CTCSS ni DCS. El acceso al repetidor es el Color Code; el tráfico se reparte en dos
        slots y se dirige a un talkgroup.
      </SeccionReferencia>

      <CajaTabla>
        <Tabla columnas={['Parámetro', 'Valores', 'Uso']}>
          {DMR_PARAMETROS.map((p) => (
            <tr key={p.nombre} className={filaClass()}>
              <td className={`${tdClass} font-semibold`}>{p.nombre}</td>
              <td className={`${tdClass} font-mono`}>{p.valores}</td>
              <td className={tdClass}>{p.uso}</td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <CajaTabla>
        <Tabla columnas={['Color Code', 'Nota']} vacia={dmrCc.length === 0}>
          {dmrCc.map((c) => (
            <tr key={c.cc} className={filaClass(Boolean(c.nota))}>
              <td className={`${tdClass} font-mono font-semibold`}>CC {c.cc}</td>
              <td className={tdNotaClass}>{c.nota ?? '—'}</td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <NotaFuente>
        CTCSS: 50 tonos EIA/TIA-603. DCS: 104 códigos TIA (octal). DMR: ETSI TS 102 361; el Color
        Code va de 0 a 15. El talkgroup 730 es el de Chile en BrandMeister; el de cada repetidor
        local lo publica el club que lo opera.
      </NotaFuente>
    </section>
  )
}

export default TonosCtcssDcs
