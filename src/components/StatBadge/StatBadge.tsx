import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon, IconName } from '../Icon';
import { createStatBadgeStyles } from './StatBadge.style';

interface StatBadgeProps {
  icon: IconName;
  label: string;
  value: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ icon, label, value }) => {
  const theme = useAppTheme();
  const styles = createStatBadgeStyles(theme);

  return (
    <View style={styles.pill}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={11} color={theme.colors.textOnDark} strokeWidth={2} />
      </View>
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
};
