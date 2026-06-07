import { mockUser } from './mockData';

// TODO: Replace with actual API calls
// const API_URL = '/api/auth';

export const authService = {
  login: async (email, password) => {
    // return fetch(`${API_URL}/login`, { ... })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: 'mock_token',
          account_type: mockUser.account_type,
          user: mockUser
        });
      }, 500);
    });
  },

  register: async (email, password, account_type) => {
    // return fetch(`${API_URL}/register`, { ... })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};
