import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createImpactScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xxl,
      marginBottom: theme.spacing.md,
    },
    heroEyebrow: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDarkSubtle,
      letterSpacing: 1.4,
      marginBottom: theme.spacing.lg,
    },
    heroBig: {
      ...theme.typography.display,
      color: theme.colors.textOnDark,
      fontWeight: '700',
      marginBottom: theme.spacing.lg,
    },
    heroDesc: {
      ...theme.typography.body,
      color: theme.colors.textOnDarkSubtle,
      lineHeight: 22,
      marginBottom: theme.spacing.xl,
    },
    statsGrid: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    gridGap: { width: theme.spacing.md },
    statTile: {
      flex: 1,
      borderRadius: theme.radii.lg,
      backgroundColor: 'rgba(255,255,255,0.10)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      padding: theme.spacing.lg,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    statLabel: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDarkSubtle,
      letterSpacing: 1.2,
      marginLeft: theme.spacing.sm,
    },
    statValue: {
      ...theme.typography.h1,
      color: theme.colors.textOnDark,
      fontWeight: '700',
    },

    cardEyebrow: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      letterSpacing: 1.4,
      marginBottom: theme.spacing.md,
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: theme.spacing.lg,
    },
    scoreNumber: {
      ...theme.typography.display,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    scoreSlash: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.sm,
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.divider,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },

    lifesavingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    lifesavingTitle: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginLeft: theme.spacing.sm,
    },
    momentRow: {
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    momentWhen: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      letterSpacing: 1.2,
      marginBottom: theme.spacing.xs,
    },
    momentDesc: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      lineHeight: 22,
    },
  });
