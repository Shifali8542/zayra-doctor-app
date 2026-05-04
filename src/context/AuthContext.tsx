import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { api } from '../api/api';
import type { UserProfile } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
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

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      api.setAuthTokens({ access: res.access, refresh: res.refresh });
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
        api.setAuthTokens({ access: res.access, refresh: res.refresh });
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
        // best-effort
      }
    }
    api.setAuthTokens(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const skip = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, loading, login, signup, logout, skip }),
    [isAuthenticated, user, loading, login, signup, logout, skip],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};