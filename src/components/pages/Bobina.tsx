import { useState } from 'react'

import {
  esPositivo,
  formatearNumero,
  inductanciaWheelerUh,
  parseNumero,
} from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero } from '../calculadora/Campos'

const Bobina = () => {
  const [vueltas, setVueltas] = useState('10')
  const [diametro, setDiametro] = useState('25')
  const [largo, setLargo] = useState('20')
  const n = parseNumero(vueltas)
  const d = parseNumero(diametro)
  const l = parseNumero(largo)
  const ok = esPositivo(n) && esPositivo(d) && esPositivo(l)
  const ratio = ok ? l / d : null

  return (
    <CalculadoraLayout
      titulo='Inductancia de Solenoide (Wheeler)'
      intro='Bobinas de carga y trampas: L a partir de vueltas, diámetro y largo.'
    >
      <Articulo titulo='Fórmula de Wheeler'>
        <p className='text-justify'>
          La fórmula de 1928 de H. A. Wheeler es precisa cuando el largo es al menos ~0,4 veces el
          diámetro. Sirve para cargas de verticales, trampas y choques de aire.
        </p>
        <Formula>
          <p>L (µH) = d² n² / (18d + 40ℓ) &nbsp; (d y ℓ en pulgadas)</p>
        </Formula>
        <Nota>
          No incluye capacidad parásita ni frecuencia de autorresonancia. Para trampas, mida después
          con dipmeter o VNA.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero id='bo-n' etiqueta='Vueltas' value={vueltas} onChange={setVueltas} />
        <CampoNumero id='bo-d' etiqueta='Diámetro (mm)' value={diametro} onChange={setDiametro} />
        <CampoNumero
          id='bo-l'
          etiqueta='Largo de la bobina (mm)'
          value={largo}
          onChange={setLargo}
        />
      </Campo>
      {ok && ratio !== null && (
        <Resultado>
          <Fila
            etiqueta='Inductancia'
            valor={`${formatearNumero(inductanciaWheelerUh(d, l, n), 3)} µH`}
          />
          <Fila etiqueta='Relación largo/diámetro' valor={formatearNumero(ratio, 2)} />
          {ratio < 0.4 && (
            <Fila etiqueta='Aviso' valor='ℓ/d < 0,4: Wheeler pierde precisión' resaltar />
          )}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Bobina
