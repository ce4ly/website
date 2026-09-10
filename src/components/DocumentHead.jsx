import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  jsonLdContactPoint,
  jsonLdOrganization,
  SITE_URL
} from '../lib/club.js'
import { metaDeRuta } from '../lib/meta.js'
import { FEED_BOLETINES } from '../lib/rss.js'

const upsertMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(
      attrs.property ? 'meta' : attrs.rel ? 'link' : 'meta'
    )
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined) el.setAttribute(k, v)
  }
  return el
}

const DocumentHead = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const m = metaDeRuta(pathname)
    document.documentElement.lang = 'es-CL'
    document.title = m.title
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: m.description
    })
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: m.canonical })
    const og = {
      'og:title': m.title,
      'og:description': m.description,
      'og:url': m.canonical,
      'og:type': 'website',
      'og:site_name': 'Radio Club Lircay',
      'og:locale': 'es_CL',
      'og:image': m.image
    }
    for (const [property, content] of Object.entries(og)) {
      upsertMeta(`meta[property="${property}"]`, { property, content })
    }
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image'
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: m.title
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: m.description
    })
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: m.image
    })

    const jsonId = 'jsonld-organization'
    let jsonEl = document.getElementById(jsonId)
    if (pathname === '/') {
      if (!jsonEl) {
        jsonEl = document.createElement('script')
        jsonEl.type = 'application/ld+json'
        jsonEl.id = jsonId
        document.head.appendChild(jsonEl)
      }
      jsonEl.textContent = JSON.stringify(jsonLdOrganization())
    } else if (jsonEl) {
      jsonEl.remove()
    }

    const contactId = 'jsonld-contactpoint'
    let contactEl = document.getElementById(contactId)
    if (pathname === '/contacto') {
      if (!contactEl) {
        contactEl = document.createElement('script')
        contactEl.type = 'application/ld+json'
        contactEl.id = contactId
        document.head.appendChild(contactEl)
      }
      contactEl.textContent = JSON.stringify(jsonLdContactPoint())
    } else if (contactEl) {
      contactEl.remove()
    }

    const rssSel = 'link[rel="alternate"][type="application/rss+xml"]'
    let rssEl = document.head.querySelector(rssSel)
    if (pathname === '/boletines') {
      if (!rssEl) {
        rssEl = document.createElement('link')
        document.head.appendChild(rssEl)
      }
      rssEl.setAttribute('rel', 'alternate')
      rssEl.setAttribute('type', 'application/rss+xml')
      rssEl.setAttribute('title', 'Boletines del Radio Club Lircay')
      rssEl.setAttribute('href', `${SITE_URL}${FEED_BOLETINES}`)
    } else if (rssEl) {
      rssEl.remove()
    }
  }, [pathname])

  return null
}

export default DocumentHead
