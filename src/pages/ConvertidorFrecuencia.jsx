import { useState } from 'react'

const VELOCIDAD_LUZ = 300

const BANDAS = [
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
  { nombre: '70 cm', min: 430.0, max: 440.0 }
]

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

const labelClass =
  'block text-sm font-medium text-stone-800 dark:text-indigo-100'

const obtenerBanda = frecuenciaMhz => {
  const banda = BANDAS.find(
    b => frecuenciaMhz >= b.min && frecuenciaMhz <= b.max
  )
  return banda ? banda.nombre : null
}

const formatearNumero = valor => {
  if (valor === null || Number.isNaN(valor)) return null
  return valor.toLocaleString('es-CL', { maximumFractionDigits: 4 })
}

const ConvertidorFrecuencia = () => {
  const [mhz, setMhz] = useState('')
  const [metros, setMetros] = useState('')

  const frecuenciaMhz = mhz !== '' ? parseFloat(mhz.replace(',', '.')) : null
  const longitudMetros =
    metros !== '' ? parseFloat(metros.replace(',', '.')) : null

  const longitudDesdeMhz =
    frecuenciaMhz > 0 ? VELOCIDAD_LUZ / frecuenciaMhz : null
  const frecuenciaDesdeMetros =
    longitudMetros > 0 ? VELOCIDAD_LUZ / longitudMetros : null

  const bandaDetectada = frecuenciaMhz > 0 ? obtenerBanda(frecuenciaMhz) : null

  const handleMhzChange = e => {
    const valor = e.target.value
    setMhz(valor)
    const num = parseFloat(valor.replace(',', '.'))
    if (valor === '' || Number.isNaN(num) || num <= 0) {
      setMetros('')
    } else {
      setMetros((VELOCIDAD_LUZ / num).toFixed(4))
    }
  }

  const handleMetrosChange = e => {
    const valor = e.target.value
    setMetros(valor)
    const num = parseFloat(valor.replace(',', '.'))
    if (valor === '' || Number.isNaN(num) || num <= 0) {
      setMhz('')
    } else {
      setMhz((VELOCIDAD_LUZ / num).toFixed(4))
    }
  }

  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Convertidor de Frecuencia y Longitud de Onda
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Convierte entre frecuencia (MHz) y longitud de onda (metros) usando la
          relación λ = 300 / f, donde 300 es la velocidad de la luz aproximada
          en millones de metros por segundo.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-5 rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div>
            <label htmlFor="frecuencia-mhz" className={labelClass}>
              Frecuencia (MHz)
            </label>
            <input
              id="frecuencia-mhz"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 433,100"
              value={mhz}
              onChange={handleMhzChange}
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-center text-stone-400 dark:text-indigo-500">
            <span className="text-sm font-medium">⇅</span>
          </div>

          <div>
            <label htmlFor="longitud-metros" className={labelClass}>
              Longitud de onda (metros)
            </label>
            <input
              id="longitud-metros"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 0,693"
              value={metros}
              onChange={handleMetrosChange}
              className={inputClass}
            />
          </div>
        </div>

        {(frecuenciaMhz > 0 || longitudMetros > 0) && (
          <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
            <h2 className="mb-4 text-lg font-serif font-semibold text-stone-900 dark:text-white">
              Resultado
            </h2>
            <dl className="space-y-3 text-sm">
              {frecuenciaMhz > 0 && (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-600 dark:text-indigo-300">
                      Frecuencia
                    </dt>
                    <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                      {formatearNumero(frecuenciaMhz)} MHz
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-600 dark:text-indigo-300">
                      Longitud de onda
                    </dt>
                    <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                      {formatearNumero(longitudDesdeMhz)} m
                    </dd>
                  </div>
                </>
              )}
              {frecuenciaDesdeMetros > 0 && frecuenciaMhz <= 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-600 dark:text-indigo-300">
                    Frecuencia equivalente
                  </dt>
                  <dd className="font-mono font-semibold text-stone-900 dark:text-white">
                    {formatearNumero(frecuenciaDesdeMetros)} MHz
                  </dd>
                </div>
              )}
              {bandaDetectada && (
                <div className="flex justify-between gap-4 border-t border-stone-200 pt-3 dark:border-indigo-900">
                  <dt className="text-stone-600 dark:text-indigo-300">
                    Banda radioaficionada
                  </dt>
                  <dd className="font-mono font-semibold text-blue-950 dark:text-indigo-200">
                    {bandaDetectada}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <p className="text-center text-xs text-stone-500 dark:text-indigo-300/80">
          Ejemplo: 433,100 MHz ≈ 0,69 m (banda de 70 cm).
        </p>
      </div>
    </section>
  )
}

export default ConvertidorFrecuencia
