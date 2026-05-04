import { palette } from './colors';
import type { ThemeColors } from './lightTheme';

export const darkTheme: { mode: 'dark'; colors: ThemeColors } = {
  mode: 'dark',
  colors: {
    background: palette.darkBg,
    backgroundAlt: palette.darkSurfaceAlt,
    surface: palette.darkSurface,
    surfaceAlt: palette.darkSurfaceAlt,
    divider: palette.darkDivider,
    border: palette.darkBorder,

    textPrimary: palette.darkTextPrimary,
    textSecondary: palette.darkTextSecondary,
    textTertiary: palette.darkTextTertiary,
    textOnDark: palette.textOnDark,
    textOnDarkSubtle: palette.textOnDarkSubtle,
    textOnDarkMuted: palette.textOnDarkMuted,

    primary: palette.teal500,
    primaryHover: palette.teal400,
    accent: palette.teal400,
    accentSoft: palette.teal300,

    heroGradientFrom: palette.navy900,
    heroGradientMid: palette.navy700,
    heroGradientTo: palette.teal500,

    glassFill: 'rgba(255,255,255,0.08)',
    glassBorder: 'rgba(255,255,255,0.14)',

    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    pulseRed: palette.pulseRed,

    severityCritical: palette.darkTextPrimary,
    severityUrgent: palette.darkTextPrimary,
    severityRoutine: palette.darkTextPrimary,

    tabBarBg: palette.darkSurface,
    tabIconActive: palette.teal400,
    tabIconInactive: palette.darkTextTertiary,
    tabActiveBg: 'rgba(31,165,155,0.14)',

    avatarGradientFrom: palette.navy900,
    avatarGradientTo: palette.teal500,
  },
};
