/**
 * Centralized color palette.
 * Light theme matches the reference design exactly:
 *  - Hero gradient: deep navy (#0A2540) -> teal/green (#1FA59B)
 *  - Background: very light blue/grey (#EEF4F7)
 *  - Primary action: deep navy (#0A2540)
 *  - Text: near-black (#0E1B2C) on light surfaces, white on dark
 */

export const palette = {
  // Brand
  navy900: '#0A2540',
  navy800: '#0F2C4D',
  navy700: '#163559',
  navy600: '#1C4A6E',
  teal500: '#1FA59B',
  teal400: '#3DBDB0',
  teal300: '#6CD3C5',
  teal200: '#A4E4DA',

  // Neutrals
  white: '#FFFFFF',
  bg: '#EEF4F7',
  bgAlt: '#F4F8FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F7FAFB',
  divider: '#E3EBEF',
  border: '#D9E2E7',

  // Text
  textPrimary: '#0E1B2C',
  textSecondary: '#4A5C6E',
  textTertiary: '#7A8A98',
  textOnDark: '#FFFFFF',
  textOnDarkSubtle: 'rgba(255,255,255,0.78)',
  textOnDarkMuted: 'rgba(255,255,255,0.55)',

  // Severity
  critical: '#0E1B2C',
  urgent: '#0E1B2C',
  routine: '#0E1B2C',
  criticalDot: '#0E1B2C',
  urgentDot: '#0E1B2C',
  routineDot: '#0E1B2C',

  // Status
  success: '#1FA59B',
  warning: '#E0A23A',
  danger: '#D04E5C',

  // Glass on dark
  glassFill: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.18)',

  // Pulse / accent
  pulseRed: '#FF6E7A',

  // Dark theme neutrals
  darkBg: '#06121F',
  darkSurface: '#0E1F30',
  darkSurfaceAlt: '#13283C',
  darkDivider: '#1E3247',
  darkBorder: '#264159',
  darkTextPrimary: '#F4F8FA',
  darkTextSecondary: '#A8B6C2',
  darkTextTertiary: '#7A8A98',
} as const;

export type Palette = typeof palette;
