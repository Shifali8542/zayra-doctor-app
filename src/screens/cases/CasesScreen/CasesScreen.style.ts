import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createCasesScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    tabsWrap: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.pill,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      marginBottom: theme.spacing.xl,
    },
    tabsScroll: {
      flexDirection: 'row',
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radii.pill,
    },
    tabActive: {
      backgroundColor: theme.colors.primary,
    },
    tabLabel: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      fontSize: theme.fonts.sizes.sm,
    },
    tabLabelActive: {
      color: theme.colors.textOnDark,
    },
    tabBadge: {
      backgroundColor: theme.colors.divider,
      borderRadius: theme.radii.pill,
      minWidth: 26,
      height: 22,
      paddingHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.sm,
    },
    tabBadgeActive: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    tabBadgeText: {
      ...theme.typography.bodySmall,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    tabBadgeTextActive: {
      color: theme.colors.textOnDark,
    },
    empty: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    completedCard: {
      paddingHorizontal: theme.spacing.lg,
    },
    completedHeaderRow: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
      marginBottom: theme.spacing.sm,
    },
    completedHeader: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      letterSpacing: 1.2,
      fontSize: theme.fonts.sizes.xs,
    },
    completedRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    completedCaseId: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
    },
    completedAnomaly: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
      lineHeight: 20,
    },
    completedPatient: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
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
