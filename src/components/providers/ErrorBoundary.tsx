import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.context || 'unknown component'}:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Log additional details in development
      if (process.env.NODE_ENV === 'development') {
        console.debug('Error Details:', {
          context: this.props.context,
          error: this.state.error,
          errorInfo: this.state.errorInfo,
        });
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function SectionError({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <h3 className="text-destructive font-medium">Error loading {title}</h3>
      <p className="text-muted-foreground text-sm mt-2">
        There was a problem loading this section. Please try refreshing the page.
      </p>
    </div>
  );
}