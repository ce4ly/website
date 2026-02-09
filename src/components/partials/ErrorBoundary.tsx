import { Component, type ErrorInfo, type ReactNode } from 'react'

import ErrorSitio from '../pages/ErrorSitio'

type Props = { children: ReactNode }
type State = { error: Error | null }

/** Si una página falla al renderizar, muestra el aviso de error en vez de dejar el sitio en blanco. */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return <ErrorSitio tipo='error' />
    }
    return this.props.children
  }
}

export default ErrorBoundary
