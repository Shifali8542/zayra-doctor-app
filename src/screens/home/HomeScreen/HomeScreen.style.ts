import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createHomeScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: theme.radii.xxl,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xxl,
      overflow: 'hidden',
    },
    ecgOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      opacity: 0.7,
    },
    heroEyebrow: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDark,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.lg,
      letterSpacing: 1.6,
    },
    heroTitle: {
      ...theme.typography.h2,
      color: theme.colors.textOnDark,
      fontWeight: '700',
      marginBottom: theme.spacing.md,
      lineHeight: 30,
    },
    heroSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textOnDarkSubtle,
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    heroSubtitleHighlight: {
      backgroundColor: 'rgba(255,255,255,0.18)',
      color: theme.colors.textOnDark,
    },
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    statPill: {
      width: '48%',
      height: 36,
    },

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
