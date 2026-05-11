/**
 * Real ECG waveform renderer using filtered signal samples from the backend.
 * Uses react-native-svg for crisp, zero-bridge rendering.
 * Accepts `data` (number[] of mV samples) and maps them to SVG polyline.
 */

import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Line, G, Rect } from 'react-native-svg';
import { useAppTheme } from '../../context/ThemeContext';

interface EcgWaveformProps {
  width?: number;
  height?: number;
  // Real filtered signal samples in mV from backend
  data?: number[];
  effectiveSamplingRate?: number;
  displaySeconds?: number;
  showGrid?: boolean;
  strokeColor?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export const EcgWaveform: React.FC<EcgWaveformProps> = ({
  width = 320,
  height = 120,
  data,
  effectiveSamplingRate = 125,
  displaySeconds = 10,
  showGrid = true,
  strokeColor,
  background,
  style,
}) => {
  const theme = useAppTheme();
  const stroke = strokeColor ?? '#E0F4F0';
  const bg = background ?? '#0E1B2C';

  const path = useMemo(() => {
    if (!data || data.length === 0) return '';
    const samplesToShow = Math.min(
      data.length,
      Math.round(effectiveSamplingRate * displaySeconds),
    );
    const slice = data.slice(0, samplesToShow);
    let min = slice[0], max = slice[0];
    for (const v of slice) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const range = max - min || 1;
    const pad = height * 0.08;
    const drawH = height - pad * 2;
    let d = '';
    for (let i = 0; i < slice.length; i++) {
      const x = (i / (slice.length - 1)) * width;
      const y = pad + drawH - ((slice[i] - min) / range) * drawH;
      d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d;
  }, [data, effectiveSamplingRate, displaySeconds, width, height]);

  const gridLines = useMemo(() => {
    if (!showGrid) return null;
    const lines: React.ReactElement[] = [];
    const step = 16;
    for (let x = 0; x <= width; x += step) {
      lines.push(<Line key={`vx-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />);
    }
    for (let y = 0; y <= height; y += step) {
      lines.push(<Line key={`hy-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />);
    }
    return <G>{lines}</G>;
  }, [showGrid, width, height]);

  return (
    <View style={[{ width, height, borderRadius: theme.radii.lg, overflow: 'hidden' }, style]}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill={bg} />
        {gridLines}
        {path ? (
          <Path d={path} stroke={stroke} strokeWidth={1.6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
      </Svg>
    </View>
  );
};