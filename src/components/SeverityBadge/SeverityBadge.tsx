import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Severity } from '../../types';
import { createSeverityBadgeStyles } from './SeverityBadge.style';

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const theme = useAppTheme();
  const styles = createSeverityBadgeStyles(theme);
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text style={styles.label}>{severity}</Text>
    </View>
  );
};
