'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Send error to monitoring service in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
      // reportError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleRefresh = () => {
    this.handleReset();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            An unexpected error occurred. Please try refreshing the page or contact support if the
            problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 p-4 bg-muted rounded-lg text-sm max-w-2xl w-full">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap text-xs overflow-auto">
                {this.state.error.stack}
              </pre>
              {this.state.errorInfo && (
                <pre className="whitespace-pre-wrap text-xs overflow-auto mt-2">
                  Component Stack: {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}

          <div className="flex gap-2">
            <Button onClick={this.handleReset} variant="outline">
              Try Again
            </Button>
            <Button onClick={this.handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
