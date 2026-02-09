import { useState } from 'react'

import { parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, { Campo, Ejemplo, Formula } from '../calculadora/CalculadoraLayout'
import { TARJETA } from '../partials/estilos'
import { CampoNumero } from '../calculadora/Campos'

type Magnitud = 'voltios' | 'amperios' | 'watts'
type Valores = Record<Magnitud, string>

const positivo = (texto: string) => {
  const num = parseNumero(texto)
  return num !== null && num > 0 ? num : null
}

const formatear = (valor: number) => valor.toLocaleString('es-CL', { maximumFractionDigits: 4 })

/** Con dos de V, A y W calcula el tercero; el campo recién editado nunca se sobrescribe. */
const completarPotencia = (editado: Magnitud, valores: Valores): Valores => {
  const v = positivo(valores.voltios)
  const a = positivo(valores.amperios)
  const w = positivo(valores.watts)
  const siguiente = { ...valores }

  if (editado !== 'watts' && v !== null && a !== null) siguiente.watts = formatear(v * a)
  else if (editado !== 'amperios' && v !== null && w !== null) siguiente.amperios = formatear(w / v)
  else if (editado !== 'voltios' && a !== null && w !== null) siguiente.voltios = formatear(w / a)

  return siguiente
}

const CAMPOS: readonly { id: Magnitud; etiqueta: string; placeholder: string }[] = [
  { id: 'voltios', etiqueta: 'Voltios (V)', placeholder: 'Ej: 13,8' },
  { id: 'amperios', etiqueta: 'Amperios (A)', placeholder: 'Ej: 2' },
  { id: 'watts', etiqueta: 'Watts (W)', placeholder: 'Ej: 27,6' },
]

const ConvertidorPotencia = () => {
  const [valores, setValores] = useState<Valores>({ voltios: '', amperios: '', watts: '' })

  const v = positivo(valores.voltios)
  const a = positivo(valores.amperios)
  const w = positivo(valores.watts)

  return (
    <CalculadoraLayout
      titulo='Calculadora de Voltios, Amperios y Watts'
      intro='Calcula la relación entre voltaje, corriente y potencia eléctrica. Ingresa dos valores y el tercero se obtiene automáticamente.'
      ancho='max-w-xl'
    >
      <Formula>P (W) = V (V) × I (A)</Formula>

      <Campo>
        {CAMPOS.map(({ id, etiqueta, placeholder }) => (
          <CampoNumero
            key={id}
            id={`potencia-${id}`}
            etiqueta={etiqueta}
            placeholder={placeholder}
            value={valores[id]}
            onChange={(valor) =>
              setValores((prev) => completarPotencia(id, { ...prev, [id]: valor }))
            }
          />
        ))}
      </Campo>

      {v !== null && a !== null && w !== null && (
        <div className={`${TARJETA} p-6`}>
          <h2 className='mb-4 text-lg font-serif font-semibold text-stone-900 dark:text-white'>
            Resultado
          </h2>
          <p className='text-center font-mono text-sm text-stone-800 dark:text-indigo-100 sm:text-base'>
            {formatear(v)} V × {formatear(a)} A = {formatear(w)} W
          </p>
        </div>
      )}

      <Ejemplo>Ejemplo: 13,8 V × 2 A = 27,6 W.</Ejemplo>
    </CalculadoraLayout>
  )
}

export default ConvertidorPotencia
