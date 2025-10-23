'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle, 
  Copy, 
  RefreshCw,
  X,
  Zap
} from 'lucide-react';

interface ErrorSimplifierProps {
  errorMessage: string;
  context?: string;
  onClose?: () => void;
  className?: string;
}

export default function ErrorSimplifier({ 
  errorMessage, 
  context, 
  onClose,
  className = '' 
}: ErrorSimplifierProps) {
  const [simplifiedError, setSimplifiedError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSimplified, setShowSimplified] = useState(false);

  const handleSimplifyError = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ai/simplify-error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorMessage,
          context
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSimplifiedError(data.simplifiedExplanation);
        setShowSimplified(true);
      } else {
        setSimplifiedError('Failed to simplify error. Please try again.');
        setShowSimplified(true);
      }
    } catch (error) {
      console.error('Error simplification failed:', error);
      setSimplifiedError('Failed to connect to error simplification service.');
      setShowSimplified(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleReset = () => {
    setSimplifiedError('');
    setShowSimplified(false);
  };

  return (
    <div className={`bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Error Detected
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Original Error */}
      <Card className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-700 dark:text-red-300 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Original Error
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-red-100 dark:bg-red-900/40 rounded-md p-3 font-mono text-sm text-red-800 dark:text-red-200 overflow-x-auto">
            {errorMessage}
          </div>
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyToClipboard(errorMessage)}
              className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-200"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simplify Button */}
      {!showSimplified && (
        <div className="text-center">
          <Button
            onClick={handleSimplifyError}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Simplifying...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Simplify Error
              </>
            )}
          </Button>
        </div>
      )}

      {/* Simplified Error */}
      {showSimplified && simplifiedError && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700 dark:text-green-300 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Simplified Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-green-100 dark:bg-green-900/40 rounded-md p-4 text-sm text-green-800 dark:text-green-200 prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: simplifiedError.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>
            <div className="flex justify-between mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Simplify Again
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyToClipboard(simplifiedError)}
                className="text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Explanation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Context Information */}
      {context && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Context:</strong> {context}
          </p>
        </div>
      )}
    </div>
  );
}
