import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

// Decode JWT payload to extract user id
const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

// Normalize user object to always have _id
const normalizeUser = (user: any, token?: string): User | null => {
  if (!user) return null;
  const _id = user._id || user.id || (token ? decodeJwtPayload(token)?.id : undefined);
  if (!_id) return null;
  return {
    _id,
    name: user.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: user.role || 'student',
  };
};

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'driver';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; role: 'student' | 'driver' }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        const parsed = JSON.parse(savedUser);
        setUser(normalizeUser(parsed, savedToken));
      } catch {
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { token: newToken, user: newUser } = response;
    const normalized = normalizeUser(newUser, newToken);
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalized));
    
    setToken(newToken);
    setUser(normalized);
  };

  const signup = async (data: { name: string; email: string; password: string; role: 'student' | 'driver' }) => {
    const response = await authAPI.signup(data);
    const { token: newToken, user: newUser } = response;
    const normalized = normalizeUser(newUser || { email: data.email, name: data.name, role: data.role }, newToken);
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalized));
    
    setToken(newToken);
    setUser(normalized);
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
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
