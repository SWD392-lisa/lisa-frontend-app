import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Star, Crown } from 'lucide-react';
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
    <path d="M16.5 12c0-2.85 2.33-4.18 2.45-4.25-1.33-1.95-3.39-2.22-4.12-2.22-1.75-.18-3.42 1.03-4.32 1.03-.9 0-2.28-.98-3.73-.95-1.9.03-3.66 1.1-4.63 2.78-1.96 3.4-.5 8.43 1.4 11.18.93 1.35 2.03 2.85 3.48 2.8 1.4-.05 1.95-.9 3.65-.9 1.7 0 2.2.9 3.68.88 1.5-.03 2.45-1.38 3.38-2.73 1.08-1.58 1.53-3.1 1.55-3.18-.03-.02-2.9-1.12-2.9-4.43zM14.6 4.88c.78-.95 1.3-2.28 1.15-3.58-1.13.05-2.53.75-3.33 1.7-.73.83-1.35 2.18-1.18 3.45 1.28.1 2.58-.63 3.36-1.57z"/>
  </svg>
);

const roleOptions = [
  { id: 'LUCY', label: 'LUCY', icon: User },
  { id: 'Pro', label: 'Pro', icon: Star },
  { id: 'Super', label: 'Super', icon: Crown }
];

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('LUCY');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    const userData = {
      fullName,
      email,
      password,
      confirmPassword,
      birthday,
      phoneNumber: phoneNumber || null,
      accountType
    };
    try {
      await register(userData);
      await login(email, password); // Auto login after register
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin của bạn.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      
      {/* 1. Left Visual Pane (Desktop Only) */}
      <div className="auth-visual-pane">
        <div className="auth-visual-bg"></div>
        
        <div className="visual-pane-logo-row">
          <img src={logoPhoenix} alt="LUCY Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span className="visual-logo-text">LUCY</span>
        </div>

        <div className="visual-pane-main">
          <div className="visual-pane-badge">Mạng xã hội đàm thoại ẩn danh</div>
          <h2>Bắt đầu hành trình thay đổi ngôn ngữ của bạn</h2>
          <p>Tạo tài khoản miễn phí để mở khóa lộ trình chuẩn hóa 100 cấp độ và kết nối với các bạn học trên toàn thế giới.</p>
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
          
          <h2 className="auth-form-title">Tạo tài khoản mới</h2>
          <p className="auth-form-subtitle">Điền thông tin bên dưới để đăng ký nhanh</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            
            {/* Role selection */}
            <div className="role-select-box">
              <p className="role-select-box-label">Tôi muốn tham gia với vai trò:</p>
              <div className="role-cards-row">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isActive = accountType === role.id;
                  
                  return (
                    <div 
                      key={role.id} 
                      className={`role-premium-card ${isActive ? 'active' : ''}`}
                      onClick={() => setAccountType(role.id)}
                    >
                      <div className="role-premium-icon">
                        <Icon size={24} />
                      </div>
                      <span className="role-premium-card-text">{role.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="auth-form-group">
              <input 
                className="auth-input"
                type="text" 
                id="fullName"
                placeholder=" "
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
              />
              <label htmlFor="fullName">Họ và tên</label>
            </div>

            <div className="auth-form-group">
              <input 
                className="auth-input"
                type="email" 
                id="email"
                placeholder=" "
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className="auth-form-group">
              <input 
                className="auth-input"
                type="tel" 
                id="phone"
                placeholder=" "
                value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value)} 
              />
              <label htmlFor="phone">Số điện thoại (Tùy chọn)</label>
            </div>

            <div className="auth-form-group">
              <input 
                className="auth-input"
                type="date" 
                id="birthday"
                placeholder=" "
                value={birthday} 
                onChange={e => setBirthday(e.target.value)} 
                required 
              />
              <label htmlFor="birthday">Ngày sinh</label>
            </div>

            <div className="auth-form-group">
              <input 
                className="auth-input"
                type="password" 
                id="password"
                placeholder=" "
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <label htmlFor="password">Mật khẩu</label>
            </div>

            <div className="auth-form-group">
              <input 
                className="auth-input"
                type="password" 
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            </div>
            
            <button type="submit" className="auth-submit-btn">
              Đăng ký
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
            Đã có tài khoản? <Link to="/login" className="auth-redirect-link">Đăng nhập ngay</Link>
          </div>
        </div>

      </div>

    </div>
  );
};
