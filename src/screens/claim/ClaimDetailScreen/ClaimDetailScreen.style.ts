import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createClaimDetailScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
    },
    backText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      marginLeft: theme.spacing.sm,
      fontWeight: '500',
    },
    headerCard: {
      marginBottom: theme.spacing.xl,
    },
    headerCardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    caseId: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.md,
      letterSpacing: 0.4,
    },
    elapsed: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.sm,
    },
    caseTitle: {
      ...theme.typography.h1,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.sm,
      lineHeight: 34,
    },
    caseSub: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.lg,
    },
    headerCtaRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    headerMetricsGrid: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    metricGap: { width: theme.spacing.md },

    section: { marginBottom: theme.spacing.xl },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    sectionTitle: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    sectionMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
    },
    sectionLink: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    captureMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    captureMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
    },

    summaryBody: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      lineHeight: 22,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    bold: { fontWeight: '700' },
    tagsCol: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm as any,
    },
    summaryTag: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },

    timelineWrap: { marginTop: theme.spacing.md },
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    timelineDotCol: {
      width: 18,
      alignItems: 'center',
    },
    timelineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginVertical: 4,
    },
    timelineLineTop: {
      width: 1,
      height: 12,
      backgroundColor: theme.colors.divider,
    },
    timelineLineBottom: {
      width: 1,
      flex: 1,
      backgroundColor: theme.colors.divider,
    },
    timelineContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    timelineWhen: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      marginBottom: 2,
    },
    timelineDesc: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      lineHeight: 22,
    },

    kvList: { marginTop: theme.spacing.md },
    kvRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    kvLabel: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    kvValue: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      flex: 1.4,
      textAlign: 'right',
    },

    physRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    physLeft: { flex: 1 },
    physLabel: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      marginBottom: 2,
      fontSize: theme.fonts.sizes.lg,
    },
    physBaseline: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
    },
    physValue: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
    },

    actionPathCard: {
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xxl,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    actionEyebrow: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDarkSubtle,
      letterSpacing: 1.4,
      marginBottom: theme.spacing.md,
    },
    actionTitle: {
      ...theme.typography.h2,
      color: theme.colors.textOnDark,
      fontWeight: '700',
      marginBottom: theme.spacing.lg,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.10)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      borderRadius: theme.radii.xl,
      padding: theme.spacing.lg,
    },
    actionGap: { height: theme.spacing.md },
    actionIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    actionLabel: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textOnDark,
      flex: 1,
      fontSize: theme.fonts.sizes.lg,
    },
  });
