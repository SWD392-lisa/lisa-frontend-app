/**
 * LMS API Service — Phase 3 Mentor LMS
 *
 * Base URL: VITE_LMS_API_URL (e.g. http://localhost:8080/api/lms)
 * Auth: Bearer token from localStorage('lucy_token')
 *
 * Real endpoints:
 *   POST   /sessions
 *   GET    /rooms/{roomId}/context
 *   POST   /rooms/{roomId}/next-sub-level
 *   POST   /progress/complete-sub-level
 *   GET    /dashboard/mentors/{mentorUserId}
 */

const BASE_URL = import.meta.env.VITE_LMS_API_URL ?? 'http://localhost:8080/api/lms';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('lucy_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text().catch(() => res.statusText);
    throw new Error(`LMS API error ${res.status}: ${errorBody}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateSessionPayload {
  roomId: string;
  levelId: number | string;
  mentorUserId?: string;
}

// Matches Java LearningSessionDto exactly
export interface SessionResponse {
  id: number;
  roomId: string;
  mentorUserId: string;
  levelId: number;
  levelTitle: string;
  currentSubNumber: number;
  totalSubLevels: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ENDED';
  startedAt: string;
  endedAt?: string;
}

// Matches Java SpeakingTaskDto exactly
export interface BackendSpeakingTask {
  id: number;
  taskType: 'QUESTION' | 'ANSWER' | 'BULLET';
  content: string;
  pronunciation?: string;
  orderIndex: number;
}

// Matches Java SubLevelDto exactly
export interface BackendSubLevel {
  id: number;
  subNumber: number;
  topic: string;
  durationMinutes: number;
  tasks: BackendSpeakingTask[];
}

// Matches Java RoomLearningContextDto exactly
export interface LearningContext {
  session: SessionResponse | null;
  currentSubLevel: BackendSubLevel | null;
}

// nextSubLevel endpoint returns LearningSessionDto (same as SessionResponse)
export type NextSubLevelResponse = SessionResponse;

// Legacy aliases kept for any code that imports these names
export type SubLevel = BackendSubLevel;
export type SpeakingTask = BackendSpeakingTask;

export interface CompleteSubLevelPayload {
  userId: string;
  roomId: string;
  levelId: number | string;
  subLevelId: number | string;
  speakingMinutes?: number;
}

export interface CompleteSubLevelResponse {
  id: number;
  userId: string;
  roomId: string;
  levelId: number;
  subLevelId: number;
  subLevelTopic: string;
  subNumber: number;
  speakingMinutes: number;
  completed: boolean;
  updatedAt: string;
}

export interface BackendLearningSession {
  id: number;
  roomId: string;
  mentorUserId: string;
  levelId: number;
  levelTitle: string;
  currentSubNumber: number;
  totalSubLevels: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ENDED';
  startedAt: string;
  endedAt?: string;
}

export interface RoomLearnerSummary {
  userId: string;
  completedSubLevels: number;
  totalSpeakingMinutes: number;
}

export interface BackendRoomProgress {
  roomId: string;
  levelId: number;
  totalSubLevels: number;
  learners: RoomLearnerSummary[];
}

export interface MentorDashboard {
  mentorUserId: string;
  totalSessions: number;
  activeSessions: number;
  sessions: BackendLearningSession[];
  activeRoomProgress: BackendRoomProgress | null;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * Create a new learning session for a room.
 * POST /sessions
 */
export async function createLearningSession(
  payload: CreateSessionPayload,
): Promise<SessionResponse> {
  const { roomId, levelId } = payload;
  const res = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ roomId, levelId }),
  });
  return handleResponse<SessionResponse>(res);
}

/**
 * Get the full learning context for a mentor's room (session, current sublevel, tasks, etc.)
 * GET /rooms/{roomId}/context
 */
export async function getRoomLearningContext(roomId: string): Promise<LearningContext> {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/context`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<LearningContext>(res);
}

/**
 * Advance the session to the next sub-level.
 * POST /rooms/{roomId}/next-sub-level
 */
export async function nextSubLevel(roomId: string): Promise<NextSubLevelResponse> {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/next-sub-level`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<NextSubLevelResponse>(res);
}

/**
 * Mark the current sub-level as complete and record speaking minutes.
 * POST /progress/complete-sub-level
 */
export async function completeSubLevel(
  payload: CompleteSubLevelPayload,
): Promise<CompleteSubLevelResponse> {
  const res = await fetch(`${BASE_URL}/progress/complete-sub-level`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<CompleteSubLevelResponse>(res);
}

/**
 * Get the mentor's full dashboard — sessions, active rooms, stats, learner summaries.
 * GET /dashboard/mentors/{mentorUserId}
 */
export async function getMentorDashboard(mentorUserId: string): Promise<MentorDashboard> {
  const res = await fetch(`${BASE_URL}/dashboard/mentors/${mentorUserId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<MentorDashboard>(res);
}

/**
 * Pause the active learning session for a room.
 * POST /rooms/{roomId}/pause
 */
export async function pauseSession(roomId: string): Promise<SessionResponse> {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/pause`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<SessionResponse>(res);
}

/**
 * Resume a paused learning session for a room.
 * POST /rooms/{roomId}/resume
 */
export async function resumeSession(roomId: string): Promise<SessionResponse> {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/resume`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<SessionResponse>(res);
}

/**
 * End the learning session for a room.
 * POST /rooms/{roomId}/end
 */
export async function endSession(roomId: string): Promise<SessionResponse> {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/end`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<SessionResponse>(res);
}

export interface LevelInfo {
  levelId: number;
  title: string;
  stage: string;
}

export async function getAvailableLevels(): Promise<LevelInfo[]> {
  const CURRICULUM_BASE_URL = BASE_URL.replace('/api/lms', '/api/curriculum');
  const res = await fetch(`${CURRICULUM_BASE_URL}/levels?language=ENGLISH`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await handleResponse<any[]>(res);
  return data.map((l) => {
    let stageStr = 'Sơ cấp';
    if (l.stage === 2) stageStr = 'Trung cấp';
    else if (l.stage === 3) stageStr = 'Cao cấp';
    return {
      levelId: l.id,
      title: l.title,
      stage: stageStr
    };
  });
}
