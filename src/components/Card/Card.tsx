import React, { ReactNode } from 'react';
import { Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { createCardStyles } from './Card.style';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: number;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding,
  elevated = true,
}) => {
  const theme = useAppTheme();
  const styles = createCardStyles(theme);

  const inner = (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        padding !== undefined && { padding },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
};
