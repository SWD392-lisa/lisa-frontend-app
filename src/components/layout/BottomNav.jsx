import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, User } from 'lucide-react';
import './BottomNav.css';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/learning', label: 'Learning', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sb-bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <Link 
            key={path} 
            to={path} 
            className={`sb-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span className="sb-bottom-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
