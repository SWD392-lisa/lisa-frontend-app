import { mockLevels } from './mockData';

// TODO: Replace with actual API calls
// const API_URL = '/api/lms';

export const lmsService = {
  getLevels: async (language, userId) => {
    // return fetch(`${API_URL}/languages/${language}/levels?user_id=${userId}`).then(r => r.json())
    return new Promise(resolve => setTimeout(() => resolve(mockLevels), 300));
  }
};
