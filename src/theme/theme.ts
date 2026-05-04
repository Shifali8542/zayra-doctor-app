import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { spacing, radii } from './spacing';
import { fonts, typography } from './fonts';

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  colors: typeof lightTheme.colors;
  spacing: typeof spacing;
  radii: typeof radii;
  fonts: typeof fonts;
  typography: typeof typography;
}

export const themes: Record<ThemeMode, AppTheme> = {
  light: {
    mode: 'light',
    colors: lightTheme.colors,
    spacing,
    radii,
    fonts,
    typography,
  },
  dark: {
    mode: 'dark',
    colors: darkTheme.colors,
    spacing,
    radii,
    fonts,
    typography,
  },
};

export { lightTheme, darkTheme, spacing, radii, fonts, typography };
export { palette } from './colors';
