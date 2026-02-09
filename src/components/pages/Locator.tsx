import { useState, type FormEvent } from 'react'

import { useQueryState } from '../../hooks/useQueryState'
import {
  latLonALocator,
  locatorALatLon,
  locatorValido,
  rumboEntreLocators,
} from '../../lib/calc/maidenhead'
import { formatearNumero, parseNumero } from '../../lib/calculadoras'
import { CLUB } from '../../lib/club'
import { parsearLugares, urlBusquedaLugar, type Lugar } from '../../lib/lugares'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, Selector, inputClass, labelClass } from '../calculadora/Campos'
import MapaGrid from '../MapaGrid'
import { botonSecundarioClass } from '../partials/estilos'

const DEFAULTS = {
  origen: CLUB.locator,
  destino: '',
  lat: '',
  lon: '',
  precision: '6',
}

const OPCIONES_PRECISION = [
  { value: '4', label: '4 caracteres' },
  { value: '6', label: '6 caracteres' },
  { value: '8', label: '8 caracteres' },
]

type CampoLugar = 'origen' | 'destino'

const OPCIONES_CAMPO: { value: CampoLugar; label: string }[] = [
  { value: 'origen', label: 'Como origen' },
  { value: 'destino', label: 'Como destino' },
]

type Busqueda =
  | { tipo: 'inicial' }
  | { tipo: 'buscando' }
  | { tipo: 'error' }
  | { tipo: 'ok'; lugares: Lugar[] }
  | { tipo: 'elegido'; nombre: string; campo: CampoLugar }

/**
 * Busca una ciudad en Nominatim (OpenStreetMap) y la usa como origen o destino. Solo busca al
 * enviar: la política de uso de Nominatim no admite consultas mientras se escribe.
 */
const BuscadorCiudad = ({ onElegir }: { onElegir: (lugar: Lugar, campo: CampoLugar) => void }) => {
  const [texto, setTexto] = useState('')
  const [campo, setCampo] = useState<CampoLugar>('origen')
  const [busqueda, setBusqueda] = useState<Busqueda>({ tipo: 'inicial' })

  const buscar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (texto.trim().length < 2) return
    setBusqueda({ tipo: 'buscando' })
    try {
      const res = await fetch(urlBusquedaLugar(texto), { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setBusqueda({ tipo: 'ok', lugares: parsearLugares(await res.json()) })
    } catch {
      setBusqueda({ tipo: 'error' })
    }
  }

  const elegir = (lugar: Lugar) => {
    onElegir(lugar, campo)
    setBusqueda({ tipo: 'elegido', nombre: lugar.nombre, campo })
  }

  return (
    <form role='search' onSubmit={buscar} className='space-y-3'>
      <div className='grid items-end gap-3 sm:grid-cols-[1fr_auto_auto]'>
        <div>
          <label htmlFor='loc-ciudad' className={labelClass}>
            Buscar una ciudad
          </label>
          <input
            id='loc-ciudad'
            type='search'
            className={inputClass}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder='Ej: Curicó, Punta Arenas, Berlín'
          />
        </div>
        <Selector
          id='loc-campo'
          etiqueta='Usar'
          value={campo}
          onChange={setCampo}
          opciones={OPCIONES_CAMPO}
        />
        <button
          type='submit'
          disabled={busqueda.tipo === 'buscando' || texto.trim().length < 2}
          className={`${botonSecundarioClass} dark:hover:bg-indigo-900/70`}
        >
          {busqueda.tipo === 'buscando' ? 'Buscando…' : 'Buscar'}
        </button>
      </div>
      {busqueda.tipo === 'error' && (
        <Nota>No se pudo buscar en este momento. Revisa tu conexión e inténtalo de nuevo.</Nota>
      )}
      {busqueda.tipo === 'ok' && busqueda.lugares.length === 0 && (
        <Nota>No encontramos ese lugar. Prueba agregando la región o el país.</Nota>
      )}
      {busqueda.tipo === 'ok' && busqueda.lugares.length > 0 && (
        <ul className='divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 dark:divide-indigo-900 dark:border-indigo-900'>
          {busqueda.lugares.map((lugar) => (
            <li key={`${lugar.nombre}-${lugar.latitud}-${lugar.longitud}`}>
              <button
                type='button'
                onClick={() => elegir(lugar)}
                className='w-full px-3 py-2 text-left text-sm text-stone-800 hover:bg-stone-100 focus:bg-stone-100 focus:outline-none dark:text-indigo-100 dark:hover:bg-indigo-900 dark:focus:bg-indigo-900'
              >
                {lugar.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
      {busqueda.tipo === 'elegido' && (
        <Nota>
          {busqueda.campo === 'origen' ? 'Origen' : 'Destino'}: {busqueda.nombre}.
        </Nota>
      )}
      <p className='text-xs text-stone-500 dark:text-indigo-300/80'>
        Búsqueda: Nominatim de OpenStreetMap.
      </p>
    </form>
  )
}

const Locator = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const [avisoGeo, setAvisoGeo] = useState('')
  const precision = Number(q.precision) || 6

  const lat = parseNumero(q.lat)
  const lon = parseNumero(q.lon)
  const desdeCoords = lat !== null && lon !== null ? latLonALocator(lat, lon, precision) : null
  const desdeLocator = locatorValido(q.origen) ? locatorALatLon(q.origen) : null
  const desdeDestino = locatorValido(q.destino) ? locatorALatLon(q.destino) : null
  const rumbo =
    locatorValido(q.origen) && locatorValido(q.destino)
      ? rumboEntreLocators(q.origen, q.destino)
      : null

  /** El origen lleva también sus coordenadas, como «Usar mi ubicación». */
  const usarLugar = ({ latitud, longitud }: Lugar, campo: CampoLugar) => {
    const locator = latLonALocator(latitud, longitud, precision)
    if (!locator) return
    if (campo === 'origen') {
      setQ({ origen: locator, lat: latitud.toFixed(5), lon: longitud.toFixed(5) })
    } else {
      setQ({ destino: locator })
    }
  }

  const usarGeo = () => {
    if (!('geolocation' in navigator)) {
      setAvisoGeo('Este navegador no permite obtener la ubicación.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setQ({
          lat: String(coords.latitude),
          lon: String(coords.longitude),
          origen: latLonALocator(coords.latitude, coords.longitude, precision) ?? q.origen,
        })
        setAvisoGeo('')
      },
      () => setAvisoGeo('No se pudo obtener la ubicación (permiso denegado o sin señal).'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  }

  return (
    <CalculadoraLayout
      titulo='Grid Maidenhead'
      intro='Convierte entre locator y coordenadas, y calcula distancia y azimut entre dos cuadrículas. El origen parte en el locator del club.'
    >
      <Articulo titulo='Origen y destino'>
        <p className='text-justify'>
          El sistema Maidenhead divide el mundo en campos, cuadrados y subsquares. Cuatro caracteres
          bastan para un QTH grueso; seis es lo habitual en QSOs; ocho da un punto de unos 500 m.
        </p>
      </Articulo>
      <Campo>
        <BuscadorCiudad onElegir={usarLugar} />
      </Campo>
      <Campo>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='loc-origen' className={labelClass}>
              Locator origen
            </label>
            <input
              id='loc-origen'
              className={inputClass}
              value={q.origen}
              onChange={(e) => setQ({ origen: e.target.value.toUpperCase() })}
              placeholder='Ej: FF44EN'
            />
          </div>
          <div>
            <label htmlFor='loc-destino' className={labelClass}>
              Locator destino
            </label>
            <input
              id='loc-destino'
              className={inputClass}
              value={q.destino}
              onChange={(e) => setQ({ destino: e.target.value.toUpperCase() })}
              placeholder='Ej: FF46'
            />
          </div>
        </div>
        <div className='mt-4 grid gap-4 sm:grid-cols-3'>
          <CampoNumero
            id='loc-lat'
            etiqueta='Latitud (°)'
            placeholder='Ej: -35,426'
            value={q.lat}
            onChange={(valor) => setQ({ lat: valor })}
          />
          <CampoNumero
            id='loc-lon'
            etiqueta='Longitud (°)'
            placeholder='Ej: -71,656'
            value={q.lon}
            onChange={(valor) => setQ({ lon: valor })}
          />
          <Selector
            id='loc-prec'
            etiqueta='Precisión'
            value={q.precision}
            onChange={(valor) => setQ({ precision: valor })}
            opciones={OPCIONES_PRECISION}
          />
        </div>
        <button
          type='button'
          onClick={usarGeo}
          className={`mt-4 ${botonSecundarioClass} dark:hover:bg-indigo-900/70`}
        >
          Usar mi ubicación
        </button>
        {avisoGeo && <Nota>{avisoGeo}</Nota>}
      </Campo>
      <MapaGrid
        origen={locatorValido(q.origen) ? q.origen : null}
        destino={locatorValido(q.destino) ? q.destino : null}
      />
      {desdeCoords && (
        <Resultado titulo='Coordenadas → locator'>
          <Fila etiqueta='Locator' valor={desdeCoords} resaltar />
        </Resultado>
      )}
      {desdeLocator && (
        <Resultado titulo='Locator origen → centro'>
          <Fila etiqueta='Latitud' valor={`${formatearNumero(desdeLocator.latitud, 5)} °`} />
          <Fila etiqueta='Longitud' valor={`${formatearNumero(desdeLocator.longitud, 5)} °`} />
        </Resultado>
      )}
      {desdeDestino && (
        <Resultado titulo='Locator destino → centro'>
          <Fila etiqueta='Latitud' valor={`${formatearNumero(desdeDestino.latitud, 5)} °`} />
          <Fila etiqueta='Longitud' valor={`${formatearNumero(desdeDestino.longitud, 5)} °`} />
        </Resultado>
      )}
      {rumbo && (
        <Resultado titulo='Gran círculo'>
          <Fila
            etiqueta='Distancia'
            valor={`${formatearNumero(rumbo.distanciaKm, 1)} km`}
            resaltar
          />
          <Fila etiqueta='Azimut directo' valor={`${formatearNumero(rumbo.azimutDirecto, 1)} °`} />
          <Fila etiqueta='Azimut inverso' valor={`${formatearNumero(rumbo.azimutInverso, 1)} °`} />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Locator
