import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Bell, X, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import logoPhoenix from '../../assets/images/logo_phonenix1.png';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;
  const isMentor = currentUser?.account_type === 'MENTOR';
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sb-navbar">
      <div className="container sb-navbar-content">
        <Link to="/" className="sb-navbar-brand" style={{ padding: '4px 0', display: 'flex', alignItems: 'center' }}>
          <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" /> Lucy
        </Link>

        <nav className="sb-navbar-links">
          <Link to="/" className={`sb-navbar-link ${isActive('/') ? 'is-active' : ''}`}>Home</Link>
          <Link to="/discover" className={`sb-navbar-link ${isActive('/discover') ? 'is-active' : ''}`}>Discover</Link>
          <Link to="/courses" className={`sb-navbar-link ${isActive('/courses') ? 'is-active' : ''}`}>Courses</Link>
          <Link to="/support" className={`sb-navbar-link ${isActive('/support') ? 'is-active' : ''}`}>Student Support</Link>
          <Link to="/events" className={`sb-navbar-link ${isActive('/events') ? 'is-active' : ''}`}>Events</Link>
          {isMentor && (
            <Link to="/mentor/dashboard" className={`sb-navbar-link ${isActive('/mentor/dashboard') ? 'is-active' : ''}`}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className="sb-navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/wallet" style={{ color: 'var(--text-black)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--gold)' }}>1.5K</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                </div>
              </Link>
              <Link to="/notifications" style={{ color: 'var(--text-black)' }}>
                <Bell size={24} />
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
              <Link to="/" className="sb-navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" style={{ width: '40px', height: '40px' }} /> Lucy
              </Link>
              <button className="sb-mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="sb-mobile-drawer-links">
              <Link to="/" className={`sb-mobile-drawer-link ${isActive('/') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/discover" className={`sb-mobile-drawer-link ${isActive('/discover') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Discover</Link>
              <Link to="/courses" className={`sb-mobile-drawer-link ${isActive('/courses') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
              <Link to="/support" className={`sb-mobile-drawer-link ${isActive('/support') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Student Support</Link>
              <Link to="/events" className={`sb-mobile-drawer-link ${isActive('/events') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
              {isMentor && (
                <Link to="/mentor/dashboard" className={`sb-mobile-drawer-link ${isActive('/mentor/dashboard') ? 'is-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
            </nav>
            
            <div className="sb-mobile-drawer-actions">
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  <Link to="/wallet" className="sb-mobile-drawer-action-item" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Wallet (1.5K Stars)</span>
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
