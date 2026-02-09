# AGENTS.md — Sitio del Radio Club Lircay (CE4LY)

Guía para agentes de IA que trabajen en este repositorio: qué es el proyecto, cómo está armado y
qué convenciones respetar.

## Qué es este sitio

- Sitio del **Radio Club Lircay de Talca** (indicativo **CE4LY**), organización comunitaria.
- Dominio de producción: **https://www.ce4ly.cl/** (constante `SITE_URL` en `src/lib/club.ts`).
- Solo en **español de Chile** (`lang="es-CL"`, números con coma decimal: `146,380`).
- Público: radioaficionados y vecinos de la Región del Maule. Tono cercano y técnico.

## Stack técnico

| Capa    | Tecnología                                                                    |
| ------- | ----------------------------------------------------------------------------- |
| UI      | React 19 + TypeScript estricto                                                |
| Build   | Vite 8                                                                        |
| Estilos | Tailwind CSS 4; tema oscuro con la clase `dark` en `<html>`                   |
| Rutas   | react-router-dom 7, rutas con barra final                                     |
| Iconos  | heroicons vía `<Icono nombre>`; Font Awesome vía `<Icon icon>` (sin svg-core) |
| Mapas   | Leaflet 1.9 con teselas de OpenStreetMap, cargado al montar (`MapaGrid`)      |
| Deploy  | **Netlify**: estático + Netlify Forms + proxies (`netlify.toml`)              |
| Render  | **SSG**: una página HTML por ruta + `404.html`; service worker offline        |

## Estructura

```
src/
  lib/paginas.ts            → catálogo de páginas: slug, ruta, título, descripción (fuente de verdad)
  lib/seo.ts                → <head> de cada ruta (título, canonical, Open Graph) y sitemap
  lib/proxies.ts            → rutas que Netlify reexpone desde otro origen
  lib/calc/                 → cálculos puros (antenas, Morse, Maidenhead…), con pruebas
  lib/*.ts                  → datos (frecuencias, tonos, indicativos, cursos, club…)
  hooks/useQueryState.ts    → estado de formulario sincronizado con el query string
  components/partials/      → layout: Header, Footer, Contenido (rutas), DocumentHead, estilos…
  components/calculadora/   → CalculadoraLayout, Campos, Diagrama (piezas SVG), Pestanas…
  components/referencia/    → tablas de referencia (TablaReferencia, estilos)
  components/pages/         → una página por archivo
scripts/prerender.ts        → SSG, sitemap.xml y sw.js
scripts/service-worker.js   → plantilla del service worker
scripts/imagenes.sh         → PNG del logo (favicon, íconos, Open Graph) desde logo-frontpage.svg
tests/                      → node:test + tsx
netlify.toml                → build, proxies, redirects, cabeceras (CSP)
```

## Rutas y páginas

- Todas las rutas llevan **barra final** (`/calculadoras/dipolo/`): es la URL con que Netlify sirve
  cada `index.html` pre-renderizado; sin barra, Netlify responde primero con un 301.
- Enlaces internos con **`rutaDe('id')`** (o `enlaceContacto(asunto)`), nunca con paths escritos a
  mano. `<a href>` solo para enlaces externos.
- `visibilidad` en el catálogo: `'oculta'` (fuera del sitemap, indexable) o `'borrador'` (fuera del
  sitemap y `noindex`, para texto provisional, como `/ca5nfs/`, modelo de las páginas del directorio).
- **Términos y Privacidad** (`/terminos/`, `/privacidad/`): si el sitio empieza a recoger otros
  datos, agrega un servicio externo o cambia el formulario, hay que actualizar la política de
  privacidad y su fecha.

**Al añadir una página:**

1. Componente en `src/components/pages/<Nombre>.tsx` (solo exporta el componente). Empieza con
   `<Encabezado>`: la franja azul con título, bajada y logo, como la portada (la sección va en
   `mb-16`, sin margen arriba). La etiqueta amarilla es la `section` de la herramienta.
2. Entrada en `src/lib/paginas.ts` (`PAGINAS_ESTATICAS` o `TOOLS` con su `section`).
3. Registro en `PAGE_COMPONENTS` (`src/components/partials/Contenido.tsx`); TypeScript exige que
   estén todas.
4. Si sale en el menú principal: `NAV_PRINCIPAL` (`src/lib/nav.ts`).
5. Si reemplaza una URL antigua: redirect 301 en `netlify.toml` hacia la ruta con barra final.

## Calculadoras y referencias

- Layout: `CalculadoraLayout` + `Articulo`, `Campo`, `Resultado`/`Fila`, `Formula`, `Nota`, `Cota`.
- Entradas: `CampoNumero` (texto con `inputMode="decimal"` para aceptar coma) y `Selector`.
  Interpretar con `parseNumero` y validar con `esPositivo`/`frecuenciaValida` (estrechan a `number`).
- Formato: `formatearNumero`, `formatearFijo`, `formatearLongitud` (cm bajo 3 m), `formatearLongitudCm`.
- Diagramas: `Diagrama` + `Alambre`, `Punta`, `Alimentacion`, `CotaSvg`, `Etiqueta`, `Rotulo`,
  `Suelo`, `Linea`. Las letras del diagrama coinciden con las de la tabla de resultados (`Cota`).
- Cálculos con más de una fórmula van en `src/lib/calc/` con su prueba en `tests/`.
- Tablas: `CajaTabla` + `Tabla` (muestra «No hay coincidencias.» con `vacia`), `FiltroReferencia`,
  `normalizarBusqueda` (sin tildes ni mayúsculas), `NotaFuente` + `EnlaceFuente`.
- Estado en la URL: `useQueryState(DEFAULTS)` con `DEFAULTS` constante de módulo. Guarda solo lo
  distinto del valor por defecto; un campo vaciado queda vacío (`?r2=`).

## Socios y operativos

- **Socios:** `socios.txt` (raíz, un indicativo por línea) es la fuente. `npm run socios`
  (`scripts/socios.ts`) valida y genera `public/data/socios.json` (no se versiona); corre solo antes
  de `dev` y `build`. El buscador (`/buscador/`) lista los socios por apellido y los resalta.
- **Control de Operativo** (`/herramientas/operativo/`): el registro vive en `localStorage`
  (`ce4ly-operativo`, `src/hooks/useOperativo.ts`); la lógica y el reporte .txt, en
  `src/lib/operativo.ts`. Enter solo registra una fila elegida con ↑/↓ o una coincidencia exacta
  única, para no anotar por error una estación parecida.

## Netlify

- **Formulario de contacto:** Netlify Forms, nombre **`contacto`** (no traducir nombres de campo:
  `nombre`, `correo`, `indicativo`, `asunto`, `mensaje`). Antispam: honeypot `bot-field` + filtro
  de Netlify. El aviso por correo a `contacto@ce4ly.cl` se configura en el panel de Netlify.
- **Proxies** (`[[redirects]]` con `status = 200`): `/boletines.xml` → feed RSS de SoundCloud,
  `/api/solar.xml` → hamqsl.com, `/api/clima.json` → Open-Meteo (clima de la portada, sin clave).
  Deben coincidir con `PROXIES` (`src/lib/proxies.ts`), que también usa `vite.config.ts` en
  desarrollo; `tests/netlify.test.ts` lo comprueba.
- **404:** no hay fallback SPA. Lo que no existe recibe `/404.html` con estado 404.
- **CSP** en `netlify.toml`: todo `'self'`, sin scripts ni estilos en línea (el tema se aplica con
  `public/tema.js`). Excepciones:
  - `frame-src`: reproductor de SoundCloud (`/boletines/`).
  - `media-src`: streams de radio del easter egg de la portada (`src/lib/emisoras.ts`).
  - `img-src`: teselas de OpenStreetMap (`src/lib/mapa.ts`) y `data:` (imágenes en línea de los
    SVG del navegador, p. ej. controles de formulario).
  - `connect-src`: Nominatim, el buscador de ciudades del Grid Maidenhead (`src/lib/lugares.ts`).

  El JSON-LD (`<JsonLd>`) no es ejecutable y la CSP no lo bloquea. Si se agrega un recurso externo,
  un script o un `style=` en línea, hay que ajustar la CSP (y la prueba).

- **Prerender:** `react-dom/static` con `progressiveChunkSize: Infinity` (sin scripts en línea).
  Las páginas son `lazy`: el prerender espera a que resuelvan y el cliente hidrata sin parpadeo.

## Sin conexión

`scripts/prerender.ts` genera `dist/sw.js` desde `scripts/service-worker.js`: precachea las
herramientas, cursos, emergencias y los assets; el nombre de la caché cambia con el contenido.
`/herramientas/reloj/`, `/contacto/` y los proxies van primero a la red.

## Qué evitar

- No escribir paths a mano (`/contacto`); usar `rutaDe('contacto')`.
- No exportar desde una página nada más que el componente (rompe el fast refresh).
- No leer `Date`, `localStorage`, `navigator` ni el query string durante el render inicial: el HTML
  pre-renderizado no los conoce y la hidratación falla. Usar efectos o `useSyncExternalStore` con
  instantánea de servidor (ver `ThemeSwitch`, `Reloj`, `useQueryState`).
- No agregar CDNs ni scripts en línea sin ajustar la CSP.
- No quitar redirects antiguos de `netlify.toml`.

## Comprobación rápida

- [ ] `npm run lint`, `npm run format:check` y `npm test` en verde.
- [ ] `npm run build` termina con «Pre-renderizadas N rutas …».
- [ ] Página nueva: catálogo + `PAGE_COMPONENTS` (+ menú si corresponde).
