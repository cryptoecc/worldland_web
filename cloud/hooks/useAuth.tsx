'use client';

import { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User;
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  devLogin: () => void;
  logout: () => void;
}

const BETA_USER: User = {
  id: 'beta-user',
  email: 'beta@worldland.foundation',
  name: 'Beta User',
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: BETA_USER,
    token: 'beta-access',
    isAuthenticated: true,
    isLoading: false,
    loginWithGoogle: async () => {},
    devLogin: () => {},
    logout: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
