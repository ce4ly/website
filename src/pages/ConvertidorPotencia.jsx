import { useState } from 'react'

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

const labelClass =
  'block text-sm font-medium text-stone-800 dark:text-indigo-100'

const parseValor = texto => {
  if (texto === '') return null
  const num = parseFloat(texto.replace(',', '.'))
  if (Number.isNaN(num) || num <= 0) return null
  return num
}

const formatear = valor => {
  return valor.toLocaleString('es-CL', { maximumFractionDigits: 4 })
}

const calcularTercero = (campoEditado, voltios, amperios, watts) => {
  const v = parseValor(voltios)
  const a = parseValor(amperios)
  const w = parseValor(watts)

  let nuevoVoltios = voltios
  let nuevoAmperios = amperios
  let nuevoWatts = watts

  if (campoEditado === 'voltios') {
    if (v !== null && a !== null) nuevoWatts = formatear(v * a)
    else if (v !== null && w !== null) nuevoAmperios = formatear(w / v)
  } else if (campoEditado === 'amperios') {
    if (v !== null && a !== null) nuevoWatts = formatear(v * a)
    else if (a !== null && w !== null) nuevoVoltios = formatear(w / a)
  } else if (campoEditado === 'watts') {
    if (v !== null && w !== null) nuevoAmperios = formatear(w / v)
    else if (a !== null && w !== null) nuevoVoltios = formatear(w / a)
  }

  return { voltios: nuevoVoltios, amperios: nuevoAmperios, watts: nuevoWatts }
}

const Potencia = () => {
  const [voltios, setVoltios] = useState('')
  const [amperios, setAmperios] = useState('')
  const [watts, setWatts] = useState('')

  const handleChange = (campo, valor) => {
    const base = {
      voltios: campo === 'voltios' ? valor : voltios,
      amperios: campo === 'amperios' ? valor : amperios,
      watts: campo === 'watts' ? valor : watts
    }
    const resultado = calcularTercero(
      campo,
      base.voltios,
      base.amperios,
      base.watts
    )
    setVoltios(resultado.voltios)
    setAmperios(resultado.amperios)
    setWatts(resultado.watts)
  }

  const v = parseValor(voltios)
  const a = parseValor(amperios)
  const w = parseValor(watts)
  const hayResultado = v !== null && a !== null && w !== null

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Calculadora de Voltios, Amperios y Watts
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Calcula la relación entre voltaje, corriente y potencia eléctrica.
          Ingresa dos valores y el tercero se obtiene automáticamente.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-6">
        <div className="rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-sm text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100">
          P (W) = V (V) × I (A)
        </div>

        <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div>
            <label htmlFor="potencia-voltios" className={labelClass}>
              Voltios (V)
            </label>
            <input
              id="potencia-voltios"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 13,8"
              value={voltios}
              onChange={e => handleChange('voltios', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="potencia-amperios" className={labelClass}>
              Amperios (A)
            </label>
            <input
              id="potencia-amperios"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 2"
              value={amperios}
              onChange={e => handleChange('amperios', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="potencia-watts" className={labelClass}>
              Watts (W)
            </label>
            <input
              id="potencia-watts"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 27,6"
              value={watts}
              onChange={e => handleChange('watts', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {hayResultado && (
          <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
            <h2 className="mb-4 text-lg font-serif font-semibold text-stone-900 dark:text-white">
              Resultado
            </h2>
            <p className="text-center font-mono text-sm text-stone-800 dark:text-indigo-100 sm:text-base">
              {formatear(v)} V × {formatear(a)} A = {formatear(w)} W
            </p>
          </div>
        )}

        <p className="text-center text-xs text-stone-500 dark:text-indigo-300/80">
          Ejemplo: 13,8 V × 2 A = 27,6 W.
        </p>
      </div>
    </section>
  )
}

export default Potencia
