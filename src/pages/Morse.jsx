import { useMemo, useRef, useState } from 'react'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Nota
} from '../components/CalculadoraLayout.jsx'
import Pestanas from '../components/Pestanas.jsx'
import { useQueryState } from '../hooks/useQueryState.js'
import {
  aciertoPorCaracter,
  grupoAleatorio,
  morseATexto,
  TABLA_MORSE,
  textoAMorse
} from '../lib/calc/morse.js'
import { reproducirMorse } from '../lib/calc/morse-audio.js'
import { inputClass, labelClass } from '../lib/calculadoras.js'
import { thClass, tdClass } from '../components/TablaReferencia.jsx'
import { meta as routeMeta } from '../lib/meta.js'
import { formatearNumero } from '../lib/calculadoras.js'

const DEFAULTS = {
  tab: 'tabla',
  texto: 'CQ CQ DE CE4LY',
  morse: '',
  tono: '600',
  ppmC: '18',
  ppmE: '12',
  set: 'letras'
}

const CONJUNTOS = {
  letras: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split(''),
  numeros: '0123456789'.split(''),
  mixto: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789'.split('')
}

export const meta = () => routeMeta({ location: '/herramientas/morse' })

const Morse = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const abortRef = useRef(null)
  const [esperado, setEsperado] = useState('')
  const [oido, setOido] = useState('')
  const [stats, setStats] = useState(null)
  const tono = Math.min(1000, Math.max(400, Number(q.tono) || 600))
  const ppmC = Number(q.ppmC) || 18
  const ppmE = Number(q.ppmE) || 12

  const reproducir = async texto => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    await reproducirMorse({
      texto,
      ppmCaracter: ppmC,
      ppmEfectivo: Math.min(ppmE, ppmC),
      frecuencia: tono,
      signal: ctrl.signal
    })
  }

  const grupos = useMemo(() => {
    const map = {}
    for (const fila of TABLA_MORSE) {
      if (!map[fila.grupo]) map[fila.grupo] = []
      map[fila.grupo].push(fila)
    }
    return map
  }, [])

  return (
    <CalculadoraLayout
      titulo="Código Morse"
      intro="Tabla ITU, traductor bidireccional, audio con envolvente suave y entrenador Farnsworth. Incluye Ñ y los prosignos AR, SK, BT y KN."
    >
      <Pestanas
        valor={q.tab}
        onChange={tab => setQ({ tab })}
        items={[
          { id: 'tabla', label: 'Tabla' },
          { id: 'traductor', label: 'Traductor' },
          { id: 'entrenador', label: 'Entrenador' }
        ]}
      />
      {q.tab === 'tabla' &&
        Object.entries(grupos).map(([grupo, filas]) => (
          <Articulo key={grupo} titulo={grupo}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className={thClass}>Símbolo</th>
                    <th className={thClass}>Morse</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map(f => (
                    <tr key={`${grupo}-${f.simbolo}`}>
                      <td className={`${tdClass} font-mono`}>{f.simbolo}</td>
                      <td className={`${tdClass} font-mono tracking-widest`}>
                        {f.codigo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Articulo>
        ))}
      {q.tab === 'traductor' && (
        <Campo>
          <div>
            <label htmlFor="morse-texto" className={labelClass}>
              Texto
            </label>
            <textarea
              id="morse-texto"
              className={inputClass}
              rows={3}
              value={q.texto}
              onChange={e =>
                setQ({
                  texto: e.target.value,
                  morse: textoAMorse(e.target.value)
                })
              }
            />
          </div>
          <div className="mt-4">
            <label htmlFor="morse-codigo" className={labelClass}>
              Morse ( / separa palabras)
            </label>
            <textarea
              id="morse-codigo"
              className={`${inputClass} font-mono`}
              rows={3}
              value={q.morse || textoAMorse(q.texto)}
              onChange={e =>
                setQ({
                  morse: e.target.value,
                  texto: morseATexto(e.target.value)
                })
              }
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="tono" className={labelClass}>
                Tono (Hz)
              </label>
              <input
                id="tono"
                className={inputClass}
                value={q.tono}
                onChange={e => setQ({ tono: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="ppmC" className={labelClass}>
                PPM carácter
              </label>
              <input
                id="ppmC"
                className={inputClass}
                value={q.ppmC}
                onChange={e => setQ({ ppmC: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="ppmE" className={labelClass}>
                PPM efectivo
              </label>
              <input
                id="ppmE"
                className={inputClass}
                value={q.ppmE}
                onChange={e => setQ({ ppmE: e.target.value })}
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-blue-950 hover:bg-stone-50 dark:border-indigo-800 dark:text-indigo-100"
            onClick={() => reproducir(q.texto)}
          >
            Reproducir
          </button>
          <Nota>
            El dit sigue el PPM de carácter; el espacio extra entre letras y
            palabras baja la velocidad efectiva (Farnsworth). Tono 400–1000 Hz.
          </Nota>
        </Campo>
      )}
      {q.tab === 'entrenador' && (
        <Campo>
          <label htmlFor="conjunto" className={labelClass}>
            Conjunto
          </label>
          <select
            id="conjunto"
            className={inputClass}
            value={q.set}
            onChange={e => setQ({ set: e.target.value })}
          >
            <option value="letras">Letras</option>
            <option value="numeros">Números</option>
            <option value="mixto">Letras y números</option>
          </select>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-blue-950 hover:bg-stone-50 dark:border-indigo-800 dark:text-indigo-100"
              onClick={async () => {
                const g = grupoAleatorio(CONJUNTOS[q.set] || CONJUNTOS.letras)
                setEsperado(g)
                setOido('')
                setStats(null)
                await reproducir(g)
              }}
            >
              Reproducir grupo
            </button>
          </div>
          <div className="mt-4">
            <label htmlFor="oido" className={labelClass}>
              Lo que oíste
            </label>
            <input
              id="oido"
              className={inputClass}
              value={oido}
              onChange={e => setOido(e.target.value.toUpperCase())}
            />
          </div>
          <button
            type="button"
            className="mt-4 rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-blue-950 hover:bg-stone-50 dark:border-indigo-800 dark:text-indigo-100"
            onClick={() => setStats(aciertoPorCaracter(esperado, oido))}
          >
            Comprobar
          </button>
          {stats && (
            <p className="mt-3 text-sm text-stone-700 dark:text-indigo-100">
              Acierto: {formatearNumero(stats.porcentaje, 0)} %. Esperado:{' '}
              <span className="font-mono">{esperado}</span>
            </p>
          )}
        </Campo>
      )}
    </CalculadoraLayout>
  )
}

export default Morse
