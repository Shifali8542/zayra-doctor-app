import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';

export const createStatBadgeStyles = (theme: AppTheme) =>
  StyleSheet.create({
   pill: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      height: 36,
      backgroundColor: 'rgba(255,255,255,0.10)',
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 0,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.16)',
      gap: 4,
      overflow: 'hidden',
    },
    iconCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    label: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 10,
      lineHeight: 13,
      flexShrink: 1,
      flexGrow: 1,
    },
    value: {
      color: theme.colors.textOnDark,
      fontSize: 11,
      fontWeight: '700',
      flexShrink: 0,
    },
  });
