import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createWaveformPlaceholderStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.radii.md,
      width: '100%',
      overflow: 'hidden',
    },
  });
