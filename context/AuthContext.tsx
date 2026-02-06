import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

const API_URL = 'http://localhost:5001/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for persistent login
    const storedUser = localStorage.getItem('lumina_user');
    const storedToken = localStorage.getItem('lumina_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        console.error('Login failed');
        return false;
      }

      const data = await response.json();

      const loggedInUser: User = {
        id: data.user.id.toString(),
        name: 'Admin User',
        email: data.user.email,
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff`
      };

      setUser(loggedInUser);
      setToken(data.token);

      localStorage.setItem('lumina_user', JSON.stringify(loggedInUser));
      localStorage.setItem('lumina_token', data.token);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lumina_user');
    localStorage.removeItem('lumina_token');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      // Update avatar if name changes
      if (data.name) {
        updatedUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3B82F6&color=fff`;
      }
      setUser(updatedUser);
      localStorage.setItem('lumina_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};