// Responsive breakpoint utilities

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

export function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < BREAKPOINTS.md;
}

export function isTablet(): boolean {
  return typeof window !== 'undefined' && 
         window.innerWidth >= BREAKPOINTS.md && 
         window.innerWidth < BREAKPOINTS.lg;
}

export function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= BREAKPOINTS.lg;
}
