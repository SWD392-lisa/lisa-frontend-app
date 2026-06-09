import { mockRooms } from './mockData';

// TODO: Replace with actual API calls
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_URL = `${API_BASE_URL}/rooms`;

export const roomService = {
  getFeatured: async () => {
    // return fetch(`${API_URL}/featured`).then(r => r.json())
    return new Promise(resolve => setTimeout(() => resolve(mockRooms.slice(0, 2)), 300));
  },

  getRecommended: async (userLevel) => {
    // return fetch(`${API_URL}/recommended?user_level=${userLevel}`).then(r => r.json())
    return new Promise(resolve => setTimeout(() => resolve(mockRooms), 300));
  },

  getAll: async (filters = {}) => {
    // const query = new URLSearchParams(filters).toString();
    // return fetch(`${API_URL}?${query}`).then(r => r.json())
    return new Promise(resolve => setTimeout(() => resolve(mockRooms), 300));
  },

  getById: async (id) => {
    // return fetch(`${API_URL}/${id}`).then(r => r.json())
    return new Promise(resolve => setTimeout(() => resolve(mockRooms.find(r => r.id === id) || mockRooms[0]), 300));
  }
};
