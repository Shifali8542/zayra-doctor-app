import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const ThemedShell: React.FC = () => {
  const theme = useAppTheme();
  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider initialMode="light">
          <AuthProvider>
            <ThemedShell />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
