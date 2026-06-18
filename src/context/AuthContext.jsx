import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('lucy_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const responseBody = await authService.login(email, password);
    const authData = responseBody.data;
    setCurrentUser(authData.user);
    localStorage.setItem('lucy_user', JSON.stringify(authData.user));
    localStorage.setItem('lucy_token', authData.accessToken);
    return authData.user;
  };

  const register = async (userData) => {
    await authService.register(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    }
    setCurrentUser(null);
    localStorage.removeItem('lucy_user');
    localStorage.removeItem('lucy_token');
  };

  const updateUser = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('lucy_user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('lucy_token', token);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
