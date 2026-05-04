import React from 'react';
import { Text, View, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon, IconName } from '../Icon';
import { createMetricCardStyles } from './MetricCard.style';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  subscript?: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  large?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  delta,
  subscript,
  icon,
  style,
  large = false,
}) => {
  const theme = useAppTheme();
  const styles = createMetricCardStyles(theme);

  return (
    <View style={[styles.card, large && styles.cardLarge, style]}>
      <View style={styles.headerRow}>
        {icon ? (
          <Icon name={icon} size={14} color={theme.colors.textTertiary} strokeWidth={2} />
        ) : null}
        <Text style={styles.label} numberOfLines={1}>
          {label}
          {subscript ? (
            <Text style={styles.subscript}>{subscript}</Text>
          ) : null}
        </Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, large && styles.valueLarge]}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        {delta ? <Text style={styles.delta}>{delta}</Text> : null}
      </View>
    </View>
  );
};
