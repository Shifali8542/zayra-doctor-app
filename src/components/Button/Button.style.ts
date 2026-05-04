import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createButtonStyles = (theme: AppTheme) =>
  StyleSheet.create({
    base: {
      borderRadius: theme.radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    fullWidth: { alignSelf: 'stretch' },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.85 },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconLeft: { marginRight: theme.spacing.sm },
    iconRight: { marginLeft: theme.spacing.sm },

    size_sm: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 36,
    },
    size_md: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      minHeight: 44,
    },
    size_lg: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xxl,
      minHeight: 52,
    },

    variant_primary: {
      backgroundColor: theme.colors.primary,
    },
    variant_secondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    variant_ghost: {
      backgroundColor: 'transparent',
    },
    variant_glass: {
      backgroundColor: theme.colors.glassFill,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
    },

    label: {
      ...theme.typography.bodyStrong,
      letterSpacing: 0.2,
    },
    label_primary: { color: theme.colors.textOnDark },
    label_secondary: { color: theme.colors.textPrimary },
    label_ghost: { color: theme.colors.primary },
    label_glass: { color: theme.colors.textOnDark },

    labelSize_sm: { fontSize: theme.fonts.sizes.md },
    labelSize_md: { fontSize: theme.fonts.sizes.lg },
    labelSize_lg: { fontSize: theme.fonts.sizes.xl },
  });
