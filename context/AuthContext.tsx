"use client";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string | null;
  login: (username: string, token: string, isAdmin: boolean) => void;
  logout: () => void;
  adminLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = sessionStorage.getItem('username');
    const storedIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    if (token && storedUsername) {
      setUsername(storedUsername);
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const login = useCallback((username: string, token: string, isAdmin: boolean) => {
    localStorage.setItem('access_token', token);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('isAdmin', String(isAdmin));
    setUsername(username);
    setIsAdmin(isAdmin);
    router.push(isAdmin ? '/admin/dashboard' : '/home');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('isAdmin');
    setUsername(null);
    setIsAdmin(false);
    router.push('/signin');
  }, [router]);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('isAdmin');
    setUsername(null);
    setIsAdmin(false);
    router.push('/admin/login');
  }, [router]);

  const isAuthenticated = !!username;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, logout, adminLogout }}>
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