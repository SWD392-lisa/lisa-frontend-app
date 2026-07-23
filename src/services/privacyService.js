const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function getRoomPersona(roomSessionId) {
  const token = localStorage.getItem('lucy_token');
  const response = await fetch(`${API_BASE_URL}/api/privacy/room-persona`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ roomSessionId }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || 'Could not create anonymous room persona.');
  return body;
}

export async function getRoomParticipantIdentities(roomSessionId, anonymousIds) {
  const token = localStorage.getItem('lucy_token');
  const response = await fetch(`${API_BASE_URL}/api/privacy/room-participant-identities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ roomSessionId, anonymousIds }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || 'Could not load participant identities.');
  return Array.isArray(body) ? body : [];
}
