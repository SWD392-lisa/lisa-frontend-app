const curriculumBase = (import.meta.env.FRONTEND_VITE_LMS_API_URL || 'http://localhost:8080/api/lms')
  .replace(/\/api\/lms\/?$/, '/api/curriculum')
  .replace(/\/$/, '');
const lmsBase = (import.meta.env.FRONTEND_VITE_LMS_API_URL || 'http://localhost:8080/api/lms').replace(/\/$/, '');
const realtimeBase = (import.meta.env.FRONTEND_VITE_REALTIME_URL || 'http://localhost:3000').replace(/\/$/, '');
const userBase = (
  import.meta.env.FRONTEND_VITE_API_BASE_URL
  || import.meta.env.VITE_API_BASE_URL
  || 'http://localhost:5000'
).replace(/\/$/, '');

const authHeaders = (json = true) => {
  const token = localStorage.getItem('lucy_token');
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseBody = async (response) => {
  const text = await response.text();
  if (!text.trim()) return null;
  try { return JSON.parse(text); } catch { return text; }
};

const request = async (base, path, options = {}) => {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { ...authHeaders(options.body instanceof FormData ? false : true), ...(options.headers || {}) },
  });
  const body = await parseBody(response);
  if (response.status === 401) window.dispatchEvent(new CustomEvent('lucy:unauthorized'));
  if (!response.ok) {
    const message = body?.message || body?.error || (typeof body === 'string' ? body : response.statusText) || 'Request failed';
    throw new Error(`${response.status}: ${message}`);
  }
  return body;
};

export const getCurriculumStats = () => request(curriculumBase, '/stats');
export const getCurriculumImports = () => request(curriculumBase, '/imports');
export const getCurriculumImport = (id) => request(curriculumBase, `/imports/${encodeURIComponent(id)}`);
export const getCurriculumLevels = (language, stage) => {
  const query = new URLSearchParams({ language });
  if (stage) query.set('stage', stage);
  return request(curriculumBase, `/levels?${query.toString()}`);
};
export const getCurriculumLevel = (id) => request(curriculumBase, `/levels/${encodeURIComponent(id)}`);
export const getCurriculumSubLevels = (id) => request(curriculumBase, `/levels/${encodeURIComponent(id)}/sub-levels`);

export const uploadCurriculum = ({ file, language, overwrite }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  formData.append('overwrite', String(overwrite));
  return request(curriculumBase, '/import', { method: 'POST', body: formData });
};

export const deleteCurriculumLanguage = (language) => request(curriculumBase, `?language=${encodeURIComponent(language)}`, { method: 'DELETE' });

export const getMentorDashboard = () => request(lmsBase, '/mentor/dashboard');
export const getMentorRecordings = () => request(lmsBase, '/mentor/dashboard/recordings');
export const getRecording = (id) => request(lmsBase, `/recordings/${encodeURIComponent(id)}`);
export const getRecordingPlayback = (id) => request(lmsBase, `/recordings/${encodeURIComponent(id)}/playback-url`);

export const getPodcasts = () => request(realtimeBase, '/api/podcasts');
export const getPodcast = (id) => request(realtimeBase, `/api/podcasts/${encodeURIComponent(id)}`);
export const getPodcastPlayback = (id) => request(realtimeBase, `/api/podcasts/${encodeURIComponent(id)}/playback-url`);

const queryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  const value = query.toString();
  return value ? `?${value}` : '';
};

export const getCreatorUsers = (params) => request(userBase, `/api/admin/users${queryString(params)}`);
export const getCreatorUser = (id) => request(userBase, `/api/admin/users/${encodeURIComponent(id)}`);
export const updateCreatorUserStatus = (id, payload) => request(userBase, `/api/admin/users/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify(payload) });

export const getCreatorRecordings = (params) => request(realtimeBase, `/api/admin/recordings${queryString(params)}`);
export const reviewCreatorRecording = (id, payload) => request(realtimeBase, `/api/admin/recordings/${encodeURIComponent(id)}/review`, { method: 'PATCH', body: JSON.stringify(payload) });
export const updateCreatorRecording = (id, payload) => request(realtimeBase, `/api/admin/recordings/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteCreatorRecording = (id) => request(realtimeBase, `/api/admin/recordings/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const getCreatorPodcasts = (params) => request(realtimeBase, `/api/admin/podcasts${queryString(params)}`);
export const updateCreatorPodcast = (id, payload) => request(realtimeBase, `/api/admin/podcasts/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const publishCreatorPodcast = (id) => request(realtimeBase, `/api/admin/podcasts/${encodeURIComponent(id)}/publish`, { method: 'POST' });
export const unpublishCreatorPodcast = (id) => request(realtimeBase, `/api/admin/podcasts/${encodeURIComponent(id)}/unpublish`, { method: 'POST' });
export const deleteCreatorPodcast = (id) => request(realtimeBase, `/api/admin/podcasts/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const creatorApiCapabilities = {
  userManagement: true,
  recordingModeration: true,
  podcastPublishing: true,
};
