import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { ExternalLink, FileText, Hand, Mic, MicOff, Users, UserMinus, Volume2, VolumeX, X, Clock3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getAgoraToken, createAgoraClient, createRealtimeSocket } from '../services/realtimeService';
import { getPinnedMaterials, getRoomState, joinSessionAttendance, leaveSessionAttendance } from '../services/lmsApi';
import './LiveRoom.css';

const emptySession = { participants: [], handQueue: [] };

function formatTimer(seconds) {
  if (seconds === undefined || seconds === null || Number.isNaN(Number(seconds))) return '--:--';
  const total = Math.max(0, Math.floor(Number(seconds)));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function getCurrentIdentity(user) {
  if (user?.userId || user?.id || user?.uid) {
    return String(user.userId || user.id || user.uid);
  }
  const token = localStorage.getItem('lucy_token');
  try {
    const payload = token ? JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) : null;
    return payload?.userId || payload?.sub || null;
  } catch {
    return null;
  }
}

export const LiveRoom = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isMentor = ['MENTOR', 'CREATOR', 'PRO', 'SUPER'].includes(
    String(currentUser?.role || currentUser?.roleCode || '').toUpperCase(),
  );

  useEffect(() => {
    if (isMentor) navigate(`/mentor/room/${sessionId}`, { replace: true });
  }, [isMentor, navigate, sessionId]);
  const socketRef = useRef(null);
  const agoraRef = useRef(null);
  const localTrackRef = useRef(null);
  const localTrackPublishedRef = useRef(false);
  const localAgoraUidRef = useRef(null);
  const speakingRef = useRef(false);
  const micOnRef = useRef(false);
  const stateSyncedAtRef = useRef(Date.now());
  const anonymousUserIdRef = useRef(getCurrentIdentity(currentUser));
  const stateRef = useRef(null);
  const sessionRef = useRef(emptySession);
  const speakerApprovedRef = useRef(false);
  const [state, setState] = useState(null);
  const [session, setSession] = useState(emptySession);
  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [speakerApproved, setSpeakerApproved] = useState(false);
  const [sessionJoined, setSessionJoined] = useState(false);
  const [error, setError] = useState('');
  const [clockNow, setClockNow] = useState(Date.now());
  const [removedFromRoom, setRemovedFromRoom] = useState(false);

  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    speakerApprovedRef.current = speakerApproved;
  }, [speakerApproved]);

  const joinAudio = useCallback(async (currentState) => {
    const channelName = currentState?.realtimeAgoraChannelName || currentState?.realtime?.agoraChannelName;
    if (!channelName || !sessionId) return;
    try {
      const client = createAgoraClient();
      agoraRef.current = client;
      const socketJoin = await new Promise((resolve, reject) => {
        const socket = socketRef.current;
        socket.timeout(10000).emit('session.join', {
          sessionId,
          displayName: currentUser?.fullName || currentUser?.email || (isMentor ? 'Mentor' : 'LUCY learner'),
          isAnonymous: !isMentor,
        }, (err, response) => err ? reject(err) : resolve(response));
      });
      if (!socketJoin?.success) throw new Error('Could not join realtime session');
      setSessionJoined(true);
      if (socketJoin.session) setSession(socketJoin.session);
      const joinedParticipant = socketJoin.session?.participants?.find(
        (participant) => participant.anonymousUserId === anonymousUserIdRef.current
      );
      anonymousUserIdRef.current = joinedParticipant?.anonymousUserId || anonymousUserIdRef.current;
      setSpeakerApproved(Boolean(socketJoin.session?.activeSpeakerIds?.includes(anonymousUserIdRef.current)));
      try {
        const agora = await getAgoraToken({
          sessionId,
          channelName,
          anonymousUserId: anonymousUserIdRef.current || 'current',
          role: 'STUDENT',
          mediaType: 'audience',
        });
        if (!agora?.appId || !agora?.token || !agora?.channelName) {
          throw new Error('Agora token response is empty or invalid.');
        }
        await client.join(agora.appId, agora.channelName, agora.token, agora.uid);
        localAgoraUidRef.current = agora.uid;
        await client.enableAudioVolumeIndicator();
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio') user.audioTrack?.play();
        });
        client.on('volume-indicator', (volumes) => {
          const ownVolume = volumes.find((volume) => String(volume.uid) === String(localAgoraUidRef.current));
          const speaking = Boolean(micOnRef.current && ownVolume && ownVolume.level > 5);
          if (speaking !== speakingRef.current) {
            speakingRef.current = speaking;
            socketRef.current?.emit('media.status.changed', { sessionId, speaking });
          }
        });
      } catch (audioError) {
        setError(`Audio unavailable: ${audioError.message}`);
      }
      setConnected(true);
    } catch (joinError) {
      const rawMessage = joinError?.message || 'Could not connect to realtime audio.';
      const message = rawMessage.includes('Unexpected end of JSON input')
        ? 'Realtime API returned an empty response. Please check the realtime service and log in again.'
        : rawMessage;
      setError(message);
    }
  }, [currentUser?.email, currentUser?.fullName, currentUser?.userId, isMentor, sessionId]);

  const setMicState = useCallback(async (nextEnabled, { forced = false } = {}) => {
    if (!agoraRef.current) {
      throw new Error('Agora audio is not connected yet.');
    }

    const ownId = anonymousUserIdRef.current;
    const approved = ownId && (speakerApprovedRef.current || (sessionRef.current.activeSpeakerIds || []).includes(ownId));
    if (nextEnabled && !approved) {
      throw new Error('Mentor must approve you before you can turn on the microphone.');
    }

    if (nextEnabled) {
      const currentState = stateRef.current;
      const channelName = currentState?.realtimeAgoraChannelName || currentState?.realtime?.agoraChannelName;
      if (!channelName || !ownId) throw new Error('Realtime speaker identity is not ready yet.');

      const speakerToken = await getAgoraToken({
        sessionId,
        channelName,
        anonymousUserId: ownId,
        role: 'STUDENT',
        mediaType: 'speaker',
      });
      await agoraRef.current.renewToken(speakerToken.token);

      if (!localTrackRef.current) {
        localTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      }
      await localTrackRef.current.setEnabled(true);
      if (!localTrackPublishedRef.current) {
        await agoraRef.current.publish(localTrackRef.current);
        localTrackPublishedRef.current = true;
      }
    } else if (localTrackRef.current) {
      // Keep the track alive so a mentor can unmute this browser later.
      await localTrackRef.current.setEnabled(false);
      speakingRef.current = false;
    }

    micOnRef.current = nextEnabled;
    setMicOn(nextEnabled);
    socketRef.current?.emit('media.status.changed', {
      sessionId,
      micEnabled: nextEnabled,
      speaking: nextEnabled ? speakingRef.current : false,
    }, (response) => {
      if (response?.success === false && !forced) {
        setError(response.message || 'Could not update microphone status.');
      }
    });
  }, [sessionId]);

  useEffect(() => {
    if (isMentor) return undefined;
    let active = true;
    const socket = createRealtimeSocket();
    socketRef.current = socket;
    const updateSnapshot = (payload) => {
      if (!active) return;
      const nextSession = payload?.session || payload || emptySession;
      setSession(nextSession);
      const ownId = anonymousUserIdRef.current;
      if (ownId) setSpeakerApproved(Boolean(nextSession.activeSpeakerIds?.includes(ownId)));
    };
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (e) => setError(e.message || 'Realtime connection failed.'));
    socket.on('presence.updated', updateSnapshot);
    socket.on('hand.queue.updated', (queue) => setSession((old) => ({
      ...old,
      handQueue: queue?.handRaiseQueue || [],
    })));
    socket.on('speaker.approved', (event) => {
      if (String(event?.targetAnonymousUserId || '') === String(anonymousUserIdRef.current || '')) {
        setSpeakerApproved(true);
        setError('');
        setSession((old) => ({
          ...old,
          activeSpeakerIds: [...new Set([...(old.activeSpeakerIds || []), event.targetAnonymousUserId])],
          participants: (old.participants || []).map((participant) => String(participant.anonymousUserId) === String(event.targetAnonymousUserId)
            ? { ...participant, isActiveSpeaker: true }
            : participant),
        }));
      }
    });
    socket.on('media.status.changed', (event) => {
      if (!active || !event?.anonymousUserId) return;
      setSession((old) => ({
        ...old,
        participants: (old.participants || []).map((participant) => String(participant.anonymousUserId) === String(event.anonymousUserId)
          ? { ...participant, micEnabled: event.micEnabled, speaking: event.speaking }
          : participant),
      }));
    });
    socket.on('participant.mute.requested', (event) => {
      if (String(event?.targetAnonymousUserId) !== String(anonymousUserIdRef.current)) return;
      setMicState(false, { forced: true }).catch((muteError) => setError(muteError.message));
    });
    socket.on('participant.unmute.requested', (event) => {
      if (String(event?.targetAnonymousUserId) !== String(anonymousUserIdRef.current)) return;
      setMicState(true, { forced: true }).catch((unmuteError) => setError(unmuteError.message));
    });
    socket.on('speaker.removed', (event) => {
      if (String(event?.targetAnonymousUserId) !== String(anonymousUserIdRef.current)) return;
      setSpeakerApproved(false);
      setMicState(false, { forced: true }).catch(() => undefined);
      setError('The mentor removed your speaker permission.');
    });
    socket.on('participant.removed', (event) => {
      if (String(event?.targetAnonymousUserId) !== String(anonymousUserIdRef.current)) return;
      setRemovedFromRoom(true);
      setError('You were removed from this room by the mentor.');
      if (localTrackRef.current) localTrackRef.current.close();
      agoraRef.current?.leave().catch(() => {});
      socket.disconnect();
    });

    (async () => {
      try {
        // Attendance is the LMS enrollment gate, so join it before reading state.
        await joinSessionAttendance(sessionId);
        const roomState = await getRoomState(sessionId);
        if (!active) return;
        stateSyncedAtRef.current = Date.now();
        setState(roomState);
        if (!Array.isArray(roomState.pinnedMaterials)) {
          try {
            const materials = await getPinnedMaterials(sessionId);
            if (active) setState((old) => old ? { ...old, pinnedMaterials: materials } : old);
          } catch {
            // Pinned materials are optional for a room.
          }
        }
        await joinAudio(roomState);
      } catch (loadError) {
        if (active) setError(loadError?.message || 'Could not load learning room.');
      }
    })();

    const lmsSyncTimer = window.setInterval(async () => {
      try {
        const nextState = await getRoomState(sessionId);
        if (!active) return;
        stateSyncedAtRef.current = Date.now();
        setState(nextState);
      } catch {
        // Keep the last known LMS state while the service reconnects.
      }
    }, 2000);
    const clockTimer = window.setInterval(() => setClockNow(Date.now()), 1000);

    return () => {
      active = false;
      window.clearInterval(lmsSyncTimer);
      window.clearInterval(clockTimer);
      socket.emit('session.leave', { sessionId });
      socket.disconnect();
      if (localTrackRef.current) localTrackRef.current.close();
      localTrackRef.current = null;
      localTrackPublishedRef.current = false;
      speakingRef.current = false;
      micOnRef.current = false;
      if (agoraRef.current) agoraRef.current.leave().catch(() => {});
      leaveSessionAttendance(sessionId).catch(() => {});
    };
  }, [isMentor, joinAudio, sessionId, setMicState]);

  const toggleHand = () => {
    if (!sessionJoined || !socketRef.current?.connected) {
      setError('Realtime room is not connected yet. Please wait and try again.');
      return;
    }
    const event = handRaised ? 'hand.lower' : 'hand.raise';
    socketRef.current.emit(event, { sessionId }, (response) => {
      if (response?.success) {
        setHandRaised((value) => !value);
        setError('');
      } else if (response?.message) {
        setError(response.message);
      }
    });
  };

  const toggleMic = async () => {
    try {
      await setMicState(!micOn);
      setError('');
    } catch (micError) {
      setError(micError?.message || 'Microphone permission was denied.');
    }
  };

  if (removedFromRoom) {
    return <div className="live-room live-room__message"><UserMinus size={32} /><strong>Removed from room</strong><Button onClick={() => navigate('/learning')}>Back to learning</Button></div>;
  }
  if (!state) return <div style={{ padding: 40 }}>Loading learning room...</div>;
  const participants = session.participants || [];
  const currentSubLevel = state.currentSubLevel;
  const elapsedSinceSync = state.status === 'LIVE'
    ? Math.floor(Math.max(0, clockNow - stateSyncedAtRef.current) / 1000)
    : 0;
  const displayedSeconds = Math.max(0, Number(state.secondsRemaining || 0) - elapsedSinceSync);
  const ownParticipant = participants.find((participant) => String(participant.anonymousUserId) === String(anonymousUserIdRef.current));

  return <div className="live-room bg-house-green text-white">
    <header className="room-header">
      <div>
        <h1 className="text-white" style={{ fontSize: '2rem', marginBottom: 4 }}>{state.levelSummary?.title || 'LUCY Live Learning'}</h1>
        <span style={{ color: 'var(--text-white-soft)', fontSize: '1rem' }}>
          {state.levelSummary?.language} · Stage {state.levelSummary?.stage} · {currentSubLevel?.topic || 'Waiting for topic'}
        </span>
        <div className="room-lms-status"><Clock3 size={16} /> {formatTimer(displayedSeconds)} <span>{state.status}</span></div>
      </div>
      <button onClick={() => navigate(-1)} className="close-btn" aria-label="Close room"><X size={24} color="#fff" /></button>
    </header>
    <main className="room-main">
      <section className="stage-area">
        <div className={`avatar-wrapper ${ownParticipant?.speaking ? 'is-speaking' : ''}`}><div className="avatar">{isMentor ? 'M' : 'L'}</div><span className="avatar-name">{isMentor ? 'Mentor' : 'LUCY Learner'}</span></div>
        <p>{state.status} · {sessionJoined ? 'Room joined' : connected ? 'Realtime connected' : 'Connecting...'}</p>
        {!micOn && <p>{speakerApproved ? 'Approved to speak' : 'Waiting for mentor approval'}</p>}
        {error && <p role="alert" style={{ color: '#ffd5d5' }}>{error}</p>}
        <div className="room-task-list">{currentSubLevel?.tasks?.map((task) => <p key={task.id}>{task.content}</p>)}</div>
      </section>
      <section className="audience-area">
        <div className="section-title"><Users size={16} /> Participants ({participants.length})</div>
        <div className="audience-grid">{participants.map((participant) => <div className={`participant-tile ${participant.speaking ? 'is-speaking' : ''}`} key={participant.anonymousUserId}><div className="avatar-wrapper small"><div className="avatar">{participant.displayName?.[0] || 'L'}</div><span className="avatar-name">{participant.displayName || 'Anonymous'}</span></div><span className="participant-status">{participant.speaking ? <Volume2 size={14} /> : participant.micEnabled ? <Mic size={14} /> : <VolumeX size={14} />} {participant.speaking ? 'Speaking' : participant.micEnabled ? 'Mic on' : 'Mic off'}</span>{participant.isActiveSpeaker && <span className="speaker-badge">Speaker</span>}</div>)}</div>
      </section>
      <section className="room-materials">
        <div className="section-title"><FileText size={16} /> Pinned materials</div>
        {!state.pinnedMaterials?.length ? <p className="room-empty">No materials pinned yet.</p> : <div className="room-material-list">{state.pinnedMaterials.map((material) => <a key={material.id} className="room-material" href={material.url} target="_blank" rel="noreferrer"><FileText size={16} /><span><strong>{material.title}</strong><small>{material.materialType}</small></span><ExternalLink size={15} /></a>)}</div>}
      </section>
    </main>
    <footer className="room-controls">
      {!isMentor && <Button variant="inverted" onClick={toggleHand} disabled={!sessionJoined} style={{ padding: '12px 18px', borderRadius: 999, backgroundColor: handRaised ? 'var(--gold)' : 'var(--white)', color: handRaised ? '#fff' : 'var(--text-black)' }} title={handRaised ? 'Lower hand' : 'Raise hand'}><Hand size={20} color={handRaised ? '#fff' : 'var(--text-black)'} /> {handRaised ? 'Lower hand' : 'Raise hand'}</Button>}
      <Button variant="inverted" onClick={toggleMic} style={{ padding: 12, borderRadius: '50%', backgroundColor: micOn ? 'var(--white)' : 'var(--red)' }} title={micOn ? 'Mute microphone' : 'Turn on microphone'}>{micOn ? <Mic size={24} color="var(--green-accent)" /> : <MicOff size={24} color="#fff" />}</Button>
    </footer>
  </div>;
};
