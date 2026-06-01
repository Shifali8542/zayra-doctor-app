import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const SEVERITY_COLORS: Record<string, string> = {
  critical: '#D04E5C',
  urgent:   '#E0A23A',
  routine:  '#1FA59B',
  normal:   '#7A8A98',
};

export const createCasePickerStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    section: {
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      color: theme.colors.textSecondary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    severityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.md,
      flexShrink: 0,
    },
    rowContent: {
      flex: 1,
      minWidth: 0,
    },
    rowDiagnosis: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    rowMeta: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    severityPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      marginLeft: theme.spacing.sm,
      flexShrink: 0,
    },
    severityPillText: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    loadMoreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
      paddingVertical: theme.spacing.md,
    },
    loadMoreText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      paddingVertical: theme.spacing.xxl,
    },
  });