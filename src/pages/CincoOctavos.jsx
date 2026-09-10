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
  inductanciaWheelerUh,
  labelClass,
  parseNumero,
  vueltasParaInductancia
} from '../lib/calculadoras.js'

const CincoOctavosDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-sm text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 260 320"
        className="h-auto w-full"
        aria-labelledby="cincooctavos-diagrama-titulo"
        role="img"
      >
        <title id="cincooctavos-diagrama-titulo">
          Diagrama esquemático de antena 5/8 de onda con bobina de base
        </title>

        {/* L: látigo 5/8 λ */}
        <line
          x1="130"
          y1="16"
          x2="130"
          y2="188"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="130" cy="16" r="4" fill="currentColor" />

        {/* Alimentación (unión látigo–bobina) */}
        <circle
          cx="130"
          cy="196"
          r="5"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* B: bobina de base */}
        <ellipse
          cx="130"
          cy="210"
          rx="26"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <ellipse
          cx="130"
          cy="220"
          rx="26"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <ellipse
          cx="130"
          cy="230"
          rx="26"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <ellipse
          cx="130"
          cy="240"
          rx="26"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />

        {/* Soporte bajo la bobina */}
        <line
          x1="130"
          y1="240"
          x2="130"
          y2="268"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Cota L */}
        <line
          x1="48"
          y1="16"
          x2="48"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="16"
          x2="52"
          y2="16"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="44"
          y1="188"
          x2="52"
          y2="188"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="36"
          y="108"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>

        {/* Cota B (largo de la bobina) */}
        <line
          x1="200"
          y1="200"
          x2="200"
          y2="250"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="196"
          y1="200"
          x2="204"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="196"
          y1="250"
          x2="204"
          y2="250"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="214"
          y="230"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          B
        </text>

        {/* Cota D (diámetro del formero) */}
        <line
          x1="104"
          y1="286"
          x2="156"
          y2="286"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="104"
          y1="282"
          x2="104"
          y2="290"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="156"
          y1="282"
          x2="156"
          y2="290"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="104"
          y1="250"
          x2="104"
          y2="282"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1="156"
          y1="250"
          x2="156"
          y2="282"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="130"
          y="306"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          D
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const CincoOctavos = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [diametro, setDiametro] = useState('20')
  const mhz = parseNumero(frecuencia)
  const d = parseNumero(diametro)
  const ok = frecuenciaValida(mhz) && d > 0
  const whip = ok ? (0.625 * 300 * 0.95) / mhz : null
  const lUh = ok ? 50 / (2 * Math.PI * mhz) : null
  const vueltas = ok ? vueltasParaInductancia(lUh, d, 2) : null
  const largoBobina = ok && vueltas ? vueltas * 2 : null
  const lCheck =
    ok && vueltas ? inductanciaWheelerUh(d, largoBobina, vueltas) : null

  return (
    <CalculadoraLayout
      titulo="5/8 de Onda con Bobina de Carga"
      intro="Largo del látigo de 5/8 λ y bobina de base para llevar la reactancia a un punto cercano a 50 Ω."
    >
      <Articulo titulo="Por qué la bobina">
        <p className="text-justify">
          El 5/8 de onda comprime el lóbulo hacia el horizonte (útil en VHF
          móvil) pero no resuena solo como un λ/4. En la base se pone una bobina
          que aporta unos 50 Ω de reactancia como punto de partida; el ajuste
          fino es recortando el látigo y espaciando espiras.
        </p>

        <CincoOctavosDiagrama />

        <Formula>
          <p>L (m) ≈ 178 / f</p>
          <p>Inductancia (µH) ≈ 50 / (2π f)</p>
        </Formula>
        <Nota>
          Vueltas según Wheeler, arrollado con paso de 2 mm. En 2 m suelen ser
          4–8 espiras sobre 15–25 mm. Un capacitor en serie a veces termina el
          ajuste.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="c8-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="c8-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 146,380"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="c8-d" className={labelClass}>
            <Cota letra="D">Diámetro del formero de la bobina (mm)</Cota>
          </label>
          <input
            id="c8-d"
            className={inputClass}
            inputMode="decimal"
            value={diametro}
            onChange={e => setDiametro(e.target.value)}
          />
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="L">Látigo 5/8 λ</Cota>}
            valor={formatearLongitud(whip)}
          />
          <Fila
            etiqueta={<Cota letra="B">Largo de la bobina (paso 2 mm)</Cota>}
            valor={formatearLongitud(largoBobina / 1000)}
          />
          <Fila
            etiqueta="Inductancia de partida"
            valor={`${formatearNumero(lUh, 3)} µH`}
          />
          <Fila
            etiqueta="Vueltas aproximadas"
            valor={formatearNumero(vueltas, 1)}
          />
          <Fila
            etiqueta="Comprobación Wheeler"
            valor={`${formatearNumero(lCheck, 3)} µH`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default CincoOctavos
