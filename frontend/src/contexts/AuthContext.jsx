import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoMode, setAutoMode] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.me();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = (data) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
  };

  const manualLogin = async (email, password) => {
    await login(email, password);
  };

  const autoLogin = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await checkAuth();
    }
  };

  const updatePreferences = (preferences) => {
    setUser((prev) => 
      prev ? { ...prev, preferences: { ...prev.preferences, ...preferences } } : null
    );
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    autoMode,
    toggleAutoMode,
    manualLogin,
    autoLogin,
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 