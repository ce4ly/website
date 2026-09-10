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
  CABLES,
  frecuenciaValida,
  formatearLongitud,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const LoopDeltaDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 360 250"
        className="h-auto w-full"
        aria-labelledby="loopdelta-diagrama-titulo"
        role="img"
      >
        <title id="loopdelta-diagrama-titulo">
          Diagrama esquemático de loop delta y cuadro de onda completa
        </title>

        {/* Cota P alrededor del delta */}
        <polyline
          points="100,16 8,176 192,176 100,16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="100"
          y="12"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          P
        </text>

        {/* Triángulo delta */}
        <polygon
          points="100,36 28,168 172,168"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Alimentación en el lado inferior */}
        <circle
          cx="100"
          cy="168"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Cota a */}
        <line
          x1="28"
          y1="196"
          x2="172"
          y2="196"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="28"
          y1="192"
          x2="28"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="172"
          y1="192"
          x2="172"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="100"
          y="214"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          a
        </text>

        {/* Línea Q */}
        <line
          x1="94"
          y1="174"
          x2="94"
          y2="236"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="106"
          y1="174"
          x2="106"
          y2="236"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="118"
          y="232"
          textAnchor="start"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          Q
        </text>

        {/* Cuadro */}
        <rect
          x="230"
          y="70"
          width="88"
          height="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Cota c */}
        <line
          x1="334"
          y1="70"
          x2="334"
          y2="158"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="330"
          y1="70"
          x2="338"
          y2="70"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="330"
          y1="158"
          x2="338"
          y2="158"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="348"
          y="118"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          c
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const LoopDelta = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [cableId, setCableId] = useState('rg59')
  const mhz = parseNumero(frecuencia)
  const ok = frecuenciaValida(mhz)
  const perimetro = ok ? 306.3 / mhz : null
  const ladoCuadro = ok ? perimetro / 4 : null
  const ladoDelta = ok ? perimetro / 3 : null
  const cable = CABLES.find(c => c.id === cableId) || CABLES[4]
  const qLinea = ok ? (cable.vf * 75) / mhz : null

  return (
    <CalculadoraLayout
      titulo="Loop Delta / Cuadro de Onda Completa"
      intro="Perímetro, lados, punto de alimentación según polarización y tramo de λ/4 de 75 Ω para adaptar a 50 Ω."
    >
      <Articulo titulo="Cuadro y delta">
        <p className="text-justify">
          Un loop de una longitud de onda tiene unos 100–120 Ω. Un cuarto de
          onda de coaxial de 75 Ω (línea Q) adapta eso a 50 Ω porque Zq = √(112
          × 50) ≈ 75 Ω. El cuadro es cuadrado; el delta, triangular.
        </p>
        <p className="text-justify">
          Alimentación en el centro del lado inferior: polarización horizontal.
          En un vértice lateral o a un tercio de un lado vertical: aparece
          componente vertical, útil en DX.
        </p>

        <LoopDeltaDiagrama />

        <Formula>
          <p>P (m) ≈ 306 / f</p>
          <p>a = P / 3 &nbsp;&nbsp; c = P / 4</p>
          <p>Q (m) = VF × 75 / f</p>
        </Formula>
        <Nota>
          306/f equivale a 1005/f en pies. Dentro de PVC o cerca de tejados
          recorte un 1–3 %.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="loop-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="loop-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="loop-c" className={labelClass}>
            <Cota letra="Q">Coaxial de 75 Ω para la línea Q</Cota>
          </label>
          <select
            id="loop-c"
            className={inputClass}
            value={cableId}
            onChange={e => setCableId(e.target.value)}
          >
            {CABLES.filter(c => c.id === 'rg59' || c.id === 'rg11').map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} (VF {c.vf})
              </option>
            ))}
          </select>
        </div>
      </Campo>

      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="P">Perímetro</Cota>}
            valor={formatearLongitud(perimetro)}
          />
          <Fila
            etiqueta={<Cota letra="a">Lado del delta</Cota>}
            valor={formatearLongitud(ladoDelta)}
          />
          <Fila
            etiqueta={<Cota letra="c">Lado del cuadro</Cota>}
            valor={formatearLongitud(ladoCuadro)}
          />
          <Fila
            etiqueta={<Cota letra="Q">Línea Q λ/4 ({cable.nombre})</Cota>}
            valor={formatearLongitud(qLinea)}
          />
          <Fila
            etiqueta="Alimentación horizontal"
            valor="Centro del lado inferior"
            resaltar
          />
          <Fila
            etiqueta="Alimentación más vertical"
            valor="Vértice o lado vertical"
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default LoopDelta
