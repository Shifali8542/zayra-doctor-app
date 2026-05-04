import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createLoginScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    kav: { flex: 1 },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
    },
    brand: {
      ...theme.typography.title,
      color: theme.colors.textPrimary,
      letterSpacing: 3,
      marginLeft: theme.spacing.sm,
      fontWeight: '700',
    },
    logo: {
      width: 130,
      height: 32,
    },
    hero: {
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xxl,
      marginBottom: theme.spacing.xxl,
    },
    heroEyebrow: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDarkSubtle,
      marginBottom: theme.spacing.md,
    },
    heroTitle: {
      ...theme.typography.h1,
      color: theme.colors.textOnDark,
      marginBottom: theme.spacing.md,
      fontWeight: '700',
    },
    heroSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textOnDarkSubtle,
      lineHeight: 22,
    },
    form: { flex: 1 },
    gap: { height: theme.spacing.lg },
    gapLg: { height: theme.spacing.xl },
    error: {
      ...theme.typography.bodySmall,
      color: theme.colors.danger,
      marginTop: theme.spacing.md,
    },
    footerLink: {
      marginTop: theme.spacing.xxl,
      alignSelf: 'center',
    },
    footerText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    footerStrong: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
  });
