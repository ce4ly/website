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
  frecuenciaValida,
  formatearLongitud,
  formatearNumero,
  inputClass,
  labelClass,
  loopMagneticoAa5tb,
  parseNumero
} from '../lib/calculadoras.js'

const LoopMagneticoDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 260 280"
        className="h-auto w-full"
        aria-labelledby="stl-diagrama-titulo"
        role="img"
      >
        <title id="stl-diagrama-titulo">
          Diagrama esquemático de loop magnético con capacitor
        </title>

        {/* Loop con gap en la base */}
        <path
          d="M 96.2 190.5 A 80 80 0 1 1 163.8 190.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Cota D (diámetro) */}
        <line
          x1="50"
          y1="118"
          x2="210"
          y2="118"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="50"
          y1="114"
          x2="50"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="210"
          y1="114"
          x2="210"
          y2="122"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="130"
          y="112"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          D
        </text>

        {/* Cota P en el arco */}
        <text
          x="36"
          y="80"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          P
        </text>

        {/* Cota d (diámetro del tubo), radial en el arco */}
        <line
          x1="184.8"
          y1="63.2"
          x2="188.3"
          y2="59.7"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="182.5"
          y1="61.5"
          x2="187"
          y2="66"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="186.1"
          y1="57.4"
          x2="190.6"
          y2="61.9"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="204"
          y="52"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          d
        </text>

        {/* Placas del capacitor C */}
        <line
          x1="90"
          y1="194"
          x2="90"
          y2="226"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="170"
          y1="194"
          x2="170"
          y2="226"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text
          x="130"
          y="250"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          C
        </text>

        {/* Alimentación */}
        <circle
          cx="130"
          cy="210"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const LoopMagnetico = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('1')
  const [tubo, setTubo] = useState('22')
  const [potencia, setPotencia] = useState('100')

  const mhz = parseNumero(frecuencia)
  const dLoop = parseNumero(diametro)
  const dTubo = parseNumero(tubo)
  const p = parseNumero(potencia)
  const ok = frecuenciaValida(mhz) && dLoop > 0.1 && dTubo > 0 && p > 0

  const r =
    ok &&
    loopMagneticoAa5tb({
      mhz,
      diametroLoopM: dLoop,
      diametroConductorMm: dTubo,
      potenciaW: p
    })

  const circ = ok ? Math.PI * dLoop : null
  const lambda = ok ? 300 / mhz : null
  const frac = ok ? circ / lambda : null

  return (
    <CalculadoraLayout
      titulo="Loop magnético (STL)"
      intro="Capacidad de resonancia, Q, eficiencia, ancho de banda, corriente y tensión en el capacitor (AA5TB / ARRL)."
    >
      <Articulo titulo="Small transmitting loop">
        <p className="text-justify">
          Un loop pequeño (perímetro &lt; 0,25 λ, mejor ~0,1 λ) es un circuito
          RLC de Q altísimo. Irradia por la resistencia de radiación, minúscula
          frente a la reactancia; por eso el capacitor ve kilovoltios incluso
          con 100 W. El tubo grueso de cobre baja la resistencia óhmica y sube
          la eficiencia.
        </p>

        <LoopMagneticoDiagrama />

        <Formula>
          <p>Rr = 3,38×10⁻⁸ (f² A)²</p>
          <p>η = Rr / (Rr + Rl) &nbsp;&nbsp; Vc = √(P × XL × Q)</p>
        </Formula>
        <Nota>
          Fórmulas de AA5TB (unidades convertidas desde pies/pulgadas). No
          incluyen pérdidas del capacitor ni uniones: la eficiencia real será
          algo menor. Use capacitor de vacío o de aire de alta tensión; el
          variable de receptor suele arquear.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="stl-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="stl-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stl-d" className={labelClass}>
            <Cota letra="D">Diámetro del loop (m)</Cota>
          </label>
          <input
            id="stl-d"
            className={inputClass}
            inputMode="decimal"
            value={diametro}
            onChange={e => setDiametro(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stl-t" className={labelClass}>
            <Cota letra="d">Diámetro del conductor o tubo (mm)</Cota>
          </label>
          <input
            id="stl-t"
            className={inputClass}
            inputMode="decimal"
            value={tubo}
            onChange={e => setTubo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stl-p" className={labelClass}>
            Potencia (W)
          </label>
          <input
            id="stl-p"
            className={inputClass}
            inputMode="decimal"
            value={potencia}
            onChange={e => setPotencia(e.target.value)}
          />
        </div>
      </Campo>

      {ok && r && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="P">Perímetro (πD)</Cota>}
            valor={formatearLongitud(circ)}
          />
          <Fila
            etiqueta="Perímetro / λ"
            valor={`${formatearNumero(frac, 3)} ${
              frac > 0.25 ? '(grande: sale del modelo STL)' : ''
            }`}
          />
          <Fila
            etiqueta="Inductancia"
            valor={`${formatearNumero(r.Luh, 3)} µH`}
          />
          <Fila
            etiqueta={<Cota letra="C">Capacitor de resonancia</Cota>}
            valor={`${formatearNumero(r.ctPf, 1)} pF`}
          />
          <Fila
            etiqueta="Resistencia de radiación"
            valor={`${formatearNumero(r.rr, 4)} Ω`}
          />
          <Fila
            etiqueta="Resistencia de pérdidas (cobre)"
            valor={`${formatearNumero(r.rl, 4)} Ω`}
          />
          <Fila
            etiqueta="Eficiencia"
            valor={`${formatearNumero(r.eta * 100, 1)} % (${formatearNumero(r.etaDb, 1)} dB)`}
          />
          <Fila etiqueta="Q" valor={formatearNumero(r.q, 0)} />
          <Fila
            etiqueta="Ancho de banda a −3 dB"
            valor={`${formatearNumero(r.bwKhz, 2)} kHz`}
          />
          <Fila
            etiqueta="Corriente circulante"
            valor={`${formatearNumero(r.iRms, 1)} A RMS`}
          />
          <Fila
            etiqueta="Tensión en el capacitor"
            valor={`${formatearNumero(r.vc, 0)} V`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default LoopMagnetico
