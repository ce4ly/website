/** Perfil público — convierte en URL de widget o parámetro `url` de oEmbed. */
export const SOUNDCLOUD_RADIO_CLUB_PROFILE =
  'https://soundcloud.com/radio-club-lircay'

const OEMBED_ENDPOINT = 'https://soundcloud.com/oembed.json'

/**
 * Construye la URL del reproductor embebido (HTML5 Widget).
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
export function soundCloudWidgetSrc(
  resourceUrl = SOUNDCLOUD_RADIO_CLUB_PROFILE,
  extraParams = {}
) {
  const params = new URLSearchParams({
    visual: 'true',
    url: resourceUrl,
    color: '#ff5500',
    auto_play: 'false',
    hide_related: 'false',
    show_comments: 'true',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'true',
    show_artwork: 'true',
    ...extraParams
  })
  return `https://w.soundcloud.com/player/?${params}`
}

/**
 * Metadatos y HTML oficial del embed (sin API key).
 * @see https://developers.soundcloud.com/docs/oembed
 */
export async function fetchSoundCloudOEmbed(resourceUrl) {
  const endpoint = new URL(OEMBED_ENDPOINT)
  endpoint.searchParams.set('format', 'json')
  endpoint.searchParams.set('url', resourceUrl)
  endpoint.searchParams.set('maxheight', '450')

  const res = await fetch(endpoint)
  if (!res.ok) {
    throw new Error(`SoundCloud oEmbed: ${res.status}`)
  }
  return res.json()
}
