import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createSeverityBadgeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textPrimary,
      marginRight: theme.spacing.sm,
    },
    label: {
      ...theme.typography.eyebrow,
      fontSize: theme.fonts.sizes.md,
      letterSpacing: 1.4,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
  });
