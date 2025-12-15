import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>⚠️</span>
            </div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. An unexpected error has
              occurred.
            </p>

            {this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <div style={styles.errorContent}>
                  <p style={styles.errorText}>
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre style={styles.stackTrace}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.button}>
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: "20px",
  },
  icon: {
    fontSize: "64px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "12px",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  details: {
    textAlign: "left",
    marginBottom: "24px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "16px",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "600",
    color: "#667eea",
    marginBottom: "12px",
  },
  errorContent: {
    marginTop: "12px",
  },
  errorText: {
    fontSize: "14px",
    color: "#e74c3c",
    marginBottom: "12px",
  },
  stackTrace: {
    fontSize: "12px",
    color: "#666",
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "6px",
    overflow: "auto",
    maxHeight: "200px",
    border: "1px solid #e0e0e0",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    background: "#e0e0e0",
    color: "#333",
  },
};

export default ErrorBoundary;
