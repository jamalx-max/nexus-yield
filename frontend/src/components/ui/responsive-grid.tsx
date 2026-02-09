import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className,
}) => {
  const gridClasses = cn(
    'grid',
    `gap-${gap}`,
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  );

  return <div className={gridClasses}>{children}</div>;
};
