import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Mic,
  PlayCircle,
  RefreshCw,
  Users,
  Zap,
  Plus,
} from 'lucide-react';
import { bindRealtimeRoom, createLearningSession, getLevels, getMentorDashboard, getRecordingPlaybackUrl } from '../services/lmsApi';
import { bindRealtimeRoomToLms, createRealtimeRoom } from '../services/realtimeService';
import './MentorDashboard.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMinutes(mins) {
  if (typeof mins !== 'number' || isNaN(mins)) return '0m';
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  }
  return `${mins}m`;
}

function formatRelativeDate(isoString) {
  if (!isoString) return '—';
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function getCompletionColor(pct) {
  if (pct === 100) return 'var(--green-accent)';
  if (pct >= 50) return 'var(--gold)';
  return 'var(--red)';
}

function calculateDurationMinutes(startedAt, endedAt) {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const diffMs = end - start;
  if (isNaN(diffMs) || diffMs <= 0) return 0;
  return Math.round(diffMs / (1000 * 60));
}

function formatTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return isoString;
  }
}

function mapSessionToUI(session, activeRoomProgress = null) {
  if (!session) return null;
  const speakingMinutes = calculateDurationMinutes(session.startedAt, session.endedAt);
  
  let learnerCount = 0;
  if (activeRoomProgress && activeRoomProgress.roomId === session.roomId && activeRoomProgress.learners) {
    learnerCount = activeRoomProgress.learners.length;
  }

  return {
    sessionId: session.id,
    roomId: session.roomId,
    roomTitle: `Room: ${session.roomId}`,
    status: session.status || 'ENDED',
    currentLevel: session.levelTitle || 'SAYING WHO I AM',
    currentSubLevel: `Sub-level ${session.currentSubNumber || 1}/${session.totalSubLevels || 1}`,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    speakingMinutes: speakingMinutes,
    learnerCount: learnerCount || 0
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ icon, value, label }) {
  return (
    <Card>
      <CardBody>
        <div className="mentor-stat-card">
          <div className="mentor-stat-card__icon">{icon}</div>
          <div className="mentor-stat-card__value">{value}</div>
          <div className="mentor-stat-card__label">{label}</div>
        </div>
      </CardBody>
    </Card>
  );
}

function ActiveSessionCard({ session }) {
  if (!session) return null;
  const elapsed = formatMinutes(session.speakingMinutes);

  return (
    <div className="mentor-active-session">
      <div className="mentor-active-session__live-pill">
        <span className="mentor-active-session__live-dot" />
        {session.status || 'LIVE'}
      </div>
      <div className="mentor-active-session__room">{session.roomTitle}</div>
      <div className="mentor-active-session__meta">
        <span className="mentor-active-session__meta-item">
          <BookOpen size={14} />
          {session.currentLevel}
        </span>
        <span className="mentor-active-session__meta-item">
          <Zap size={14} />
          {session.currentSubLevel}
        </span>
        <span className="mentor-active-session__meta-item">
          <Users size={14} />
          {session.learnerCount} learners
        </span>
        <span className="mentor-active-session__meta-item">
          <Mic size={14} />
          {elapsed} speaking
        </span>
      </div>
      <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginTop: '8px', paddingLeft: '4px' }}>
        Started: {formatTime(session.startedAt)} ({formatDate(session.startedAt)})
      </div>
      <div className="mentor-active-session__actions">
        <Link to={`/mentor/room/${session.sessionId}`} style={{ textDecoration: 'none' }}>
          <Button variant="inverted" style={{ fontSize: '1.4rem', padding: '8px 20px' }}>
            <PlayCircle size={16} />
            Open Room
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SessionListItem({ session }) {
  const isCompleted = session.status === 'COMPLETED' || session.status === 'ENDED';
  const statusColor = isCompleted ? 'var(--green-accent)' : 'var(--gold)';

  return (
    <Card>
      <CardBody>
        <div className="mentor-session-item">
          <div className="mentor-session-item__left">
            <div className="mentor-session-item__icon">
              <BookOpen size={20} color={statusColor} />
            </div>
            <div className="mentor-session-item__info">
              <div className="mentor-session-item__room">
                {session.roomTitle} 
                <span className="mentor-session-item__status-tag" style={{
                  marginLeft: '8px',
                  fontSize: '1.1rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: statusColor,
                  fontWeight: 600,
                  border: `1px solid ${statusColor}`
                }}>
                  {session.status}
                </span>
              </div>
              <div className="mentor-session-item__sub">
                <strong>{session.currentLevel}</strong> · {session.currentSubLevel}
              </div>
              <div style={{ fontSize: '1.2rem', color: 'var(--text-black-soft)', marginTop: '4px' }}>
                Time: {formatTime(session.startedAt)} - {session.endedAt ? formatTime(session.endedAt) : 'Now'} ({formatDate(session.startedAt)})
              </div>
            </div>
          </div>
          <div className="mentor-session-item__right">
            <div className="mentor-session-item__minutes">
              {formatMinutes(session.speakingMinutes)}
            </div>
            <div className="mentor-session-item__date">
              {formatRelativeDate(session.endedAt || session.startedAt)}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function LearnerSummaryItem({ learner }) {
  return (
    <div className="mentor-learner-item">
      <div className="mentor-learner-item__avatar">👤</div>
      <div className="mentor-learner-item__info">
        <div className="mentor-learner-item__name">{learner.learnerName}</div>
        <div className="mentor-learner-item__progress-bar-track">
          <div
            className="mentor-learner-item__progress-bar-fill"
            style={{
              width: `${learner.completionPercent}%`,
              backgroundColor: getCompletionColor(learner.completionPercent),
            }}
          />
        </div>
      </div>
      <div
        className="mentor-learner-item__pct"
        style={{ color: getCompletionColor(learner.completionPercent) }}
      >
        {learner.completionPercent}%
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="mentor-skeleton"
          style={{ height: '80px', marginBottom: '16px' }}
        />
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="container">
      <div className="mentor-dashboard__error">
        <div className="mentor-dashboard__error-icon">⚠️</div>
        <div className="mentor-dashboard__error-title">Could not load dashboard</div>
        <p className="mentor-dashboard__error-message">{message}</p>
        <Button variant="primary-filled" onClick={onRetry}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export const MentorDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [levels, setLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ language: 'ENGLISH', stage: '1', levelId: '', name: '', description: '', autoSwitchEnabled: true });
  const [createState, setCreateState] = useState({ loading: false, error: '' });
  const [recordingError, setRecordingError] = useState('');
  const [playingRecordingId, setPlayingRecordingId] = useState(null);

  const openCreateRoom = async () => {
    setShowCreateRoom(true);
    if (levels.length) return;
    try {
      setLevelsLoading(true);
      setCreateState({ loading: false, error: '' });
      setLevels(await getLevels(createForm.language, Number(createForm.stage)));
    } catch (err) {
      setCreateState({ loading: false, error: err.message || 'Could not load levels.' });
    } finally {
      setLevelsLoading(false);
    }
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (!createForm.levelId || !createForm.name.trim()) return;
    setCreateState({ loading: true, error: '' });
    try {
      const selectedLevel = levels.find((level) => String(level.id) === String(createForm.levelId));
      const lmsSession = await createLearningSession({
        levelId: Number(createForm.levelId),
        autoSwitchEnabled: createForm.autoSwitchEnabled,
      });
      const realtimeRoom = await createRealtimeRoom({
        name: createForm.name.trim(),
        description: createForm.description.trim() || undefined,
        level: String(selectedLevel?.levelNumber || createForm.levelId),
      });
      const sessionId = lmsSession.sessionId || lmsSession.id;
      await bindRealtimeRoom(sessionId, {
        realtimeRoomId: realtimeRoom.roomId || realtimeRoom.id,
        realtimeAgoraChannelName: realtimeRoom.agoraChannelName || realtimeRoom.defaultChannelName,
      });
      await bindRealtimeRoomToLms(realtimeRoom.roomId || realtimeRoom.id, sessionId);
      navigate(`/mentor/room/${sessionId}`);
    } catch (err) {
      setCreateState({ loading: false, error: err.message || 'Could not create room.' });
    }
  };

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUser?.userId) {
        throw new Error('Not authenticated');
      }
      const data = await getMentorDashboard(currentUser.userId);
      
      // Map backend DTO to frontend UI expectations
      const sessions = data.sessions || [];
      const activeSessionsCount = typeof data.activeSessions === 'number' ? data.activeSessions : sessions.filter(s => s.status === 'ACTIVE').length;
      const totalSessionsCount = typeof data.totalSessions === 'number' ? data.totalSessions : sessions.length;

      // Extract and map active/paused session as "current session"
      const activeSessionRaw = sessions.find(s => s.status === 'ACTIVE' || s.status === 'PAUSED') || null;
      const currentSession = activeSessionRaw ? mapSessionToUI(activeSessionRaw, data.activeRoomProgress) : null;

      // Recent sessions: only COMPLETED or ENDED (not ACTIVE/PAUSED which is the current session)
      const recentSessions = sessions
        .filter(s => s.status !== 'ACTIVE' && s.status !== 'PAUSED')
        .map(s => mapSessionToUI(s, data.activeRoomProgress))
        .filter(Boolean);

      // Calculate completed sessions (COMPLETED or ENDED)
      const completedSessionsCount = sessions.filter(s => s.status === 'COMPLETED' || s.status === 'ENDED').length;

      // Sum speaking minutes (calculated from startedAt and endedAt)
      const totalSpeakingMinutes = sessions.reduce((sum, s) => {
        return sum + calculateDurationMinutes(s.startedAt, s.endedAt);
      }, 0);

      // Extract learner summaries from activeRoomProgress
      const learnerSummaries = [];
      if (data.activeRoomProgress && data.activeRoomProgress.learners) {
        const totalSubLevels = data.activeRoomProgress.totalSubLevels || 1;
        data.activeRoomProgress.learners.forEach((l) => {
          const completionPercent = totalSubLevels > 0 
            ? Math.round((l.completedSubLevels / totalSubLevels) * 100)
            : 0;
          learnerSummaries.push({
            learnerId: l.userId,
            learnerName: `Learner ${l.userId.substring(0, 5)}`,
            completedSubLevels: l.completedSubLevels,
            totalSubLevels: totalSubLevels,
            completionPercent: completionPercent
          });
        });
      }

      setDashboard({
        mentorUserId: data.mentorUserId,
        mentorName: currentUser.fullName || currentUser.full_name || 'Mentor',
        totalSessions: totalSessionsCount,
        activeSessions: activeSessionsCount,
        completedSessions: completedSessionsCount,
        totalSpeakingMinutes: totalSpeakingMinutes,
        currentSession,
        recentSessions,
        learnerSummaries,
        recordings: data.recordings?.latestRecordings || []
      });
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />;
  if (!dashboard) return null;

  const {
    mentorName,
    totalSessions,
    activeSessions,
    completedSessions,
    totalSpeakingMinutes,
    currentSession,
    recentSessions,
    learnerSummaries,
    recordings,
  } = dashboard;

  const playRecording = async (recording) => {
    try {
      setPlayingRecordingId(recording.recordingId);
      const playback = await getRecordingPlaybackUrl(recording.recordingId);
      window.open(playback.playbackUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setRecordingError(err.message || 'Could not open recording.');
    } finally {
      setPlayingRecordingId(null);
    }
  };

  return (
    <div className="mentor-dashboard">
      {/* ── Header ── */}
      <div className="mentor-dashboard__header">
        <div className="container">
          <p className="mentor-dashboard__greeting">Welcome back,</p>
          <h1 className="mentor-dashboard__name">{mentorName}</h1>
          <span className="mentor-dashboard__badge">
            <Mic size={12} />
            MENTOR
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mentor-dashboard__body">
        <div className="container" style={{ paddingTop: '40px' }}>

          {/* Stats grid */}
          <h2 className="mentor-dashboard__section-title">
            <Zap size={18} color="var(--gold)" />
            Overview
          </h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
            <Button variant="primary-filled" onClick={openCreateRoom}>
              <Plus size={17} /> Create Live Room
            </Button>
          </div>
          <div className="mentor-dashboard__stats-grid">
            <StatCard
              icon={<BookOpen size={22} color="var(--green-accent)" />}
              value={totalSessions}
              label="Total Sessions"
            />
            <StatCard
              icon={<PlayCircle size={22} color="var(--red)" />}
              value={activeSessions}
              label="Active Now"
            />
            <StatCard
              icon={<CheckCircle size={22} color="var(--green-accent)" />}
              value={completedSessions}
              label="Completed"
            />
            <StatCard
              icon={<Mic size={22} color="var(--gold)" />}
              value={formatMinutes(totalSpeakingMinutes)}
              label="Speaking Time"
            />
            <StatCard
              icon={<Users size={22} color="var(--starbucks-green)" />}
              value={learnerSummaries.length}
              label="Learners"
            />
            <StatCard
              icon={<Clock size={22} color="var(--text-black-soft)" />}
              value={`${Math.round((completedSessions / Math.max(totalSessions, 1)) * 100)}%`}
              label="Completion Rate"
            />
          </div>

          {/* Active session */}
          {currentSession && (
            <>
              <h2 className="mentor-dashboard__section-title">
                <PlayCircle size={18} color="var(--red)" />
                Current Session
              </h2>
              <ActiveSessionCard session={currentSession} />
            </>
          )}

          {/* Learner completion */}
          {learnerSummaries.length > 0 && (
            <>
              <h2 className="mentor-dashboard__section-title">
                <Users size={18} color="var(--green-accent)" />
                Learner Completion
              </h2>
              <Card style={{ marginBottom: '32px' }}>
                <CardBody>
                  <div className="mentor-learner-list">
                    {learnerSummaries.map((learner) => (
                      <LearnerSummaryItem key={learner.learnerId} learner={learner} />
                    ))}
                  </div>
                </CardBody>
              </Card>
            </>
          )}

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <>
              <h2 className="mentor-dashboard__section-title">
                <Clock size={18} color="var(--text-black-soft)" />
                Recent Sessions
              </h2>
              <div className="mentor-session-list">
                {recentSessions.map((session) => (
                  <SessionListItem key={session.sessionId} session={session} />
                ))}
              </div>
            </>
          )}

          <h2 className="mentor-dashboard__section-title">
            <Mic size={18} color="var(--gold)" />
            Recent Recordings
          </h2>
          {recordingError && <p role="alert">{recordingError}</p>}
          {recordings.length === 0 ? <p className="mentor-dashboard__empty">No recordings yet.</p> : <div className="mentor-session-list">{recordings.map((recording) => <Card key={recording.recordingId}><CardBody><div className="mentor-session-item"><div className="mentor-session-item__info"><strong>{recording.recordingId}</strong><span>{recording.status} · {recording.provider || 'Agora'} · {recording.durationSeconds ? `${Math.round(recording.durationSeconds / 60)}m` : 'Duration pending'}</span></div><Button variant="primary-outlined" disabled={recording.status !== 'READY' || playingRecordingId === recording.recordingId} onClick={() => playRecording(recording)}>{playingRecordingId === recording.recordingId ? 'Opening...' : 'Play'}</Button></div></CardBody></Card>)}</div>}

        </div>
      </div>
      {showCreateRoom && (
        <div className="mentor-dashboard__modal-backdrop" onClick={() => setShowCreateRoom(false)}>
          <form className="mentor-dashboard__create-modal" onSubmit={handleCreateRoom} onClick={(event) => event.stopPropagation()}>
            <h2>Create Live Learning Room</h2>
            <label>Room name<input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="English Speaking Practice" required /></label>
            <label>Language<select value={createForm.language} onChange={async (e) => { const language = e.target.value; setCreateForm({ ...createForm, language, levelId: '' }); setLevelsLoading(true); try { setLevels(await getLevels(language, Number(createForm.stage))); setCreateState({ loading: false, error: '' }); } catch (err) { setLevels([]); setCreateState({ loading: false, error: err.message }); } finally { setLevelsLoading(false); } }}><option value="ENGLISH">English</option><option value="CHINESE">Chinese</option><option value="JAPANESE">Japanese</option></select></label>
            <label>Stage<select value={createForm.stage} onChange={async (e) => { const stage = e.target.value; setCreateForm({ ...createForm, stage, levelId: '' }); setLevelsLoading(true); try { setLevels(await getLevels(createForm.language, Number(stage))); setCreateState({ loading: false, error: '' }); } catch (err) { setLevels([]); setCreateState({ loading: false, error: err.message }); } finally { setLevelsLoading(false); } }}><option value="1">Stage 1 · Beginner</option><option value="2">Stage 2 · Intermediate</option><option value="3">Stage 3 · Advanced</option></select></label>
            <label>Level<select value={createForm.levelId} onChange={(e) => setCreateForm({ ...createForm, levelId: e.target.value })} disabled={levelsLoading} required><option value="">{levelsLoading ? 'Loading levels...' : levels.length ? 'Select a level' : 'No levels available'}</option>{levels.map((level) => <option key={level.id} value={level.id}>Level {level.levelNumber} · {level.title}</option>)}</select></label>
            <label>Description<textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} rows="3" /></label>
            <label className="mentor-dashboard__checkbox"><input type="checkbox" checked={createForm.autoSwitchEnabled} onChange={(e) => setCreateForm({ ...createForm, autoSwitchEnabled: e.target.checked })} /> Auto switch sub-level</label>
            {createState.error && <p className="mentor-dashboard__create-error" role="alert">{createState.error}</p>}
            <div className="mentor-dashboard__create-actions"><Button variant="dark-outlined" type="button" onClick={() => setShowCreateRoom(false)}>Cancel</Button><Button variant="primary-filled" type="submit" disabled={createState.loading}>{createState.loading ? 'Creating...' : 'Create and Open Room'}</Button></div>
          </form>
        </div>
      )}
    </div>
  );
};
