import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const createNotificationPanelStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: 'flex-end',
    },
    panel: {
      width: Math.min(SCREEN_WIDTH - 24, 340),
      maxHeight: 460,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.lg,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    unreadBadge: {
      backgroundColor: '#EF4444',
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: 'center',
    },
    unreadBadgeText: {
      ...theme.typography.eyebrow,
      color: '#fff',
      fontWeight: '700',
      fontSize: 10,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    markAllText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      fontWeight: '500',
    },
    closeBtn: { padding: 4 },
    list: { maxHeight: 360 },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    notifRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
      gap: theme.spacing.md,
    },
    notifRowUnread: {
      backgroundColor: theme.colors.backgroundAlt,
    },
    typeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 4,
      flexShrink: 0,
    },
    notifContent: { flex: 1 },
    notifTitle: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    notifMessage: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      lineHeight: 16,
      marginBottom: 2,
    },
    notifTime: {
      ...theme.typography.eyebrow,
      color: theme.colors.textTertiary,
      fontSize: 10,
    },
    unreadDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#EF4444',
      marginTop: 6,
      flexShrink: 0,
    },
  });