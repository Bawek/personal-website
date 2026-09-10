'use client'

import { Component } from 'react'
import { HiExclamationTriangle, HiRefresh } from 'react-icons/hi'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <HiExclamationTriangle size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              {this.props.fallbackMessage || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 mb-2">
                  Error details
                </summary>
                <pre className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-3 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:from-violet-400 hover:to-pink-400 transition-all"
            >
              <HiRefresh size={18} />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorFallback({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
      <HiExclamationTriangle size={32} className="mb-3 opacity-40" />
      <p className="text-sm mb-3">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
        >
          <HiRefresh size={12} /> Try again
        </button>
      )}
    </div>
  )
}
