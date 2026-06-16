import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  Wallet as WalletIcon, Star, Crown, Zap,
  TrendingUp, Plus
} from 'lucide-react';
import './Wallet.css';

export const Wallet = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [balance] = useState(1500);

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

  const isPro = currentUser?.account_type === 'Pro';
  const isSuper = currentUser?.account_type === 'Super';

  return (
    <div className="wallet-page">
      {/* ── Starbucks dark-green feature band: Balance ── */}
      <div className="wallet-balance-band">
        <div className="wallet-balance-content">
          <div className="wallet-balance-label">So du LUCY Coin</div>
          <div className="wallet-balance-value">
            {balance.toLocaleString()}
            <WalletIcon size={24} />
          </div>
          <div className="wallet-balance-usd">
            <TrendingUp size={12} />
            ~${(balance * 0.01).toFixed(2)} USD
          </div>
        </div>
        <div className="wallet-balance-action">
          <Button variant="inverted" onClick={handleDepositClick}>
            <Plus size={16} />
            Nap tien
          </Button>
        </div>
      </div>

      {/* ── Section heading ── */}
      <h2 className="wallet-section-title">Nang cap tai khoan</h2>
      <p className="wallet-section-desc">
        Mo khoa them tinh nang voi goi Mentor hoac Creator
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
                <span className="wallet-tier-period">/ thang</span>
              </div>
            </div>

            <h3 className="wallet-tier-name">LUCY Pro</h3>
            <p className="wallet-tier-sub">Danh cho Mentor</p>

            <ul className="wallet-tier-features">
              <li><CheckIcon /> Tao phong Live Audio</li>
              <li><CheckIcon /> Quan ly hoc vien trong phong</li>
              <li><CheckIcon /> Nhan goi y tu AI trong luc day</li>
            </ul>

            <Button
              variant={isPro ? 'primary-outlined' : 'primary-filled'}
              fullWidth
              onClick={() => handleUpgradeClick('Pro')}
            >
              {isPro ? 'Dang su dung' : 'Nang cap Pro'}
            </Button>
          </CardBody>
        </Card>

        {/* ── Super Tier Card (Gold) ── */}
        <Card className={`wallet-tier-card wallet-tier-card--super ${isSuper ? 'wallet-tier-card--active' : ''}`}>
          <CardBody>
            <div className="wallet-tier-badge-super">
              <Crown size={22} color="var(--gold)" fill="var(--gold)" />
              <span className="wallet-tier-popular">Pho bien nhat</span>
            </div>

            <div className="wallet-tier-header">
              <div>
                <h3 className="wallet-tier-name" style={{ color: 'var(--gold)' }}>LUCY Super</h3>
                <p className="wallet-tier-sub">Danh cho Content Creator</p>
              </div>
              <div className="wallet-tier-price">
                <span className="wallet-tier-amount" style={{ color: 'var(--gold)' }}>500k</span>
                <span className="wallet-tier-period">/ thang</span>
              </div>
            </div>

            <ul className="wallet-tier-features">
              <li><CheckIcon /> Toan bo tinh nang cua goi Pro</li>
              <li className="wallet-tier-feature-highlight">
                <Zap size={14} color="var(--gold)" /> <strong>Ghi am phong Live</strong>
              </li>
              <li><CheckIcon /> Xuat ban & kiem tien tu Podcast</li>
            </ul>

            <Button
              variant={isSuper ? 'primary-outlined' : 'primary-filled'}
              fullWidth
              style={isSuper ? {} : { backgroundColor: 'var(--gold)', borderColor: 'var(--gold)', color: 'var(--white)' }}
              onClick={() => handleUpgradeClick('Super')}
            >
              {isSuper ? 'Dang su dung' : 'Nang cap Super'}
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
