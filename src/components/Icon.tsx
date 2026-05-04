import React from 'react';
import Svg, { Path, Circle, Polyline, Line, Rect, G } from 'react-native-svg';

export type IconName =
  | 'pulse'
  | 'pulse-line'
  | 'bell'
  | 'chevron-right'
  | 'chevron-left'
  | 'clock'
  | 'eye'
  | 'bolt'
  | 'trending-up'
  | 'activity'
  | 'cases'
  | 'trace'
  | 'sparkle'
  | 'trophy'
  | 'heart'
  | 'drop'
  | 'phone'
  | 'stethoscope'
  | 'check-circle'
  | 'close-circle'
  | 'alert-triangle'
  | 'arrow-up-right'
  | 'arrow-right'
  | 'send'
  | 'search'
  | 'share'
  | 'bookmark'
  | 'book'
  | 'plus'
  | 'minus'
  | 'expand'
  | 'check'
  | 'shield'
  | 'shield-check'
  | 'flame'
  | 'medal'
  | 'sun'
  | 'moon'
  | 'arrow-down';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fillColor?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#0E1B2C',
  strokeWidth = 2,
  fillColor = 'none',
}) => {
  const stroke = color;
  const sw = strokeWidth;

  const wrap = (children: React.ReactNode) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  );

  switch (name) {
    case 'pulse':
    case 'pulse-line':
    case 'activity':
      return wrap(
        <Polyline
          points="2,12 6,12 8,7 12,17 14,10 17,12 22,12"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'bell':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </G>,
      );
    case 'chevron-right':
      return wrap(
        <Polyline
          points="9,6 15,12 9,18"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'chevron-left':
      return wrap(
        <Polyline
          points="15,6 9,12 15,18"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'clock':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none">
          <Circle cx="12" cy="12" r="9" />
          <Polyline points="12,7 12,12 16,14" />
        </G>,
      );
    case 'eye':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <Circle cx="12" cy="12" r="3" />
        </G>,
      );
    case 'bolt':
      return wrap(
        <Path
          d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill={fillColor === 'none' ? 'none' : fillColor}
        />,
      );
    case 'trending-up':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Polyline points="3,17 9,11 13,15 21,7" />
          <Polyline points="14,7 21,7 21,14" />
        </G>,
      );
    case 'cases':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M3 7l9-4 9 4-9 4-9-4z" />
          <Path d="M3 12l9 4 9-4" />
          <Path d="M3 17l9 4 9-4" />
        </G>,
      );
    case 'trace':
      return wrap(
        <Polyline
          points="3,18 7,18 9,8 12,20 14,12 17,16 21,16"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'sparkle':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z" />
          <Path d="M19 15l.7 1.8L21.5 17.5l-1.8.7L19 20l-.7-1.8L16.5 17.5l1.8-.7z" />
        </G>,
      );
    case 'trophy':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M8 21h8" />
          <Path d="M12 17v4" />
          <Path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <Path d="M7 7H4a3 3 0 0 0 3 3" />
          <Path d="M17 7h3a3 3 0 0 1-3 3" />
        </G>,
      );
    case 'heart':
      return wrap(
        <Path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill={fillColor === 'none' ? 'none' : fillColor}
        />,
      );
    case 'drop':
      return wrap(
        <Path
          d="M12 2.5s6 7 6 11.5a6 6 0 1 1-12 0c0-4.5 6-11.5 6-11.5z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'phone':
      return wrap(
        <Path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.27-1.36a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />,
      );
    case 'stethoscope':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M11 2v6a4 4 0 0 0 8 0V2" />
          <Path d="M5 2v6a4 4 0 0 0 4 4v4a5 5 0 0 0 10 0v-2" />
          <Circle cx="20" cy="14" r="2" />
        </G>,
      );
    case 'check-circle':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Circle cx="12" cy="12" r="9" />
          <Polyline points="8,12 11,15 16,9" />
        </G>,
      );
    case 'close-circle':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Circle cx="12" cy="12" r="9" />
          <Line x1="9" y1="9" x2="15" y2="15" />
          <Line x1="15" y1="9" x2="9" y2="15" />
        </G>,
      );
    case 'alert-triangle':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <Line x1="12" y1="9" x2="12" y2="13" />
          <Line x1="12" y1="17" x2="12.01" y2="17" />
        </G>,
      );
    case 'arrow-up-right':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Line x1="7" y1="17" x2="17" y2="7" />
          <Polyline points="7,7 17,7 17,17" />
        </G>,
      );
    case 'arrow-right':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Line x1="5" y1="12" x2="19" y2="12" />
          <Polyline points="12,5 19,12 12,19" />
        </G>,
      );
    case 'send':
      return wrap(
        <Path
          d="M22 2L11 13"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'search':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Circle cx="11" cy="11" r="7" />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" />
        </G>,
      );
    case 'share':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Circle cx="18" cy="5" r="3" />
          <Circle cx="6" cy="12" r="3" />
          <Circle cx="18" cy="19" r="3" />
          <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </G>,
      );
    case 'bookmark':
      return wrap(
        <Path
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'book':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </G>,
      );
    case 'plus':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none">
          <Line x1="12" y1="5" x2="12" y2="19" />
          <Line x1="5" y1="12" x2="19" y2="12" />
        </G>,
      );
    case 'minus':
      return wrap(
        <Line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />,
      );
    case 'expand':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Polyline points="15,3 21,3 21,9" />
          <Polyline points="9,21 3,21 3,15" />
          <Line x1="21" y1="3" x2="14" y2="10" />
          <Line x1="3" y1="21" x2="10" y2="14" />
        </G>,
      );
    case 'check':
      return wrap(
        <Polyline
          points="5,12 10,17 19,7"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'shield':
      return wrap(
        <Path
          d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'shield-check':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" fill="none">
          <Path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
          <Polyline points="9,12 11,14 15,10" />
        </G>,
      );
    case 'flame':
      return wrap(
        <Path
          d="M8.5 14.5C7 16 7 18.5 8.5 20a4 4 0 0 0 7 0c1.5-1.5 1.5-4 0-5.5-1-1-1.5-2.5-1-4 .5-1.5 0-3.5-1.5-5-1 1.5-1.5 3.5-3 4-1.5.5-2.5 2-2 3.5.5 1 0 2-.5 2.5z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'medal':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" fill="none">
          <Path d="M7 4h10l-2 6H9z" />
          <Circle cx="12" cy="15" r="5" />
        </G>,
      );
    case 'sun':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none">
          <Circle cx="12" cy="12" r="4" />
          <Line x1="12" y1="2" x2="12" y2="5" />
          <Line x1="12" y1="19" x2="12" y2="22" />
          <Line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <Line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <Line x1="2" y1="12" x2="5" y2="12" />
          <Line x1="19" y1="12" x2="22" y2="12" />
          <Line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <Line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </G>,
      );
    case 'moon':
      return wrap(
        <Path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />,
      );
    case 'arrow-down':
      return wrap(
        <G stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Line x1="12" y1="5" x2="12" y2="19" />
          <Polyline points="19,12 12,19 5,12" />
        </G>,
      );
    default:
      return wrap(<Rect x="2" y="2" width="20" height="20" stroke={stroke} strokeWidth={sw} fill="none" />);
  }
};
