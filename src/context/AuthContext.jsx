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
    const data = await authService.login(email, password);
    setCurrentUser(data.user);
    localStorage.setItem('lucy_user', JSON.stringify(data.user));
    localStorage.setItem('lucy_token', data.access_token);
    return data.user;
  };

  const register = async (email, password, accountType) => {
    await authService.register(email, password, accountType);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lucy_user');
    localStorage.removeItem('lucy_token');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
