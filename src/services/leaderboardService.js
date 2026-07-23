const API_BASE = (
  import.meta.env.FRONTEND_VITE_API_BASE_URL
  || import.meta.env.VITE_API_BASE_URL
  || 'http://localhost:5000'
).replace(/\/$/, '');

export async function getMentorLeaderboard(period = 'weekly', page = 1, pageSize = 20) {
  const token = localStorage.getItem('lucy_token');
  const query = new URLSearchParams({
    period,
    page: String(page),
    pageSize: String(pageSize),
  });
  const response = await fetch(`${API_BASE}/api/leaderboard/mentors?${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('lucy:unauthorized'));
  }

  const raw = await response.text();
  let body = null;
  if (raw.trim()) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw new Error(body?.message || response.statusText || 'Could not load mentor leaderboard.');
  }

  return body?.data || body;
}
