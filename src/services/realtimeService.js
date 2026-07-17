import { io } from 'socket.io-client';
import AgoraRTC from 'agora-rtc-sdk-ng';

const REALTIME_BASE_URL = (import.meta.env.FRONTEND_VITE_REALTIME_URL || 'http://localhost:3000').replace(/\/$/, '');

function token() {
  return localStorage.getItem('lucy_token');
}

async function api(path, options = {}) {
  const response = await fetch(`${REALTIME_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {}),
    },
  });
  const raw = await response.text();
  let body = null;
  if (raw.trim()) {
    try { body = JSON.parse(raw); } catch { body = null; }
  }
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Realtime authentication failed. Please log in again.');
    }
    const message = body?.message || raw.trim() || response.statusText || 'Request failed';
    throw new Error(`${response.status}: ${message}`);
  }
  return body;
}

export const createRealtimeSocket = () => io(REALTIME_BASE_URL, {
  transports: ['websocket'],
  auth: { token: token() },
  reconnection: true,
});

export const getAgoraToken = (payload) => api('/api/agora/token', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const createRealtimeRoom = (payload) => api('/api/rooms/create', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const bindRealtimeRoomToLms = (roomId, lmsSessionId) => api(`/api/rooms/${roomId}/lms-binding`, {
  method: 'PATCH',
  body: JSON.stringify({ lmsSessionId }),
});

export const createAgoraClient = () => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export const getPodcasts = () => api('/api/podcasts');
export const getPodcastPlaybackUrl = (podcastId) => api(`/api/podcasts/${encodeURIComponent(podcastId)}/playback-url`);
export const getNotifications = () => api('/api/notifications');
export const markNotificationRead = (notificationId) => api(`/api/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' });
