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
  LARGO_MEDIA_ONDA,
  parseNumero
} from '../lib/calculadoras.js'

const TurnstileDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 360 280"
        className="h-auto w-full"
        aria-labelledby="turnstile-diagrama-titulo"
        role="img"
      >
        <title id="turnstile-diagrama-titulo">
          Diagrama esquemático de antena turnstile y eggbeater
        </title>

        {/* Loop eggbeater P */}
        <circle
          cx="292"
          cy="148"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <text
          x="292"
          y="154"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          P
        </text>

        {/* Dipolo horizontal */}
        <line
          x1="28"
          y1="148"
          x2="112"
          y2="148"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="136"
          y1="148"
          x2="220"
          y2="148"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="28" cy="148" r="4" fill="currentColor" />
        <circle cx="220" cy="148" r="4" fill="currentColor" />

        {/* Dipolo vertical */}
        <line
          x1="124"
          y1="36"
          x2="124"
          y2="120"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="124"
          y1="176"
          x2="124"
          y2="260"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="124" cy="36" r="4" fill="currentColor" />
        <circle cx="124" cy="260" r="4" fill="currentColor" />

        {/* Alimentación / cruce */}
        <circle
          cx="124"
          cy="148"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Línea de 90° F */}
        <line
          x1="136"
          y1="160"
          x2="168"
          y2="188"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="162"
          y1="188"
          x2="174"
          y2="188"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="180"
          y="192"
          textAnchor="start"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          F
        </text>

        {/* Cota D (dipolo horizontal completo) */}
        <line
          x1="28"
          y1="20"
          x2="220"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="28"
          y1="16"
          x2="28"
          y2="24"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="220"
          y1="16"
          x2="220"
          y2="24"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="124"
          y="14"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          D
        </text>

        {/* Cota L (un brazo) */}
        <line
          x1="28"
          y1="172"
          x2="112"
          y2="172"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="28"
          y1="168"
          x2="28"
          y2="176"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="112"
          y1="168"
          x2="112"
          y2="176"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="70"
          y="188"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>
      </svg>
      <PieDiagrama>
        Vista de planta (no a escala). Las letras coinciden con las medidas.
      </PieDiagrama>
    </figure>
  )
}

const Turnstile = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [cableId, setCableId] = useState('rg59')
  const mhz = parseNumero(frecuencia)
  const cable = CABLES.find(c => c.id === cableId) || CABLES[4]
  const ok = frecuenciaValida(mhz)
  const dipolo = ok ? LARGO_MEDIA_ONDA / mhz : null
  const brazo = ok ? dipolo / 2 : null
  const loop = ok ? 306.3 / mhz : null
  const fase = ok ? (cable.vf * 75) / mhz : null

  return (
    <CalculadoraLayout
      titulo="Turnstile / Eggbeater"
      intro="Dos dipolos (turnstile) o dos loops (eggbeater) en cuadratura, para polarización circular en satélites."
    >
      <Articulo titulo="Polarización circular">
        <p className="text-justify">
          El turnstile cruza dos dipolos a 90° y los desfasá 90° con un tramo de
          coaxial de cuarto de onda. El eggbeater hace lo mismo con dos loops de
          onda completa, más robusto y con buen cielo hacia el cénit: ideal para
          LEO en 2 m y 70 cm.
        </p>

        <TurnstileDiagrama />

        <Formula>
          <p>D ≈ 142,5 / f &nbsp;&nbsp; L = D / 2</p>
          <p>P ≈ 306 / f</p>
          <p>F = VF × 75 / f</p>
        </Formula>
        <Nota>
          Un extremo del tramo de 90° va a un elemento; el otro, al segundo y al
          coaxial de 50 Ω (a veces con T de 75 Ω). El sentido RHCP/LHCP se
          invierte cruzando las conexiones.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="tu-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="tu-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 146,380"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tu-c" className={labelClass}>
            <Cota letra="F">Coaxial del desfase 90°</Cota>
          </label>
          <select
            id="tu-c"
            className={inputClass}
            value={cableId}
            onChange={e => setCableId(e.target.value)}
          >
            {CABLES.filter(c =>
              ['rg59', 'rg11', 'rg58', 'lmr400'].includes(c.id)
            ).map(c => (
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
            etiqueta={<Cota letra="D">Cada dipolo del turnstile</Cota>}
            valor={formatearLongitud(dipolo)}
          />
          <Fila
            etiqueta={<Cota letra="L">Cada brazo del dipolo</Cota>}
            valor={formatearLongitud(brazo)}
          />
          <Fila
            etiqueta={<Cota letra="P">Perímetro de cada loop eggbeater</Cota>}
            valor={formatearLongitud(loop)}
          />
          <Fila
            etiqueta={<Cota letra="F">{`Línea de 90° (${cable.nombre})`}</Cota>}
            valor={formatearLongitud(fase)}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Turnstile
