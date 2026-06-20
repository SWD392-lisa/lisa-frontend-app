import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getBalance } from '../services/walletService';
import { getUpgradePackages, upgradeUsingWallet } from '../services/roleUpgradeService';
import {
  Wallet as WalletIcon, Star, Crown, Zap,
  TrendingUp, Plus, Loader, CheckCircle, AlertCircle
} from 'lucide-react';
import './Wallet.css';

const PACKAGE_ICONS = {
  PRO: { icon: Star, color: 'var(--green-accent)' },
  SUPER: { icon: Crown, color: 'var(--gold)' },
};

const PACKAGE_FEATURES = {
  PRO: [
    'Tạo phòng Live Audio',
    'Quản lý học viên trong phòng',
    'Nhận gợi ý từ AI trong lúc dạy',
  ],
  SUPER: [
    'Toàn bộ tính năng của gói Pro',
    'Ghi âm phòng Live chất lượng cao',
    'Xuất bản & kiếm tiền từ Podcast',
  ],
};

export const Wallet = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null); // rolePriceId being processed
  const [upgradeError, setUpgradeError] = useState(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(null);

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

  useEffect(() => {
    let cancelled = false;
    const fetchPackages = async () => {
      try {
        const result = await getUpgradePackages();
        if (!cancelled) setPackages(result);
      } catch (err) {
        console.error('Failed to load upgrade packages:', err);
      } finally {
        if (!cancelled) setPackagesLoading(false);
      }
    };
    fetchPackages();
    return () => { cancelled = true; };
  }, []);

  const handleUpgradeClick = async (pkg) => {
    setUpgradeError(null);
    setUpgradeSuccess(null);
    setUpgrading(pkg.rolePriceId);

    try {
      const result = await upgradeUsingWallet(pkg.rolePriceId);
      // Success — update user info with new token
      if (result.newAccessToken && result.user) {
        updateUser(result.user, result.newAccessToken);
      }
      setUpgradeSuccess(`Nâng cấp lên ${pkg.roleName} thành công!`);
      // Refresh packages to reflect new role
      const updatedPackages = await getUpgradePackages();
      setPackages(updatedPackages);
    } catch (err) {
      if (err.status === 402) {
        // Insufficient balance — redirect to SePay checkout
        navigate(`/checkout?type=upgrade&rolePriceId=${pkg.rolePriceId}`);
        return;
      }
      setUpgradeError(err.message || 'Nâng cấp thất bại. Vui lòng thử lại.');
    } finally {
      setUpgrading(null);
    }
  };

  const handleDepositClick = () => {
    navigate('/checkout?type=deposit&amount=100000');
  };

  const isPackageDisabled = (pkg) => pkg.isCurrentRole;

  const getPackageButtonState = (pkg) => {
    if (pkg.isCurrentRole) {
      return { label: 'Đang sử dụng', variant: 'primary-outlined', disabled: true };
    }
    return { label: 'Nâng cấp', variant: 'primary-filled', disabled: false };
  };

  return (
    <div className="wallet-page">
      {/* ── Balance Band ── */}
      <div className="wallet-balance-band">
        <div className="wallet-balance-content">
          <div className="wallet-balance-label">Số dư LUCY Coin</div>
          <div className="wallet-balance-value">
            {loading ? <Loader size={24} className="spin" /> : <>{balance?.toLocaleString()}<WalletIcon size={24} /></>}
          </div>
          <div className="wallet-balance-usd">
            <TrendingUp size={12} />
            {loading ? '...' : `~$${((balance || 0) * 0.01).toFixed(2)} USD`}
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

      {/* Status messages */}
      {upgradeSuccess && (
        <div className="wallet-status wallet-status--success">
          <CheckCircle size={18} />
          <span>{upgradeSuccess}</span>
        </div>
      )}
      {upgradeError && (
        <div className="wallet-status wallet-status--error">
          <AlertCircle size={18} />
          <span>{upgradeError}</span>
        </div>
      )}

      {/* Package cards */}
      {packagesLoading ? (
        <div className="wallet-loading">
          <Loader size={32} className="spin" />
        </div>
      ) : (
        <div className="wallet-tier-grid">
          {packages.map((pkg) => {
            const iconConfig = PACKAGE_ICONS[pkg.roleCode] || { icon: Star, color: 'var(--green-accent)' };
            const IconComponent = iconConfig.icon;
            const btnState = getPackageButtonState(pkg);
            const isSuper = pkg.roleCode === 'SUPER';
            const features = PACKAGE_FEATURES[pkg.roleCode] || [];

            return (
              <Card
                key={pkg.rolePriceId}
                className={`wallet-tier-card ${pkg.isCurrentRole ? 'wallet-tier-card--active' : ''} ${isSuper ? 'wallet-tier-card--super' : ''}`}
              >
                <CardBody>
                  {isSuper && (
                    <div className="wallet-tier-badge-super">
                      <Crown size={22} color="var(--gold)" fill="var(--gold)" />
                      <span className="wallet-tier-popular">Phổ biến nhất</span>
                    </div>
                  )}

                  <div className="wallet-tier-header">
                    {!isSuper && (
                      <div className="wallet-tier-badge" style={{ background: iconConfig.color }}>
                        <IconComponent size={22} color="white" fill="white" />
                      </div>
                    )}
                    <div className="wallet-tier-price">
                      <span className="wallet-tier-amount" style={isSuper ? { color: 'var(--gold)' } : {}}>
                        {pkg.price?.toLocaleString('vi-VN')}
                      </span>
                      <span className="wallet-tier-period">/ tháng</span>
                    </div>
                  </div>

                  <h3 className="wallet-tier-name" style={isSuper ? { color: 'var(--gold)' } : {}}>
                    LUCY {pkg.roleName}
                  </h3>
                  {pkg.description && (
                    <p className="wallet-tier-sub">{pkg.description}</p>
                  )}

                  <ul className="wallet-tier-features">
                    {features.map((feat, i) => (
                      <li key={i}>
                        {feat.includes('Ghi âm') || feat.includes('Podcast') ? (
                          <><Zap size={14} color="var(--gold)" /> <strong>{feat}</strong></>
                        ) : (
                          <><CheckIcon /> {feat}</>
                        )}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={btnState.variant}
                    fullWidth
                    disabled={btnState.disabled || upgrading === pkg.rolePriceId}
                    onClick={() => handleUpgradeClick(pkg)}
                    style={isSuper && !pkg.isCurrentRole ? {
                      backgroundColor: 'var(--gold)',
                      borderColor: 'var(--gold)',
                      color: 'var(--white)'
                    } : {}}
                  >
                    {upgrading === pkg.rolePriceId ? 'Đang xử lý...' : btnState.label}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
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
