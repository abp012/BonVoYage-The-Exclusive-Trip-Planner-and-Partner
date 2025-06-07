import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
  className?: string;
  showRetry?: boolean;
  title?: string;
  description?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  className,
  showRetry = true,
  title = 'AI Content Unavailable',
  description = 'Unable to generate AI content at the moment. Using fallback information.'
}) => {
  return (
    <Card className={cn('border-orange-200 bg-orange-50', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-orange-800 mb-1">{title}</h4>
            <p className="text-sm text-orange-700 mb-3">{description}</p>
            {error && (
              <p className="text-xs text-orange-600 mb-3 font-mono bg-orange-100 p-2 rounded">
                {error}
              </p>
            )}
            {showRetry && onRetry && (
              <Button 
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorFallback;
