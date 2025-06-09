import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AIBadgeProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export const AIBadge: React.FC<AIBadgeProps> = ({ 
  variant = 'outline',
  size = 'sm',
  className,
  showIcon = true,
  label = 'AI Generated'
}) => {
  // AI badges hidden as requested
  return null;
  
  /* Original AIBadge implementation commented out
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      variant={variant} 
      className={cn(
        'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Sparkles className={cn('mr-1', iconSizes[size])} />}
      {label}
    </Badge>
  );
  */
};

interface AIContentWrapperProps {
  children: React.ReactNode;
  isAI?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const AIContentWrapper: React.FC<AIContentWrapperProps> = ({
  children,
  isAI = false,
  isLoading = false,
  loadingText = 'Generating AI content...',
  className,
  badgePosition = 'top-right'
}) => {
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2'
  };

  if (isLoading) {
    return (
      <div className={cn('relative min-h-[100px] flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">{loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      {/* AI badges hidden as requested */}
      {/* isAI && (
        <div className={cn('absolute z-10', positionClasses[badgePosition])}>
          <AIBadge />
        </div>
      ) */}
    </div>
  );
};

export default AIBadge;
