import { useEffect, useRef, useState } from 'react'
import type { DivIcon, LayerGroup, Map as MapaLeaflet } from 'leaflet'

import {
  limitesLocator,
  locatorALatLon,
  puntosGranCirculo,
  type PuntoLocator,
} from '../lib/calc/maidenhead'
import { CLUB } from '../lib/club'
import { ATRIBUCION_OSM, TESELAS_OSM, ZOOM_POR_PRECISION } from '../lib/mapa'
import { TARJETA } from './partials/estilos'

type Leaflet = typeof import('leaflet')

type Estado = 'cargando' | 'listo' | 'error'

const EXTREMOS = {
  origen: { etiqueta: 'Origen', color: '#172554', relleno: 'fill-blue-950', punto: 'bg-blue-950' },
  destino: { etiqueta: 'Destino', color: '#dc2626', relleno: 'fill-red-600', punto: 'bg-red-600' },
} as const

type Extremo = keyof typeof EXTREMOS

/** Pin SVG (la punta marca el centro de la cuadrícula). */
const pin = (L: Leaflet, extremo: Extremo): DivIcon =>
  L.divIcon({
    className: 'pin-mapa',
    html: `<svg viewBox="0 0 24 36" width="24" height="36" aria-hidden="true"><path class="${EXTREMOS[extremo].relleno}" d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 36 12 36s12-15.2 12-24.1C24 5.3 18.6 0 12 0z"/><circle cx="12" cy="12" r="4.5" class="fill-white"/></svg>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    tooltipAnchor: [0, -34],
  })

/**
 * Mapa de OpenStreetMap (Leaflet) del Grid Maidenhead: un pin y la cuadrícula por cada locator
 * escrito (origen, destino o ambos) y, con los dos, la ruta de gran círculo que los une. Leaflet
 * se descarga recién al montar: el prerender solo deja el contenedor.
 */
const MapaGrid = ({ origen, destino }: { origen: string | null; destino: string | null }) => {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<Leaflet | null>(null)
  const mapaRef = useRef<MapaLeaflet | null>(null)
  const capaRef = useRef<LayerGroup | null>(null)
  const [estado, setEstado] = useState<Estado>('cargando')

  useEffect(() => {
    let cancelado = false
    let mapa: MapaLeaflet | undefined

    const iniciar = async () => {
      try {
        const [modulo] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
        // Leaflet 1.9 se publica como UMD: según cómo lo empaquete Vite, viene en `default`.
        const L = (modulo as unknown as { default?: Leaflet }).default ?? modulo
        if (cancelado || !contenedorRef.current) return
        mapa = L.map(contenedorRef.current, {
          center: [CLUB.latitud, CLUB.longitud],
          zoom: 6,
          // La rueda del mouse solo hace zoom después de hacer clic en el mapa: así no atrapa el
          // scroll de la página.
          scrollWheelZoom: false,
          worldCopyJump: true,
        })
        const actual = mapa
        actual.on('click', () => actual.scrollWheelZoom.enable())
        actual.on('mouseout', () => actual.scrollWheelZoom.disable())
        actual.attributionControl.setPrefix(
          '<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>',
        )
        L.tileLayer(TESELAS_OSM, { maxZoom: 19, attribution: ATRIBUCION_OSM }).addTo(actual)
        capaRef.current = L.layerGroup().addTo(actual)
        leafletRef.current = L
        mapaRef.current = actual
        setEstado('listo')
      } catch {
        if (!cancelado) setEstado('error')
      }
    }

    void iniciar()
    return () => {
      cancelado = true
      mapa?.remove()
      mapaRef.current = null
      capaRef.current = null
    }
  }, [])

  useEffect(() => {
    const L = leafletRef.current
    const mapa = mapaRef.current
    const capa = capaRef.current
    if (estado !== 'listo' || !L || !mapa || !capa) return
    capa.clearLayers()

    const puntos = (
      [
        ['origen', origen],
        ['destino', destino],
      ] as const
    ).flatMap(([extremo, locator]) => {
      const centro = locatorALatLon(locator)
      return centro && locator ? [{ extremo, locator, centro }] : []
    })

    for (const { extremo, locator, centro } of puntos) {
      const { color, etiqueta } = EXTREMOS[extremo]
      const l = limitesLocator(locator)
      if (l) {
        L.rectangle(
          [
            [l.sur, l.oeste],
            [l.norte, l.este],
          ],
          { color, weight: 1.5, fillOpacity: 0.08, interactive: false },
        ).addTo(capa)
      }
      L.marker([centro.latitud, centro.longitud], {
        icon: pin(L, extremo),
        title: `${etiqueta}: ${locator.toUpperCase()}`,
        keyboard: false,
      })
        .bindTooltip(`${etiqueta}: ${locator.toUpperCase()}`, {
          permanent: true,
          direction: 'top',
        })
        .addTo(capa)
    }

    if (puntos.length === 2) {
      const ruta = puntosGranCirculo(puntos[0].centro, puntos[1].centro)
      L.polyline(ruta, {
        color: EXTREMOS.origen.color,
        weight: 3,
        dashArray: '8 6',
        interactive: false,
      }).addTo(capa)
      mapa.fitBounds(L.latLngBounds(ruta), { padding: [56, 56], maxZoom: 12 })
    } else if (puntos.length === 1) {
      const { centro }: { centro: PuntoLocator } = puntos[0]
      mapa.setView([centro.latitud, centro.longitud], ZOOM_POR_PRECISION[centro.precision])
    }
  }, [estado, origen, destino])

  return (
    <div className={`${TARJETA} space-y-3 p-4`}>
      <div className='flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-stone-700 dark:text-indigo-100'>
        {origen || destino ? (
          (
            [
              ['origen', origen],
              ['destino', destino],
            ] as const
          ).map(
            ([extremo, locator]) =>
              locator && (
                <span key={extremo} className='inline-flex items-center gap-2'>
                  <span
                    className={`size-2.5 rounded-full ${EXTREMOS[extremo].punto}`}
                    aria-hidden='true'
                  />
                  {EXTREMOS[extremo].etiqueta}:{' '}
                  <span className='font-mono font-semibold text-stone-900 dark:text-white'>
                    {locator.toUpperCase()}
                  </span>
                </span>
              ),
          )
        ) : (
          <span>Escribe un locator de origen o de destino para verlo en el mapa.</span>
        )}
      </div>
      {/* `isolate`: los z-index internos de Leaflet (hasta 1000) no tapan el menú del sitio. */}
      <div className='relative isolate h-80 overflow-hidden rounded-lg border border-stone-300 bg-stone-200 sm:h-96 dark:border-indigo-800 dark:bg-indigo-950'>
        <div ref={contenedorRef} className='absolute inset-0' />
        {estado === 'cargando' && (
          <p className='absolute inset-x-0 bottom-3 text-center text-sm text-stone-600'>
            Cargando mapa…
          </p>
        )}
        {estado === 'error' && (
          <p className='absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-stone-600 dark:text-indigo-200'>
            No se pudo cargar el mapa. Revisa tu conexión.
          </p>
        )}
      </div>
      {origen && destino && (
        <p className='text-xs text-stone-500 dark:text-indigo-300/80'>
          La línea sigue la ruta de gran círculo, la misma con que se calculan la distancia y el
          azimut.
        </p>
      )}
    </div>
  )
}

export default MapaGrid
