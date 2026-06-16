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
  mentorUserId: string;
}

export interface SessionResponse {
  sessionId: string;
  roomId: string;
  levelId: number | string;
  status: string;
  createdAt: string;
}

export interface SubLevel {
  subLevelId: string;
  title: string;
  topic: string;
  description: string;
  speakingTasks: SpeakingTask[];
  order: number;
}

export interface SpeakingTask {
  taskId: string;
  prompt: string;
  durationSeconds?: number;
  completed?: boolean;
}

export interface LearningContext {
  roomId: string;
  sessionId: string;
  sessionStatus: 'ACTIVE' | 'PAUSED' | 'ENDED';
  currentLevel: {
    levelId: number | string;
    title: string;
    stage: string;
  };
  currentSubLevel: SubLevel;
  availableLevels: Array<{ levelId: number | string; title: string; stage: string }>;
  pinnedLevelId: number | string | null;
}

export interface NextSubLevelResponse {
  sessionId: string;
  previousSubLevel: SubLevel;
  currentSubLevel: SubLevel;
  isLevelComplete: boolean;
}

export interface CompleteSubLevelPayload {
  sessionId: string;
  subLevelId: string;
  speakingMinutes?: number;
}

export interface CompleteSubLevelResponse {
  success: boolean;
  sessionId: string;
  subLevelId: string;
  speakingMinutes: number;
}

export interface MentorSession {
  sessionId: string;
  roomId: string;
  roomTitle: string;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  currentLevel: string;
  currentSubLevel: string;
  startedAt: string;
  endedAt?: string;
  speakingMinutes: number;
  learnerCount: number;
}

export interface LearnerCompletionSummary {
  learnerId: string;
  learnerName: string;
  completedSubLevels: number;
  totalSubLevels: number;
  completionPercent: number;
}

export interface MentorDashboard {
  mentorUserId: string;
  mentorName: string;
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalSpeakingMinutes: number;
  currentSession: MentorSession | null;
  recentSessions: MentorSession[];
  learnerSummaries: LearnerCompletionSummary[];
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
  const res = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
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
