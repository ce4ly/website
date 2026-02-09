import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from './App.jsx'

export function render(path) {
  const html = renderToString(
    <MemoryRouter initialEntries={[path]}>
      <AppLayout />
    </MemoryRouter>,
  )
  return html
}
