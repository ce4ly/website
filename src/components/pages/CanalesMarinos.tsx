import { useMemo, useState } from 'react'

import { CANALES_MARINOS } from '../../lib/canalesMarinos'
import Encabezado from '../partials/Encabezado'
import { CajaTabla, FiltroReferencia, NotaFuente, Tabla } from '../referencia/TablaReferencia'
import { filaClass, fmtFreq, normalizarBusqueda, tdClass } from '../referencia/estilos'

const CanalesMarinos = () => {
  const [filtro, setFiltro] = useState('')

  const canales = useMemo(() => {
    const q = normalizarBusqueda(filtro.trim())
    if (!q) return CANALES_MARINOS
    return CANALES_MARINOS.filter((c) =>
      normalizarBusqueda([c.ch, c.ship, c.coast, c.tipo, c.uso].join(' ')).includes(q),
    )
  }, [filtro])

  return (
    <section className='mb-16 space-y-8'>
      <Encabezado titulo='Canales de Frecuencias Marinas'>
        Canalización VHF marina internacional (156–162 MHz). En dúplex, el barco transmite en una
        frecuencia y la costa en la otra. El canal 16 es socorro, seguridad y llamada.
      </Encabezado>

      <FiltroReferencia
        id='mar-filtro'
        label='Buscar canal, uso o frecuencia'
        placeholder='Ej: 16, socorro, 156,800, AIS…'
        value={filtro}
        onChange={setFiltro}
      />

      <CajaTabla className='mx-auto max-w-5xl'>
        <Tabla columnas={['Canal', 'Barco', 'Costa', 'Tipo', 'Uso']} vacia={canales.length === 0}>
          {canales.map((c) => (
            <tr key={c.ch} className={filaClass(c.destacar)}>
              <td className={`${tdClass} font-mono font-semibold`}>{c.ch}</td>
              <td className={`${tdClass} font-mono`}>{fmtFreq(c.ship, 3)}</td>
              <td className={`${tdClass} font-mono`}>{fmtFreq(c.coast, 3)}</td>
              <td className={tdClass}>{c.tipo}</td>
              <td className={tdClass}>{c.uso}</td>
            </tr>
          ))}
        </Tabla>
      </CajaTabla>

      <NotaFuente>
        Plan del Apéndice 18 del Reglamento de Radiocomunicaciones (UIT). Chile lo aplica a través
        de DIRECTEMAR. El canal 70 es solo DSC: no se habla ahí. 87B y 88B son AIS. Transmitir en
        frecuencias marinas requiere la licencia del servicio correspondiente; no basta la de
        radioaficionado.
      </NotaFuente>
    </section>
  )
}

export default CanalesMarinos
