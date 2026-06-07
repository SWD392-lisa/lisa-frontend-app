import React, { useState } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, Star, Crown, Zap } from 'lucide-react';

export const Wallet = () => {
  const { currentUser, login } = useAuth(); // Assume login updates global context for mock
  const [balance, setBalance] = useState(1500); // Mock balance

  const handleUpgrade = (type) => {
    alert(`Nâng cấp gói ${type} thành công!`);
    // Mock updating the user context
    login(currentUser.email, 'mock_password').then(user => {
      // In a real app, you'd call an API. We'll just fake it by reloading state or updating context directly if possible.
      // But login here works fine as a mock refresh.
    });
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 style={{ marginBottom: '24px' }}>Ví & Nâng cấp</h1>

      {/* Balance Section */}
      <Card variant="dark" style={{ marginBottom: '32px' }}>
        <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.4rem', color: 'var(--text-white-soft)', marginBottom: '8px' }}>
              Số dư LUCY Coin
            </div>
            <div style={{ fontSize: '3.2rem', fontWeight: 700, color: 'var(--gold)' }}>
              {balance} <WalletIcon size={24} color="var(--gold)" style={{ verticalAlign: 'middle' }} />
            </div>
          </div>
          <Button variant="inverted">Nạp tiền</Button>
        </CardBody>
      </Card>

      <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Nâng cấp tài khoản</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Pro Tier */}
        <Card>
          <CardBody>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green-accent)' }}>
                  <Star size={24} /> LUCY Pro
                </h3>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>Dành cho Mentor</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>200k</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-black-soft)' }}>/ tháng</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '1.4rem', color: 'var(--text-black-soft)', lineHeight: '2' }}>
              <li>✓ Khởi tạo phòng Live Audio</li>
              <li>✓ Quản lý học viên trong phòng</li>
              <li>✓ Nhận gợi ý từ AI trong lúc dạy</li>
            </ul>
            <Button variant="primary-outlined" fullWidth onClick={() => handleUpgrade('Pro')}>
              {currentUser?.account_type === 'Pro' ? 'Đang sử dụng' : 'Nâng cấp Pro'}
            </Button>
          </CardBody>
        </Card>

        {/* Super Tier */}
        <Card style={{ border: '2px solid var(--gold)' }}>
          <CardBody>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)' }}>
                  <Crown size={24} /> LUCY Super
                </h3>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>Dành cho Content Creator</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>500k</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-black-soft)' }}>/ tháng</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '1.4rem', color: 'var(--text-black-soft)', lineHeight: '2' }}>
              <li>✓ Toàn bộ tính năng của gói Pro</li>
              <li>✓ <Zap size={16} color="var(--gold)" style={{ verticalAlign: 'middle' }} /> <strong>Ghi âm phòng Live</strong></li>
              <li>✓ Xuất bản & kiếm tiền từ Podcast</li>
            </ul>
            <Button variant="primary-filled" fullWidth style={{ backgroundColor: 'var(--gold)', borderColor: 'var(--gold)' }} onClick={() => handleUpgrade('Super')}>
              {currentUser?.account_type === 'Super' ? 'Đang sử dụng' : 'Nâng cấp Super'}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
