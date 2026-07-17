import { mockLevels } from './mockData';

// TODO: Replace with actual API calls
// const API_BASE_URL = import.meta.env.FRONTEND_VITE_API_BASE_URL;
// const API_URL = `${API_BASE_URL}/lms`;

export const lmsService = {
  getLevels: async (language, userId) => {
    // return fetch(`${API_URL}/languages/${language}/levels?user_id=${userId}`).then(r => r.json())
    return new Promise(resolve => setTimeout(() => resolve(mockLevels), 300));
  }
};
