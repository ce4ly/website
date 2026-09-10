import { CLUB, SITE_URL } from './club.js'
import { PAGINAS_SITEMAP, paginaPorRuta } from './tools-catalog.js'

const TITULO_SITIO = 'Radio Club Lircay CE4LY'

const escapeAttr = valor =>
  String(valor)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')

export const canonicalDe = path => {
  if (!path || path === '/') return `${SITE_URL}/`
  const limpio = path.endsWith('/') ? path.slice(0, -1) : path
  return `${SITE_URL}${limpio}`
}

export const tituloDocumento = pagina => {
  if (!pagina) return TITULO_SITIO
  if (pagina.path === '/') return `${pagina.title} — CE4LY`
  return `${pagina.title} — ${TITULO_SITIO}`
}

export const metaDeRuta = path => {
  const pagina = paginaPorRuta(path)
  const title = tituloDocumento(pagina)
  const description =
    pagina?.description ||
    'Sitio del Radio Club Lircay de Talca (CE4LY), radioafición en la Región del Maule.'
  const canonical = canonicalDe(path)
  const image = pagina?.ogImage
    ? pagina.ogImage.startsWith('http')
      ? pagina.ogImage
      : `${SITE_URL}${pagina.ogImage}`
    : CLUB.ogImage
  const keywords = pagina?.keywords?.join(', ') || 'radioafición, CE4LY, Talca'
  return {
    title,
    description,
    canonical,
    image,
    keywords,
    path: pagina?.path || path
  }
}

/** Forma compatible con el export `meta` de React Router. */
export const meta = ({ location } = {}) => {
  const path =
    typeof location === 'string' ? location : (location?.pathname ?? '/')
  const m = metaDeRuta(path)
  return [
    { title: m.title },
    { name: 'description', content: m.description },
    { name: 'keywords', content: m.keywords },
    { tagName: 'link', rel: 'canonical', href: m.canonical },
    { property: 'og:title', content: m.title },
    { property: 'og:description', content: m.description },
    { property: 'og:url', content: m.canonical },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Radio Club Lircay' },
    { property: 'og:locale', content: 'es_CL' },
    { property: 'og:image', content: m.image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: m.title },
    { name: 'twitter:description', content: m.description },
    { name: 'twitter:image', content: m.image }
  ]
}

export const metaTagsHtml = path => {
  const m = metaDeRuta(path)
  return [
    `<title>${escapeAttr(m.title)}</title>`,
    `<meta name="description" content="${escapeAttr(m.description)}" />`,
    `<meta name="keywords" content="${escapeAttr(m.keywords)}" />`,
    `<link rel="canonical" href="${escapeAttr(m.canonical)}" />`,
    `<meta property="og:title" content="${escapeAttr(m.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(m.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(m.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Radio Club Lircay" />`,
    `<meta property="og:locale" content="es_CL" />`,
    `<meta property="og:image" content="${escapeAttr(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(m.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(m.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(m.image)}" />`
  ].join('\n    ')
}

export const sitemapXml = () => {
  const urls = PAGINAS_SITEMAP.map(
    p => `  <url>\n    <loc>${canonicalDe(p.path)}</loc>\n  </url>`
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export const robotsTxt = () => `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
