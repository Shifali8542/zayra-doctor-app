import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createStatBadgeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.10)',
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.16)',
    },
    iconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    label: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textOnDark,
      flex: 1,
      fontSize: theme.fonts.sizes.lg,
    },
    value: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textOnDark,
      marginRight: theme.spacing.lg,
      fontSize: theme.fonts.sizes.lg,
      fontWeight: '700',
    },
  });
