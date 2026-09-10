import { useMemo, useState } from 'react'
import { CANALES_MARINOS } from '../lib/canalesMarinos.js'
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

const CanalesMarinos = () => {
  const [filtro, setFiltro] = useState('')

  const canales = useMemo(() => {
    const q = normalizar(filtro.trim())
    if (!q) return CANALES_MARINOS
    return CANALES_MARINOS.filter(c =>
      normalizar([c.ch, c.ship, c.coast, c.tipo, c.uso].join(' ')).includes(q)
    )
  }, [filtro])

  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Canales de Frecuencias Marinas">
        Canalización VHF marina internacional (156–162 MHz). En dúplex, el barco
        transmite en una frecuencia y la costa en la otra. El canal 16 es
        socorro, seguridad y llamada.
      </EncabezadoReferencia>

      <FiltroReferencia
        id="mar-filtro"
        label="Buscar canal, uso o frecuencia"
        placeholder="Ej: 16, socorro, 156,800, AIS…"
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla className="mx-auto max-w-5xl">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>Canal</th>
              <th className={thClass}>Barco</th>
              <th className={thClass}>Costa</th>
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Uso</th>
            </tr>
          </thead>
          <tbody>
            {canales.map(c => (
              <tr key={c.ch} className={filaClass(c.destacar)}>
                <td className={`${tdClass} font-mono font-semibold`}>{c.ch}</td>
                <td className={`${tdClass} font-mono`}>{fmtFreq(c.ship, 3)}</td>
                <td className={`${tdClass} font-mono`}>
                  {fmtFreq(c.coast, 3)}
                </td>
                <td className={tdClass}>{c.tipo}</td>
                <td className={tdClass}>{c.uso}</td>
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
        Plan del Apéndice 18 del Reglamento de Radiocomunicaciones (UIT). Chile
        lo aplica a través de DIRECTEMAR. El canal 70 es solo DSC: no se habla
        ahí. 87B y 88B son AIS. Transmitir en frecuencias marinas requiere la
        licencia del servicio correspondiente; no basta la de radioaficionado.
      </NotaFuente>
    </section>
  )
}

export default CanalesMarinos
