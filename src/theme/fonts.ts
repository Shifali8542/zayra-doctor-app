import { Platform, TextStyle } from 'react-native';

/**
 * Centralized typography. Uses the platform default sans (San Francisco
 * on iOS, Roboto on Android, system on web) so the app feels native
 * without bundling custom fonts at this stage.
 */
const family = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
}) as string;

const familyMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
}) as string;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  xxl: 18,
  display1: 22,
  display2: 26,
  display3: 32,
  display4: 40,
} as const;

export const lineHeights = {
  xs: 14,
  sm: 16,
  md: 18,
  base: 20,
  lg: 22,
  xl: 24,
  xxl: 26,
  display1: 28,
  display2: 32,
  display3: 38,
  display4: 46,
} as const;

type Variant =
  | 'eyebrow'
  | 'caption'
  | 'bodySmall'
  | 'body'
  | 'bodyStrong'
  | 'subtitle'
  | 'title'
  | 'h3'
  | 'h2'
  | 'h1'
  | 'display'
  | 'metricLarge'
  | 'metricMedium';

export const typography: Record<Variant, TextStyle> = {
  eyebrow: {
    fontFamily: familyMedium,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.sm,
    letterSpacing: 1.2,
    fontWeight: fontWeights.semibold,
  },
  caption: {
    fontFamily: family,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontFamily: family,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.base,
    fontWeight: fontWeights.regular,
  },
  body: {
    fontFamily: family,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.regular,
  },
  bodyStrong: {
    fontFamily: familyMedium,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.semibold,
  },
  subtitle: {
    fontFamily: family,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.regular,
  },
  title: {
    fontFamily: familyMedium,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xxl,
    fontWeight: fontWeights.semibold,
  },
  h3: {
    fontFamily: familyMedium,
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.display1,
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontFamily: familyMedium,
    fontSize: fontSizes.display1,
    lineHeight: lineHeights.display2,
    fontWeight: fontWeights.bold,
  },
  h1: {
    fontFamily: familyMedium,
    fontSize: fontSizes.display2,
    lineHeight: lineHeights.display3,
    fontWeight: fontWeights.bold,
  },
  display: {
    fontFamily: familyMedium,
    fontSize: fontSizes.display3,
    lineHeight: lineHeights.display4,
    fontWeight: fontWeights.bold,
  },
  metricLarge: {
    fontFamily: familyMedium,
    fontSize: fontSizes.display3,
    lineHeight: lineHeights.display3,
    fontWeight: fontWeights.bold,
  },
  metricMedium: {
    fontFamily: familyMedium,
    fontSize: fontSizes.display1,
    lineHeight: lineHeights.display1,
    fontWeight: fontWeights.bold,
  },
};

export const fonts = {
  family,
  familyMedium,
  weights: fontWeights,
  sizes: fontSizes,
  lineHeights,
  typography,
};

export type Typography = typeof typography;
