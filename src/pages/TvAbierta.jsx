import { useMemo, useState } from 'react'
import { CANALES_TV_ABIERTA } from '../lib/tvAbierta.js'
import {
  CajaTabla,
  EncabezadoReferencia,
  FiltroReferencia,
  NotaFuente,
  filaClass,
  fmtFreq,
  tdClass,
  thClass
} from '../components/TablaReferencia.jsx'

const normalizar = texto =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const TvAbierta = () => {
  const [filtro, setFiltro] = useState('')

  const canales = useMemo(() => {
    const q = normalizar(filtro.trim())
    if (!q) return CANALES_TV_ABIERTA
    return CANALES_TV_ABIERTA.filter(c =>
      normalizar(
        [c.canal, c.banda, c.min, c.max, c.centro, c.nota || ''].join(' ')
      ).includes(q)
    )
  }, [filtro])

  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Frecuencias de TV Abierta">
        Canalización de 6 MHz para televisión de libre recepción en Chile
        (ISDB-Tb). El número que muestra el televisor (13.1, 7.1) es virtual: el
        canal de radiofrecuencia es el de esta tabla.
      </EncabezadoReferencia>

      <FiltroReferencia
        id="tv-filtro"
        label="Buscar canal o frecuencia"
        placeholder="Ej: 24, 533, UHF…"
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Canal RF</th>
              <th className={thClass}>Banda</th>
              <th className={thClass}>Rango</th>
              <th className={thClass}>Centro</th>
              <th className={thClass}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {canales.map(c => (
              <tr key={c.canal} className={filaClass(false)}>
                <td className={`${tdClass} font-mono font-semibold`}>
                  {c.canal}
                </td>
                <td className={tdClass}>{c.banda}</td>
                <td className={`${tdClass} font-mono`}>
                  {fmtFreq(c.min, 0)} – {fmtFreq(c.max, 0)}
                </td>
                <td className={`${tdClass} font-mono`}>
                  {fmtFreq(c.centro, 0)}
                </td>
                <td
                  className={`${tdClass} text-stone-500 dark:text-indigo-300/80`}
                >
                  {c.nota || '—'}
                </td>
              </tr>
            ))}
            {canales.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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
        Plan de televisión de Chile (6 MHz, mismo raster que NTSC-M). La TDT usa
        sobre todo UHF 14–51 (470–698 MHz); el apagón analógico ya ocurrió. El
        canal 37 suele reservarse. Qué multiplex hay en cada ciudad lo publica
        SUBTEL / CNTV y cambia por zona.
      </NotaFuente>
    </section>
  )
}

export default TvAbierta
