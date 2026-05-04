/**
 * Spacing scale - 4pt grid based.
 * Use these tokens consistently across the app.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 56,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export type Spacing = typeof spacing;
export type Radii = typeof radii;
