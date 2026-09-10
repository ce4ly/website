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
  longitudOnda,
  parseNumero
} from '../lib/calculadoras.js'

const regimen = frac => {
  if (frac < 0.15) return 'NVIS (ángulo muy alto, cobertura local/regional)'
  if (frac < 0.3) return 'Regional / NVIS suave'
  if (frac < 0.6) return 'Mixto (regional y algo de DX)'
  return 'DX (ángulo bajo)'
}

const NvisDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 230"
        className="h-auto w-full"
        aria-labelledby="nvis-diagrama-titulo"
        role="img"
      >
        <title id="nvis-diagrama-titulo">
          Diagrama de altura de un dipolo y ángulo NVIS
        </title>

        {/* Suelo */}
        <line
          x1="24"
          y1="200"
          x2="316"
          y2="200"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Dipolo */}
        <line
          x1="70"
          y1="56"
          x2="270"
          y2="56"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          cx="170"
          cy="56"
          r="6"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Mástil */}
        <line
          x1="170"
          y1="56"
          x2="170"
          y2="200"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        {/* Cota H */}
        <line
          x1="40"
          y1="56"
          x2="40"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="56"
          x2="44"
          y2="56"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="36"
          y1="200"
          x2="44"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="28"
          y="132"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          H
        </text>

        {/* Ángulo α desde el horizonte */}
        <path
          d="M 210 200 A 48 48 0 0 0 200 156"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="170"
          y1="200"
          x2="248"
          y2="148"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="228"
          y="186"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          α
        </text>

        <line
          x1="292"
          y1="168"
          x2="308"
          y2="168"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="318"
          y="172"
          textAnchor="start"
          className="fill-current font-serif text-[13px] font-semibold"
        >
          Hn
        </text>
        <line
          x1="292"
          y1="88"
          x2="308"
          y2="88"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="318"
          y="92"
          textAnchor="start"
          className="fill-current font-serif text-[13px] font-semibold"
        >
          Hd
        </text>
        <text
          x="300"
          y="52"
          textAnchor="middle"
          className="fill-current font-serif text-[13px] font-semibold"
        >
          λ
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const Nvis = () => {
  const [frecuencia, setFrecuencia] = useState('7,148')
  const [altura, setAltura] = useState('10')
  const mhz = parseNumero(frecuencia)
  const h = parseNumero(altura)
  const ok = frecuenciaValida(mhz) && h > 0
  const lambda = ok ? longitudOnda(mhz) : null
  const frac = ok ? h / lambda : null
  const arg = ok ? lambda / (4 * h) : null
  const elev =
    ok && arg <= 1 ? (Math.asin(arg) * 180) / Math.PI : ok ? 90 : null
  const hNvis = ok ? 0.15 * lambda : null
  const hDx = ok ? 0.5 * lambda : null

  return (
    <CalculadoraLayout
      titulo="Altura sobre el Suelo y Ángulo NVIS"
      intro="En 40 y 80 m la altura del dipolo decide si ilumina el cielo (NVIS) o el horizonte (DX)."
    >
      <Articulo titulo="El primer lóbulo">
        <p className="text-justify">
          Un dipolo horizontal sobre tierra tiene el máximo de radiación a un
          ángulo de elevación cuyo seno es λ/(4h). Bajo (~0,1–0,2 λ) el lóbulo
          apunta al cénit: NVIS, comunicaciones de 50–400 km saltando la
          ionosfera. A λ/2 el máximo baja hacia unos 30° y empieza el DX.
        </p>

        <NvisDiagrama />

        <Formula>
          <p>sin(α) = λ / (4H) &nbsp; (primer máximo)</p>
        </Formula>
        <Nota>
          Modelo de tierra plana y dipolo. Techos, árboles y pendientes mueven
          el diagrama. En 80 m, 10 m de altura ya es NVIS; para DX de 80 m hace
          falta un soporte alto de verdad.
        </Nota>
      </Articulo>
      <Campo>
        <div>
          <label htmlFor="nv-f" className={labelClass}>
            Frecuencia (MHz)
          </label>
          <input
            id="nv-f"
            className={inputClass}
            inputMode="decimal"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="nv-h" className={labelClass}>
            <Cota letra="H">Altura del dipolo (m)</Cota>
          </label>
          <input
            id="nv-h"
            className={inputClass}
            inputMode="decimal"
            value={altura}
            onChange={e => setAltura(e.target.value)}
          />
        </div>
      </Campo>
      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="λ">Longitud de onda</Cota>}
            valor={formatearLongitud(lambda)}
          />
          <Fila
            etiqueta={<Cota letra="H/λ">Altura en longitudes de onda</Cota>}
            valor={formatearNumero(frac, 3)}
          />
          <Fila
            etiqueta={<Cota letra="α">Ángulo del primer máximo</Cota>}
            valor={`${formatearNumero(elev, 0)} °`}
          />
          <Fila etiqueta="Régimen" valor={regimen(frac)} resaltar />
          <Fila
            etiqueta={
              <Cota letra="Hn">Altura NVIS de referencia (0,15 λ)</Cota>
            }
            valor={formatearLongitud(hNvis)}
          />
          <Fila
            etiqueta={<Cota letra="Hd">Altura DX de referencia (0,5 λ)</Cota>}
            valor={formatearLongitud(hDx)}
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Nvis
