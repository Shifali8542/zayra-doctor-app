import React from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

interface ZayraLogoProps {
  style?: ViewStyle;
  size?: number;
}

const logoImage = require('../../assets/icon.png');

export const ZayraLogo: React.FC<ZayraLogoProps> = ({ style, size = 40 }) => {
  const theme = useAppTheme();
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={logoImage}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};
