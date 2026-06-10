import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { getMentorDashboard } from '../services/lmsApi';
import { mockMentorDashboard } from '../services/mockData';
import './MentorDashboard.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMinutes(mins) {
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
        LIVE
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
      <div className="mentor-active-session__actions">
        <Link to={`/mentor/room/${session.roomId}`} style={{ textDecoration: 'none' }}>
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
  return (
    <Card>
      <CardBody>
        <div className="mentor-session-item">
          <div className="mentor-session-item__left">
            <div className="mentor-session-item__icon">
              <BookOpen size={20} color="var(--green-accent)" />
            </div>
            <div className="mentor-session-item__info">
              <div className="mentor-session-item__room">{session.roomTitle}</div>
              <div className="mentor-session-item__sub">
                {session.currentLevel} · {session.currentSubLevel}
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
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use real API when backend is available:
      // const data = await getMentorDashboard(currentUser?.id);
      // Fallback to mock while backend is being developed:
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve(mockMentorDashboard), 400)
      );
      setDashboard(data);
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

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
  } = dashboard;

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

        </div>
      </div>
    </div>
  );
};
