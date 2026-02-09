import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  className,
}) => {
  const sizeClasses = {
    sm: 'text-xs md:text-sm',
    base: 'text-sm md:text-base',
    lg: 'text-base md:text-lg',
    xl: 'text-lg md:text-xl',
    '2xl': 'text-xl md:text-2xl',
    '3xl': 'text-2xl md:text-3xl',
  };

  return (
    <span className={cn(sizeClasses[size], `font-${weight}`, className)}>
      {children}
    </span>
  );
};
