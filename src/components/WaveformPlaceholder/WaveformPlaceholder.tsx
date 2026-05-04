import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppTheme } from '../../context/ThemeContext';
import { createWaveformPlaceholderStyles } from './WaveformPlaceholder.style';

interface WaveformPlaceholderProps {
  height?: number;
  style?: StyleProp<ViewStyle>;
  seed?: number;
}

const buildPath = (width: number, height: number, seed: number): string => {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const baseY = height * 0.5;
  const cycles = 5;
  const cycleW = width / cycles;
  let d = `M 0 ${baseY.toFixed(2)}`;
  for (let i = 0; i < cycles; i++) {
    const cx = i * cycleW;
    const r = (rand() - 0.5) * 4;
    d += ` L ${(cx + cycleW * 0.3).toFixed(2)} ${(baseY + r).toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.4).toFixed(2)} ${(baseY - height * 0.3).toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.46).toFixed(2)} ${(baseY + height * 0.18).toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.6).toFixed(2)} ${(baseY).toFixed(2)}`;
    d += ` Q ${(cx + cycleW * 0.72).toFixed(2)} ${(baseY - height * 0.1).toFixed(2)} ${(cx + cycleW * 0.84).toFixed(2)} ${baseY.toFixed(2)}`;
  }
  d += ` L ${width.toFixed(2)} ${baseY.toFixed(2)}`;
  return d;
};

export const WaveformPlaceholder: React.FC<WaveformPlaceholderProps> = ({
  height = 56,
  style,
  seed = 5,
}) => {
  const theme = useAppTheme();
  const styles = createWaveformPlaceholderStyles(theme);
  const [width, setWidth] = React.useState(0);

  return (
    <View
      style={[styles.container, { height }, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Path
            d={buildPath(width, height, seed)}
            stroke={theme.colors.divider}
            strokeWidth={1.4}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </Svg>
      ) : null}
    </View>
  );
};
