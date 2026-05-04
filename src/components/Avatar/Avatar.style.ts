import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createAvatarStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    gradient: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      color: theme.colors.textOnDark,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });
