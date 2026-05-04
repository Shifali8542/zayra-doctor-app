/**
 * Procedurally-generated ECG-style waveform renderer.
 * Uses react-native-svg for crisp rendering; no native bridge cost.
 *
 * `seed` lets callers vary the wave shape between cases.
 * `severity` tilts the amplitude / chaos to evoke the rhythm class.
 */

import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Line, G, Rect } from 'react-native-svg';
import { useAppTheme } from '../../context/ThemeContext';

type WaveSeverity = 'normal' | 'urgent' | 'critical';

interface EcgWaveformProps {
  width?: number;
  height?: number;
  seed?: number;
  severity?: WaveSeverity;
  showGrid?: boolean;
  strokeColor?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
  cycles?: number;
}

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

interface BeatParams {
  amplitude: number; // R-peak height factor (0..1)
  pWave: number; // P-wave size
  width: number; // overall beat width factor
  qrsWidth: number; // narrower QRS = sinus, wider = VT
  jitter: number;
}

const severityToParams = (sev: WaveSeverity): BeatParams => {
  switch (sev) {
    case 'critical':
      return { amplitude: 0.95, pWave: 0.0, width: 1.0, qrsWidth: 1.6, jitter: 0.18 };
    case 'urgent':
      return { amplitude: 0.7, pWave: 0.05, width: 0.8, qrsWidth: 1.0, jitter: 0.1 };
    case 'normal':
    default:
      return { amplitude: 0.6, pWave: 0.18, width: 1.0, qrsWidth: 0.7, jitter: 0.04 };
  }
};

const generatePath = (
  width: number,
  height: number,
  cycles: number,
  seed: number,
  severity: WaveSeverity,
): string => {
  const rand = seededRandom(seed);
  const params = severityToParams(severity);

  const baseY = height * 0.55;
  const ampMax = height * 0.4 * params.amplitude;

  const cycleW = width / cycles;
  let d = `M 0 ${baseY.toFixed(2)}`;

  for (let i = 0; i < cycles; i++) {
    const cx = i * cycleW;
    const j = (rand() - 0.5) * params.jitter * height;
    // pre-baseline
    d += ` L ${(cx + cycleW * 0.05).toFixed(2)} ${(baseY + j).toFixed(2)}`;
    // P wave (small bump)
    if (params.pWave > 0) {
      const pcx = cx + cycleW * 0.15;
      const py = baseY - height * 0.08 * params.pWave;
      d += ` Q ${pcx.toFixed(2)} ${py.toFixed(2)} ${(cx + cycleW * 0.22).toFixed(2)} ${baseY.toFixed(2)}`;
    }
    // PR segment
    d += ` L ${(cx + cycleW * 0.32).toFixed(2)} ${baseY.toFixed(2)}`;
    // Q (down)
    const qX = cx + cycleW * 0.36;
    const qY = baseY + ampMax * 0.15;
    d += ` L ${qX.toFixed(2)} ${qY.toFixed(2)}`;
    // R (sharp up)
    const rX = cx + cycleW * (0.40 + 0.02 * params.qrsWidth);
    const rY = baseY - ampMax;
    d += ` L ${rX.toFixed(2)} ${rY.toFixed(2)}`;
    // S (sharp down past baseline)
    const sX = cx + cycleW * (0.46 + 0.04 * params.qrsWidth);
    const sY = baseY + ampMax * 0.35;
    d += ` L ${sX.toFixed(2)} ${sY.toFixed(2)}`;
    // ST segment
    d += ` L ${(cx + cycleW * 0.6).toFixed(2)} ${baseY.toFixed(2)}`;
    // T wave
    const tcx = cx + cycleW * 0.72;
    const ty = baseY - height * 0.12;
    d += ` Q ${tcx.toFixed(2)} ${ty.toFixed(2)} ${(cx + cycleW * 0.84).toFixed(2)} ${baseY.toFixed(2)}`;
    // Tail
    d += ` L ${(cx + cycleW * 0.98).toFixed(2)} ${baseY.toFixed(2)}`;
  }
  d += ` L ${width.toFixed(2)} ${baseY.toFixed(2)}`;
  return d;
};

export const EcgWaveform: React.FC<EcgWaveformProps> = ({
  width = 320,
  height = 120,
  seed = 7,
  severity = 'normal',
  showGrid = true,
  strokeColor,
  background,
  style,
  cycles,
}) => {
  const theme = useAppTheme();

  const stroke = strokeColor ?? '#E0F4F0';
  const bg = background ?? '#0E1B2C';

  const beatCount = cycles ?? (severity === 'critical' ? 6 : severity === 'urgent' ? 5 : 4);

  const path = useMemo(
    () => generatePath(width, height, beatCount, seed, severity),
    [width, height, beatCount, seed, severity],
  );

  // grid lines
  const gridLines = useMemo(() => {
    if (!showGrid) return null;
    const lines: React.ReactElement[] = [];
    const step = 16;
    for (let x = 0; x <= width; x += step) {
      lines.push(
        <Line
          key={`vx-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />,
      );
    }
    for (let y = 0; y <= height; y += step) {
      lines.push(
        <Line
          key={`hy-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />,
      );
    }
    return <G>{lines}</G>;
  }, [showGrid, width, height]);

  return (
    <View style={[{ width, height, borderRadius: theme.radii.lg, overflow: 'hidden' }, style]}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill={bg} />
        {gridLines}
        <Path
          d={path}
          stroke={stroke}
          strokeWidth={1.6}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};
