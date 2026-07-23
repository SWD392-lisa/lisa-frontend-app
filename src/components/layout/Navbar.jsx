import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Bell, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { isCreator, isMentor } from '../../utils/roleAccess';
import { getBalance } from '../../services/walletService';
import { createRealtimeSocket, getNotifications, markNotificationRead } from '../../services/realtimeService';
import logoPhoenix from '../../assets/images/logo_phonenix1.png';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;
  const creatorAccess = isCreator(currentUser);
  const mentorAccess = isMentor(currentUser);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    getBalance()
      .then(result => { if (!cancelled) setWalletBalance(result.balance); })
      .catch(() => { if (!cancelled) setWalletBalance(0); });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    getNotifications().then((items) => { if (active) setNotifications(items || []); }).catch(() => {});
    const socket = createRealtimeSocket();
    socket.on('notification.created', (item) => setNotifications((old) => [item, ...old].slice(0, 100)));
    return () => { active = false; socket.disconnect(); };
  }, [isAuthenticated]);

  const unreadCount = notifications.filter((item) => !item.readAt).length;
  const readNotification = async (item) => {
    if (!item.readAt) {
      try { await markNotificationRead(item.notificationId); } catch { /* keep local notification visible */ }
      setNotifications((old) => old.map((entry) => entry.notificationId === item.notificationId ? { ...entry, readAt: new Date().toISOString() } : entry));
    }
  };

  const formatBalance = (amount) => {
    if (amount === null) return '...';
    if (amount >= 1000) return (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return amount.toString();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sb-navbar">
      <div className="container sb-navbar-content">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="sb-navbar-brand" style={{ padding: '4px 0', display: 'flex', alignItems: 'center' }}>
          <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" /> Lucy
        </Link>

        <nav className="sb-navbar-links">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className={`sb-navbar-link ${isActive(isAuthenticated ? "/dashboard" : "/") ? 'is-active' : ''}`}>Home</Link>
          <Link to="/discover" className={`sb-navbar-link ${isActive('/discover') ? 'is-active' : ''}`}>Discover</Link>
          {mentorAccess && <Link to="/leaderboard" className={`sb-navbar-link ${isActive('/leaderboard') ? 'is-active' : ''}`}>Leaderboard</Link>}
          <Link to="/courses" className={`sb-navbar-link ${isActive('/courses') ? 'is-active' : ''}`}>Courses</Link>
          <Link to="/learning" className={`sb-navbar-link ${location.pathname.startsWith('/learning') ? 'is-active' : ''}`}>Learning</Link>
          <Link to="/support" className={`sb-navbar-link ${isActive('/support') ? 'is-active' : ''}`}>Student Support</Link>
          <Link to="/events" className={`sb-navbar-link ${isActive('/events') ? 'is-active' : ''}`}>Events</Link>
          {mentorAccess && (
            <Link to="/mentor/dashboard" className={`sb-navbar-link ${isActive('/mentor/dashboard') ? 'is-active' : ''}`}>
              Dashboard
            </Link>
          )}
          {creatorAccess && (
            <Link to="/creator" className={`sb-navbar-link ${location.pathname.startsWith('/creator') ? 'is-active' : ''}`}>
              Creator Portal
            </Link>
          )}
        </nav>

        <div className="sb-navbar-actions">
          {isAuthenticated ? (
            <>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Open notifications" title="Notifications" style={{ border: 0, background: 'transparent', cursor: 'pointer', position: 'relative', color: 'var(--text-black)' }}>
                  <Bell size={22} />
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: -5, right: -7, minWidth: 16, height: 16, borderRadius: 999, background: 'var(--red)', color: 'white', fontSize: 10, display: 'grid', placeItems: 'center' }}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
                {notificationsOpen && <div style={{ position: 'absolute', right: 0, top: '32px', width: 300, maxHeight: 360, overflowY: 'auto', background: 'var(--white)', border: '1px solid var(--ceramic)', borderRadius: 8, boxShadow: 'var(--shadow-card)', zIndex: 20, padding: 8 }}>
                  {notifications.length === 0 ? <p style={{ padding: 12, margin: 0 }}>No notifications.</p> : notifications.slice(0, 8).map((item) => <button type="button" key={item.notificationId} onClick={() => readNotification(item)} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, borderBottom: '1px solid var(--ceramic)', background: item.readAt ? 'transparent' : 'rgba(203,162,88,.12)', padding: 10, cursor: 'pointer' }}><strong>{item.title}</strong><span style={{ display: 'block', fontSize: 12, marginTop: 3 }}>{item.message}</span></button>)}
                </div>}
              </div>
              <Link to="/wallet" style={{ color: 'var(--text-black)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--gold)' }}>{formatBalance(walletBalance)}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                </div>
              </Link>
              <Link to="/profile" style={{ color: 'var(--text-black)' }}>
                <User size={24} />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="dark-outlined">Sign in</Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="black-filled">Join now</Button>
              </Link>
            </>
          )}
          
          <button className="sb-navbar-mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="sb-mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="sb-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sb-mobile-drawer-header">
              <Link to={isAuthenticated ? "/dashboard" : "/"} className="sb-navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" style={{ width: '40px', height: '40px' }} /> Lucy
              </Link>
              <button className="sb-mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="sb-mobile-drawer-links">
              <Link to={isAuthenticated ? "/dashboard" : "/"} className={`sb-mobile-drawer-link ${isActive(isAuthenticated ? "/dashboard" : "/") ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/discover" className={`sb-mobile-drawer-link ${isActive('/discover') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Discover</Link>
              {mentorAccess && <Link to="/leaderboard" className={`sb-mobile-drawer-link ${isActive('/leaderboard') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>}
              <Link to="/courses" className={`sb-mobile-drawer-link ${isActive('/courses') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
              <Link to="/learning" className={`sb-mobile-drawer-link ${location.pathname.startsWith('/learning') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Learning</Link>
              <Link to="/support" className={`sb-mobile-drawer-link ${isActive('/support') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Student Support</Link>
              <Link to="/events" className={`sb-mobile-drawer-link ${isActive('/events') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
              {mentorAccess && (
                <Link to="/mentor/dashboard" className={`sb-mobile-drawer-link ${isActive('/mentor/dashboard') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {creatorAccess && (
                <Link to="/creator" className={`sb-mobile-drawer-link ${location.pathname.startsWith('/creator') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                  Creator Portal
                </Link>
              )}
            </nav>
            
            <div className="sb-mobile-drawer-actions">
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  <Link to="/wallet" className="sb-mobile-drawer-action-item" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Wallet ({formatBalance(walletBalance)} Stars)</span>
                  </Link>
                  <Link to="/profile" className="sb-mobile-drawer-action-item" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>My Profile</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="dark-outlined" fullWidth>Sign in</Button>
                  </Link>
                  <Link to="/register" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="black-filled" fullWidth>Join now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
