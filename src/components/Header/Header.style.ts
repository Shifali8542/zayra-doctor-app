import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createHeaderStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
    },
    brandWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoImage: {
      width: 130,
      height: 52,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bellBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    pressed: { opacity: 0.7 },
    bellBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
      borderWidth: 1.5,
      borderColor: theme.colors.surface,
    },
    bellBadgeText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '700',
    },
  });
