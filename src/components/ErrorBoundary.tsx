"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    console.error("Component stack:", errorInfo.componentStack);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({
  error,
  retry,
}) => {
  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Terjadi Kesalahan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
          </p>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          {error && process.env.NODE_ENV === "development" && (
            <details className="text-xs text-gray-500">
              <summary>Detail Error (Development)</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
            </details>
          )}
          <Button onClick={retry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};