import React from 'react';
import { Text, View, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { createSectionTitleStyles } from './SectionTitle.style';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  style,
}) => {
  const theme = useAppTheme();
  const styles = createSectionTitleStyles(theme);
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};
