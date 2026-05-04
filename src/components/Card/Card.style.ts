import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createCardStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xxl,
      padding: theme.spacing.xl,
    },
    elevated: {
      shadowColor: '#0A2540',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    pressed: { opacity: 0.92, transform: [{ scale: 0.997 }] },
  });
