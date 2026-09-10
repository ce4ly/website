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
  formatearNumero,
  inputClass,
  labelClass,
  parseNumero
} from '../lib/calculadoras.js'

const ColinealDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 220 300"
        className="h-auto w-full"
        aria-labelledby="colineal-diagrama-titulo"
        role="img"
      >
        <title id="colineal-diagrama-titulo">
          Diagrama esquemático de antena colineal coaxial
        </title>

        {/* Segmentos S apilados */}
        <line
          x1="110"
          y1="24"
          x2="110"
          y2="78"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="110"
          y1="86"
          x2="110"
          y2="140"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="110"
          y1="148"
          x2="110"
          y2="202"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="110"
          y1="210"
          x2="110"
          y2="264"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="110" cy="24" r="4" fill="currentColor" />

        {/* Alimentación en la base */}
        <circle
          cx="110"
          cy="264"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />
        <line
          x1="104"
          y1="271"
          x2="104"
          y2="292"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="116"
          y1="271"
          x2="116"
          y2="292"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Cota T */}
        <line
          x1="48"
          y1="24"
          x2="48"
          y2="264"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="24"
          x2="52"
          y2="24"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="264"
          x2="52"
          y2="264"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="150"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          T
        </text>

        {/* Cota S (un segmento) */}
        <line
          x1="168"
          y1="86"
          x2="168"
          y2="140"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="164"
          y1="86"
          x2="172"
          y2="86"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="164"
          y1="140"
          x2="172"
          y2="140"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="182"
          y="118"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          S
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const Colineal = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [secciones, setSecciones] = useState('4')
  const [cableId, setCableId] = useState('rg58')
  const mhz = parseNumero(frecuencia)
  const n = Math.round(parseNumero(secciones) || 0)
  const cable = CABLES.find(c => c.id === cableId) || CABLES[0]
  const ok = frecuenciaValida(mhz) && n >= 2 && n <= 16
  const segmento = ok ? (cable.vf * 150) / mhz : null
  const total = ok ? n * segmento : null
  const ganancia = ok ? 10 * Math.log10(n) - 0.8 : null

  return (
    <CalculadoraLayout
      titulo="Colineal coaxial (Franklin / COCO)"
      intro="Largo de cada segmento con el factor de velocidad del coaxial, y una estimación de ganancia según el número de secciones."
    >
      <Articulo titulo="Franklin y COCO">
        <p className="text-justify">
          Varias medias ondas en fase, una sobre otra. En coaxial colineal
          (COCO) cada tramo mide λ/2 eléctrica del cable (no del aire): se
          invierte vivo y malla en cada unión para mantener la corriente en
          fase. Más secciones, más ganancia, pero también más pérdidas y un
          lóbulo más estrecho.
        </p>

        <ColinealDiagrama />

        <Formula>
          <p>S (m) = VF × 150 / f</p>
          <p>T = N × S</p>
          <p>Ganancia ≈ 10 log₁₀(N) − 0,8 dBd</p>
        </Formula>
        <Nota>
          La ganancia es orientativa y cae con coaxial delgado o muchas
          secciones. 4 a 8 tramos de RG-213 o LMR-400 son el rango útil. Un
          choque en la base evita que la bajada forme parte de la antena.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="co-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="co-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 146,380"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="co-n" className={labelClass}>
            <Cota letra="N">Número de secciones λ/2</Cota>
          </label>
          <input
            id="co-n"
            className={inputClass}
            inputMode="numeric"
            value={secciones}
            onChange={e => setSecciones(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="co-c" className={labelClass}>
            Coaxial
          </label>
          <select
            id="co-c"
            className={inputClass}
            value={cableId}
            onChange={e => setCableId(e.target.value)}
          >
            {CABLES.filter(c => c.vf <= 0.86).map(c => (
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
            etiqueta={<Cota letra="S">Cada segmento (λ/2 del coaxial)</Cota>}
            valor={formatearLongitud(segmento)}
          />
          <Fila
            etiqueta={<Cota letra="T">Largo radiador total</Cota>}
            valor={formatearLongitud(total)}
          />
          <Fila
            etiqueta="Ganancia estimada"
            valor={`${formatearNumero(ganancia, 1)} dBd`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Colineal
