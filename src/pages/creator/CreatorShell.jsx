import { NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, Mic2, Podcast, UsersRound } from 'lucide-react';
import './CreatorPortal.css';

const links = [
  { to: '/creator', label: 'Overview', icon: BarChart3, end: true },
  { to: '/creator/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/creator/recordings', label: 'Recordings', icon: Mic2 },
  { to: '/creator/podcasts', label: 'Podcasts', icon: Podcast },
  { to: '/creator/users', label: 'Users', icon: UsersRound },
];

export const CreatorShell = ({ title, eyebrow, children }) => (
  <div className="creator-portal container">
    <aside className="creator-portal__sidebar" aria-label="Creator navigation">
      <div className="creator-portal__brand">
        <span className="creator-portal__brand-mark">L</span>
        <span><strong>Creator Portal</strong><small>Content operations</small></span>
      </div>
      <nav className="creator-portal__nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `creator-portal__nav-link${isActive ? ' is-active' : ''}`}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="creator-portal__notice">
        <strong>Access: Creator</strong>
        <span>Role is read-only in this portal.</span>
      </div>
    </aside>
    <main className="creator-portal__content">
      <header className="creator-portal__header">
        <div>
          <span className="creator-portal__eyebrow">{eyebrow || 'LUCY operations'}</span>
          <h1>{title}</h1>
        </div>
        <div className="creator-portal__status"><span /> Services connected</div>
      </header>
      {children}
    </main>
  </div>
);

export const LoadingState = ({ label = 'Loading data...' }) => <div className="creator-state creator-state--loading">{label}</div>;
export const ErrorState = ({ message, onRetry }) => (
  <div className="creator-state creator-state--error" role="alert">
    <strong>Could not load this view.</strong>
    <span>{message}</span>
    {onRetry && <button type="button" className="creator-link-button" onClick={onRetry}>Retry</button>}
  </div>
);
export const EmptyState = ({ title, detail }) => (
  <div className="creator-state"><strong>{title}</strong><span>{detail}</span></div>
);
