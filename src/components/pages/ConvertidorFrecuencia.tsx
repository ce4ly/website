import { useState } from 'react'

import { VELOCIDAD_LUZ, esPositivo, parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, {
  Campo,
  Ejemplo,
  Fila,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero } from '../calculadora/Campos'

/** Bandas de radioaficionado (MHz) para indicar en cuál cae la frecuencia. */
const BANDAS: readonly { nombre: string; min: number; max: number }[] = [
  { nombre: '160 m', min: 1.8, max: 2.0 },
  { nombre: '80 m', min: 3.5, max: 4.0 },
  { nombre: '40 m', min: 7.0, max: 7.3 },
  { nombre: '30 m', min: 10.1, max: 10.15 },
  { nombre: '20 m', min: 14.0, max: 14.35 },
  { nombre: '17 m', min: 18.068, max: 18.168 },
  { nombre: '15 m', min: 21.0, max: 21.45 },
  { nombre: '12 m', min: 24.89, max: 24.99 },
  { nombre: '10 m', min: 28.0, max: 29.7 },
  { nombre: '6 m', min: 50.0, max: 54.0 },
  { nombre: '2 m', min: 144.0, max: 148.0 },
  { nombre: '1¼ m', min: 220.0, max: 225.0 },
  { nombre: '70 cm', min: 430.0, max: 440.0 },
]

const bandaDe = (mhz: number) => BANDAS.find((b) => mhz >= b.min && mhz <= b.max)?.nombre

const formatear = (valor: number) => valor.toLocaleString('es-CL', { maximumFractionDigits: 4 })

/** f ↔ λ con λ = 300 / f; `''` si el texto no es un número positivo. */
const convertir = (texto: string) => {
  const num = parseNumero(texto)
  return esPositivo(num) ? (VELOCIDAD_LUZ / num).toFixed(4) : ''
}

const ConvertidorFrecuencia = () => {
  const [mhz, setMhz] = useState('')
  const [metros, setMetros] = useState('')

  const frecuencia = parseNumero(mhz)
  const longitud = parseNumero(metros)
  const banda = esPositivo(frecuencia) ? bandaDe(frecuencia) : undefined

  return (
    <CalculadoraLayout
      titulo='Convertidor de Frecuencia y Longitud de Onda'
      intro='Convierte entre frecuencia (MHz) y longitud de onda (metros) usando la relación λ = 300 / f, donde 300 es la velocidad de la luz aproximada en millones de metros por segundo.'
      ancho='max-w-xl'
    >
      <Campo>
        <CampoNumero
          id='frecuencia-mhz'
          etiqueta='Frecuencia (MHz)'
          placeholder='Ej: 433,100'
          value={mhz}
          onChange={(valor) => {
            setMhz(valor)
            setMetros(convertir(valor))
          }}
        />
        <div className='flex items-center justify-center text-stone-400 dark:text-indigo-500'>
          <span className='text-sm font-medium'>⇅</span>
        </div>
        <CampoNumero
          id='longitud-metros'
          etiqueta='Longitud de onda (metros)'
          placeholder='Ej: 0,693'
          value={metros}
          onChange={(valor) => {
            setMetros(valor)
            setMhz(convertir(valor))
          }}
        />
      </Campo>

      {(esPositivo(frecuencia) || esPositivo(longitud)) && (
        <Resultado titulo='Resultado'>
          {esPositivo(frecuencia) ? (
            <>
              <Fila etiqueta='Frecuencia' valor={`${formatear(frecuencia)} MHz`} />
              <Fila
                etiqueta='Longitud de onda'
                valor={`${formatear(VELOCIDAD_LUZ / frecuencia)} m`}
              />
            </>
          ) : (
            esPositivo(longitud) && (
              <Fila
                etiqueta='Frecuencia equivalente'
                valor={`${formatear(VELOCIDAD_LUZ / longitud)} MHz`}
              />
            )
          )}
          {banda && (
            <Fila
              etiqueta='Banda radioaficionada'
              valor={banda}
              resaltar
              claseValor='font-mono font-semibold text-blue-950 dark:text-indigo-200'
            />
          )}
        </Resultado>
      )}

      <Ejemplo>Ejemplo: 433,100 MHz ≈ 0,69 m (banda de 70 cm).</Ejemplo>
    </CalculadoraLayout>
  )
}

export default ConvertidorFrecuencia
