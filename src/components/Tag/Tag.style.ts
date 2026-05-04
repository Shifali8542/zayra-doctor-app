import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createTagStyles = (theme: AppTheme) =>
  StyleSheet.create({
    base: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radii.pill,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    soft: {
      backgroundColor: theme.colors.backgroundAlt,
    },
    softOnDark: {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    default: {
      backgroundColor: theme.colors.backgroundAlt,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconLeft: { marginRight: theme.spacing.sm },
    iconRight: { marginLeft: theme.spacing.sm },
    label: {
      ...theme.typography.bodySmall,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    labelOnDark: {
      color: theme.colors.textOnDark,
    },
  });
