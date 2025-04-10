import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveValues {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  containerMaxWidth: number;
  horizontalPadding: number;
  gridColumns: number;
}

/**
 * Custom hook for responsive design
 * Detects screen size and provides appropriate values for layout
 */
export function useResponsive(): ResponsiveValues {
  // Window dimensions
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  // Update dimensions on window changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription.remove();
  }, []);

  // Determine current screen size
  const getScreenSize = (width: number): ScreenSize => {
    if (width >= 1200) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  };

  const screenSize = getScreenSize(dimensions.width);
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isDesktop = screenSize === 'desktop';

  // Get appropriate container width based on screen size
  const getContainerMaxWidth = (): number => {
    if (isDesktop) return 1140; // Desktop container max width
    if (isTablet) return dimensions.width - 48; // Tablet gets some padding
    return dimensions.width; // Mobile takes full width
  };

  // Get appropriate horizontal padding based on screen size
  const getHorizontalPadding = (): number => {
    if (isDesktop) return 48;
    if (isTablet) return 32;
    return 16; // Mobile padding
  };

  // Get appropriate number of grid columns based on screen size
  const getGridColumns = (): number => {
    if (isDesktop) return 4;
    if (isTablet) return 3;
    return 2; // Mobile grid columns
  };

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
    containerMaxWidth: getContainerMaxWidth(),
    horizontalPadding: getHorizontalPadding(),
    gridColumns: getGridColumns(),
  };
} 