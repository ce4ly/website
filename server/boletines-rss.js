const TTL_MS = 60 * 60 * 1000

let cache = { xml: null, fetchedAt: 0 }

export function soundCloudFeedUrl(userId) {
  return `https://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`
}

export function resetBoletinesCache() {
  cache = { xml: null, fetchedAt: 0 }
}

export async function getBoletinesRss(
  env,
  { ahora = Date.now(), fetchImpl = fetch } = {}
) {
  const userId = env.SOUNDCLOUD_USER_ID?.trim()
  if (!userId) {
    return { status: 503, body: null, reason: 'unconfigured' }
  }

  if (cache.xml && ahora - cache.fetchedAt < TTL_MS) {
    return { status: 200, body: cache.xml, fromCache: true }
  }

  try {
    const res = await fetchImpl(soundCloudFeedUrl(userId), {
      headers: { 'User-Agent': 'CE4LY/1.0 (+https://www.ce4ly.cl/)' }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    if (!xml.includes('<rss') && !xml.includes('<feed')) {
      throw new Error('respuesta que no es RSS')
    }
    cache = { xml, fetchedAt: ahora }
    return { status: 200, body: xml }
  } catch (e) {
    console.error('[boletines.xml]', e)
    if (cache.xml) {
      return { status: 200, body: cache.xml, stale: true }
    }
    return { status: 503, body: null, reason: 'unavailable' }
  }
}

export function cuerpoErrorRss() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Boletines Radio Club Lircay</title>
    <link>https://www.ce4ly.cl/boletines</link>
    <description>El feed no está disponible en este momento.</description>
  </channel>
</rss>
`
}
