import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/theme';
import { DeviceType } from '../../utils/responsive';

export const createLayoutStyles = (_theme: AppTheme, _device: DeviceType) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
  });
