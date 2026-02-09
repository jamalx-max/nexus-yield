import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: { xs?: 'vertical' | 'horizontal'; md?: 'vertical' | 'horizontal' };
  gap?: number;
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = { xs: 'vertical', md: 'horizontal' },
  gap = 4,
  className,
}) => {
  return (
    <div
      className={cn(
        direction.xs === 'vertical' ? 'flex-col' : 'flex-row',
        direction.md === 'horizontal' && 'md:flex-row',
        direction.md === 'vertical' && 'md:flex-col',
        `gap-${gap}`,
        'flex',
        className
      )}
    >
      {children}
    </div>
  );
};
