import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { themes, AppTheme, ThemeMode } from '../theme/theme';

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'light',
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[mode],
      mode,
      setMode,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};

export const useAppTheme = (): AppTheme => useTheme().theme;
