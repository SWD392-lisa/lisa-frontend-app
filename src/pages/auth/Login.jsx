import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoPhoenix from '../../assets/images/logo_phonenix1.png';
import './Auth.css';

// Minimalist SVG Icons for Social Sign-in
const GoogleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
    <path d="M16.5 12c0-2.85 2.33-4.18 2.45-4.25-1.33-1.95-3.39-2.22-4.12-2.25-1.75-.18-3.42 1.03-4.32 1.03-.9 0-2.28-.98-3.73-.95-1.9.03-3.66 1.1-4.63 2.78-1.96 3.4-.5 8.43 1.4 11.18.93 1.35 2.03 2.85 3.48 2.8 1.4-.05 1.95-.9 3.65-.9 1.7 0 2.2.9 3.68.88 1.5-.03 2.45-1.38 3.38-2.73 1.08-1.58 1.53-3.1 1.55-3.18-.03-.02-2.9-1.12-2.9-4.43zM14.6 4.88c.78-.95 1.3-2.28 1.15-3.58-1.13.05-2.53.75-3.33 1.7-.73.83-1.35 2.18-1.18 3.45 1.28.1 2.58-.63 3.36-1.57z"/>
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu hoặc kết nối tới server.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      
      {/* 1. Left Visual Pane (Desktop) */}
      <div className="auth-visual-pane">
        <div className="auth-visual-bg"></div>
        
        <div className="visual-pane-logo-row">
          <img src={logoPhoenix} alt="LUCY Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span className="visual-logo-text">LUCY</span>
        </div>

        <div className="visual-pane-main">
          <div className="visual-pane-badge">Mạng xã hội đàm thoại ẩn danh</div>
          <h2>Nói tiếng Anh tự tin, không lo sợ phán xét.</h2>
          <p>Tham gia hàng ngàn phòng đàm thoại ẩn danh thời gian thực, phá bỏ rào cản tâm lý giao tiếp cùng AI Copilot đồng hành.</p>
        </div>

        <div className="visual-pane-footer">
          © 2026 LUCY EdTech. All rights reserved.
        </div>
      </div>

      {/* 2. Right Form Pane */}
      <div className="auth-form-pane">
        <div className="form-pane-mesh-bg"></div>

        <div className="premium-auth-card">
          {/* Mobile Logo Header */}
          <Link to="/">
            <img src={logoPhoenix} alt="LUCY Logo" className="form-pane-logo-mobile" />
          </Link>
          
          <h2 className="auth-form-title">Chào mừng trở lại</h2>
          <p className="auth-form-subtitle">Đăng nhập tài khoản để tiếp tục hành trình</p>

          {error && (
            <div style={{
              backgroundColor: '#fdf2f2',
              border: '1px solid #fde8e8',
              color: '#c81e1e',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '1.4rem',
              marginBottom: '20px',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group-premium">
              <label htmlFor="email">Địa chỉ Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-premium"
                required
              />
            </div>

            <div className="input-group-premium">
              <label htmlFor="password">Mật khẩu</label>
              <input 
                type="password" 
                id="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-premium"
                required
              />
            </div>

            <button type="submit" className="submit-btn-premium">
              Đăng Nhập
            </button>
          </form>

          <div className="social-divider-premium">
            <span>Hoặc đăng nhập nhanh bằng</span>
          </div>

          <div className="social-row-premium">
            <button className="social-btn-premium" onClick={() => alert('Chức năng đang phát triển!')}>
              <GoogleIcon /> Google
            </button>
            <button className="social-btn-premium" onClick={() => alert('Chức năng đang phát triển!')}>
              <AppleIcon /> Apple
            </button>
          </div>

          <div className="auth-footer-text">
            Chưa có tài khoản? <Link to="/register" className="auth-redirect-link">Đăng ký ngay</Link>
          </div>
        </div>

      </div>

    </div>
  );
};

