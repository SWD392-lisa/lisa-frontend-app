import { useEffect, useMemo, useState } from 'react';
import { Check, Filter, Mic2, Play, RefreshCw, X } from 'lucide-react';
import { CreatorShell, EmptyState, ErrorState, LoadingState } from './CreatorShell';
import { formatDate, normalizeList } from './creatorUtils';
import { getCreatorRecordings, getRecordingPlayback, reviewCreatorRecording } from '../../services/creatorService';

const statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export const CreatorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState({});
  const [reviewing, setReviewing] = useState({});
  const [state, setState] = useState({ loading: true, error: '' });

  const load = async () => {
    setState({ loading: true, error: '' });
    try { setRecordings(normalizeList(await getCreatorRecordings())); }
    catch (err) { setState({ loading: false, error: err.message || 'Could not load recordings.' }); return; }
    setState({ loading: false, error: '' });
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => recordings.filter((item) => {
    const status = String(item.reviewStatus || 'PENDING').toUpperCase();
    const matchesStatus = filter === 'ALL' || status === filter;
    const haystack = `${item.recordingId} ${item.roomSessionId || ''} ${item.provider || ''}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [recordings, filter, query]);

  const play = async (item) => {
    if (playing[item.recordingId]?.url) return;
    setPlaying((old) => ({ ...old, [item.recordingId]: { loading: true } }));
    try {
      const result = await getRecordingPlayback(item.recordingId);
      const url = result?.playbackUrl || result?.url || result;
      setPlaying((old) => ({ ...old, [item.recordingId]: { url } }));
    } catch (err) { setPlaying((old) => ({ ...old, [item.recordingId]: { error: err.message || 'Playback unavailable.' } })); }
  };

  const review = async (item, decision) => {
    const note = window.prompt(decision === 'APPROVED' ? 'Optional review note' : 'Reason for rejection');
    if (decision === 'REJECTED' && note === null) return;
    setReviewing((old) => ({ ...old, [item.recordingId]: true }));
    try {
      await reviewCreatorRecording(item.recordingId, { decision, note: note || '' });
      await load();
    } catch (err) {
      setState({ loading: false, error: err.message || 'Review failed.' });
    } finally {
      setReviewing((old) => ({ ...old, [item.recordingId]: false }));
    }
  };

  return <CreatorShell title="Recording review" eyebrow="Media operations">
    <section className="creator-toolbar"><div><span className="creator-panel__eyebrow">Recording queue</span><h2>{visible.length} recordings</h2></div><div className="creator-toolbar__actions"><label className="creator-search"><Filter size={15} /><input placeholder="Search ID, room or provider" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter recording status">{statuses.map((item) => <option key={item}>{item}</option>)}</select><button className="creator-icon-button" type="button" onClick={load} title="Refresh recordings"><RefreshCw size={17} /></button></div></section>
    {state.error && <ErrorState message={state.error} onRetry={load} />}
    {state.loading && <LoadingState label="Loading recordings..." />}
    {!state.loading && !state.error && <section className="creator-recording-grid">{visible.length === 0 ? <EmptyState title="No recordings match" detail="Try another review status or search term." /> : visible.map((item) => { const reviewStatus = String(item.reviewStatus || 'PENDING').toUpperCase(); const media = playing[item.recordingId]; const isReviewing = reviewing[item.recordingId]; return <article className="creator-recording-card" key={item.recordingId}><div className="creator-recording-card__top"><span className="creator-recording-card__icon"><Mic2 size={20} /></span><span className={`creator-badge creator-badge--${reviewStatus.toLowerCase()}`}>{reviewStatus}</span></div><h3>{item.title || item.recordingId}</h3><dl><div><dt>Recording</dt><dd>{item.recordingId}</dd></div><div><dt>Room/session</dt><dd>{item.roomId || item.sessionId || 'Not linked'}</dd></div><div><dt>Technical status</dt><dd>{item.status || 'Unknown'}</dd></div><div><dt>Duration</dt><dd>{item.durationSeconds ? `${Math.round(item.durationSeconds / 60)} min` : 'Pending'}</dd></div><div><dt>Created</dt><dd>{formatDate(item.createdAt || item.startedAt)}</dd></div></dl>{item.reviewNote && <p className="creator-inline-note">Review note: {item.reviewNote}</p>}{media?.url && <audio className="creator-audio" controls src={media.url} />}{media?.error && <p className="creator-inline-error">{media.error}</p>}<div className="creator-recording-card__actions"><button className="creator-action-button" type="button" disabled={item.status !== 'READY' || media?.loading} onClick={() => play(item)}><Play size={15} />{media?.loading ? 'Opening...' : 'Preview'}</button>{reviewStatus === 'PENDING' && <><button className="creator-action-button" type="button" disabled={isReviewing || item.status !== 'READY'} onClick={() => review(item, 'APPROVED')}><Check size={15} />Approve</button><button className="creator-danger-button" type="button" disabled={isReviewing || item.status !== 'READY'} onClick={() => review(item, 'REJECTED')}><X size={15} />Reject</button></>}</div></article>; })}</section>}
  </CreatorShell>;
};
