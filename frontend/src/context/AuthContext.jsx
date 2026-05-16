import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { api } from '../utils/api.js';
import { generateFingerprint } from '../utils/fingerprint.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/api/auth/me');
      const currentUser = response.data.user;
      setUser(currentUser);

      try {
        const fingerprint = await generateFingerprint();
        await api.post('/api/auth/fingerprint', { fingerprint });
      } catch (fingerprintError) {
        console.warn('Fingerprint check failed silently');
      }

      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.get('/api/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshUser,
      logout
    }),
    [loading, logout, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
