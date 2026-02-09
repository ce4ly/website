import { useState } from 'react'

import { esPositivo, formatearNumero, frecuenciaValida, parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero } from '../calculadora/Campos'

/** L (µH) o C (pF) que resuena con el otro a `mhz`: X · Y = 10⁶ / (2πf)². */
const complemento = (mhz: number, valor: number) => 1e6 / ((2 * Math.PI * mhz) ** 2 * valor)

const Trampas = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [c, setC] = useState('50')
  const [l, setL] = useState('')
  const mhz = parseNumero(frecuencia)
  const cPf = parseNumero(c)
  const lUh = parseNumero(l)

  const ok = frecuenciaValida(mhz)
  const lCalc = ok && esPositivo(cPf) ? complemento(mhz, cPf) : null
  const cCalc = ok && esPositivo(lUh) ? complemento(mhz, lUh) : null
  const lUsar = esPositivo(lUh) ? lUh : lCalc
  const cUsar = esPositivo(cPf) ? cPf : cCalc
  const xl = ok && lUsar ? 2 * Math.PI * mhz * lUsar : null

  return (
    <CalculadoraLayout
      titulo='Trampas LC Resonantes'
      intro='Calcule L o C para que el paralelo resuene en la banda que quiere rechazar.'
    >
      <Articulo titulo='Trampa en paralelo'>
        <p className='text-justify'>
          En la frecuencia de la trampa el paralelo LC es un circuito abierto y «corta» el alambre.
          Debajo de esa frecuencia la trampa se ve como una inductancia y alarga eléctricamente el
          resto. Típico: trampa de 40 m en un dipolo 80/40.
        </p>
        <Formula>
          <p>f = 1 / (2π √(LC))</p>
        </Formula>
        <Nota>
          Deje L o C vacío para calcularlo. Capacitores de alta tensión y Q; evite cerámicos de
          receptor. Una trampa coaxial es el mismo circuito con C y L del propio cable.
        </Nota>
      </Articulo>
      <Campo>
        <CampoNumero
          id='tr-f'
          etiqueta='Frecuencia de resonancia (MHz)'
          placeholder='Ej: 7,148'
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='tr-c'
          etiqueta='C (pF) — vacío para calcularlo'
          value={c}
          onChange={setC}
        />
        <CampoNumero
          id='tr-l'
          etiqueta='L (µH) — vacío para calcularlo'
          value={l}
          onChange={setL}
        />
      </Campo>
      {ok && (lCalc || cCalc) && (
        <Resultado>
          {lCalc !== null && (
            <Fila etiqueta='L necesaria' valor={`${formatearNumero(lCalc, 3)} µH`} />
          )}
          {cCalc !== null && (
            <Fila etiqueta='C necesaria' valor={`${formatearNumero(cCalc, 1)} pF`} />
          )}
          {xl !== null && (
            <Fila etiqueta='XL = XC en resonancia' valor={`${formatearNumero(xl, 1)} Ω`} resaltar />
          )}
          {cUsar && lUsar && (
            <Fila
              etiqueta='Comprobación f'
              valor={`${formatearNumero(1000 / (2 * Math.PI * Math.sqrt(lUsar * cUsar)), 3)} MHz`}
            />
          )}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Trampas
