import { useState } from 'react'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Cota,
  Fila,
  Formula,
  Nota,
  PieDiagrama,
  Resultado
} from '../components/CalculadoraLayout.jsx'
import {
  disenarYagiDl6wu,
  frecuenciaValida,
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const YagiDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 224"
        className="h-auto w-full"
        aria-labelledby="yagi-diagrama-titulo"
        role="img"
      >
        <title id="yagi-diagrama-titulo">
          Diagrama esquemático de yagi de 3 elementos
        </title>

        {/* Boom B */}
        <line
          x1="48"
          y1="108"
          x2="292"
          y2="108"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Reflector R */}
        <line
          x1="60"
          y1="36"
          x2="60"
          y2="180"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <text
          x="60"
          y="28"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          R
        </text>

        {/* Excitado E */}
        <line
          x1="160"
          y1="48"
          x2="160"
          y2="168"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          cx="160"
          cy="108"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />
        <text
          x="160"
          y="40"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          E
        </text>

        {/* Director Dir */}
        <line
          x1="280"
          y1="58"
          x2="280"
          y2="158"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <text
          x="280"
          y="50"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Dir
        </text>

        {/* Cota B */}
        <line
          x1="60"
          y1="16"
          x2="280"
          y2="16"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="60"
          y1="12"
          x2="60"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="280"
          y1="12"
          x2="280"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="170"
          y="12"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          B
        </text>

        {/* Cota s1 */}
        <line
          x1="60"
          y1="196"
          x2="160"
          y2="196"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="60"
          y1="192"
          x2="60"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="160"
          y1="192"
          x2="160"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="110"
          y="210"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          s1
        </text>

        {/* Cota s2 */}
        <line
          x1="160"
          y1="196"
          x2="280"
          y2="196"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="160"
          y1="192"
          x2="160"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="280"
          y1="192"
          x2="280"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="220"
          y="210"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          s2
        </text>
      </svg>
      <PieDiagrama>
        Vista de lado (no a escala). Las letras coinciden con las medidas.
      </PieDiagrama>
    </figure>
  )
}

const Yagi = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [modo, setModo] = useState('hf')
  const [elementos, setElementos] = useState('3')
  const [diametro, setDiametro] = useState('12')
  const mhz = parseNumero(frecuencia)
  const n = Math.round(parseNumero(elementos) || 0)
  const d = parseNumero(diametro)
  const lambda = frecuenciaValida(mhz) ? 300 / mhz : null

  const hfOk = modo === 'hf' && frecuenciaValida(mhz) && (n === 2 || n === 3)
  const vhfOk =
    modo === 'vhf' && frecuenciaValida(mhz) && n >= 8 && n <= 40 && d > 0

  const dl6 = vhfOk
    ? disenarYagiDl6wu({ mhz, elementos: n, diametroMm: d })
    : null

  return (
    <CalculadoraLayout
      titulo="Calculadora Yagi"
      intro="HF de 2 o 3 elementos con espaciado clásico, o VHF/UHF larga según DL6WU (elementos y espacios escalables)."
    >
      <Articulo titulo="Dos recetas">
        <p className="text-justify">
          En HF una yagi de 2–3 elementos cabe en un techo y ya da ganancia y
          relación frente/espalda. En VHF/UHF las yagis largas de Günter Hoch
          (DL6WU) usan espacios que crecen hasta 0,40 λ y largos que se acortan
          a lo largo del boom: buena ganancia y ancho de banda.
        </p>

        <YagiDiagrama />

        <Formula>
          <p>HF: R ≈ 0,50 λ &nbsp; E ≈ 0,475 λ &nbsp; Dir ≈ 0,45 λ</p>
          <p>s1 = 0,20 λ &nbsp; s2 = 0,15 λ &nbsp; B = s1 + s2</p>
          <p>DL6WU: s1 = 0,20 λ; primer Dir a 0,075 λ</p>
        </Formula>
        <Nota>
          DL6WU brilla a partir de ~10 elementos (boom ≥ 2 λ). Sin corrección de
          boom metálico: si los elementos atraviesan y se unen al boom,
          alárguelos según el diámetro del tubo. El DE está 2 % más largo para
          dipolo plegado.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="ya-m" className={labelClass}>
            Tipo
          </label>
          <select
            id="ya-m"
            className={inputClass}
            value={modo}
            onChange={e => {
              setModo(e.target.value)
              setElementos(e.target.value === 'hf' ? '3' : '10')
              setDiametro(e.target.value === 'hf' ? '12' : '8')
            }}
          >
            <option value="hf">HF — 2 o 3 elementos</option>
            <option value="vhf">VHF/UHF — DL6WU</option>
          </select>
        </div>
        <div>
          <label htmlFor="ya-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="ya-f"
            className={inputClass}
            inputMode="decimal"
            placeholder={modo === 'hf' ? 'Ej: 7,148' : 'Ej: 146,380'}
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ya-n" className={labelClass}>
            <Cota letra="N">Número de elementos</Cota>
          </label>
          <input
            id="ya-n"
            className={inputClass}
            inputMode="numeric"
            value={elementos}
            onChange={e => setElementos(e.target.value)}
          />
        </div>
        {modo === 'vhf' && (
          <div>
            <label htmlFor="ya-d" className={labelClass}>
              <Cota letra="d">Diámetro de parásitos (mm)</Cota>
            </label>
            <input
              id="ya-d"
              className={inputClass}
              inputMode="decimal"
              value={diametro}
              onChange={e => setDiametro(e.target.value)}
            />
          </div>
        )}
      </Campo>

      {hfOk && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="λ">Longitud de onda</Cota>}
            valor={formatearLongitud(lambda)}
          />
          <Fila
            etiqueta={<Cota letra="R">Reflector</Cota>}
            valor={formatearLongitud(0.5 * lambda)}
          />
          <Fila
            etiqueta={<Cota letra="E">Excitado</Cota>}
            valor={formatearLongitud(0.475 * lambda)}
          />
          {n === 3 && (
            <Fila
              etiqueta={<Cota letra="Dir">Director</Cota>}
              valor={formatearLongitud(0.45 * lambda)}
            />
          )}
          <Fila
            etiqueta={<Cota letra="s1">Espacio reflector–excitado</Cota>}
            valor={formatearLongitud(0.2 * lambda)}
          />
          {n === 3 && (
            <Fila
              etiqueta={<Cota letra="s2">Espacio excitado–director</Cota>}
              valor={formatearLongitud(0.15 * lambda)}
            />
          )}
          <Fila
            etiqueta={<Cota letra="B">Boom</Cota>}
            valor={formatearLongitud((n === 2 ? 0.2 : 0.35) * lambda)}
            resaltar
          />
        </Resultado>
      )}

      {vhfOk && dl6 && (
        <Resultado>
          <Fila
            etiqueta="Ganancia estimada"
            valor={`${formatearNumero(dl6.ganancia, 1)} dBd`}
          />
          <Fila
            etiqueta={<Cota letra="B">Boom eléctrico</Cota>}
            valor={formatearLongitud(dl6.boom)}
          />
          <Fila
            etiqueta={<Cota letra="R">Reflector (pos. 0)</Cota>}
            valor={formatearLongitud(dl6.reflector)}
          />
          <Fila
            etiqueta={
              <Cota letra="E">{`Excitado (pos. ${formatearLongitud(dl6.reflectorEspacio)})`}</Cota>
            }
            valor={formatearLongitud(dl6.driven)}
          />
          {dl6.dirs.map(el => (
            <Fila
              key={el.nombre}
              etiqueta={
                <Cota letra="Dir">{`${el.nombre} (pos. ${formatearLongitud(el.posicion)})`}</Cota>
              }
              valor={formatearLongitud(el.largo)}
            />
          ))}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Yagi
