import { describe, expect, it } from 'vitest'
import {
  getBoletinesRss,
  resetBoletinesCache,
  soundCloudFeedUrl
} from './boletines-rss.js'

describe('getBoletinesRss', () => {
  it('responde 503 si no hay SOUNDCLOUD_USER_ID', async () => {
    resetBoletinesCache()
    const r = await getBoletinesRss({})
    expect(r.status).toBe(503)
    expect(r.body).toBeNull()
  })

  it('cachea el feed al menos 60 minutos', async () => {
    resetBoletinesCache()
    let llamadas = 0
    const xml = '<?xml version="1.0"?><rss><channel></channel></rss>'
    const fetchImpl = async () => {
      llamadas += 1
      return { ok: true, text: async () => xml }
    }
    const env = { SOUNDCLOUD_USER_ID: '1676930966' }
    const a = await getBoletinesRss(env, { ahora: 1000, fetchImpl })
    const b = await getBoletinesRss(env, {
      ahora: 1000 + 59 * 60 * 1000,
      fetchImpl
    })
    expect(a.body).toBe(xml)
    expect(b.fromCache).toBe(true)
    expect(llamadas).toBe(1)
  })

  it('sirve la última copia si la fuente falla', async () => {
    resetBoletinesCache()
    const xml = '<?xml version="1.0"?><rss><channel></channel></rss>'
    const env = { SOUNDCLOUD_USER_ID: '1' }
    await getBoletinesRss(env, {
      ahora: 0,
      fetchImpl: async () => ({ ok: true, text: async () => xml })
    })
    const r = await getBoletinesRss(env, {
      ahora: 2 * 60 * 60 * 1000,
      fetchImpl: async () => {
        throw new Error('red')
      }
    })
    expect(r.status).toBe(200)
    expect(r.stale).toBe(true)
    expect(r.body).toBe(xml)
  })

  it('arma la URL del feed de SoundCloud', () => {
    expect(soundCloudFeedUrl('1676930966')).toBe(
      'https://feeds.soundcloud.com/users/soundcloud:users:1676930966/sounds.rss'
    )
  })
})
