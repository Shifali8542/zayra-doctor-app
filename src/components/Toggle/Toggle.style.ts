import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createToggleStyles = (theme: AppTheme) =>
  StyleSheet.create({
    track: {
      width: 44,
      height: 26,
      borderRadius: 13,
      justifyContent: 'center',
    },
    knob: {
      position: 'absolute',
      top: 2,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 1,
    },
    pressed: { opacity: 0.85 },
  });
