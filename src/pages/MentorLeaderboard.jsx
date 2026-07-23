import { useCallback, useEffect, useState } from 'react';
import { Gift, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getMentorLeaderboard } from '../services/leaderboardService';
import './MentorLeaderboard.css';

const PAGE_SIZE = 20;

function initials(name) {
  return String(name || 'Mentor')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'M';
}

function RoleBadge({ roleCode }) {
  const superMentor = String(roleCode).toUpperCase() === 'SUPER';
  return (
    <span className={`mentor-leaderboard__role ${superMentor ? 'mentor-leaderboard__role--super' : ''}`}>
      {superMentor ? 'LUCY Super' : 'LUCY Pro'}
    </span>
  );
}

function PodiumCard({ entry }) {
  if (!entry) return null;
  return (
    <article className={`mentor-leaderboard__podium-card mentor-leaderboard__podium-card--${entry.rank}`}>
      <span className="mentor-leaderboard__medal">#{entry.rank}</span>
      <div className="mentor-leaderboard__avatar">{initials(entry.displayName)}</div>
      <h3>{entry.displayName}</h3>
      <RoleBadge roleCode={entry.roleCode} />
      <p><Gift size={16} /> {entry.giftCount.toLocaleString()} gifts received</p>
    </article>
  );
}

export const MentorLeaderboard = () => {
  const { currentUser } = useAuth();
  const [period, setPeriod] = useState('weekly');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [podium, setPodium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestData = useCallback(async () => {
    const [pageData, podiumData] = await Promise.all([
      getMentorLeaderboard(period, page, PAGE_SIZE),
      page === 1 ? Promise.resolve(null) : getMentorLeaderboard(period, 1, 3),
    ]);
    return { pageData, podiumData };
  }, [page, period]);

  const applyData = useCallback(({ pageData, podiumData }) => {
    setData(pageData);
    setPodium((podiumData?.items || pageData.items || []).filter((item) => item.rank <= 3));
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      applyData(await requestData());
    } catch (loadError) {
      setError(loadError?.message || 'Could not load mentor leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    requestData()
      .then((result) => { if (active) applyData(result); })
      .catch((loadError) => { if (active) setError(loadError?.message || 'Could not load mentor leaderboard.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [applyData, requestData]);

  const changePeriod = (nextPeriod) => {
    setLoading(true);
    setError('');
    setPeriod(nextPeriod);
    setPage(1);
  };
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE));
  const viewerId = String(currentUser?.userId || currentUser?.id || '').toLowerCase();
  const listItems = (data?.items || []).filter((item) => item.rank > 3 || page > 1);

  return (
    <div className="mentor-leaderboard">
      <header className="mentor-leaderboard__hero">
        <Trophy size={42} />
        <p className="mentor-leaderboard__eyebrow">Mentor reputation</p>
        <h1>Mentor Leaderboard</h1>
        <p>Ranked by the value of completed gifts received from the LUCY community.</p>
      </header>

      <main className="mentor-leaderboard__container">
        <div className="mentor-leaderboard__tabs" role="tablist" aria-label="Leaderboard period">
          <button type="button" role="tab" aria-selected={period === 'weekly'} className={period === 'weekly' ? 'is-active' : ''} onClick={() => changePeriod('weekly')}>Weekly</button>
          <button type="button" role="tab" aria-selected={period === 'alltime'} className={period === 'alltime' ? 'is-active' : ''} onClick={() => changePeriod('alltime')}>All-time</button>
        </div>

        {data?.viewer && !loading && (
          <section className="mentor-leaderboard__viewer" aria-label="Your leaderboard position">
            <div><span>Your rank</span><strong>#{data.viewer.rank}</strong></div>
            <div><span>Gifts received</span><strong>{data.viewer.giftCount.toLocaleString()}</strong></div>
            <div><span>Period</span><strong>{period === 'weekly' ? 'This week' : 'All-time'}</strong></div>
          </section>
        )}

        {loading && <div className="mentor-leaderboard__state"><span className="mentor-leaderboard__spinner" />Loading rankings...</div>}
        {!loading && error && (
          <div className="mentor-leaderboard__state mentor-leaderboard__state--error">
            <p>{error}</p>
            <Button variant="primary-filled" onClick={load}><RefreshCw size={16} /> Try again</Button>
          </div>
        )}
        {!loading && !error && data?.total === 0 && (
          <div className="mentor-leaderboard__state"><Gift size={34} /><h2>No rankings yet</h2><p>Mentors will appear after receiving their first completed gift.</p></div>
        )}

        {!loading && !error && data?.total > 0 && (
          <>
            <section className="mentor-leaderboard__podium" aria-label="Top three mentors">
              <PodiumCard entry={podium.find((item) => item.rank === 2)} />
              <PodiumCard entry={podium.find((item) => item.rank === 1)} />
              <PodiumCard entry={podium.find((item) => item.rank === 3)} />
            </section>

            {listItems.length > 0 && (
              <section className="mentor-leaderboard__list" aria-label="Mentor rankings">
                {listItems.map((entry) => {
                  const isViewer = String(entry.mentorId).toLowerCase() === viewerId;
                  return (
                    <article key={entry.mentorId} className={`mentor-leaderboard__row ${isViewer ? 'is-viewer' : ''}`}>
                      <strong className="mentor-leaderboard__rank">#{entry.rank}</strong>
                      <div className="mentor-leaderboard__avatar mentor-leaderboard__avatar--small">{initials(entry.displayName)}</div>
                      <div className="mentor-leaderboard__identity"><strong>{entry.displayName}{isViewer ? ' (You)' : ''}</strong><RoleBadge roleCode={entry.roleCode} /></div>
                      <span className="mentor-leaderboard__gifts"><Gift size={17} /> {entry.giftCount.toLocaleString()} gifts</span>
                    </article>
                  );
                })}
              </section>
            )}

            <nav className="mentor-leaderboard__pagination" aria-label="Leaderboard pages">
              <Button variant="dark-outlined" disabled={page <= 1} onClick={() => { setLoading(true); setError(''); setPage((value) => value - 1); }}>Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button variant="dark-outlined" disabled={page >= totalPages} onClick={() => { setLoading(true); setError(''); setPage((value) => value + 1); }}>Next</Button>
            </nav>
          </>
        )}
      </main>
    </div>
  );
};
