const decodeXml = texto =>
  String(texto)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()

const primerTag = (bloque, nombre) => {
  const re = new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`, 'i')
  const m = bloque.match(re)
  return m ? decodeXml(m[1]) : ''
}

export function parsearFeedRss(xml) {
  const items = []
  const re = /<item>([\s\S]*?)<\/item>/gi
  let m
  while ((m = re.exec(xml))) {
    const bloque = m[1]
    const title = primerTag(bloque, 'title')
    const link = primerTag(bloque, 'link')
    if (!title && !link) continue
    items.push({
      title: title || 'Sin título',
      link,
      pubDate: primerTag(bloque, 'pubDate'),
      description: primerTag(bloque, 'description')
    })
  }
  return items
}

export function formatearFechaRss(pubDate) {
  if (!pubDate) return ''
  const d = new Date(pubDate)
  if (Number.isNaN(d.getTime())) return pubDate
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeZone: 'America/Santiago'
  }).format(d)
}
