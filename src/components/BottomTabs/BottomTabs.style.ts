import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createBottomTabsStyles = (theme: AppTheme, bottomInset: number) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: bottomInset,
      backgroundColor: theme.colors.tabBarBg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
    bar: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    tabBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    iconWrap: {
      width: 44,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    iconWrapActive: {
      backgroundColor: theme.colors.tabActiveBg,
    },
    label: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
    },
    labelActive: {
      color: theme.colors.tabIconActive,
      fontWeight: '700',
    },
    labelInactive: {
      color: theme.colors.tabIconInactive,
    },
  });
