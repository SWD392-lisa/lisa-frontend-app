import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoPhoenix from '../../assets/images/logo_phonenix1.png';
import './Auth.css';

// Minimalist SVG Icons for Social Sign-in
const GoogleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 12c0-2.85 2.33-4.18 2.45-4.25-1.33-1.95-3.39-2.22-4.12-2.25-1.75-.18-3.42 1.03-4.32 1.03-.9 0-2.28-.98-3.73-.95-1.9.03-3.66 1.1-4.63 2.78-1.96 3.4-.5 8.43 1.4 11.18.93 1.35 2.03 2.85 3.48 2.8 1.4-.05 1.95-.9 3.65-.9 1.7 0 2.2.9 3.68.88 1.5-.03 2.45-1.38 3.38-2.73 1.08-1.58 1.53-3.1 1.55-3.18-.03-.02-2.9-1.12-2.9-4.43zM14.6 4.88c.78-.95 1.3-2.28 1.15-3.58-1.13.05-2.53.75-3.33 1.7-.73.83-1.35 2.18-1.18 3.45 1.28.1 2.58-.63 3.36-1.57z"/>
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="auth-layout">
      {/* CSS 3D Floating Particles */}
      <div className="auth-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="auth-glass-card">
        <div className="auth-header">
          <Link to="/">
            <img src={logoPhoenix} alt="LUCY Logo" className="auth-logo" />
          </Link>
          <h1 className="auth-title">Welcome to the anonymous world</h1>
          <p className="auth-subtitle">Log in to continue your language journey</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="auth-form-group">
            <label>Email</label>
            <input 
              className="auth-input"
              type="email" 
              placeholder="Enter your email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="auth-form-group">
            <label>Password</label>
            <input 
              className="auth-input"
              type="password" 
              placeholder="Enter your password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-submit-btn">
            Sign In
          </button>
        </form>

        <div className="social-divider">
          <span>Or quick login with</span>
        </div>

        <div className="social-grid">
          <button className="social-btn">
            <GoogleIcon /> Google
          </button>
          <button className="social-btn">
            <AppleIcon /> Apple
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
