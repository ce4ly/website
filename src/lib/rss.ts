export type EpisodioRss = {
  title: string
  link: string
  pubDate: string
  description: string
}

const decodeXml = (texto: string): string =>
  texto
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()

const primerTag = (bloque: string, nombre: string): string => {
  const re = new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`, 'i')
  const m = bloque.match(re)
  return m ? decodeXml(m[1]) : ''
}

/** Episodios (`<item>`) de un feed RSS 2.0, en el orden del feed. */
export function parsearFeedRss(xml: string): EpisodioRss[] {
  const items: EpisodioRss[] = []
  for (const [, bloque] of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const title = primerTag(bloque, 'title')
    const link = primerTag(bloque, 'link')
    if (!title && !link) continue
    items.push({
      title: title || 'Sin título',
      link,
      pubDate: primerTag(bloque, 'pubDate'),
      description: primerTag(bloque, 'description'),
    })
  }
  return items
}

export function formatearFechaRss(pubDate: string): string {
  if (!pubDate) return ''
  const d = new Date(pubDate)
  if (Number.isNaN(d.getTime())) return pubDate
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeZone: 'America/Santiago',
  }).format(d)
}

/** Fecha del feed (RFC 822) en ISO 8601 para `<time dateTime>`; `undefined` si no es válida. */
export function fechaIsoRss(pubDate: string): string | undefined {
  const d = new Date(pubDate)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}
