import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createEarningsScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    headerWrap: { paddingHorizontal: theme.spacing.xl },
    list: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.massive,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    summaryCard: {
      width: '47%',
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    summaryLabel: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      letterSpacing: 1.2,
      marginBottom: theme.spacing.xs,
    },
    summaryValue: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },

    cardTitle: {
      ...theme.typography.h3,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      marginBottom: theme.spacing.lg,
    },
    barRow: { marginBottom: theme.spacing.lg },
    barHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    barLabel: { ...theme.typography.bodyStrong, color: theme.colors.textPrimary },
    barAmount: { ...theme.typography.bodySmall, color: theme.colors.textTertiary },
    barTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.divider,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },

    payoutCard: {
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xxl,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    payoutTitle: { ...theme.typography.h3, color: '#fff', fontWeight: '700' },
    payoutSub: { ...theme.typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    payoutAmount: {
      ...theme.typography.display,
      color: '#fff',
      fontWeight: '700',
      marginTop: theme.spacing.lg,
    },

    tableHeader: { marginBottom: theme.spacing.sm },
    sectionTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, fontWeight: '700' },
    tableHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radii.sm,
      paddingHorizontal: theme.spacing.md,
      marginBottom: 2,
    },
    tableCol: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      letterSpacing: 1.1,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    tableCell: { ...theme.typography.body, color: theme.colors.textPrimary },
    emptyWrap: { paddingVertical: theme.spacing.xxl, alignItems: 'center' },
    emptyText: { ...theme.typography.body, color: theme.colors.textTertiary, textAlign: 'center', paddingTop: theme.spacing.xxl },
  });
