const num = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i'))
  if (!m) return null
  const n = Number(String(m[1]).replace(',', '.'))
  return Number.isFinite(n) ? n : String(m[1]).trim()
}

export const parseSolarXml = xml => {
  if (!xml || !String(xml).includes('<solar')) return null
  const texto = String(xml)
  const updated = num(texto, 'updated')
  return {
    sfi: Number(num(texto, 'solarflux')) || null,
    sunspots: Number(num(texto, 'sunspots')) || null,
    aIndex: Number(num(texto, 'aindex')) || null,
    kIndex: Number(num(texto, 'kindex')) || null,
    kIndexNt: Number(num(texto, 'kindexnt')) || null,
    xray: num(texto, 'xray'),
    geomagField: num(texto, 'geomagfield'),
    signalnoise: num(texto, 'signalnoise'),
    updated: typeof updated === 'string' ? updated : num(texto, 'updated'),
    source: 'https://www.hamqsl.com/solarxml.php'
  }
}
