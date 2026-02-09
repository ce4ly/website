import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'

import App from './App'

export async function render(url: string): Promise<string> {
  // A diferencia de renderToString, espera a que resuelvan las páginas lazy, así el HTML
  // pre-renderizado incluye su contenido en vez del fallback de Suspense.
  // `progressiveChunkSize: Infinity`: sin él, React saca los límites de Suspense grandes a un
  // `<div hidden>` que revela con scripts en línea (ocultos sin JS y bloqueados por la CSP).
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    { progressiveChunkSize: Infinity },
  )

  return new Response(prelude).text()
}
