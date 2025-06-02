"use client";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check both localStorage (for JWT) and sessionStorage (for username)
    const token = localStorage.getItem('access_token');
    const storedUsername = sessionStorage.getItem('username');
    
    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const login = useCallback((username: string, token: string) => {
    localStorage.setItem('access_token', token);
    sessionStorage.setItem('username', username);
    router.push('/home');
    setUsername(username);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    router.push('/signin');
    setUsername(null);
  }, []);

  const isAuthenticated = !!username;

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
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