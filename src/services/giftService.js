const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, options = {}) {
  const token = localStorage.getItem('lucy_token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || body?.data?.message || 'Gift request failed.');
  return body?.data ?? body;
}

export const getGiftCatalog = () => request('/api/gift/catalog');
export const registerRoomGiftRecipient = (roomSessionId) => request(`/api/gift/room/${encodeURIComponent(roomSessionId)}/recipient`, { method: 'PUT' });
export const deactivateRoomGiftRecipient = (roomSessionId) => request(`/api/gift/room/${encodeURIComponent(roomSessionId)}/recipient`, { method: 'DELETE' });
export const sendGiftToRoom = (payload) => request('/api/gift/send-to-room', { method: 'POST', body: JSON.stringify(payload) });
