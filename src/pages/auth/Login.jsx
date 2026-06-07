import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="container" style={{ padding: '40px 16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Đăng nhập vào LUCY</h1>
      
      <form onSubmit={handleLogin}>
        <Input 
          label="Email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <Input 
          label="Mật khẩu" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        
        <Button variant="primary-filled" type="submit" fullWidth style={{ marginTop: '16px', height: '50px' }}>
          Đăng nhập
        </Button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.4rem' }}>
          Chưa có tài khoản? <Link to="/register" style={{ fontWeight: 600 }}>Tham gia ngay</Link>
        </p>
      </div>
    </div>
  );
};
