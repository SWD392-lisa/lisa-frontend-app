import { io } from 'socket.io-client';
import AgoraRTC from 'agora-rtc-sdk-ng';

const REALTIME_BASE_URL = (
  import.meta.env.FRONTEND_VITE_REALTIME_URL
  || import.meta.env.VITE_REALTIME_URL
  || 'http://localhost:3000'
).replace(/\/$/, '');

function token() {
  return localStorage.getItem('lucy_token');
}

async function api(path, options = {}) {
  const { authToken, ...fetchOptions } = options;
  const response = await fetch(`${REALTIME_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...((authToken || token()) ? { Authorization: `Bearer ${authToken || token()}` } : {}),
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

export const createRealtimeSocket = (authToken = token()) => io(REALTIME_BASE_URL, {
  transports: ['websocket'],
  auth: { token: authToken },
  reconnection: true,
});

export const getAgoraToken = (payload, authToken) => api('/api/agora/token', {
  method: 'POST',
  body: JSON.stringify(payload),
  authToken,
});

export const uploadLocalRecordingChunk = (recordingId, sequence, mimeType, blob) => api(
  `/api/recordings/${encodeURIComponent(recordingId)}/local-chunks?sequence=${sequence}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Recording-Mime-Type': mimeType,
    },
    body: blob,
  },
);

export const abortLocalRecording = (recordingId, reason) => api(
  `/api/recordings/${encodeURIComponent(recordingId)}/local-abort`,
  { method: 'POST', body: JSON.stringify({ reason }) },
);

export const createRealtimeRoom = (payload) => api('/api/rooms/create', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const bindRealtimeRoomToLms = (roomId, lmsSessionId) => api(`/api/rooms/${roomId}/lms-binding`, {
  method: 'PATCH',
  body: JSON.stringify({ lmsSessionId }),
});

export const endRealtimeRoom = (roomId) => api(`/api/rooms/${encodeURIComponent(roomId)}/end`, {
  method: 'PATCH',
});

export const createAgoraClient = () => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export const getPodcasts = () => api('/api/podcasts');
export const getPodcastPlaybackUrl = (podcastId) => api(`/api/podcasts/${encodeURIComponent(podcastId)}/playback-url`);
export const getNotifications = () => api('/api/notifications');
export const markNotificationRead = (notificationId) => api(`/api/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' });
