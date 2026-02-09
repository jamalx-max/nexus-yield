import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  mobileFullWidth?: boolean;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className,
  mobileFullWidth = true,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-4',
        'md:p-6',
        mobileFullWidth && 'w-full',
        className
      )}
    >
      {children}
    </div>
  );
};
