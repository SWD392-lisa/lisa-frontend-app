const configuredLmsUrl = import.meta.env.FRONTEND_VITE_LMS_API_URL || 'http://localhost:8080/api/lms';
const LMS_BASE_URL = configuredLmsUrl.replace(/\/$/, '');
const CURRICULUM_BASE_URL = LMS_BASE_URL.replace(/\/api\/lms$/, '/api/curriculum');
const REALTIME_BASE_URL = (
  import.meta.env.FRONTEND_VITE_REALTIME_URL
  || import.meta.env.VITE_REALTIME_URL
  || 'http://localhost:3000'
).replace(/\/$/, '');

export type Language = 'ENGLISH' | 'CHINESE' | 'JAPANESE';
export type SessionStatus = 'WAITING' | 'LIVE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ENDED';

export interface SpeakingTask {
  id: number;
  taskType: 'QUESTION' | 'ANSWER' | 'BULLET';
  content: string;
  pronunciation?: string;
  orderIndex: number;
}

export interface SubLevel {
  id: number;
  subNumber: number;
  topic: string;
  durationMinutes: number;
  tasks: SpeakingTask[];
}

export interface Level {
  id: number;
  language: Language;
  stage: number;
  levelNumber: number;
  title: string;
  cefrTarget?: string;
  durationMinutes: number;
  groupLabel?: string;
  subLevels?: SubLevel[];
}

export interface LearnerProgress {
  learnerUserId: string;
  levelId: number;
  subLevelId: number;
  completed: boolean;
  completedAt?: string;
  speakingSeconds: number;
  updatedAt?: string;
}

export interface Session {
  sessionId: string;
  channelName?: string;
  status: SessionStatus;
  levelId: number;
  currentSubLevelId?: number;
  realtimeRoomId?: string;
  realtimeAgoraChannelName?: string;
}

export interface RoomState {
  sessionId: string;
  channelName?: string;
  status: SessionStatus;
  realtimeRoomId?: string;
  realtimeAgoraChannelName?: string;
  levelSummary?: Pick<Level, 'id' | 'language' | 'stage' | 'levelNumber' | 'title' | 'cefrTarget' | 'durationMinutes'>;
  currentSubLevel?: SubLevel;
  subLevelStartedAt?: string;
  secondsRemaining?: number;
  autoSwitchEnabled?: boolean;
  pinnedMaterials?: PinnedMaterial[];
  realtime?: Record<string, unknown>;
}

export interface PinnedMaterial {
  id: number;
  title: string;
  materialType: string;
  url: string;
  displayOrder?: number;
  active: boolean;
  pinnedByUserId?: string;
  pinnedAt?: string;
}

export interface MentorLearnerProgress {
  learnerUserId: string;
  completedSubLevels: number;
  totalSpeakingSeconds: number;
  lastUpdatedAt?: string;
}

export interface MentorSession {
  sessionId: string;
  roomId?: string;
  levelId: number;
  levelTitle?: string;
  status: SessionStatus;
  currentSubLevelId?: number;
  currentSubNumber?: number;
  totalSubLevels?: number;
  currentSubLevelTopic?: string;
  realtimeRoomId?: string;
  realtimeAgoraChannelName?: string;
  topic?: string;
  startedAt?: string;
  endedAt?: string;
  pinnedMaterialCount?: number;
}

export interface Recording {
  recordingId: string;
  roomSessionId?: string;
  playbackUrl?: string;
  durationSeconds?: number;
  status?: string;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string;
  provider?: string;
  storageObjectKey?: string;
  podcastId?: string;
}

export interface MentorDashboard {
  mentorId: string;
  activeRoomCount: number;
  totalSessions: number;
  learnersToday: number;
  averageAttendanceMinutes: number;
  completedSubLevels: number;
  currentSessions: MentorSession[];
  progressSummaryByLevel: Array<Record<string, unknown>>;
  pinnedMaterialCount: number;
  learning?: { completedSubLevels?: number; activeSubLevels?: number };
  recordings?: { totalRecordings?: number; latestRecordings?: Recording[]; playbackReadyCount?: number };
}

export interface CreateSessionPayload {
  levelId: number | string;
  autoSwitchEnabled?: boolean;
  realtimeRoomId?: string;
  realtimeAgoraChannelName?: string;
}

export interface AiSuggestion {
  content: string;
  focus: string;
}

export interface AiSuggestionContext {
  language: Language | string;
  stage?: number;
  levelId?: number;
  levelNumber?: number;
  topic: string;
  task: string;
  count?: number;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('lucy_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(baseUrl: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('lucy:unauthorized'));
  }

  if (!response.ok) {
    let message = response.statusText || 'Request failed';
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      const text = await response.text().catch(() => '');
      if (text) message = text;
    }
    throw new Error(`${response.status}: ${message}`);
  }

  if (response.status === 204) return undefined as T;
  const raw = await response.text();
  if (!raw.trim()) return undefined as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`${response.status}: Invalid JSON response from LMS`);
  }
}

export const getLevels = (language: Language, stage?: number) => {
  const query = new URLSearchParams({ language });
  if (stage) query.set('stage', String(stage));
  return request<Level[]>(CURRICULUM_BASE_URL, `/levels?${query.toString()}`);
};

export const getAiSuggestions = (context: AiSuggestionContext) =>
  request<{ provider: string; model: string; suggestions: AiSuggestion[] }>(CURRICULUM_BASE_URL.replace(/\/curriculum$/, ''), '/ai/suggestions', {
    method: 'POST',
    body: JSON.stringify({ ...context, count: context.count || 3 }),
  });

export const getLevel = (levelId: string | number) =>
  request<Level>(CURRICULUM_BASE_URL, `/levels/${levelId}`);

export const getSubLevels = (levelId: string | number) =>
  request<SubLevel[]>(CURRICULUM_BASE_URL, `/levels/${levelId}/sub-levels`);

export const getLearnerProgress = () =>
  request<LearnerProgress[]>(LMS_BASE_URL, '/me/progress');

export const saveLearnerProgress = (payload: {
  sessionId?: string;
  levelId: number;
  subLevelId: number;
  completed: boolean;
  speakingSeconds: number;
}) => request<LearnerProgress>(LMS_BASE_URL, '/learner-progress', {
  method: 'POST',
  body: JSON.stringify({
    ...payload,
    idempotencyKey: `${payload.levelId}-${payload.subLevelId}-${Date.now()}`,
  }),
});

export const createLearningSession = (payload: CreateSessionPayload & { roomId?: string }) =>
  request<Session>(LMS_BASE_URL, '/room-sessions', {
    method: 'POST',
    body: JSON.stringify({
      levelId: payload.levelId,
      autoSwitchEnabled: payload.autoSwitchEnabled ?? true,
      realtimeRoomId: payload.realtimeRoomId || payload.roomId,
      realtimeAgoraChannelName: payload.realtimeAgoraChannelName,
    }),
  });

export const bindRealtimeRoom = (sessionId: string, payload: {
  realtimeRoomId: string;
  realtimeAgoraChannelName?: string;
}) => request<Session>(LMS_BASE_URL, `/room-sessions/${sessionId}/realtime-binding`, {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const startSession = (sessionId: string) =>
  request<Session>(LMS_BASE_URL, `/room-sessions/${sessionId}/start`, { method: 'POST' });

export const pauseSession = (sessionId: string) =>
  request<Session>(LMS_BASE_URL, `/room-sessions/${sessionId}/pause`, { method: 'POST' });

export const endSession = (sessionId: string) =>
  request<Session>(LMS_BASE_URL, `/room-sessions/${sessionId}/end`, { method: 'POST' });

export const getRoomState = (sessionId: string) =>
  request<RoomState>(LMS_BASE_URL, `/room-sessions/${sessionId}/state`);

export const joinSessionAttendance = (sessionId: string) =>
  request(LMS_BASE_URL, `/room-sessions/${sessionId}/attendance/join`, {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });

export const leaveSessionAttendance = (sessionId: string) =>
  request(LMS_BASE_URL, `/room-sessions/${sessionId}/attendance/leave`, {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });

export const nextSubLevel = (sessionId: string) =>
  request<Session>(LMS_BASE_URL, `/room-sessions/${sessionId}/switch-next`, { method: 'POST' });

export const switchSubLevel = (sessionId: string, subLevelId: number) =>
  request<Session>(LMS_BASE_URL, `/room-sessions/${sessionId}/switch-sub-level`, {
    method: 'POST',
    body: JSON.stringify({ subLevelId }),
  });

export const getPinnedMaterials = (sessionId: string) =>
  request<PinnedMaterial[]>(LMS_BASE_URL, `/room-sessions/${sessionId}/pinned-materials`);

export const addPinnedMaterial = (sessionId: string, payload: Omit<PinnedMaterial, 'id' | 'active' | 'pinnedByUserId' | 'pinnedAt'>) =>
  request<PinnedMaterial>(LMS_BASE_URL, `/room-sessions/${sessionId}/pinned-materials`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deletePinnedMaterial = (materialId: number) =>
  request<void>(LMS_BASE_URL, `/pinned-materials/${materialId}`, { method: 'DELETE' });

export const getMentorDashboard = async () => {
  const data = await request<MentorDashboard>(LMS_BASE_URL, '/mentor/dashboard');
  const sessionData = await getMentorSessions();
  const sourceSessions = sessionData?.length ? sessionData : (data.currentSessions || []);
  const sessions = sourceSessions.map((session) => ({
    id: session.sessionId,
    roomId: session.roomId || session.realtimeRoomId || session.sessionId,
    levelId: session.levelId,
    levelTitle: session.levelTitle || `Level ${session.levelId}`,
    currentSubNumber: session.currentSubNumber,
    totalSubLevels: session.totalSubLevels,
    status: session.status,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
  }));
  const active = sessions.find((session) => session.status === 'ACTIVE' || session.status === 'PAUSED');
  const learnerData = active ? await getMentorLearners(active.id) : [];
  return {
    ...data,
    sessions,
    mentorUserId: data.mentorId,
    activeSessions: data.activeRoomCount,
    activeRoomProgress: active ? {
      roomId: active.roomId,
      totalSubLevels: active.totalSubLevels,
      learners: (learnerData || []).map((learner) => ({
        userId: learner.learnerUserId,
        completedSubLevels: learner.completedSubLevels,
        totalSpeakingMinutes: Math.round((learner.totalSpeakingSeconds || 0) / 60),
      })),
    } : null,
  };
};

export const getMentorLearners = (sessionId?: string) => {
  const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
  return request<MentorLearnerProgress[]>(LMS_BASE_URL, `/mentor/dashboard/learners${query}`);
};

export const getMentorSessions = () =>
  request<MentorSession[]>(LMS_BASE_URL, '/mentor/dashboard/sessions');

export const getMentorRecordings = () =>
  request<Recording[]>(LMS_BASE_URL, '/mentor/dashboard/recordings');

export const startRecording = (sessionId: string) =>
  request<Recording>(LMS_BASE_URL, `/sessions/${sessionId}/recordings/start`, { method: 'POST' });

export const stopRecording = (recordingId: string) =>
  request<Recording>(LMS_BASE_URL, `/recordings/${recordingId}/stop`, { method: 'POST' });

export const getSessionRecordings = (sessionId: string) =>
  request<Recording[]>(LMS_BASE_URL, `/sessions/${sessionId}/recordings`);

export const getRecordingPlaybackUrl = (recordingId: string) =>
  request<{ recordingId: string; playbackUrl: string }>(LMS_BASE_URL, `/recordings/${recordingId}/playback-url`);

export const getRealtimeRoom = (roomId: string) =>
  request<Record<string, unknown>>(REALTIME_BASE_URL, `/api/rooms/${encodeURIComponent(roomId)}`);

// Compatibility exports for existing mentor screens while they are migrated.
export const getRoomLearningContext = async (sessionId: string) => {
  const state = await getRoomState(sessionId);
  return {
    session: state ? {
      sessionId: state.sessionId,
      status: state.status,
      levelId: state.levelSummary?.id,
      levelTitle: state.levelSummary?.title,
      currentSubNumber: state.currentSubLevel?.subNumber,
      totalSubLevels: undefined,
    } : null,
    currentSubLevel: state.currentSubLevel || null,
  };
};

export const resumeSession = startSession;
export const completeSubLevel = saveLearnerProgress;
export const getAvailableLevels = async () => (await getLevels('ENGLISH')).map((level) => ({
  levelId: level.id,
  title: level.title,
  stage: `Stage ${level.stage}`,
}));
