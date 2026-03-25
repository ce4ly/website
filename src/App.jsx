import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import Acerca from './pages/Acerca.jsx'
import Contacto from './pages/Contacto.jsx'
import Directorio from './pages/Directorio.jsx'
import Terminos from './pages/Terminos.jsx'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx'

export const PRERENDER_PATHS = [
  '/',
  '/acerca',
  '/directorio',
  '/contacto',
  '/terminos',
  '/privacidad'
]

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/directorio" element={<Directorio />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<PoliticaPrivacidad />} />
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
