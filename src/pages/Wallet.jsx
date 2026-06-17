import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getBalance } from '../services/walletService';
import {
  Wallet as WalletIcon, Star, Crown, Zap,
  TrendingUp, Plus, Loader
} from 'lucide-react';
import './Wallet.css';

export const Wallet = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBalance = async () => {
      try {
        const result = await getBalance();
        if (!cancelled) setBalance(result.balance);
      } catch {
        if (!cancelled) setBalance(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBalance();
    return () => { cancelled = true; };
  }, []);

  const handleDepositClick = () => {
    navigate('/checkout?type=deposit&amount=100000');
  };

  const handleUpgradeClick = (tier) => {
    if (tier === 'Pro') {
      navigate('/checkout?type=upgrade_pro&amount=200000');
    } else if (tier === 'Super') {
      navigate('/checkout?type=upgrade_super&amount=500000');
    }
  };

  const isPro = currentUser?.roleCode === 'PRO';
  const isSuper = currentUser?.roleCode === 'SUPER';

  return (
    <div className="wallet-page">
      {/* ── Starbucks dark-green feature band: Balance ── */}
      <div className="wallet-balance-band">
        <div className="wallet-balance-content">
          <div className="wallet-balance-label">Số dư LUCY Coin</div>
          <div className="wallet-balance-value">
            {loading ? <Loader size={24} className="spin" /> : <>{balance.toLocaleString()}<WalletIcon size={24} /></>}
          </div>
          <div className="wallet-balance-usd">
            <TrendingUp size={12} />
            {loading ? '...' : `~$${(balance * 0.01).toFixed(2)} USD`}
          </div>
        </div>
        <div className="wallet-balance-action">
          <Button variant="inverted" onClick={handleDepositClick}>
            <Plus size={16} />
            Nạp tiền
          </Button>
        </div>
      </div>

      {/* ── Section heading ── */}
      <h2 className="wallet-section-title">Nâng cấp tài khoản</h2>
      <p className="wallet-section-desc">
        Mở khóa thêm tính năng với gói Mentor hoặc Creator
      </p>

      <div className="wallet-tier-grid">
        {/* ── Pro Tier Card ── */}
        <Card className={`wallet-tier-card ${isPro ? 'wallet-tier-card--active' : ''}`}>
          <CardBody>
            <div className="wallet-tier-header">
              <div className="wallet-tier-badge" style={{ background: 'var(--green-accent)' }}>
                <Star size={22} color="white" fill="white" />
              </div>
              <div className="wallet-tier-price">
                <span className="wallet-tier-amount">200k</span>
                <span className="wallet-tier-period">/ tháng</span>
              </div>
            </div>

            <h3 className="wallet-tier-name">LUCY Pro</h3>
            <p className="wallet-tier-sub">Dành cho Mentor</p>

            <ul className="wallet-tier-features">
              <li><CheckIcon /> Tạo phòng Live Audio</li>
              <li><CheckIcon /> Quản lý học viên trong phòng</li>
              <li><CheckIcon /> Nhận gợi ý từ AI trong lúc dạy</li>
            </ul>

            <Button
              variant={isPro ? 'primary-outlined' : 'primary-filled'}
              fullWidth
              onClick={() => handleUpgradeClick('Pro')}
            >
              {isPro ? 'Đang sử dụng' : 'Nâng cấp Pro'}
            </Button>
          </CardBody>
        </Card>

        {/* ── Super Tier Card (Gold) ── */}
        <Card className={`wallet-tier-card wallet-tier-card--super ${isSuper ? 'wallet-tier-card--active' : ''}`}>
          <CardBody>
            <div className="wallet-tier-badge-super">
              <Crown size={22} color="var(--gold)" fill="var(--gold)" />
              <span className="wallet-tier-popular">Phổ biến nhất</span>
            </div>

            <div className="wallet-tier-header">
              <div>
                <h3 className="wallet-tier-name" style={{ color: 'var(--gold)' }}>LUCY Super</h3>
                <p className="wallet-tier-sub">Dành cho Content Creator</p>
              </div>
              <div className="wallet-tier-price">
                <span className="wallet-tier-amount" style={{ color: 'var(--gold)' }}>500k</span>
                <span className="wallet-tier-period">/ tháng</span>
              </div>
            </div>

            <ul className="wallet-tier-features">
              <li><CheckIcon /> Toàn bộ tính năng của gói Pro</li>
              <li className="wallet-tier-feature-highlight">
                <Zap size={14} color="var(--gold)" /> <strong>Ghi âm phòng Live</strong>
              </li>
              <li><CheckIcon /> Xuất bản & kiếm tiền từ Podcast</li>
            </ul>

            <Button
              variant={isSuper ? 'primary-outlined' : 'primary-filled'}
              fullWidth
              style={isSuper ? {} : { backgroundColor: 'var(--gold)', borderColor: 'var(--gold)', color: 'var(--white)' }}
              onClick={() => handleUpgradeClick('Super')}
            >
              {isSuper ? 'Đang sử dụng' : 'Nâng cấp Super'}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" fill="var(--green-accent)" opacity="0.15" />
      <path d="M5 8.5L7 10.5L11 6" stroke="var(--green-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default Wallet;
