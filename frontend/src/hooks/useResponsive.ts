import { useState, useEffect } from 'react';
import { getBreakpoint, isMobile, isTablet, isDesktop, type Breakpoint } from '../lib/responsive';

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => getBreakpoint());
  const [mobile, setMobile] = useState(() => isMobile());
  const [tablet, setTablet] = useState(() => isTablet());
  const [desktop, setDesktop] = useState(() => isDesktop());

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
      setMobile(isMobile());
      setTablet(isTablet());
      setDesktop(isDesktop());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: desktop,
  };
}
