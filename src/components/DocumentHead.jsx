import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { jsonLdOrganization } from '../lib/club.js'
import { metaDeRuta } from '../lib/meta.js'

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
  }, [pathname])

  return null
}

export default DocumentHead
