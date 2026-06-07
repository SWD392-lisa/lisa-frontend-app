import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import logoPhoenix from '../../assets/images/logo_phonenix1.png';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;

  return (
    <header className="sb-navbar">
      <div className="container sb-navbar-content">
        <Link to="/" className="sb-navbar-brand" style={{ padding: '4px 0' }}>
          <img src={logoPhoenix} alt="LUCY Logo" className="header-logo" /> LUCY
        </Link>

        <nav className="sb-navbar-links">
          <Link to="/dashboard" className="sb-navbar-link">Home</Link>
          <Link to="/discover" className="sb-navbar-link">Discover</Link>
          <Link to="/learning" className="sb-navbar-link">My Learning</Link>
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
          
          <button className="sb-navbar-mobile-toggle">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
