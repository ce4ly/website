/** Perfil público del club. */
export const SOUNDCLOUD_RADIO_CLUB_PROFILE = 'https://soundcloud.com/radio-club-lircay'

/** ID público del mismo perfil (no es secreto). */
export const SOUNDCLOUD_USER_ID = '1676930966'

export function soundCloudFeedUrl(userId: string): string {
  return `https://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`
}

/** Origen del reproductor embebido; la CSP lo permite en `frame-src` (netlify.toml). */
export const SOUNDCLOUD_WIDGET_ORIGIN = 'https://w.soundcloud.com'

/**
 * URL del reproductor embebido (HTML5 Widget).
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
export function soundCloudWidgetSrc(resourceUrl = SOUNDCLOUD_RADIO_CLUB_PROFILE): string {
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
  })
  return `${SOUNDCLOUD_WIDGET_ORIGIN}/player/?${params}`
}
