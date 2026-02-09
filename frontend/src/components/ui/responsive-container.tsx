import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = true,
  className,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto',
        maxWidthClasses[maxWidth],
        padding && 'px-4 md:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};
