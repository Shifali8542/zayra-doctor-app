import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const theme = useAppTheme();

  const navTheme = {
    ...(theme.mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.divider,
      primary: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
