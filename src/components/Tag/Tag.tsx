import React, { ReactNode } from 'react';
import { Text, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { createTagStyles } from './Tag.style';

interface TagProps {
  label: string;
  variant?: 'default' | 'soft' | 'outline';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onDark?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'soft',
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onDark = false,
}) => {
  const theme = useAppTheme();
  const styles = createTagStyles(theme);

  return (
    <View
      style={[
        styles.base,
        variant === 'soft' && (onDark ? styles.softOnDark : styles.soft),
        variant === 'default' && styles.default,
        variant === 'outline' && styles.outline,
        style,
      ]}
    >
      {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
      <Text
        style={[
          styles.label,
          onDark && styles.labelOnDark,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
    </View>
  );
};
