import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Settings, Award, Clock } from 'lucide-react';

export const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If loading or not available, use fallback
  const user = currentUser || {
    persona_name: 'Guest',
    account_type: 'LUCY',
    stats: { total_hours: 0 },
    xp: 0
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Hồ sơ của tôi</h1>
        <Button variant="dark-outlined" style={{ padding: '8px' }}>
          <Settings size={20} />
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ 
          width: '100px', height: '100px', 
          backgroundColor: 'var(--green-light)', 
          borderRadius: '50%', 
          margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px'
        }}>
          👤
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '4px' }}>{user.persona_name}</h2>
        <span style={{ 
          display: 'inline-block', 
          backgroundColor: 'var(--gold-lightest)', 
          color: 'var(--gold)', 
          padding: '4px 12px', 
          borderRadius: '50px',
          fontSize: '1.2rem',
          fontWeight: 600,
          border: '1px solid var(--gold)'
        }}>
          {user.account_type} MEMBER
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <Card>
          <CardBody style={{ textAlign: 'center' }}>
            <Clock size={24} color="var(--green-accent)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '2.4rem', fontWeight: 700 }}>{user.stats.total_hours}h</div>
            <div style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>Tổng giờ học</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody style={{ textAlign: 'center' }}>
            <Award size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '2.4rem', fontWeight: 700 }}>{user.xp}</div>
            <div style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>XP tích lũy</div>
          </CardBody>
        </Card>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Button variant="primary-outlined" fullWidth onClick={() => navigate('/wallet')}>
          Quản lý Ví & Nâng cấp tài khoản
        </Button>
      </div>

      <Button variant="black-filled" fullWidth onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
};
