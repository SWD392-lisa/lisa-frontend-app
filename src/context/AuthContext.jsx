import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Helper to decode JWT payload safely
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Check if JWT access token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

// Check if refresh token is expired (if it is a JWT)
const isRefreshTokenExpired = (refreshToken) => {
  if (!refreshToken) return true;
  const decoded = parseJwt(refreshToken);
  if (!decoded || !decoded.exp) {
    // If not a JWT (e.g. standard random string), assume not expired client-side
    return false;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthSuccess = (loginData) => {
    setCurrentUser(loginData.user);
    localStorage.setItem('lucy_user', JSON.stringify(loginData.user));
    localStorage.setItem('lucy_token', loginData.accessToken);
    localStorage.setItem('lucy_refresh_token', loginData.refreshToken);
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('lucy_refresh_token');
    authService.logout(refreshToken).catch(() => {});
    
    setCurrentUser(null);
    localStorage.removeItem('lucy_user');
    localStorage.removeItem('lucy_token');
    localStorage.removeItem('lucy_refresh_token');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('lucy_token');
      const refreshToken = localStorage.getItem('lucy_refresh_token');
      const storedUser = localStorage.getItem('lucy_user');

      if (!token) {
        setLoading(false);
        return;
      }

      if (!isTokenExpired(token)) {
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
        return;
      }

      // Access token is expired, check refresh token
      if (isRefreshTokenExpired(refreshToken)) {
        logout();
        setLoading(false);
        return;
      }

      // Try to get a new access token
      try {
        const result = await authService.refreshToken(refreshToken);
        if (result && result.data) {
          handleAuthSuccess(result.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auto token refresh failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    const loginData = result.data;
    handleAuthSuccess(loginData);
    return loginData.user;
  };

  const register = async (userData) => {
    return await authService.register(userData);
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
