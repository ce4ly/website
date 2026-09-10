import { useMemo, useState } from 'react'
import { CANALES_BANDA_CIUDADANA } from '../lib/bandaCiudadana.js'
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

const BandaCiudadana = () => {
  const [filtro, setFiltro] = useState('')

  const canales = useMemo(() => {
    const q = normalizar(filtro.trim())
    if (!q) return CANALES_BANDA_CIUDADANA
    return CANALES_BANDA_CIUDADANA.filter(c =>
      normalizar([c.ch, fmtFreq(c.mhz, 3), c.nota || ''].join(' ')).includes(q)
    )
  }, [filtro])

  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Canales de Banda Ciudadana">
        Los 40 canales del Servicio de Banda Local en 27 MHz, según la
        canalización de SUBTEL. En Chile se necesita permiso; no es la banda de
        radioaficionado.
      </EncabezadoReferencia>

      <FiltroReferencia
        id="cb-filtro"
        label="Buscar canal o frecuencia"
        placeholder="Ej: 9, 27,065, emergencia…"
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Canal</th>
              <th className={thClass}>Frecuencia</th>
              <th className={thClass}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {canales.map(c => (
              <tr key={c.ch} className={filaClass(c.destacar)}>
                <td className={`${tdClass} font-mono font-semibold`}>{c.ch}</td>
                <td className={`${tdClass} font-mono`}>{fmtFreq(c.mhz, 3)}</td>
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
                  colSpan={3}
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
        Canalización 26,965–27,405 MHz (Resolución Exenta Nº 1261 y Decreto Nº
        315). El canal 9 es el de emergencia internacional. Los canales 23–25 no
        siguen el orden numérico de frecuencia: es el plan histórico de 40
        canales. Consulte equipos autorizados y el trámite en{' '}
        <a
          href="https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-banda-local/"
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

export default BandaCiudadana
