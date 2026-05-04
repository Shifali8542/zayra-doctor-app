import { Dimensions, Platform, ScaledSize } from 'react-native';

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 600,
  desktop: 1024,
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const getDeviceType = (width: number): DeviceType => {
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
};

export const isWeb = Platform.OS === 'web';

export const getMaxContentWidth = (deviceType: DeviceType): number => {
  switch (deviceType) {
    case 'desktop':
      return 480; // mobile-style centered layout on desktop
    case 'tablet':
      return 560;
    case 'mobile':
    default:
      return 9999;
  }
};

export const getInitialDimensions = (): ScaledSize => Dimensions.get('window');
