'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI } from './api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'EMPLOYER' | 'JOB_SEEKER' | 'ADMIN';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          await userAPI.getProfile();
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await userAPI.login({ email, password });
      const accessToken = response.data.accessToken || response.data.access_token;
      const userData = response.data.user || response.data.userData;

      if (!accessToken) {
        throw new Error('Login response missing access token');
      }

      localStorage.setItem('token', accessToken);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setToken(accessToken);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const response = await userAPI.register({ email, password, fullName, role });
      const accessToken = response.data.accessToken || response.data.access_token;
      const userData = response.data.user || response.data.userData;

      if (!accessToken) {
        throw new Error('Registration response missing access token');
      }

      localStorage.setItem('token', accessToken);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setToken(accessToken);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
