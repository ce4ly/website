import { useRef, useState } from 'react'

import { useQueryState } from '../../hooks/useQueryState'
import {
  TABLA_MORSE,
  aciertoPorCaracter,
  grupoAleatorio,
  morseATexto,
  textoAMorse,
  type FilaMorse,
} from '../../lib/calc/morse'
import { reproducirMorse } from '../../lib/calc/morse-audio'
import { formatearNumero } from '../../lib/calculadoras'
import CalculadoraLayout, { Articulo, Campo, Nota } from '../calculadora/CalculadoraLayout'
import { CampoNumero, Selector, inputClass, labelClass } from '../calculadora/Campos'
import Pestanas from '../calculadora/Pestanas'
import { botonSecundarioClass } from '../partials/estilos'
import { Tabla } from '../referencia/TablaReferencia'
import { tdClass } from '../referencia/estilos'

const DEFAULTS = {
  tab: 'tabla',
  texto: 'CQ CQ DE CE4LY',
  morse: '',
  tono: '600',
  ppmC: '18',
  ppmE: '12',
  set: 'letras',
}

const PESTANAS = [
  { id: 'tabla', label: 'Tabla' },
  { id: 'traductor', label: 'Traductor' },
  { id: 'entrenador', label: 'Entrenador' },
] as const

const CONJUNTOS = {
  letras: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
  numeros: '0123456789',
  mixto: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789',
} as const

type Conjunto = keyof typeof CONJUNTOS

const OPCIONES_CONJUNTO: readonly { value: Conjunto; label: string }[] = [
  { value: 'letras', label: 'Letras' },
  { value: 'numeros', label: 'Números' },
  { value: 'mixto', label: 'Letras y números' },
]

const esConjunto = (valor: string): valor is Conjunto => valor in CONJUNTOS

/** Filas de la tabla agrupadas (letras, números, signos, prosignos), en orden de aparición. */
const GRUPOS = (() => {
  const grupos = new Map<FilaMorse['grupo'], FilaMorse[]>()
  for (const fila of TABLA_MORSE) {
    grupos.set(fila.grupo, [...(grupos.get(fila.grupo) ?? []), fila])
  }
  return [...grupos]
})()

const TablaMorse = () =>
  GRUPOS.map(([grupo, filas]) => {
    const conSignificado = filas.some((f) => f.significado)
    const columnas = conSignificado ? ['Símbolo', 'Morse', 'Significado'] : ['Símbolo', 'Morse']
    return (
      <Articulo key={grupo} titulo={grupo}>
        <div className='overflow-x-auto'>
          <Tabla columnas={columnas}>
            {filas.map((f) => (
              <tr key={`${grupo}-${f.simbolo}`}>
                <td className={`${tdClass} font-mono font-bold text-stone-900 dark:text-white`}>
                  {f.simbolo}
                </td>
                <td className={`${tdClass} font-mono tracking-widest`}>{f.codigo}</td>
                {conSignificado && <td className={tdClass}>{f.significado ?? '—'}</td>}
              </tr>
            ))}
          </Tabla>
        </div>
      </Articulo>
    )
  })

const Morse = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const abortRef = useRef<AbortController | null>(null)
  const [esperado, setEsperado] = useState('')
  const [oido, setOido] = useState('')
  const [acierto, setAcierto] = useState<number | null>(null)
  const tono = Math.min(1000, Math.max(400, Number(q.tono) || 600))
  const ppmC = Number(q.ppmC) || 18
  const ppmE = Number(q.ppmE) || 12
  const conjunto: Conjunto = esConjunto(q.set) ? q.set : 'letras'

  /** Corta lo que esté sonando y reproduce `texto`. */
  const reproducir = async (texto: string) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    await reproducirMorse({
      texto,
      ppmCaracter: ppmC,
      ppmEfectivo: Math.min(ppmE, ppmC),
      frecuencia: tono,
      signal: ctrl.signal,
    })
  }

  const nuevoGrupo = async () => {
    const grupo = grupoAleatorio(CONJUNTOS[conjunto])
    setEsperado(grupo)
    setOido('')
    setAcierto(null)
    await reproducir(grupo)
  }

  return (
    <CalculadoraLayout
      titulo='Código Morse'
      intro='Tabla ITU, traductor bidireccional, audio con envolvente suave y entrenador Farnsworth. Incluye Ñ y los prosignos AR, SK, BT y KN.'
    >
      <Pestanas valor={q.tab} onChange={(tab) => setQ({ tab })} items={PESTANAS} />
      {q.tab === 'tabla' && <TablaMorse />}
      {q.tab === 'traductor' && (
        <Campo>
          <div>
            <label htmlFor='morse-texto' className={labelClass}>
              Texto
            </label>
            <textarea
              id='morse-texto'
              className={inputClass}
              rows={3}
              value={q.texto}
              onChange={(e) => setQ({ texto: e.target.value, morse: textoAMorse(e.target.value) })}
            />
          </div>
          <div className='mt-4'>
            <label htmlFor='morse-codigo' className={labelClass}>
              Morse ( / separa palabras)
            </label>
            <textarea
              id='morse-codigo'
              className={`${inputClass} font-mono`}
              rows={3}
              value={q.morse || textoAMorse(q.texto)}
              onChange={(e) => setQ({ morse: e.target.value, texto: morseATexto(e.target.value) })}
            />
          </div>
          <div className='mt-4 grid gap-4 sm:grid-cols-3'>
            <CampoNumero
              id='tono'
              etiqueta='Tono (Hz)'
              value={q.tono}
              onChange={(tono) => setQ({ tono })}
            />
            <CampoNumero
              id='ppmC'
              etiqueta='PPM carácter'
              value={q.ppmC}
              onChange={(ppmC) => setQ({ ppmC })}
            />
            <CampoNumero
              id='ppmE'
              etiqueta='PPM efectivo'
              value={q.ppmE}
              onChange={(ppmE) => setQ({ ppmE })}
            />
          </div>
          <button
            type='button'
            className={`mt-4 ${botonSecundarioClass}`}
            onClick={() => void reproducir(q.texto)}
          >
            Reproducir
          </button>
          <Nota>
            El dit sigue el PPM de carácter; el espacio extra entre letras y palabras baja la
            velocidad efectiva (Farnsworth). Tono 400–1000 Hz.
          </Nota>
        </Campo>
      )}
      {q.tab === 'entrenador' && (
        <Campo>
          <Selector
            id='conjunto'
            etiqueta='Conjunto'
            value={conjunto}
            onChange={(set) => setQ({ set })}
            opciones={OPCIONES_CONJUNTO}
          />
          <div className='mt-4 flex flex-wrap gap-2'>
            <button
              type='button'
              className={botonSecundarioClass}
              onClick={() => void nuevoGrupo()}
            >
              Reproducir grupo
            </button>
          </div>
          <div className='mt-4'>
            <label htmlFor='oido' className={labelClass}>
              Lo que oíste
            </label>
            <input
              id='oido'
              className={inputClass}
              value={oido}
              onChange={(e) => setOido(e.target.value.toUpperCase())}
            />
          </div>
          <button
            type='button'
            className={`mt-4 ${botonSecundarioClass}`}
            onClick={() => setAcierto(aciertoPorCaracter(esperado, oido).porcentaje)}
          >
            Comprobar
          </button>
          {acierto !== null && (
            <p className='mt-3 text-sm text-stone-700 dark:text-indigo-100'>
              Acierto: {formatearNumero(acierto, 0)} %. Esperado:{' '}
              <span className='font-mono'>{esperado}</span>
            </p>
          )}
        </Campo>
      )}
    </CalculadoraLayout>
  )
}

export default Morse
