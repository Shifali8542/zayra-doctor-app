import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, SECURE_TOKEN_KEY } from '../api/api';
import type { AuthTokens, UserProfile } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  skip: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  // True while reading tokens from secure store on first launch
  const [initializing, setInitializing] = useState(true);

  // ── Restore session on app launch ──────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const raw = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
        if (!raw) return;

        const tokens: AuthTokens = JSON.parse(raw);
        if (!tokens?.access || !tokens?.refresh) return;

        // Load tokens into the in-memory store so all API calls are authorized
        api.setAuthTokens(tokens);

        // Verify the token is still valid by fetching the profile
        const profile = await api.auth.profile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch {
        // Token expired or invalid — clear stale data
        await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY).catch(() => {});
        api.setAuthTokens(null);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      const tokens: AuthTokens = { access: res.access, refresh: res.refresh };
      api.setAuthTokens(tokens);
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, JSON.stringify(tokens));
      setUser(res.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const [first, ...rest] = name.split(' ');
      setLoading(true);
      try {
        const res = await api.auth.registerDoctor({
          first_name: first || name,
          last_name: rest.join(' '),
          email,
          phone: '',
          password,
          confirm_password: password,
        });
        const tokens: AuthTokens = { access: res.access, refresh: res.refresh };
        api.setAuthTokens(tokens);
        await SecureStore.setItemAsync(SECURE_TOKEN_KEY, JSON.stringify(tokens));
        setUser(res.user);
        setIsAuthenticated(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const refresh = api.getRefreshToken();
    if (refresh) {
      try {
        await api.auth.logout(refresh);
      } catch {
      }
    }
    api.setAuthTokens(null);
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY).catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const skip = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, loading, initializing, login, signup, logout, skip }),
    [isAuthenticated, user, loading, initializing, login, signup, logout, skip],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};