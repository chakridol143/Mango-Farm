import React from 'react';

/**
 * Catches render-time errors anywhere below it so a single bad component /
 * malformed API payload shows a recovery screen instead of a blank white page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface in the console for debugging; swap for a logging service if desired.
    console.error('Unhandled UI error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '3rem' }}>🥭</div>
          <h1 style={{ margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#606c38', maxWidth: 420 }}>
            Sorry — that page hit an unexpected error. Please head back to the
            home page and try again.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.75rem',
              borderRadius: '999px',
              border: 'none',
              background: '#F58A07',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
