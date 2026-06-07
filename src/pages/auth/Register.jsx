import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('LUCY');
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    await register(email, password, accountType);
    await login(email, password); // Auto login after register
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Tạo tài khoản mới</h1>
      
      <form onSubmit={handleRegister}>
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
        <Input 
          label="Xác nhận mật khẩu" 
          type="password" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
        />

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)', marginBottom: '8px' }}>Loại tài khoản:</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['LUCY', 'Pro', 'Super'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="accountType" 
                  value={type} 
                  checked={accountType === type}
                  onChange={(e) => setAccountType(e.target.value)}
                />
                <span style={{ fontSize: '1.6rem' }}>{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        <Button variant="primary-filled" type="submit" fullWidth style={{ marginTop: '16px', height: '50px' }}>
          Đăng ký
        </Button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.4rem' }}>
          Đã có tài khoản? <Link to="/login" style={{ fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};
