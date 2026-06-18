import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Mic,
  Pause,
  Play,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  getRoomLearningContext,
  createLearningSession,
  nextSubLevel,
  completeSubLevel,
  pauseSession,
  resumeSession,
  endSession,
  getAvailableLevels,
  getMentorDashboard,
} from '../services/lmsApi';
import { mockLearningContext, mockSubLevels } from '../services/mockData';
import './MentorRoom.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSeconds(secs) {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m > 0) return `${m}m${s > 0 ? ` ${s}s` : ''}`;
  return `${s}s`;
}

// ---------------------------------------------------------------------------
// End Session Confirmation Dialog
// ---------------------------------------------------------------------------

function EndSessionDialog({ onConfirm, onCancel }) {
  return (
    <div className="mentor-room__overlay" onClick={onCancel}>
      <div className="mentor-room__dialog" onClick={(e) => e.stopPropagation()}>
        <div className="mentor-room__dialog-icon">⚠️</div>
        <h2 className="mentor-room__dialog-title">End Session?</h2>
        <p className="mentor-room__dialog-message">
          This will end the current learning session for all learners in the room. This action
          cannot be undone.
        </p>
        <div className="mentor-room__dialog-actions">
          <Button variant="dark-outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary-filled"
            onClick={onConfirm}
            style={{ backgroundColor: 'var(--red)', borderColor: 'var(--red)' }}
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status Pill
// ---------------------------------------------------------------------------

function StatusPill({ status }) {
  const label =
    status === 'ACTIVE' ? 'LIVE' : status === 'PAUSED' ? 'PAUSED' : 'ENDED';
  const cls =
    status === 'ACTIVE'
      ? 'mentor-room__status-pill--active'
      : status === 'PAUSED'
      ? 'mentor-room__status-pill--paused'
      : 'mentor-room__status-pill--ended';

  return (
    <span className={`mentor-room__status-pill ${cls}`}>
      <span className="mentor-room__status-dot" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Speaking Task Item
// ---------------------------------------------------------------------------

function TaskItem({ task, index, onToggle }) {
  return (
    <div
      className={`mentor-room__task-item ${task.completed ? 'mentor-room__task-item--done' : ''}`}
    >
      <div className="mentor-room__task-num">{index + 1}</div>
      <div className="mentor-room__task-content">
        <div className="mentor-room__task-prompt">{task.prompt}</div>
        {task.durationSeconds && (
          <div className="mentor-room__task-duration">
            <Clock size={12} />
            {formatSeconds(task.durationSeconds)}
          </div>
        )}
      </div>
      <button
        className="mentor-room__task-check"
        onClick={() => onToggle(task.taskId)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <CheckCircle size={22} fill={task.completed ? 'var(--green-accent)' : 'none'} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export const MentorRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // ── State ──
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Session status driven locally after initial load
  const [sessionStatus, setSessionStatus] = useState('ACTIVE'); // ACTIVE | PAUSED | ENDED

  // Level selector
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [pinnedLevelId, setPinnedLevelId] = useState(null);
  const [pinning, setPinning] = useState(false);
  const [availableLevels, setAvailableLevels] = useState([]);

  // SubLevel & tasks (local copies for task-toggling)
  const [currentSubLevel, setCurrentSubLevel] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Action loading states
  const [advancingSubLevel, setAdvancingSubLevel] = useState(false);

  // End session dialog
  const [showEndDialog, setShowEndDialog] = useState(false);

  // ── Fetch context ──
  const fetchContext = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await getRoomLearningContext(roomId);
      } catch (err) {
        if (err.message && (err.message.includes('404') || err.message.includes('not found'))) {
          data = {
            session: null,
            currentSubLevel: null
          };
        } else {
          throw err;
        }
      }
      setContext(data);

      const session = data?.session;
      setSessionStatus(session?.status ?? 'INACTIVE');
      setSelectedLevelId(session?.levelId ?? null);
      setPinnedLevelId(session?.levelId ?? null);
      setCurrentSubLevel(data?.currentSubLevel ?? null);

      if (data?.currentSubLevel && data.currentSubLevel.tasks) {
        const resolvedTasks = [...data.currentSubLevel.tasks]
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
          .map((t) => ({
            taskId: t.id,
            prompt: t.content,
            taskType: t.taskType,
            completed: false
          }));
        setTasks(resolvedTasks);
      } else {
        setTasks([]);
      }

      // Fetch available levels for selector
      let levels = [];
      try {
        levels = await getAvailableLevels();
        setAvailableLevels(levels);
      } catch (lvErr) {
        console.error('Failed to load available levels:', lvErr);
        if (session) {
          levels = [{
            levelId: session.levelId,
            title: session.levelTitle || 'SAYING WHO I AM',
            stage: 'Sơ cấp'
          }];
          setAvailableLevels(levels);
        }
      }

      if (!session && levels && levels.length > 0) {
        setSelectedLevelId((prev) => prev ?? levels[0].levelId);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load room context.');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  // ── Handlers ──

  const handlePinLevel = async () => {
    if (!selectedLevelId || !currentUser) return;
    setPinning(true);
    try {
      // 1. Get current session details from mentor dashboard first
      const dashboard = await getMentorDashboard(currentUser.userId);
      
      // 2. Check if active session exists in current room
      const activeSessionInRoom = dashboard.sessions?.find(
        (s) => s.roomId === roomId && (s.status === 'ACTIVE' || s.status === 'PAUSED')
      );
      const hasActiveSession = (dashboard.activeRoomProgress && dashboard.activeRoomProgress.roomId === roomId) ||
                               (activeSessionInRoom != null);

      if (hasActiveSession) {
        // Reuse current session
        const activeSession = activeSessionInRoom || (dashboard.sessions?.find(s => s.roomId === roomId));
        if (activeSession) {
          setPinnedLevelId(activeSession.levelId);
          setSelectedLevelId(activeSession.levelId);
        }
      } else {
        // 3. Only call POST /api/lms/sessions when no active session exists
        await createLearningSession({
          roomId,
          levelId: selectedLevelId
        });
        setPinnedLevelId(selectedLevelId);
      }
      
      // 5. Automatically refresh dashboard / load currentSubLevel
      await fetchContext();
    } catch (err) {
      alert('Failed to pin level: ' + err.message);
    } finally {
      setPinning(false);
    }
  };

  const handleNextSubLevel = async () => {
    if (advancingSubLevel) return;
    setAdvancingSubLevel(true);
    try {
      const res = await nextSubLevel(roomId);
      if (res && (res.status === 'COMPLETED' || res.status === 'ENDED')) {
        setSessionStatus('ENDED');
      }
      await fetchContext();
    } catch (err) {
      alert('Failed to advance sub-level: ' + err.message);
    } finally {
      setAdvancingSubLevel(false);
    }
  };

  const handleTogglePause = async () => {
    const next = sessionStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      if (sessionStatus === 'ACTIVE') {
        await pauseSession(roomId);
      } else {
        await resumeSession(roomId);
      }
      setSessionStatus(next);
    } catch (err) {
      alert('Failed to toggle pause state: ' + err.message);
    }
  };

  const handleEndSession = async () => {
    setShowEndDialog(false);
    try {
      await endSession(roomId);
      setSessionStatus('ENDED');
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      alert('Failed to end session: ' + err.message);
    }
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // ── Render states ──

  if (loading) {
    return (
      <div className="mentor-room">
        <div className="mentor-room__loading">
          <div className="mentor-room__spinner" />
          <span style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>
            Loading room…
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mentor-room">
        <div className="mentor-room__error">
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <p style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-black)' }}>
            Could not load room
          </p>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>{error}</p>
          <Button variant="primary-filled" onClick={fetchContext}>
            <RefreshCw size={16} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="mentor-room" style={{ padding: '40px', textAlign: 'center', fontSize: '1.6rem', color: 'var(--text-black-soft)' }}>
        Loading room context…
      </div>
    );
  }

  const isPaused = sessionStatus === 'PAUSED';
  const isEnded = sessionStatus === 'ENDED';
  const isSessionActive = sessionStatus === 'ACTIVE' || sessionStatus === 'PAUSED';
  const completedCount = tasks.filter((t) => t.completed).length;
  const isPinned = selectedLevelId === pinnedLevelId;

  return (
    <>
      {showEndDialog && (
        <EndSessionDialog
          onConfirm={handleEndSession}
          onCancel={() => setShowEndDialog(false)}
        />
      )}

      <div className="mentor-room">
        {/* ── Header ── */}
        <header className="mentor-room__header">
          <div className="mentor-room__header-left">
            <div className="mentor-room__room-title">
              {context?.session?.levelTitle ?? 'Mentor Room'}
            </div>
            <div className="mentor-room__header-meta">
              <StatusPill status={sessionStatus} />
              <span>Room {roomId}</span>
            </div>
          </div>
          <button
            className="mentor-room__close-btn"
            onClick={() => navigate(-1)}
            aria-label="Close room"
          >
            <X size={22} color="#fff" />
          </button>
        </header>

        {/* ── Main scrollable area ── */}
        <main className="mentor-room__main">

          {/* Level Selector Panel */}
          <div className="mentor-room__level-panel">
            <div className="mentor-room__level-panel-header">
              <BookOpen size={16} color="var(--gold)" />
              <span className="mentor-room__level-panel-title">Level Selection</span>
            </div>
            <div className="mentor-room__level-panel-body">
              <select
                id="mentor-room-level-select"
                className="mentor-room__level-select"
                value={selectedLevelId ?? ''}
                onChange={(e) => setSelectedLevelId(Number(e.target.value))}
                disabled={isEnded}
              >
                {(availableLevels ?? []).map((lv) => (
                  <option key={lv.levelId} value={lv.levelId}>
                    Level {lv.levelId} - {lv.title}
                  </option>
                ))}
              </select>

              {isSessionActive ? (
                <Button
                  variant="primary-filled"
                  disabled={true}
                  style={{ padding: '9px 18px', fontSize: '1.4rem', backgroundColor: 'var(--ceramic)', borderColor: 'var(--ceramic)', color: 'var(--text-black-soft)' }}
                >
                  <MapPin size={14} />
                  Session đang hoạt động
                </Button>
              ) : isPinned ? (
                <span className="mentor-room__pinned-badge">
                  <MapPin size={13} />
                  Pinned
                </span>
              ) : (
                <Button
                  variant="primary-filled"
                  onClick={handlePinLevel}
                  disabled={pinning || isEnded}
                  style={{ padding: '9px 18px', fontSize: '1.4rem' }}
                >
                  <MapPin size={14} />
                  {pinning ? 'Pinning…' : 'Pin Level'}
                </Button>
              )}
            </div>
          </div>

          {/* Current SubLevel Card */}
          {currentSubLevel ? (
            <div className="mentor-room__sublevel-card">
              <div className="mentor-room__sublevel-header">
                <div className="mentor-room__sublevel-label">
                  Current Sub-Level
                  {context?.session?.totalSubLevels > 0 && (
                    <span style={{ marginLeft: '8px', fontWeight: 400, opacity: 0.7 }}>
                      {currentSubLevel.subNumber || 1}/{context.session.totalSubLevels}
                    </span>
                  )}
                </div>
                <div className="mentor-room__sublevel-title">
                  Sub-Level {currentSubLevel.subNumber || 1}
                </div>
                <div className="mentor-room__sublevel-topic">
                  📌 {currentSubLevel.topic}
                </div>
              </div>

              {/* Speaking Tasks */}
              <div className="mentor-room__tasks-section">
                <div className="mentor-room__tasks-title">
                  <Mic size={14} />
                  Speaking Tasks
                  <span style={{ marginLeft: 'auto', fontWeight: 400, textTransform: 'none' }}>
                    {completedCount}/{tasks.length} done
                  </span>
                </div>
                <div className="mentor-room__task-list">
                  {tasks.map((task, i) => (
                    <TaskItem
                      key={task.taskId}
                      task={task}
                      index={i}
                      onToggle={handleToggleTask}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mentor-room__no-session-card" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-black-soft)',
              fontSize: '1.5rem',
              marginTop: '20px'
            }}>
              Chưa có session nào hoạt động trong room này. Hãy chọn một level bên trên và nhấn Pin Level để bắt đầu.
            </div>
          )}

        </main>

        {/* ── Bottom Controls ── */}
        <footer className="mentor-room__controls">
          <div className="mentor-room__controls-primary">
            {/* Next Sub-Level */}
            <Button
              id="btn-next-sublevel"
              variant="primary-filled"
              onClick={handleNextSubLevel}
              disabled={advancingSubLevel || isEnded || !isSessionActive}
              style={{ fontSize: '1.4rem', padding: '9px 16px' }}
            >
              {advancingSubLevel ? (
                <RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <ChevronRight size={15} />
              )}
              {advancingSubLevel ? 'Loading…' : 'Next Sub-Level'}
            </Button>

            {/* Pause / Resume */}
            {!isEnded && isSessionActive && (
              <Button
                id="btn-pause-resume"
                variant="dark-outlined"
                onClick={handleTogglePause}
                style={{ fontSize: '1.4rem', padding: '9px 16px' }}
              >
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
          </div>

          {/* End Session */}
          <div className="mentor-room__controls-danger">
            <Button
              id="btn-end-session"
              variant="primary-filled"
              onClick={() => setShowEndDialog(true)}
              disabled={isEnded || !isSessionActive}
              style={{
                fontSize: '1.4rem',
                padding: '9px 16px',
                backgroundColor: (isEnded || !isSessionActive) ? 'var(--ceramic)' : 'var(--red)',
                borderColor: (isEnded || !isSessionActive) ? 'var(--ceramic)' : 'var(--red)',
                color: (isEnded || !isSessionActive) ? 'var(--text-black-soft)' : 'var(--white)',
              }}
            >
              {isEnded ? 'Session Ended' : 'End Session'}
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
};
