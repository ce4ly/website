import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { HEAD_TAG_MARKER, pageHead, type PageHead } from '../../lib/seo'

function applyPageHead({ title, tags }: PageHead) {
  document.title = title
  for (const el of document.head.querySelectorAll(`[${HEAD_TAG_MARKER}]`)) {
    el.remove()
  }
  for (const { tag, attrs } of tags) {
    const el = document.createElement(tag)
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value)
    }
    el.setAttribute(HEAD_TAG_MARKER, '')
    document.head.appendChild(el)
  }
}

/**
 * El HTML pre-renderizado ya trae estas etiquetas (scripts/prerender.ts); al navegar en el cliente
 * se reemplazan por las de la nueva ruta.
 */
const DocumentHead = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    applyPageHead(pageHead(pathname))
  }, [pathname])

  return null
}

export default DocumentHead
