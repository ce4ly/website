import { useMemo, useState } from 'react'
import { CLUB } from '../lib/club.js'
import {
  latLonALocator,
  locatorALatLon,
  locatorValido,
  rumboEntreLocators
} from '../lib/calc/maidenhead.js'
import { formatearNumero } from '../lib/calculadoras.js'
import { useQueryState } from '../hooks/useQueryState.js'
import { meta as routeMeta } from '../lib/meta.js'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Nota
} from '../components/CalculadoraLayout.jsx'
import { inputClass, labelClass } from '../lib/calculadoras.js'

const DEFAULTS = {
  origen: CLUB.locator,
  destino: '',
  lat: '',
  lon: '',
  precision: '6'
}

export const meta = () => routeMeta({ location: '/herramientas/locator' })

const Locator = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const [geoMsg, setGeoMsg] = useState('')
  const precision = Number(q.precision) || 6

  const desdeCoords = useMemo(() => {
    const lat = parseFloat(String(q.lat).replace(',', '.'))
    const lon = parseFloat(String(q.lon).replace(',', '.'))
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
    return latLonALocator(lat, lon, precision)
  }, [q.lat, q.lon, precision])

  const desdeLocator = locatorValido(q.origen) ? locatorALatLon(q.origen) : null
  const rumbo =
    locatorValido(q.origen) && locatorValido(q.destino)
      ? rumboEntreLocators(q.origen, q.destino)
      : null

  const usarGeo = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        const loc = latLonALocator(lat, lon, precision)
        setQ({
          lat: String(lat),
          lon: String(lon),
          origen: loc || q.origen
        })
        setGeoMsg('')
      },
      () => setGeoMsg(''),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    )
  }

  return (
    <CalculadoraLayout
      titulo="Grid Maidenhead"
      intro="Convierte entre locator y coordenadas, y calcula distancia y azimut entre dos cuadrículas. El origen parte en el locator del club."
    >
      <Articulo titulo="Origen y destino">
        <p className="text-justify">
          El sistema Maidenhead divide el mundo en campos, cuadrados y
          subsquares. Cuatro caracteres bastan para un QTH grueso; seis es lo
          habitual en QSOs; ocho da un punto de unos 500 m.
        </p>
      </Articulo>
      <Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="loc-origen" className={labelClass}>
              Locator origen
            </label>
            <input
              id="loc-origen"
              className={inputClass}
              value={q.origen}
              onChange={e => setQ({ origen: e.target.value.toUpperCase() })}
              placeholder="Ej: FF44EN"
            />
          </div>
          <div>
            <label htmlFor="loc-destino" className={labelClass}>
              Locator destino
            </label>
            <input
              id="loc-destino"
              className={inputClass}
              value={q.destino}
              onChange={e => setQ({ destino: e.target.value.toUpperCase() })}
              placeholder="Ej: FF46"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="loc-lat" className={labelClass}>
              Latitud (°)
            </label>
            <input
              id="loc-lat"
              className={inputClass}
              inputMode="decimal"
              value={q.lat}
              onChange={e => setQ({ lat: e.target.value })}
              placeholder="Ej: -35,426"
            />
          </div>
          <div>
            <label htmlFor="loc-lon" className={labelClass}>
              Longitud (°)
            </label>
            <input
              id="loc-lon"
              className={inputClass}
              inputMode="decimal"
              value={q.lon}
              onChange={e => setQ({ lon: e.target.value })}
              placeholder="Ej: -71,656"
            />
          </div>
          <div>
            <label htmlFor="loc-prec" className={labelClass}>
              Precisión
            </label>
            <select
              id="loc-prec"
              className={inputClass}
              value={q.precision}
              onChange={e => setQ({ precision: e.target.value })}
            >
              <option value="4">4 caracteres</option>
              <option value="6">6 caracteres</option>
              <option value="8">8 caracteres</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={usarGeo}
          className="mt-4 rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-blue-950 hover:bg-stone-50 dark:border-indigo-800 dark:text-indigo-100 dark:hover:bg-indigo-900/70"
        >
          Usar mi ubicación
        </button>
        {geoMsg ? <Nota>{geoMsg}</Nota> : null}
      </Campo>
      {desdeCoords && (
        <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900 dark:text-white">
            Coordenadas → locator
          </h2>
          <dl className="space-y-3 text-sm">
            <Fila etiqueta="Locator" valor={desdeCoords} resaltar />
          </dl>
        </div>
      )}
      {desdeLocator && (
        <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900 dark:text-white">
            Locator origen → centro
          </h2>
          <dl className="space-y-3 text-sm">
            <Fila
              etiqueta="Latitud"
              valor={`${formatearNumero(desdeLocator.latitud, 5)} °`}
            />
            <Fila
              etiqueta="Longitud"
              valor={`${formatearNumero(desdeLocator.longitud, 5)} °`}
            />
          </dl>
        </div>
      )}
      {rumbo && (
        <div className="rounded-xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900 dark:text-white">
            Gran círculo
          </h2>
          <dl className="space-y-3 text-sm">
            <Fila
              etiqueta="Distancia"
              valor={`${formatearNumero(rumbo.distanciaKm, 1)} km`}
              resaltar
            />
            <Fila
              etiqueta="Azimut directo"
              valor={`${formatearNumero(rumbo.azimutDirecto, 1)} °`}
            />
            <Fila
              etiqueta="Azimut inverso"
              valor={`${formatearNumero(rumbo.azimutInverso, 1)} °`}
            />
          </dl>
        </div>
      )}
    </CalculadoraLayout>
  )
}

export default Locator
