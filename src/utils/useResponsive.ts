import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { DeviceType, getDeviceType } from './responsive';

interface ResponsiveInfo {
  width: number;
  height: number;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useResponsive = (): ResponsiveInfo => {
  const [dim, setDim] = useState<ScaledSize>(Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDim(window);
    });
    return () => sub.remove();
  }, []);

  const deviceType = getDeviceType(dim.width);
  return {
    width: dim.width,
    height: dim.height,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
};
