import { useEffect, useState } from 'react';
import { Gift, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMentorLeaderboard } from '../../services/leaderboardService';

function initials(name) {
  return String(name || 'Mentor').trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'M';
}

export const TopMentorsSection = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getMentorLeaderboard('weekly', 1, 4)
      .then((result) => { if (active) setMentors(result?.items || []); })
      .catch((loadError) => { if (active) setError(loadError?.message || 'Could not load top mentors.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="mentors-section">
      <div className="section-header-row" style={{ display: 'block', textAlign: 'center', marginBottom: '40px' }}>
        <span className="section-subtitle-tag" style={{ display: 'inline-block', margin: '0 auto 8px' }}>Mentor reputation</span>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>Top Mentors This Week</h2>
        <p style={{ fontSize: '1.6rem', color: 'var(--text-black-soft)', maxWidth: '600px', margin: '0 auto' }}>
          Ranked by completed gifts received from the LUCY community.
        </p>
      </div>

      {loading && <p className="empty-state">Loading top mentors...</p>}
      {!loading && error && <p className="empty-state" role="alert">{error}</p>}
      {!loading && !error && mentors.length === 0 && <p className="empty-state">No mentors have received gifts this week yet.</p>}
      <div className="mentors-grid">
        {mentors.map((mentor) => (
          <div key={mentor.mentorId} className="mentor-card">
            <div className="mentor-avatar-wrapper">
              <div className="mentor-avatar mentor-avatar--initials" aria-label={mentor.displayName}>{initials(mentor.displayName)}</div>
              <div className={`mentor-badge ${mentor.roleCode === 'SUPER' ? 'mentor-badge--super' : ''}`}>
                {mentor.roleCode === 'SUPER' ? 'LUCY Super' : 'LUCY Pro'}
              </div>
            </div>
            
            <h3 className="mentor-name">{mentor.displayName}</h3>
            <p className="mentor-role">Rank #{mentor.rank}</p>
            
            <div className="mentor-stats">
              <div className="rating-wrapper">
                <Gift className="rating-star-icon" size={16} />
                <span>{mentor.giftCount.toLocaleString()} gifts</span>
              </div>
            </div>
            
            <Link
              to="/leaderboard"
              className="sb-button sb-button--dark-outlined"
              style={{ width: '100%', padding: '8px 16px', fontSize: '1.4rem' }}
            >
              <Trophy size={15} /> View ranking
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

