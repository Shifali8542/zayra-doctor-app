import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import type { Severity } from '../../types';
import { createSeverityBadgeStyles, SEVERITY_DOT_COLOR, SEVERITY_TEXT_COLOR } from './SeverityBadge.style';

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const theme = useAppTheme();
  const styles = createSeverityBadgeStyles(theme);
  const dotColor  = SEVERITY_DOT_COLOR[severity]  ?? theme.colors.textTertiary;
  const textColor = SEVERITY_TEXT_COLOR[severity] ?? theme.colors.textTertiary;
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, { color: textColor }]}>{severity}</Text>
    </View>
  );
};