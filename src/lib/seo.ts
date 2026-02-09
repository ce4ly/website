import { CLUB, SITE_URL } from './club'
import { PAGINAS_SITEMAP, paginaPorRuta, rutaDe, type Pagina } from './paginas'
import { FEED_BOLETINES } from './proxies'

const TITULO_SITIO = 'Radio Club Lircay CE4LY'

/** Imagen Open Graph por defecto (public/og-default.png, 1200×630). */
const IMAGEN = { url: CLUB.ogImage, width: 1200, height: 630, alt: 'Logo del Radio Club Lircay' }

export type HeadTag = { tag: 'meta' | 'link'; attrs: Record<string, string> }

export type PageHead = { title: string; tags: HeadTag[] }

/** URL absoluta de una ruta del sitio (las rutas de página ya llevan barra final). */
function absoluteUrl(ruta: string): string {
  return `${SITE_URL}${ruta}`
}

/** «Cursos — Radio Club Lircay CE4LY»; en la portada, «… — CE4LY». */
function tituloDocumento(pagina: Pagina): string {
  if (pagina.path === '/') return `${pagina.title} — CE4LY`
  return `${pagina.title} — ${TITULO_SITIO}`
}

const meta = (name: string, content: string): HeadTag => ({ tag: 'meta', attrs: { name, content } })
const og = (property: string, content: string): HeadTag => ({
  tag: 'meta',
  attrs: { property, content },
})

function etiquetasSociales(title: string, description: string, url: string): HeadTag[] {
  return [
    og('og:type', 'website'),
    og('og:site_name', CLUB.nombre),
    og('og:title', title),
    og('og:description', description),
    og('og:url', url),
    og('og:locale', 'es_CL'),
    og('og:image', IMAGEN.url),
    og('og:image:width', String(IMAGEN.width)),
    og('og:image:height', String(IMAGEN.height)),
    og('og:image:alt', IMAGEN.alt),
    meta('twitter:card', 'summary_large_image'),
    meta('twitter:title', title),
    meta('twitter:description', description),
    meta('twitter:image', IMAGEN.url),
    meta('twitter:image:alt', IMAGEN.alt),
  ]
}

/** Título y etiquetas de `<head>` para una ruta (`/`, `/calculadoras/dipolo/`, …). */
export function pageHead(pathname: string): PageHead {
  const pagina = paginaPorRuta(pathname)

  if (!pagina) {
    return {
      title: `Página no encontrada — ${TITULO_SITIO}`,
      tags: [meta('robots', 'noindex')],
    }
  }

  const title = tituloDocumento(pagina)
  const url = absoluteUrl(pagina.path)
  const tags: HeadTag[] = [
    meta('description', pagina.description),
    meta('keywords', pagina.keywords.join(', ')),
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
  ]
  if (pagina.visibilidad === 'borrador') {
    tags.push(meta('robots', 'noindex'))
  }
  tags.push(...etiquetasSociales(title, pagina.description, url))
  if (pagina.path === rutaDe('boletines')) {
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Boletines del Radio Club Lircay',
        href: absoluteUrl(FEED_BOLETINES),
      },
    })
  }
  return { title, tags }
}

/** Marca las etiquetas gestionadas para poder reemplazarlas al navegar en el cliente. */
export const HEAD_TAG_MARKER = 'data-page-head'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** HTML de `<title>` + etiquetas, para el prerender. */
export function renderPageHead({ title, tags }: PageHead): string {
  const lines = [`<title>${escapeHtml(title)}</title>`]
  for (const { tag, attrs } of tags) {
    const attrText = Object.entries(attrs)
      .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
      .join(' ')
    lines.push(`<${tag} ${attrText} ${HEAD_TAG_MARKER} />`)
  }
  return lines.join('\n    ')
}

export function sitemapXml(): string {
  const urls = PAGINAS_SITEMAP.map(
    (pagina) => `  <url>\n    <loc>${absoluteUrl(pagina.path)}</loc>\n  </url>`,
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}
