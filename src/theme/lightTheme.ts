import { palette } from './colors';
export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  divider: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnDark: string;
  textOnDarkSubtle: string;
  textOnDarkMuted: string;

  primary: string;
  primaryHover: string;
  accent: string;
  accentSoft: string;

  heroGradientFrom: string;
  heroGradientMid: string;
  heroGradientTo: string;

  glassFill: string;
  glassBorder: string;

  success: string;
  warning: string;
  danger: string;
  pulseRed: string;

  severityCritical: string;
  severityUrgent: string;
  severityRoutine: string;

  tabBarBg: string;
  tabIconActive: string;
  tabIconInactive: string;
  tabActiveBg: string;

  avatarGradientFrom: string;
  avatarGradientTo: string;
}

export const lightTheme: { mode: 'light'; colors: ThemeColors } = {
  mode: 'light',
  colors: {
    background: palette.bg,
    backgroundAlt: palette.bgAlt,
    surface: palette.surface,
    surfaceAlt: palette.surfaceAlt,
    divider: palette.divider,
    border: palette.border,

    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textTertiary: palette.textTertiary,
    textOnDark: palette.textOnDark,
    textOnDarkSubtle: palette.textOnDarkSubtle,
    textOnDarkMuted: palette.textOnDarkMuted,

    primary: palette.navy900,
    primaryHover: palette.navy800,
    accent: palette.teal500,
    accentSoft: palette.teal200,

    heroGradientFrom: palette.navy900,
    heroGradientMid: palette.navy700,
    heroGradientTo: palette.teal500,

    glassFill: palette.glassFill,
    glassBorder: palette.glassBorder,

    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    pulseRed: palette.pulseRed,

    severityCritical: palette.criticalDot,
    severityUrgent: palette.urgentDot,
    severityRoutine: palette.routineDot,

    tabBarBg: palette.surface,
    tabIconActive: palette.navy900,
    tabIconInactive: palette.textTertiary,
    tabActiveBg: '#E9EFF3',

    avatarGradientFrom: palette.navy900,
    avatarGradientTo: palette.teal500,
  },
};
