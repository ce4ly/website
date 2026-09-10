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
  inputClass,
  labelClass,
  LARGO_MEDIA_ONDA,
  parseNumero
} from '../lib/calculadoras.js'

const OcfdDiagrama = () => {
  return (
    <figure className="mx-auto w-full max-w-md text-stone-700 dark:text-indigo-200">
      <svg
        viewBox="0 0 340 180"
        className="h-auto w-full"
        aria-labelledby="ocfd-diagrama-titulo"
        role="img"
      >
        <title id="ocfd-diagrama-titulo">
          Diagrama esquemático de dipolo alimentado fuera de centro
        </title>

        {/* Cota total T */}
        <line
          x1="28"
          y1="28"
          x2="312"
          y2="28"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="28"
          y1="24"
          x2="28"
          y2="32"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="312"
          y1="24"
          x2="312"
          y2="32"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="170"
          y="22"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          T
        </text>

        {/* Brazo corto C */}
        <line
          x1="28"
          y1="72"
          x2="118"
          y2="72"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="28" cy="72" r="4" fill="currentColor" />

        {/* Brazo largo L */}
        <line
          x1="142"
          y1="72"
          x2="312"
          y2="72"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="312" cy="72" r="4" fill="currentColor" />

        {/* Alimentación en el offset */}
        <circle
          cx="130"
          cy="72"
          r="7"
          className="fill-blue-950 dark:fill-indigo-400"
        />

        {/* Bajada coaxial */}
        <line
          x1="124"
          y1="79"
          x2="124"
          y2="148"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="136"
          y1="79"
          x2="136"
          y2="148"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="146"
          y="140"
          textAnchor="start"
          className="fill-current font-sans text-[11px]"
        >
          alimentación
        </text>

        {/* Cota C */}
        <line
          x1="28"
          y1="100"
          x2="118"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="28"
          y1="96"
          x2="28"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="118"
          y1="96"
          x2="118"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="73"
          y="116"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          C
        </text>

        {/* Cota L */}
        <line
          x1="142"
          y1="100"
          x2="312"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="142"
          y1="96"
          x2="142"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="312"
          y1="96"
          x2="312"
          y2="104"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="227"
          y="116"
          textAnchor="middle"
          className="fill-current font-serif text-[14px] font-semibold"
        >
          L
        </text>
      </svg>
      <PieDiagrama />
    </figure>
  )
}

const Ocfd = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [offset, setOffset] = useState('33')
  const mhz = parseNumero(frecuencia)
  const pct = parseNumero(offset)
  const ok = frecuenciaValida(mhz) && pct > 5 && pct < 49
  const total = ok ? LARGO_MEDIA_ONDA / mhz : null
  const corto = ok ? total * (pct / 100) : null
  const largo = ok ? total * (1 - pct / 100) : null
  const balun = pct >= 28 && pct <= 36 ? '4:1 (≈ 200 Ω)' : '6:1 (≈ 300 Ω)'

  return (
    <CalculadoraLayout
      titulo="OCFD / Windom"
      intro="Dipolo alimentado fuera de centro: brazos al 33 % (o el porcentaje que elija) y balun 4:1 o 6:1."
    >
      <Articulo titulo="Windom moderno">
        <p className="text-justify">
          El OCFD (off-center-fed dipole) se alimenta a un tercio de un extremo,
          no en el centro. Eso permite varias bandas armónicas con un solo
          alambre. El Windom clásico usaba un solo hilo de bajada; el OCFD
          actual usa balun 4:1 (offset ~33 %) o 6:1 (offset ~20 %).
        </p>

        <OcfdDiagrama />

        <Formula>
          <p>T (m) ≈ 142,5 / f</p>
          <p>C = (p/100) × T &nbsp;&nbsp; L = T − C</p>
        </Formula>
        <Nota>
          El OCFD clásico de 80 m (unos 41 m de largo, entrando 3,5 MHz) al 33 %
          con balún 4:1 cubre de forma típica 80/40/20/10 m. Un choque 1:1 en el
          coaxial, a unos 0,05–0,1 λ de la caja del balun, evita que la malla
          irradie.
        </Nota>
      </Articulo>

      <Campo>
        <div>
          <label htmlFor="ocfd-f" className={labelClass}>
            Frecuencia de media onda (MHz)
          </label>
          <input
            id="ocfd-f"
            className={inputClass}
            inputMode="decimal"
            placeholder="Ej: 7,148"
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ocfd-p" className={labelClass}>
            <Cota letra="p">Offset desde un extremo (%)</Cota>
          </label>
          <input
            id="ocfd-p"
            className={inputClass}
            inputMode="decimal"
            value={offset}
            onChange={e => setOffset(e.target.value)}
          />
        </div>
      </Campo>

      {ok && (
        <Resultado>
          <Fila
            etiqueta={<Cota letra="T">Largo total</Cota>}
            valor={formatearLongitud(total)}
          />
          <Fila
            etiqueta={<Cota letra="C">Brazo corto</Cota>}
            valor={formatearLongitud(corto)}
          />
          <Fila
            etiqueta={<Cota letra="L">Brazo largo</Cota>}
            valor={formatearLongitud(largo)}
          />
          <Fila etiqueta="Balun sugerido" valor={balun} resaltar />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Ocfd
