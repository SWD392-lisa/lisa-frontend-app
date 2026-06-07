const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL = `${API_BASE_URL}/api/Auth`;

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Include if backend sets HttpOnly cookies
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  },

  register: async (userData) => {
    // userData expects: fullName, email, password, confirmPassword, birthday, phoneNumber
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.json();
  },

  logout: async (refreshToken = null) => {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include' // To clear HttpOnly cookie
    });
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    return response.json();
  },

  refreshToken: async (refreshToken = null) => {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include' // To send HttpOnly cookie
    });
    if (!response.ok) {
      throw new Error('Refresh token failed');
    }
    return response.json();
  }
};
