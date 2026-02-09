import { defineConfig, type ProxyOptions } from 'vite'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { PROXIES } from './src/lib/proxies.ts'

/** Mismos proxies que `[[redirects]]` con `status = 200` en netlify.toml, para `npm run dev`. */
const proxy = Object.fromEntries(
  Object.values(PROXIES).map(({ ruta, destino }): [string, ProxyOptions] => {
    const url = new URL(destino)
    return [
      ruta,
      { target: url.origin, changeOrigin: true, rewrite: () => url.pathname + url.search },
    ]
  }),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Año del © con que se pre-renderiza el footer (ver Footer.tsx).
  define: { 'import.meta.env.VITE_ANIO_BUILD': JSON.stringify(new Date().getFullYear()) },
  server: { proxy },
  ssr: {
    noExternal: [
      'react-router-dom',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-brands-svg-icons',
    ],
  },
})
