import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createHomeScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xxl,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xxl,
      overflow: 'hidden',
    },
    heroBeat: {
      position: 'absolute',
      left: -8,
      top: 24,
      opacity: 0.6,
    },
    heroEyebrow: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDark,
      marginBottom: theme.spacing.lg,
      letterSpacing: 1.6,
    },
    heroTitle: {
      ...theme.typography.h1,
      color: theme.colors.textOnDark,
      fontWeight: '700',
      marginBottom: theme.spacing.lg,
      lineHeight: 36,
    },
    heroSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textOnDarkSubtle,
      marginBottom: theme.spacing.xxl,
      lineHeight: 22,
    },
    heroSubtitleHighlight: {
      backgroundColor: 'rgba(255,255,255,0.18)',
      color: theme.colors.textOnDark,
    },
    statsCol: {},
    statGap: { height: theme.spacing.md },

    casesHeader: {
      marginBottom: theme.spacing.lg,
    },
    statusWrap: {
      paddingVertical: theme.spacing.xxl,
      alignItems: 'center',
    },
    statusText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    errorText: {
      ...theme.typography.bodyStrong,
      color: theme.colors.danger,
      textAlign: 'center',
    },
    errorDetail: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
  });
