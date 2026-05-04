import React from 'react';
import { Text, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../context/ThemeContext';
import { createAvatarStyles } from './Avatar.style';

interface AvatarProps {
  initials: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = 36,
  style,
}) => {
  const theme = useAppTheme();
  const styles = createAvatarStyles(theme);
  const fontSize = Math.round(size * 0.42);

  return (
    <View
      style={[
        styles.wrapper,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <LinearGradient
        colors={[theme.colors.avatarGradientFrom, theme.colors.avatarGradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: size / 2 }]}
      >
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      </LinearGradient>
    </View>
  );
};
