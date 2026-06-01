import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';
import type { Severity } from '../../types';

export const SEVERITY_DOT_COLOR: Record<Severity, string> = {
  CRITICAL: '#D04E5C',
  URGENT:   '#E0A23A',
  ROUTINE:  '#1FA59B',
};

export const SEVERITY_TEXT_COLOR: Record<Severity, string> = {
  CRITICAL: '#D04E5C',
  URGENT:   '#E0A23A',
  ROUTINE:  '#1FA59B',
};

export const createSeverityBadgeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.sm,
    },
    label: {
      ...theme.typography.eyebrow,
      fontSize: theme.fonts.sizes.md,
      letterSpacing: 1.4,
      fontWeight: '700',
    },
  });