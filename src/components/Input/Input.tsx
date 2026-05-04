import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon, IconName } from '../Icon';
import { createInputStyles } from './Input.style';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
  rightSlot?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconLeft,
  containerStyle,
  rightSlot,
  ...rest
}) => {
  const theme = useAppTheme();
  const styles = createInputStyles(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.fieldWrap, error ? styles.fieldError : null]}>
        {iconLeft ? (
          <View style={styles.iconLeftWrap}>
            <Icon name={iconLeft} size={18} color={theme.colors.textTertiary} />
          </View>
        ) : null}
        <TextInput
          placeholderTextColor={theme.colors.textTertiary}
          style={[
            styles.input,
            iconLeft && styles.inputWithIcon,
            rightSlot ? styles.inputWithRight : null,
          ]}
          {...rest}
        />
        {rightSlot}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};
