import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from './App.jsx'

export const render = path => {
  const html = renderToString(
    <MemoryRouter initialEntries={[path]}>
      <AppLayout />
    </MemoryRouter>
  )
  return html
}
