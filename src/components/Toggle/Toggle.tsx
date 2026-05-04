import React from 'react';
import { Pressable, View, Animated } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { createToggleStyles } from './Toggle.style';

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const theme = useAppTheme();
  const styles = createToggleStyles(theme);

  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.divider, theme.colors.primary],
  });

  const knobLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={({ pressed }) => [
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View style={[styles.knob, { left: knobLeft }]} />
      </Animated.View>
    </Pressable>
  );
};
