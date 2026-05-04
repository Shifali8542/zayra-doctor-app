import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createInputStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { width: '100%' },
    label: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontWeight: '500',
    },
    fieldWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 52,
    },
    fieldError: {
      borderColor: theme.colors.danger,
    },
    iconLeftWrap: {
      marginRight: theme.spacing.md,
    },
    input: {
      ...theme.typography.body,
      flex: 1,
      color: theme.colors.textPrimary,
      paddingVertical: theme.spacing.md,
    },
    inputWithIcon: {
      // when icon is present, ensure no extra left padding from system
    },
    inputWithRight: {
      paddingRight: theme.spacing.sm,
    },
    error: {
      ...theme.typography.caption,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
  });
