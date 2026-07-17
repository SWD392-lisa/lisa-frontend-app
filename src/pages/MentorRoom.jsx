import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { AICopilot } from '../components/lms/AICopilot';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Mic,
  MicOff,
  Pause,
  Play,
  RefreshCw,
  Users,
  UserMinus,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  getRoomLearningContext,
  createLearningSession,
  nextSubLevel,
  pauseSession,
  resumeSession,
  endSession,
  getAvailableLevels,
  getMentorDashboard,
  getPinnedMaterials,
  getRoomState,
  addPinnedMaterial,
  deletePinnedMaterial,
  startSession,
  startRecording,
  stopRecording,
  getSessionRecordings,
} from '../services/lmsApi';
import { createAgoraClient, createRealtimeSocket, getAgoraToken } from '../services/realtimeService';
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

function formatTimer(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(Math.floor(total % 60)).padStart(2, '0')}`;
}

function getAgoraChannel(state) {
  return state?.realtimeAgoraChannelName
    || state?.realtime?.agoraChannelName
    || state?.channelName
    || null;
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
    (status === 'ACTIVE' || status === 'LIVE') ? 'LIVE' : status === 'PAUSED' ? 'PAUSED' : status === 'WAITING' ? 'READY' : 'ENDED';
  const cls =
    (status === 'ACTIVE' || status === 'LIVE')
      ? 'mentor-room__status-pill--active'
      : status === 'PAUSED'
      ? 'mentor-room__status-pill--paused'
      : status === 'WAITING'
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
  const [sessionStatus, setSessionStatus] = useState('WAITING'); // WAITING | ACTIVE | PAUSED | ENDED

  // Level selector
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [pinnedLevelId, setPinnedLevelId] = useState(null);
  const [pinning, setPinning] = useState(false);
  const [availableLevels, setAvailableLevels] = useState([]);

  // SubLevel & tasks (local copies for task-toggling)
  const [currentSubLevel, setCurrentSubLevel] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialForm, setMaterialForm] = useState({ title: '', materialType: 'LINK', url: '' });
  const [materialLoading, setMaterialLoading] = useState(false);

  // Action loading states
  const [advancingSubLevel, setAdvancingSubLevel] = useState(false);

  // End session dialog
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [realtimeSession, setRealtimeSession] = useState({ participants: [], handRaiseQueue: [] });
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('IDLE');
  const [recordingId, setRecordingId] = useState(null);
  const [recordingActionLoading, setRecordingActionLoading] = useState(false);
  const [lmsRoomState, setLmsRoomState] = useState(null);
  const [mentorClockNow, setMentorClockNow] = useState(Date.now());
  const lmsSyncedAtRef = useRef(Date.now());
  const [moderationNotice, setModerationNotice] = useState('');
  const realtimeSocketRef = useRef(null);
  const agoraClientRef = useRef(null);
  const mentorTrackRef = useRef(null);
  const mentorTrackPublishedRef = useRef(false);
  const mentorAgoraUidRef = useRef(null);
  const mentorMicOnRef = useRef(false);
  const mentorSpeakingRef = useRef(false);
  const mentorAnonymousUserIdRef = useRef(null);
  const agoraJoinInProgressRef = useRef(false);
  const agoraChannelRef = useRef(null);
  const lmsRoomStateRef = useRef(null);
  const [agoraConnected, setAgoraConnected] = useState(false);
  const [mentorMicOn, setMentorMicOn] = useState(false);
  const [mentorSpeaking, setMentorSpeaking] = useState(false);
  const [micLoading, setMicLoading] = useState(false);
  const [audioError, setAudioError] = useState('');

  const applyLmsState = useCallback((state) => {
    if (!state) return;
    lmsSyncedAtRef.current = Date.now();
    setLmsRoomState(state);
    lmsRoomStateRef.current = state;
    setSessionStatus(state.status || 'WAITING');
    setCurrentSubLevel(state.currentSubLevel || null);
    const resolvedTasks = [...(state.currentSubLevel?.tasks || [])]
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((task) => ({
        taskId: task.id,
        prompt: task.content,
        taskType: task.taskType,
        completed: false,
      }));
    setTasks(resolvedTasks);
  }, []);

  const syncLmsState = useCallback(async () => {
    const state = await getRoomState(roomId);
    applyLmsState(state);
    return state;
  }, [applyLmsState, roomId]);

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

      try {
        await syncLmsState();
      } catch {
        // getRoomLearningContext already supplied the initial screen state.
      }

      const session = data?.session;
      setSessionStatus(session?.status ?? 'INACTIVE');
      setSelectedLevelId(session?.levelId ?? null);
      setPinnedLevelId(session?.levelId ?? null);
      setCurrentSubLevel(data?.currentSubLevel ?? null);

      try {
        setMaterials(await getPinnedMaterials(roomId));
      } catch (materialErr) {
        console.warn('Failed to load pinned materials:', materialErr);
        setMaterials([]);
      }

      try {
        const recordings = await getSessionRecordings(roomId);
        const latest = recordings?.[0];
        const activeRecording = recordings?.find((item) => ['REQUESTED', 'RECORDING', 'PROCESSING'].includes(item.status));
        setRecordingId((activeRecording || latest)?.recordingId || null);
        setRecordingStatus(activeRecording?.status || 'IDLE');
      } catch {
        setRecordingId(null);
      }

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
  }, [roomId, syncLmsState]);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  useEffect(() => {
    if (!context?.session?.sessionId) return undefined;
    let active = true;
    const poll = async () => {
      try {
        await syncLmsState();
      } catch {
        // Keep the last known state while LMS is temporarily unavailable.
      }
    };
    poll();
    const lmsTimer = window.setInterval(() => { if (active) poll(); }, 2000);
    const clockTimer = window.setInterval(() => setMentorClockNow(Date.now()), 1000);
    return () => {
      active = false;
      window.clearInterval(lmsTimer);
      window.clearInterval(clockTimer);
    };
  }, [context?.session?.sessionId, syncLmsState]);

  const cleanupAgora = useCallback(async () => {
    const client = agoraClientRef.current;
    const track = mentorTrackRef.current;

    try {
      if (client && mentorTrackPublishedRef.current && track) {
        await client.unpublish(track);
      }
    } catch {
      // The client may already be disconnected while the page is closing.
    }

    try {
      if (client) await client.leave();
    } catch {
      // Cleanup must remain best-effort during reconnect or unmount.
    }

    track?.close();
    agoraClientRef.current = null;
    mentorTrackRef.current = null;
    mentorTrackPublishedRef.current = false;
    mentorAgoraUidRef.current = null;
    agoraChannelRef.current = null;
    agoraJoinInProgressRef.current = false;
    mentorMicOnRef.current = false;
    mentorSpeakingRef.current = false;
    setMentorMicOn(false);
    setMentorSpeaking(false);
    setAgoraConnected(false);
  }, []);

  const setMentorMicState = useCallback(async (nextEnabled) => {
    const client = agoraClientRef.current;
    const socket = realtimeSocketRef.current;
    const sessionId = context?.session?.sessionId;
    const channelName = agoraChannelRef.current;
    const anonymousUserId = mentorAnonymousUserIdRef.current || currentUser?.userId;

    if (!client || !agoraConnected || !socket?.connected || !sessionId || !channelName) {
      throw new Error('Mentor audio is not connected yet. Please reconnect the room.');
    }

    setMicLoading(true);
    const previousEnabled = mentorMicOnRef.current;
    try {
      if (nextEnabled) {
        const tokenResponse = await getAgoraToken({
          sessionId,
          channelName,
          anonymousUserId: anonymousUserId || 'current',
          role: 'HOST',
          mediaType: 'host',
        });

        if (!tokenResponse?.token) {
          throw new Error('Agora host token response is empty.');
        }
        await client.renewToken(tokenResponse.token);

        if (!mentorTrackRef.current) {
          mentorTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
        }
        await mentorTrackRef.current.setEnabled(true);
        if (!mentorTrackPublishedRef.current) {
          await client.publish(mentorTrackRef.current);
          mentorTrackPublishedRef.current = true;
        }
      } else if (mentorTrackRef.current) {
        await mentorTrackRef.current.setEnabled(false);
        mentorSpeakingRef.current = false;
        setMentorSpeaking(false);
      }

      const response = await new Promise((resolve, reject) => {
        socket.timeout(10000).emit('media.status.changed', {
          sessionId,
          micEnabled: nextEnabled,
          speaking: nextEnabled ? mentorSpeakingRef.current : false,
        }, (timeoutError, result) => {
          if (timeoutError) {
            reject(timeoutError);
          } else if (!result?.success) {
            reject(new Error(result?.message || 'Could not update mentor microphone status.'));
          } else {
            resolve(result);
          }
        });
      });

      mentorMicOnRef.current = nextEnabled;
      setMentorMicOn(nextEnabled);
      setAudioError('');
      return response;
    } catch (toggleError) {
      if (nextEnabled !== previousEnabled && mentorTrackRef.current) {
        await mentorTrackRef.current.setEnabled(previousEnabled).catch(() => undefined);
      }
      throw toggleError;
    } finally {
      setMicLoading(false);
    }
  }, [agoraConnected, context?.session?.sessionId, currentUser?.userId]);

  const toggleMentorMic = () => {
    setMentorMicState(!mentorMicOnRef.current).catch((micError) => {
      setAudioError(micError?.message || 'Microphone permission was denied.');
    });
  };

  useEffect(() => {
    if (!context?.session?.sessionId) return undefined;
    const socket = createRealtimeSocket();
    realtimeSocketRef.current = socket;
    const sessionId = context.session.sessionId;
    const update = (payload) => {
      const next = payload?.session || payload;
      if (!next) return;
      setRealtimeSession((old) => ({ ...old, ...next }));
    };
    const connectAgora = async (channelName) => {
      if (agoraClientRef.current || agoraJoinInProgressRef.current) return;
      agoraJoinInProgressRef.current = true;
      agoraChannelRef.current = channelName;

      try {
        const tokenResponse = await getAgoraToken({
          sessionId,
          channelName,
          anonymousUserId: currentUser?.userId || 'current',
          role: 'HOST',
          mediaType: 'host',
        });
        if (!tokenResponse?.appId || !tokenResponse?.token || !tokenResponse?.channelName) {
          throw new Error('Agora host token response is empty or invalid.');
        }

        const client = createAgoraClient();
        agoraClientRef.current = client;
        client.on('connection-state-change', (state) => {
          setAgoraConnected(state === 'CONNECTED' || state === 'CONNECTING' || state === 'RECONNECTING');
        });
        client.on('user-published', async (user, mediaType) => {
          if (mediaType !== 'audio') return;
          try {
            await client.subscribe(user, 'audio');
            user.audioTrack?.play();
          } catch (subscribeError) {
            setAudioError(`Could not play learner audio: ${subscribeError.message}`);
          }
        });
        client.on('token-privilege-will-expire', async () => {
          try {
            const renewed = await getAgoraToken({
              sessionId,
              channelName: agoraChannelRef.current,
              anonymousUserId: mentorAnonymousUserIdRef.current || currentUser?.userId || 'current',
              role: 'HOST',
              mediaType: 'host',
            });
            await client.renewToken(renewed.token);
          } catch (renewError) {
            setAudioError(`Could not renew Agora token: ${renewError.message}`);
          }
        });
        await client.join(tokenResponse.appId, tokenResponse.channelName, tokenResponse.token, tokenResponse.uid);
        mentorAgoraUidRef.current = tokenResponse.uid;
        await client.enableAudioVolumeIndicator();
        client.on('volume-indicator', (volumes) => {
          const ownVolume = volumes.find((volume) => String(volume.uid) === String(mentorAgoraUidRef.current));
          const speaking = Boolean(mentorMicOnRef.current && ownVolume && ownVolume.level > 5);
          if (speaking === mentorSpeakingRef.current) return;
          mentorSpeakingRef.current = speaking;
          setMentorSpeaking(speaking);
          socket.emit('media.status.changed', { sessionId, speaking });
        });
        setAgoraConnected(true);
        setAudioError('');
      } catch (audioJoinError) {
        await cleanupAgora();
        setAudioError(audioJoinError?.message || 'Could not connect mentor audio.');
      } finally {
        agoraJoinInProgressRef.current = false;
      }
    };

    const joinSession = async () => {
      let roomState = lmsRoomStateRef.current;
      let channelName = getAgoraChannel(roomState) || getAgoraChannel(context?.session);
      if (!channelName) {
        try {
          roomState = await getRoomState(sessionId);
          lmsRoomStateRef.current = roomState;
          channelName = getAgoraChannel(roomState);
        } catch {
          // The error below gives the mentor an actionable room state message.
        }
      }
      if (!channelName) {
        setAudioError('This learning session has no bound Agora channel.');
        return;
      }

      setRealtimeConnected(true);
      socket.timeout(10000).emit('session.join', {
        sessionId,
        channelName,
        displayName: currentUser?.fullName || currentUser?.email || 'Mentor',
      }, (err, response) => {
        if (err || !response?.success) {
          setRealtimeConnected(false);
          setAudioError(err?.message || response?.message || 'Could not join realtime session.');
          return;
        }
        if (response.session) {
          update(response);
          mentorAnonymousUserIdRef.current = response.session.participants?.find(
            (participant) => participant.role === 'HOST' || participant.role === 'SUPER',
          )?.anonymousUserId || currentUser?.userId || null;
        }
        void connectAgora(channelName);
      });
    };

    socket.on('connect', () => { void joinSession(); });
    socket.on('disconnect', () => {
      setRealtimeConnected(false);
      void cleanupAgora();
    });
    socket.on('connect_error', (connectError) => setAudioError(connectError?.message || 'Realtime connection failed.'));
    socket.on('presence.updated', update);
    socket.on('speaker.approved', update);
    socket.on('media.status.changed', (event) => {
      if (!event?.anonymousUserId) return;
      if (String(event.anonymousUserId) === String(mentorAnonymousUserIdRef.current)) {
        mentorMicOnRef.current = Boolean(event.micEnabled);
        mentorSpeakingRef.current = Boolean(event.speaking);
        setMentorMicOn(Boolean(event.micEnabled));
        setMentorSpeaking(Boolean(event.speaking));
      }
      setRealtimeSession((old) => ({
        ...old,
        participants: (old.participants || []).map((participant) => String(participant.anonymousUserId) === String(event.anonymousUserId)
          ? { ...participant, micEnabled: event.micEnabled, speaking: event.speaking }
          : participant),
      }));
    });
    socket.on('participant.mute.requested', (event) => {
      setModerationNotice(`Mute requested for ${event?.targetAnonymousUserId || 'participant'}.`);
    });
    socket.on('participant.unmute.requested', (event) => {
      setModerationNotice(`Unmute requested for ${event?.targetAnonymousUserId || 'participant'}.`);
    });
    socket.on('speaker.removed', (event) => {
      setModerationNotice(`Speaker permission removed for ${event?.targetAnonymousUserId || 'participant'}.`);
    });
    socket.on('participant.removed', (event) => {
      setModerationNotice(`Participant removed: ${event?.targetAnonymousUserId || 'unknown'}.`);
    });
    socket.on('recording.status.changed', (event) => setRecordingStatus(event?.status || 'IDLE'));
    socket.on('hand.queue.updated', (queue) => setRealtimeSession((old) => ({
      ...old,
      handRaiseQueue: queue?.handRaiseQueue || [],
    })));
    return () => {
      realtimeSocketRef.current = null;
      socket.emit('session.leave', { sessionId });
      socket.disconnect();
      void cleanupAgora();
    };
  }, [cleanupAgora, context, currentUser?.email, currentUser?.fullName, currentUser?.userId]);

  const approveSpeaker = (anonymousUserId) => {
    const socket = realtimeSocketRef.current;
    if (!socket?.connected || !context?.session?.sessionId) {
      setError('Realtime connection is not ready. Please reconnect the room.');
      return;
    }
    socket.timeout(10000).emit('speaker.approve', {
      sessionId: context.session.sessionId,
      targetAnonymousUserId: anonymousUserId,
    }, (error, response) => {
      if (error || !response?.success) {
        setError(error?.message || 'Could not approve learner speaker.');
        return;
      }
      if (response.session) setRealtimeSession(response.session);
    });
  };

  const moderateParticipant = (eventName, anonymousUserId) => {
    const socket = realtimeSocketRef.current;
    const sessionId = context?.session?.sessionId;
    if (!socket?.connected || !sessionId) {
      setError('Realtime connection is not ready. Please reconnect the room.');
      return;
    }
    socket.timeout(10000).emit(eventName, {
      sessionId,
      targetAnonymousUserId: anonymousUserId,
    }, (ackError, response) => {
      if (ackError || !response?.success) {
        setError(ackError?.message || response?.message || 'Could not update participant moderation.');
        return;
      }
      setError(null);
      if (response.session) setRealtimeSession(response.session);
    });
  };

  const toggleRecording = async () => {
    if (!context?.session?.sessionId || recordingActionLoading) return;
    setRecordingActionLoading(true);
    try {
      if (recordingStatus === 'RECORDING' && recordingId) {
        const stopped = await stopRecording(recordingId);
        setRecordingStatus(stopped?.status || 'PROCESSING');
      } else if (!['PROCESSING', 'REQUESTED'].includes(recordingStatus)) {
        const started = await startRecording(context.session.sessionId);
        setRecordingId(started?.recordingId || null);
        setRecordingStatus(started?.status || 'RECORDING');
      }
      setAudioError('');
    } catch (recordingError) {
      setRecordingStatus('FAILED');
      setAudioError(recordingError?.message || 'Recording operation failed.');
    } finally {
      setRecordingActionLoading(false);
    }
  };

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
    const next = (sessionStatus === 'ACTIVE' || sessionStatus === 'LIVE') ? 'PAUSED' : 'LIVE';
    try {
      if (sessionStatus === 'ACTIVE' || sessionStatus === 'LIVE') {
        await pauseSession(roomId);
      } else {
        await resumeSession(roomId);
      }
      setSessionStatus(next);
    } catch (err) {
      alert('Failed to toggle pause state: ' + err.message);
    }
  };

  const handleStartSession = async () => {
    try {
      const started = await startSession(roomId);
      setSessionStatus(started?.status || 'ACTIVE');
      await fetchContext();
    } catch (err) {
      alert('Failed to start session: ' + err.message);
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

  const handleAddMaterial = async (event) => {
    event.preventDefault();
    if (!materialForm.title.trim() || !materialForm.url.trim()) return;
    setMaterialLoading(true);
    try {
      const created = await addPinnedMaterial(roomId, materialForm);
      setMaterials((prev) => [...prev, created]);
      setMaterialForm({ title: '', materialType: 'LINK', url: '' });
    } catch (err) {
      alert(`Failed to add material: ${err.message}`);
    } finally {
      setMaterialLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    setMaterialLoading(true);
    try {
      await deletePinnedMaterial(materialId);
      setMaterials((prev) => prev.filter((item) => item.id !== materialId));
    } catch (err) {
      alert(`Failed to remove material: ${err.message}`);
    } finally {
      setMaterialLoading(false);
    }
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
  const isEnded = sessionStatus === 'ENDED' || sessionStatus === 'COMPLETED';
  const isWaiting = sessionStatus === 'WAITING';
  const isSessionActive = sessionStatus === 'ACTIVE' || sessionStatus === 'LIVE' || sessionStatus === 'PAUSED';
  const completedCount = tasks.filter((t) => t.completed).length;
  const isPinned = selectedLevelId === pinnedLevelId;
  const elapsedSinceSync = lmsRoomState?.status === 'LIVE'
    ? Math.floor(Math.max(0, mentorClockNow - lmsSyncedAtRef.current) / 1000)
    : 0;
  const mentorSecondsRemaining = Math.max(0, Number(lmsRoomState?.secondsRemaining || 0) - elapsedSinceSync);

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
              <span className="mentor-room__timer"><Clock size={14} /> {formatTimer(mentorSecondsRemaining)}</span>
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
                  {(lmsRoomState?.currentSubLevel || context?.session?.totalSubLevels > 0) && (
                    <span style={{ marginLeft: '8px', fontWeight: 400, opacity: 0.7 }}>
                      Sub-level {currentSubLevel.subNumber || 1}
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

          <div className="mentor-room__lms-extras">
            <div className="mentor-room__materials-card">
              <div className="mentor-room__tasks-title"><Users size={14} /> Realtime Participants <span style={{ marginLeft: 'auto' }}>{realtimeConnected ? 'Connected' : 'Offline'} · {realtimeSession.handRaiseQueue?.length || 0} hand(s)</span></div>
              {audioError && <p className="mentor-room__audio-error" role="alert">{audioError}</p>}
              {moderationNotice && <p className="mentor-room__moderation-notice" role="status">{moderationNotice}</p>}
              {realtimeSession.participants.length === 0 ? <p className="mentor-room__materials-empty">No participants yet.</p> : realtimeSession.participants.map((participant) => (
                <div className="mentor-room__material-item" key={participant.anonymousUserId}>
                  <span className="mentor-room__participant-main"><strong>{participant.displayName || 'Anonymous'}</strong><small>{participant.role} · {participant.speaking ? <><Volume2 size={13} /> Speaking</> : participant.micEnabled ? <><Mic size={13} /> Mic on</> : <><VolumeX size={13} /> Mic off</>}{participant.isActiveSpeaker ? ' · Speaker' : ''}</small></span>
                  <span className="mentor-room__participant-actions">
                    {realtimeSession.handRaiseQueue?.includes(participant.anonymousUserId) && <Button type="button" onClick={() => approveSpeaker(participant.anonymousUserId)} style={{ padding: '5px 9px', fontSize: '1.1rem' }}>Approve speaker</Button>}
                    {participant.role === 'STUDENT' && <Button type="button" onClick={() => moderateParticipant(participant.micEnabled ? 'participant.mute' : 'participant.unmute', participant.anonymousUserId)} style={{ padding: '5px 9px', fontSize: '1.1rem' }}>{participant.micEnabled ? 'Mute' : 'Unmute'}</Button>}
                    {participant.isActiveSpeaker && <Button type="button" onClick={() => moderateParticipant('speaker.remove', participant.anonymousUserId)} style={{ padding: '5px 9px', fontSize: '1.1rem' }}>Remove speaker</Button>}
                    {participant.role === 'STUDENT' && <Button type="button" onClick={() => moderateParticipant('participant.remove', participant.anonymousUserId)} aria-label={`Remove ${participant.displayName || 'participant'}`} title="Remove participant" style={{ padding: '5px 9px', fontSize: '1.1rem' }}><UserMinus size={14} /> Remove</Button>}
                  </span>
                </div>
              ))}
            </div>
            <div className="mentor-room__materials-card">
              <div className="mentor-room__tasks-title"><BookOpen size={14} /> Pinned Materials</div>
              <form className="mentor-room__material-form" onSubmit={handleAddMaterial}>
                <input value={materialForm.title} onChange={(event) => setMaterialForm({ ...materialForm, title: event.target.value })} placeholder="Material title" />
                <select value={materialForm.materialType} onChange={(event) => setMaterialForm({ ...materialForm, materialType: event.target.value })}>
                  <option>LINK</option><option>SLIDE</option><option>PDF</option><option>DOC</option><option>IMAGE</option><option>OTHER</option>
                </select>
                <input value={materialForm.url} onChange={(event) => setMaterialForm({ ...materialForm, url: event.target.value })} placeholder="https://..." />
                <Button type="submit" disabled={materialLoading}>Add</Button>
              </form>
              {materials.length === 0 ? <p className="mentor-room__materials-empty">No pinned materials.</p> : materials.map((item) => (
                <div className="mentor-room__material-item" key={item.id}>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a><span>{item.materialType}</span>
                  <button type="button" onClick={() => handleDeleteMaterial(item.id)} disabled={materialLoading} aria-label="Remove material" title="Remove material"><X size={15} /></button>
                </div>
              ))}
            </div>
            <AICopilot topic={currentSubLevel?.topic || context?.session?.levelTitle || ''} task={tasks[0]?.prompt || ''} compact />
          </div>

        </main>

        {/* ── Bottom Controls ── */}
        <footer className="mentor-room__controls">
          <div className="mentor-room__controls-primary">
            <Button
              id="btn-mentor-mic"
              variant={mentorMicOn ? 'primary-filled' : 'dark-outlined'}
              onClick={toggleMentorMic}
              disabled={!agoraConnected || micLoading || isEnded || !isSessionActive}
              title={mentorMicOn ? 'Turn mentor microphone off' : 'Turn mentor microphone on'}
              style={{ fontSize: '1.4rem', padding: '9px 16px' }}
            >
              {mentorMicOn ? <MicOff size={15} /> : <Mic size={15} />}
              {micLoading ? 'Connecting mic...' : mentorMicOn ? 'Mute mic' : 'Enable mic'}
              {mentorSpeaking && <span className="mentor-room__speaking-indicator">Speaking</span>}
            </Button>

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
            {isWaiting && (
              <Button
                id="btn-start-session"
                variant="primary-filled"
                onClick={handleStartSession}
                style={{ fontSize: '1.4rem', padding: '9px 16px' }}
              >
                <Play size={15} /> Start Session
              </Button>
            )}

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
            {!isEnded && isSessionActive && (
              <Button
                id="btn-recording"
                variant="dark-outlined"
                onClick={toggleRecording}
                disabled={recordingActionLoading || ['PROCESSING', 'REQUESTED'].includes(recordingStatus)}
                style={{ fontSize: '1.4rem', padding: '9px 16px' }}
              >
                {recordingActionLoading ? 'Updating...' : recordingStatus === 'RECORDING' ? 'Stop Recording' : recordingStatus === 'PROCESSING' ? 'Processing...' : recordingStatus === 'READY' ? 'Start New Recording' : 'Start Recording'}
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
