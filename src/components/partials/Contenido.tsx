import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { PAGINAS, type PaginaId } from '../../lib/paginas'
import ErrorSitio from '../pages/ErrorSitio'
import ErrorBoundary from './ErrorBoundary'

/**
 * Cada página va en su propio chunk: el bundle de entrada solo lleva el layout. El prerender espera
 * a que resuelvan (entry-server.tsx), así que el HTML ya trae el contenido; al hidratar, React
 * conserva ese HTML hasta que llega el chunk de la página.
 */
const PAGE_COMPONENTS: Record<PaginaId, LazyExoticComponent<ComponentType>> = {
  inicio: lazy(() => import('../pages/Inicio')),
  acerca: lazy(() => import('../pages/Acerca')),
  directorio: lazy(() => import('../pages/Directorio')),
  boletines: lazy(() => import('../pages/Boletines')),
  cursos: lazy(() => import('../pages/Cursos')),
  emergencias: lazy(() => import('../pages/Emergencias')),
  contacto: lazy(() => import('../pages/Contacto')),
  terminos: lazy(() => import('../pages/Terminos')),
  privacidad: lazy(() => import('../pages/PoliticaPrivacidad')),
  herramientas: lazy(() => import('../pages/Herramientas')),
  ca5nfs: lazy(() => import('../pages/Ca5nfs')),
  buscador: lazy(() => import('../pages/BuscadorLicencias')),
  'espectro-radioelectrico': lazy(() => import('../pages/EspectroRadioelectrico')),
  'alfabeto-fonetico': lazy(() => import('../pages/AlfabetoFonetico')),
  'codigos-q': lazy(() => import('../pages/CodigoQ')),
  'tonos-ctcss-dcs': lazy(() => import('../pages/TonosCtcssDcs')),
  indicativos: lazy(() => import('../pages/IndicativosPais')),
  locator: lazy(() => import('../pages/Locator')),
  morse: lazy(() => import('../pages/Morse')),
  reloj: lazy(() => import('../pages/Reloj')),
  operativo: lazy(() => import('../pages/ControlOperativo')),
  potencia: lazy(() => import('../pages/ConvertidorPotencia')),
  frecuencia: lazy(() => import('../pages/ConvertidorFrecuencia')),
  electronica: lazy(() => import('../pages/Electronica')),
  'banda-ciudadana': lazy(() => import('../pages/BandaCiudadana')),
  marinas: lazy(() => import('../pages/CanalesMarinos')),
  'radio-comercial': lazy(() => import('../pages/RadioComercial')),
  'tv-abierta': lazy(() => import('../pages/TvAbierta')),
  emergencia: lazy(() => import('../pages/Emergencia')),
  dipolo: lazy(() => import('../pages/Dipolo')),
  'v-invertida': lazy(() => import('../pages/InvertedV')),
  efhw: lazy(() => import('../pages/Efhw')),
  'vertical-cuarto-onda': lazy(() => import('../pages/VerticalCuartoOnda')),
  'loop-delta': lazy(() => import('../pages/LoopDelta')),
  ocfd: lazy(() => import('../pages/Ocfd')),
  g5rv: lazy(() => import('../pages/G5rv')),
  'loop-magnetico': lazy(() => import('../pages/LoopMagnetico')),
  'hilo-largo': lazy(() => import('../pages/HiloLargo')),
  'j-pole': lazy(() => import('../pages/JPole')),
  'slim-jim': lazy(() => import('../pages/SlimJim')),
  flowerpot: lazy(() => import('../pages/Flowerpot')),
  'ground-plane': lazy(() => import('../pages/GroundPlane')),
  'cinco-octavos': lazy(() => import('../pages/CincoOctavos')),
  colineal: lazy(() => import('../pages/Colineal')),
  turnstile: lazy(() => import('../pages/Turnstile')),
  discone: lazy(() => import('../pages/Discone')),
  yagi: lazy(() => import('../pages/Yagi')),
  moxon: lazy(() => import('../pages/Moxon')),
  quad: lazy(() => import('../pages/Quad')),
  'choque-coaxial': lazy(() => import('../pages/ChoqueCoaxial')),
  bobina: lazy(() => import('../pages/Bobina')),
  trampas: lazy(() => import('../pages/Trampas')),
  'linea-q': lazy(() => import('../pages/LineaQ')),
  'gamma-hairpin': lazy(() => import('../pages/GammaHairpin')),
  'perdida-linea': lazy(() => import('../pages/PerdidaLinea')),
  nvis: lazy(() => import('../pages/Nvis')),
  horizonte: lazy(() => import('../pages/Horizonte')),
}

const Contenido = () => {
  const { pathname } = useLocation()

  return (
    // El Suspense queda fuera del ErrorBoundary: al navegar (en una transición) React mantiene la
    // página anterior mientras llega el chunk de la nueva, en vez de mostrar el fallback vacío.
    <Suspense fallback={null}>
      {/* La clave reinicia el ErrorBoundary al navegar: un fallo no se arrastra a otra página. */}
      <ErrorBoundary key={pathname}>
        <Routes>
          {PAGINAS.map(({ slug, path }) => {
            const Pagina = PAGE_COMPONENTS[slug]
            return <Route key={slug} path={path} element={<Pagina />} />
          })}
          <Route path='*' element={<ErrorSitio tipo='no-encontrada' />} />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  )
}

export default Contenido
