import { getRoomLobby } from './lmsApi';

const API_BASE_URL = (
  import.meta.env.FRONTEND_VITE_REALTIME_URL
  || import.meta.env.VITE_REALTIME_URL
  || 'http://localhost:3000'
).replace(/\/$/, '');

async function fetchRooms(status = 'OPEN') {
  const response = await fetch(`${API_BASE_URL}/api/rooms?status=${status}`);
  if (!response.ok) throw new Error(`Could not load rooms (${response.status})`);
  const rooms = await response.json();
  const boundRooms = rooms.filter((room) => room.lmsSessionId);

  const verifiedRooms = await Promise.all(boundRooms.map(async (room) => {
    try {
      const session = await getRoomLobby(room.lmsSessionId);
      const sessionStatus = String(session?.status || '').toUpperCase();
      return ['WAITING', 'LIVE', 'ACTIVE'].includes(sessionStatus)
        ? { ...room, sessionStatus }
        : null;
    } catch (error) {
      console.warn(`Could not verify LMS session ${room.lmsSessionId}:`, error);
      return null;
    }
  }));

  return verifiedRooms.filter(Boolean);
}

export const roomService = {
  getFeatured: async () => (await fetchRooms('OPEN')).slice(0, 2),
  getRecommended: async () => fetchRooms('OPEN'),
  getAll: async (filters = {}) => fetchRooms(filters.status || 'OPEN'),
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${id}`);
    if (!response.ok) throw new Error(`Could not load room (${response.status})`);
    return response.json();
  },
};
