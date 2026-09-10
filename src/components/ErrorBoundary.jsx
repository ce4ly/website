import { Component } from 'react'
import ErrorSitio from '../pages/ErrorSitio.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return <ErrorSitio tipo="servidor" />
    }
    return this.props.children
  }
}

export default ErrorBoundary
