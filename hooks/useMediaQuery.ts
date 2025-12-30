import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  width: number;
  height: number;
}

export const useMediaQuery = (): MediaQueryResult => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  const deviceType: DeviceType = isMobile
    ? 'mobile'
    : isTablet
      ? 'tablet'
      : 'desktop';

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    width: windowSize.width,
    height: windowSize.height,
  };
};
