import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', data);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};