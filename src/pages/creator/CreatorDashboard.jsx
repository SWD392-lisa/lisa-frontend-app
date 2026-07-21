import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, FileCheck2, Mic2, Podcast, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorShell, ErrorState, LoadingState } from './CreatorShell';
import { normalizeList } from './creatorUtils';
import { getCurriculumImports, getCurriculumStats, getMentorDashboard, getMentorRecordings, getPodcasts } from '../../services/creatorService';

const metric = (value) => typeof value === 'number' ? value.toLocaleString() : (value ?? '0');

export const CreatorDashboard = () => {
  const [state, setState] = useState({ loading: true, error: '', stats: {}, imports: [], dashboard: {}, recordings: [], podcasts: [] });

  const load = async () => {
    setState((old) => ({ ...old, loading: true, error: '' }));
    const results = await Promise.allSettled([getCurriculumStats(), getCurriculumImports(), getMentorDashboard(), getMentorRecordings(), getPodcasts()]);
    const failed = results.find((result) => result.status === 'rejected');
    if (failed && results.every((result) => result.status === 'rejected')) {
      setState((old) => ({ ...old, loading: false, error: failed.reason?.message || 'Services are unavailable.' }));
      return;
    }
    setState({
      loading: false,
      error: '',
      stats: results[0].status === 'fulfilled' ? results[0].value || {} : {},
      imports: results[1].status === 'fulfilled' ? normalizeList(results[1].value) : [],
      dashboard: results[2].status === 'fulfilled' ? results[2].value || {} : {},
      recordings: results[3].status === 'fulfilled' ? normalizeList(results[3].value) : [],
      podcasts: results[4].status === 'fulfilled' ? normalizeList(results[4].value) : [],
    });
  };

  // Load the aggregate view once when the protected route is opened.
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  if (state.loading) return <CreatorShell title="Creator overview"><LoadingState /></CreatorShell>;
  if (state.error) return <CreatorShell title="Creator overview"><ErrorState message={state.error} onRetry={load} /></CreatorShell>;

  const curriculumTotal = Object.values(state.stats).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const dashboard = state.dashboard;
  const cards = [
    { label: 'Curriculum levels', value: metric(curriculumTotal), icon: BookOpen, to: '/creator/curriculum', tone: 'green' },
    { label: 'Import reports', value: metric(state.imports.length), icon: FileCheck2, to: '/creator/curriculum', tone: 'gold' },
    { label: 'Recordings', value: metric(dashboard?.recordings?.totalRecordings ?? state.recordings.length), icon: Mic2, to: '/creator/recordings', tone: 'dark' },
    { label: 'Published podcasts', value: metric(state.podcasts.length), icon: Podcast, to: '/creator/podcasts', tone: 'red' },
  ];

  return (
    <CreatorShell title="Creator overview" eyebrow="Content operations">
      <section className="creator-metric-grid" aria-label="Creator metrics">
        {cards.map(({ label, value, icon: Icon, to, tone }) => (
          <Link className={`creator-metric creator-metric--${tone}`} to={to} key={label}>
            <span className="creator-metric__icon"><Icon size={20} /></span>
            <span className="creator-metric__label">{label}</span>
            <strong>{value}</strong>
            <ArrowRight size={18} className="creator-metric__arrow" />
          </Link>
        ))}
      </section>

      <section className="creator-overview-grid">
        <div className="creator-panel">
          <div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Learning system</span><h2>Curriculum coverage</h2></div><Link to="/creator/curriculum">Open <ArrowRight size={15} /></Link></div>
          <div className="creator-language-list">
            {['ENGLISH', 'CHINESE', 'JAPANESE'].map((language) => <div className="creator-language-row" key={language}><span>{language}</span><strong>{metric(state.stats[language] ?? state.stats[language.toLowerCase()])}</strong></div>)}
          </div>
        </div>
        <div className="creator-panel creator-panel--dark">
          <div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Mentor network</span><h2>Live activity</h2></div><Link to="/creator/recordings">Review <ArrowRight size={15} /></Link></div>
          <div className="creator-dark-stats"><div><strong>{metric(dashboard.activeRoomCount)}</strong><span>Active rooms</span></div><div><strong>{metric(dashboard.learnersToday)}</strong><span>Learners today</span></div><div><strong>{metric(dashboard.completedSubLevels)}</strong><span>Sub-levels complete</span></div></div>
        </div>
      </section>

      <section className="creator-panel creator-panel--next">
        <div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Quick access</span><h2>Content operations</h2></div></div>
        <div className="creator-quick-grid">
          <Link to="/creator/curriculum"><BookOpen size={18} /><span><strong>Import curriculum</strong><small>Upload and inspect Word imports</small></span><ArrowRight size={16} /></Link>
          <Link to="/creator/recordings"><Mic2 size={18} /><span><strong>Review recordings</strong><small>Check status and playback readiness</small></span><ArrowRight size={16} /></Link>
          <Link to="/creator/podcasts"><Podcast size={18} /><span><strong>Podcast library</strong><small>Browse published audio content</small></span><ArrowRight size={16} /></Link>
          <Link to="/creator/users"><UsersRound size={18} /><span><strong>User operations</strong><small>Open the management workspace</small></span><ArrowRight size={16} /></Link>
        </div>
      </section>
    </CreatorShell>
  );
};
