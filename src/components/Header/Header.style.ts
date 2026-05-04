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
    brandText: {
      ...theme.typography.title,
      color: theme.colors.textPrimary,
      letterSpacing: 3,
      marginLeft: theme.spacing.sm,
      fontWeight: '700',
    },
    logo: {
      width: 110,
      height: 28,
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
  });
