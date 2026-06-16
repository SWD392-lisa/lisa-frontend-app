import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
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
import { getRoomLearningContext, nextSubLevel, completeSubLevel } from '../services/lmsApi';
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
      // Use real API when backend is available:
      // const data = await getRoomLearningContext(roomId);
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve(mockLearningContext), 500)
      );
      setContext(data);
      setSessionStatus(data.sessionStatus ?? 'ACTIVE');
      setSelectedLevelId(data.currentLevel?.levelId ?? null);
      setPinnedLevelId(data.pinnedLevelId ?? null);
      setCurrentSubLevel(data.currentSubLevel);
      setTasks(data.currentSubLevel?.speakingTasks?.map((t) => ({ ...t })) ?? []);
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
    if (!selectedLevelId) return;
    setPinning(true);
    try {
      // await createLearningSession({ roomId, levelId: selectedLevelId, mentorUserId: ... });
      await new Promise((r) => setTimeout(r, 400)); // mock delay
      setPinnedLevelId(selectedLevelId);
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
      // const res = await nextSubLevel(roomId);
      // Mock: cycle through available sub-levels
      await new Promise((r) => setTimeout(r, 400));
      
      const currentIndex = mockSubLevels.findIndex(
        (s) => s.subLevelId === currentSubLevel?.subLevelId
      );
      const nextIndex = (currentIndex === -1 ? 0 : currentIndex + 1) % mockSubLevels.length;
      const nextSub = mockSubLevels[nextIndex];
      
      setCurrentSubLevel(nextSub);
      setTasks(nextSub.speakingTasks.map((t) => ({ ...t })));
    } catch (err) {
      alert('Failed to advance sub-level: ' + err.message);
    } finally {
      setAdvancingSubLevel(false);
    }
  };

  const handleTogglePause = async () => {
    const next = sessionStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    // TODO: POST pause/resume to API
    await new Promise((r) => setTimeout(r, 200));
    setSessionStatus(next);
  };

  const handleEndSession = async () => {
    setShowEndDialog(false);
    // await completeSubLevel({ sessionId: context?.sessionId, subLevelId: currentSubLevel?.subLevelId, ... });
    await new Promise((r) => setTimeout(r, 300));
    setSessionStatus('ENDED');
    // Navigate back after a moment
    setTimeout(() => navigate(-1), 1000);
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

  const room = context;
  const isPaused = sessionStatus === 'PAUSED';
  const isEnded = sessionStatus === 'ENDED';
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
              {room?.currentLevel?.title ?? 'Mentor Room'}
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
                {(room?.availableLevels ?? []).map((lv) => (
                  <option key={lv.levelId} value={lv.levelId}>
                    Level {lv.levelId} — {lv.title} ({lv.stage})
                  </option>
                ))}
              </select>

              {isPinned ? (
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
          {currentSubLevel && (
            <div className="mentor-room__sublevel-card">
              <div className="mentor-room__sublevel-header">
                <div className="mentor-room__sublevel-label">Current Sub-Level</div>
                <div className="mentor-room__sublevel-title">{currentSubLevel.title}</div>
                <div className="mentor-room__sublevel-topic">
                  📌 Topic: {currentSubLevel.topic}
                </div>
              </div>

              {currentSubLevel.description && (
                <div className="mentor-room__sublevel-desc">
                  {currentSubLevel.description}
                </div>
              )}

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
              disabled={advancingSubLevel || isEnded}
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
            {!isEnded && (
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
              disabled={isEnded}
              style={{
                fontSize: '1.4rem',
                padding: '9px 16px',
                backgroundColor: isEnded ? 'var(--ceramic)' : 'var(--red)',
                borderColor: isEnded ? 'var(--ceramic)' : 'var(--red)',
                color: isEnded ? 'var(--text-black-soft)' : 'var(--white)',
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
