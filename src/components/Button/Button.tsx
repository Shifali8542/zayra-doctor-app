import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon, IconName } from '../Icon';
import { createButtonStyles } from './Button.style';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightAdornment?: ReactNode;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  labelStyle,
  rightAdornment,
  testID,
}) => {
  const theme = useAppTheme();
  const styles = createButtonStyles(theme);

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const text: StyleProp<TextStyle> = [
    styles.label,
    styles[`label_${variant}`],
    styles[`labelSize_${size}`],
    labelStyle,
  ];

  const iconColor =
    variant === 'primary' || variant === 'glass'
      ? theme.colors.textOnDark
      : theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      style={({ pressed }) => [
        containerStyle,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.content}>
          {iconLeft ? (
            <View style={styles.iconLeft}>
              <Icon name={iconLeft} size={size === 'lg' ? 20 : 16} color={iconColor} />
            </View>
          ) : null}
          <Text style={text} numberOfLines={1}>
            {label}
          </Text>
          {iconRight ? (
            <View style={styles.iconRight}>
              <Icon name={iconRight} size={size === 'lg' ? 20 : 16} color={iconColor} />
            </View>
          ) : null}
          {rightAdornment}
        </View>
      )}
    </Pressable>
  );
};
