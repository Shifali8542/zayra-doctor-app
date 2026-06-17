import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme/theme';

export const createGrandRoundsScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerWrap: {
      paddingHorizontal: theme.spacing.xl,
    },
    list: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.massive,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    avatarText: {
      ...theme.typography.eyebrow,
      color: theme.colors.textOnDark,
      fontWeight: '700',
      fontSize: 11,
    },
    authorInfo: { flex: 1 },
    authorName: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    authorMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.textPrimary,
      fontWeight: '700',
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    metaText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
    },
    openBtn: {
      marginLeft: 'auto',
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 2,
    },
    openBtnText: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
  });
