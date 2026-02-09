import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './assets/stylesheets/app.css'

import App from './App'
import ScrollToTop from './components/partials/ScrollToTop'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
)

// En producción cada página llega pre-renderizada; `npm run dev` sirve la raíz vacía.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

// sw.js lo genera scripts/prerender.ts: solo existe en el build.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.warn('[sw] no se pudo registrar el service worker', error)
    })
  })
}
