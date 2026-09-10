import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Routes,
  Route
} from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import Acerca from './pages/Acerca.jsx'
import Contacto from './pages/Contacto.jsx'
import ExDirectorio from './pages/ExDirectorio.jsx'
import Terminos from './pages/Terminos.jsx'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx'
import Boletines from './pages/Boletines.jsx'
import Herramientas from './pages/Herramientas.jsx'
import AlfabetoFonetico from './pages/AlfabetoFonetico.jsx'
import CodigoQ from './pages/CodigoQ.jsx'
import ConvertidorFrecuencia from './pages/ConvertidorFrecuencia.jsx'
import Dipolo from './pages/Dipolo.jsx'
import EspectroRadioelectrico from './pages/EspectroRadioelectrico.jsx'
import IndicativosPais from './pages/IndicativosPais.jsx'
import JPole from './pages/JPole.jsx'
import SlimJim from './pages/SlimJim.jsx'
import Flowerpot from './pages/Flowerpot.jsx'
import ConvertidorPotencia from './pages/ConvertidorPotencia.jsx'
import InvertedV from './pages/InvertedV.jsx'
import Efhw from './pages/Efhw.jsx'
import VerticalCuartoOnda from './pages/VerticalCuartoOnda.jsx'
import LoopDelta from './pages/LoopDelta.jsx'
import Ocfd from './pages/Ocfd.jsx'
import G5rv from './pages/G5rv.jsx'
import LoopMagnetico from './pages/LoopMagnetico.jsx'
import GroundPlane from './pages/GroundPlane.jsx'
import CincoOctavos from './pages/CincoOctavos.jsx'
import Colineal from './pages/Colineal.jsx'
import Turnstile from './pages/Turnstile.jsx'
import Yagi from './pages/Yagi.jsx'
import Moxon from './pages/Moxon.jsx'
import Quad from './pages/Quad.jsx'
import ChoqueCoaxial from './pages/ChoqueCoaxial.jsx'
import Bobina from './pages/Bobina.jsx'
import Trampas from './pages/Trampas.jsx'
import LineaQ from './pages/LineaQ.jsx'
import GammaHairpin from './pages/GammaHairpin.jsx'
import PerdidaLinea from './pages/PerdidaLinea.jsx'
import Nvis from './pages/Nvis.jsx'
import BandaCiudadana from './pages/BandaCiudadana.jsx'
import CanalesMarinos from './pages/CanalesMarinos.jsx'
import RadioComercial from './pages/RadioComercial.jsx'
import TvAbierta from './pages/TvAbierta.jsx'
import Emergencia from './pages/Emergencia.jsx'
import BuscadorLicencias from './pages/BuscadorLicencias.jsx'
import TonosCtcssDcs from './pages/TonosCtcssDcs.jsx'
import Ca5nfs from './pages/Ca5nfs.jsx'
import Locator from './pages/Locator.jsx'
import Horizonte from './pages/Horizonte.jsx'
import Morse from './pages/Morse.jsx'
import Electronica from './pages/Electronica.jsx'
import HiloLargo from './pages/HiloLargo.jsx'
import Discone from './pages/Discone.jsx'
import Reloj from './pages/Reloj.jsx'
import DocumentHead from './components/DocumentHead.jsx'
import { RUTAS_PRERENDER } from './lib/tools-catalog.js'
import { REDIRECCIONES } from './lib/redirecciones.js'

export const PRERENDER_PATHS = RUTAS_PRERENDER

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <DocumentHead />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/ExDirectorio" element={<ExDirectorio />} />
            <Route path="/boletines" element={<Boletines />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/herramientas" element={<Herramientas />} />
            <Route path="/buscador" element={<BuscadorLicencias />} />
            <Route
              path="/herramientas/alfabeto-fonetico"
              element={<AlfabetoFonetico />}
            />
            <Route path="/herramientas/codigos-q" element={<CodigoQ />} />
            <Route
              path="/herramientas/tonos-ctcss-dcs"
              element={<TonosCtcssDcs />}
            />
            <Route
              path="/convertidor/frecuencia"
              element={<ConvertidorFrecuencia />}
            />
            <Route path="/calculadoras/dipolo" element={<Dipolo />} />
            <Route
              path="/herramientas/espectro-radioelectrico"
              element={<EspectroRadioelectrico />}
            />
            <Route
              path="/herramientas/indicativos"
              element={<IndicativosPais />}
            />
            <Route path="/calculadoras/j-pole" element={<JPole />} />
            <Route path="/calculadoras/slim-jim" element={<SlimJim />} />
            <Route path="/calculadoras/flowerpot" element={<Flowerpot />} />
            <Route
              path="/convertidor/potencia"
              element={<ConvertidorPotencia />}
            />
            <Route path="/calculadoras/v-invertida" element={<InvertedV />} />
            <Route path="/calculadoras/efhw" element={<Efhw />} />
            <Route
              path="/calculadoras/vertical-cuarto-onda"
              element={<VerticalCuartoOnda />}
            />
            <Route path="/calculadoras/loop-delta" element={<LoopDelta />} />
            <Route path="/calculadoras/ocfd" element={<Ocfd />} />
            <Route path="/calculadoras/g5rv" element={<G5rv />} />
            <Route
              path="/calculadoras/loop-magnetico"
              element={<LoopMagnetico />}
            />
            <Route
              path="/calculadoras/ground-plane"
              element={<GroundPlane />}
            />
            <Route
              path="/calculadoras/cinco-octavos"
              element={<CincoOctavos />}
            />
            <Route path="/calculadoras/colineal" element={<Colineal />} />
            <Route path="/calculadoras/turnstile" element={<Turnstile />} />
            <Route path="/calculadoras/yagi" element={<Yagi />} />
            <Route path="/calculadoras/moxon" element={<Moxon />} />
            <Route path="/calculadoras/quad" element={<Quad />} />
            <Route
              path="/calculadoras/choque-coaxial"
              element={<ChoqueCoaxial />}
            />
            <Route path="/calculadoras/bobina" element={<Bobina />} />
            <Route path="/calculadoras/trampas" element={<Trampas />} />
            <Route path="/calculadoras/linea-q" element={<LineaQ />} />
            <Route
              path="/calculadoras/gamma-hairpin"
              element={<GammaHairpin />}
            />
            <Route
              path="/calculadoras/perdida-linea"
              element={<PerdidaLinea />}
            />
            <Route path="/calculadoras/nvis" element={<Nvis />} />
            <Route
              path="/frecuencias/banda-ciudadana"
              element={<BandaCiudadana />}
            />
            <Route path="/frecuencias/marinas" element={<CanalesMarinos />} />
            <Route
              path="/frecuencias/radio-comercial"
              element={<RadioComercial />}
            />
            <Route path="/frecuencias/tv-abierta" element={<TvAbierta />} />
            <Route path="/frecuencias/emergencia" element={<Emergencia />} />
            <Route path="/herramientas/locator" element={<Locator />} />
            <Route path="/herramientas/morse" element={<Morse />} />
            <Route path="/herramientas/electronica" element={<Electronica />} />
            <Route path="/herramientas/reloj" element={<Reloj />} />
            <Route path="/calculadoras/horizonte" element={<Horizonte />} />
            <Route path="/calculadoras/hilo-largo" element={<HiloLargo />} />
            <Route path="/calculadoras/discone" element={<Discone />} />
            <Route path="/ca5nfs" element={<Ca5nfs />} />
            {REDIRECCIONES.map(({ from, to }) => (
              <Route
                key={from}
                path={from}
                element={<Navigate to={to} replace />}
              />
            ))}
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const App = ({ RouterComponent = BrowserRouter, initialPath }) => {
  const routerProps =
    RouterComponent === MemoryRouter
      ? { initialEntries: [initialPath || '/'] }
      : {}
  return (
    <RouterComponent {...routerProps}>
      <AppLayout />
    </RouterComponent>
  )
}

export default App
