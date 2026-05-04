import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createSectionTitleStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrap: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });
