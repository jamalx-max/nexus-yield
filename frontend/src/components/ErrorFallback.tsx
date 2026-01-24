import type { ErrorInfo } from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
}

/**
 * Error Fallback UI
 * Professional error display with recovery options
 */
export function ErrorFallback({ error, errorInfo, resetError }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="text-2xl">Application Error</CardTitle>
              <CardDescription>
                Something went wrong. We apologize for the inconvenience.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-mono text-destructive break-words">
                {error.message || 'An unexpected error occurred'}
              </p>
            </div>
          )}

          {/* Error Details (Collapsible) */}
          {errorInfo && import.meta.env.DEV && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-2">
                Technical Details (Development Only)
              </summary>
              <pre className="p-4 rounded-lg bg-secondary overflow-auto max-h-64 text-xs font-mono">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}

          {/* Recovery Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={resetError}
              variant="default"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>

          {/* Support Information */}
          <p className="text-xs text-muted-foreground text-center pt-2">
            If this problem persists, please refresh the page or{' '}
            <a
              href="https://github.com/man-croft/ApexYield/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              report the issue
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
