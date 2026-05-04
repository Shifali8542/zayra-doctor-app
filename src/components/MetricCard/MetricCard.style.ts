import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createMetricCardStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      minHeight: 76,
    },
    cardLarge: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 96,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    label: {
      ...theme.typography.eyebrow,
      letterSpacing: 1,
      color: theme.colors.textTertiary,
      fontSize: theme.fonts.sizes.xs,
      marginLeft: 4,
      flex: 1,
    },
    subscript: {
      fontSize: theme.fonts.sizes.xs - 2,
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    value: {
      ...theme.typography.h3,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    valueLarge: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    unit: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: 4,
      fontSize: theme.fonts.sizes.sm,
    },
    delta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.sm,
      fontWeight: '600',
      fontSize: theme.fonts.sizes.sm,
    },
  });
