import { useEffect, useMemo, useState } from 'react';
import { Edit3, EyeOff, Headphones, Play, RefreshCw, Search, Send, Trash2 } from 'lucide-react';
import { CreatorShell, EmptyState, ErrorState, LoadingState } from './CreatorShell';
import { formatDate, normalizeList } from './creatorUtils';
import { deleteCreatorPodcast, getCreatorPodcasts, getPodcastPlayback, publishCreatorPodcast, unpublishCreatorPodcast, updateCreatorPodcast } from '../../services/creatorService';

export const CreatorPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState({});
  const [state, setState] = useState({ loading: true, error: '' });

  const load = async () => {
    setState({ loading: true, error: '' });
    try { setPodcasts(normalizeList(await getCreatorPodcasts())); }
    catch (err) { setState({ loading: false, error: err.message || 'Could not load podcasts.' }); return; }
    setState({ loading: false, error: '' });
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => podcasts.filter((item) => `${item.title || ''} ${item.creatorUserId || ''} ${item.language || ''}`.toLowerCase().includes(query.toLowerCase())), [podcasts, query]);
  const play = async (item) => {
    setPlaying((old) => ({ ...old, [item.podcastId]: { loading: true } }));
    try { const result = await getPodcastPlayback(item.podcastId); setPlaying((old) => ({ ...old, [item.podcastId]: { url: result?.playbackUrl || result?.url || result } })); }
    catch (err) { setPlaying((old) => ({ ...old, [item.podcastId]: { error: err.message || 'Playback unavailable.' } })); }
  };

  const edit = async (item) => {
    const title = window.prompt('Podcast title', item.title || '');
    if (title === null) return;
    const description = window.prompt('Podcast description', item.description || '');
    if (description === null) return;
    try { await updateCreatorPodcast(item.podcastId, { title, description }); await load(); }
    catch (err) { setState({ loading: false, error: err.message || 'Update failed.' }); }
  };

  const changePublication = async (item) => {
    const published = item.status !== 'PUBLISHED';
    if (!window.confirm(`${published ? 'Publish' : 'Unpublish'} this podcast?`)) return;
    try { await (published ? publishCreatorPodcast(item.podcastId) : unpublishCreatorPodcast(item.podcastId)); await load(); }
    catch (err) { setState({ loading: false, error: err.message || 'Publication update failed.' }); }
  };

  const remove = async (item) => {
    if (!window.confirm('Delete this podcast? The source recording will remain.')) return;
    try { await deleteCreatorPodcast(item.podcastId); await load(); }
    catch (err) { setState({ loading: false, error: err.message || 'Delete failed.' }); }
  };

  return <CreatorShell title="Podcast library" eyebrow="Published content">
    <section className="creator-toolbar"><div><span className="creator-panel__eyebrow">Audio library</span><h2>{visible.length} podcasts</h2></div><div className="creator-toolbar__actions"><label className="creator-search"><Search size={15} /><input placeholder="Search title, creator or language" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="creator-icon-button" type="button" onClick={load} title="Refresh podcasts"><RefreshCw size={17} /></button></div></section>
    <div className="creator-capability-banner"><strong>Podcast publishing workflow</strong><span>Only podcasts linked to an approved recording can be published publicly. Editing and deletion never change the source recording.</span></div>
    {state.error && <ErrorState message={state.error} onRetry={load} />}
    {state.loading && <LoadingState label="Loading podcasts..." />}
    {!state.loading && !state.error && <section className="creator-podcast-grid">{visible.length === 0 ? <EmptyState title="No podcasts found" detail="Podcast drafts and published content will appear here." /> : visible.map((item) => { const media = playing[item.podcastId]; const published = item.status === 'PUBLISHED'; const approved = item.reviewStatus === 'APPROVED'; return <article className="creator-podcast-card" key={item.podcastId}><div className="creator-podcast-card__art"><Headphones size={28} /></div><div className="creator-podcast-card__body"><div className="creator-podcast-card__heading"><h3>{item.title || 'Untitled podcast'}</h3><span className={`creator-badge creator-badge--${String(item.status || 'UNPUBLISHED').toLowerCase()}`}>{item.status || 'UNPUBLISHED'}</span></div><p>{item.description || 'No description provided.'}</p><dl><div><dt>Creator</dt><dd>{item.creatorUserId || 'Not available'}</dd></div><div><dt>Recording review</dt><dd>{item.reviewStatus || 'Unknown'}</dd></div><div><dt>Language</dt><dd>{item.language || 'Not set'}</dd></div><div><dt>Published</dt><dd>{formatDate(item.publishedAt || item.createdAt)}</dd></div></dl>{media?.url && <audio className="creator-audio" controls src={media.url} />}{media?.error && <p className="creator-inline-error">{media.error}</p>}<div className="creator-recording-card__actions">{published && <button className="creator-action-button" type="button" disabled={media?.loading} onClick={() => play(item)}><Play size={15} />{media?.loading ? 'Opening...' : 'Preview audio'}</button>}<button className="creator-action-button" type="button" onClick={() => edit(item)}><Edit3 size={15} />Edit</button><button className="creator-action-button" type="button" disabled={!approved && !published} onClick={() => changePublication(item)}>{published ? <EyeOff size={15} /> : <Send size={15} />}{published ? 'Unpublish' : 'Publish'}</button><button className="creator-danger-button" type="button" onClick={() => remove(item)} title="Delete podcast"><Trash2 size={15} /></button></div></div></article>; })}</section>}
  </CreatorShell>;
};
