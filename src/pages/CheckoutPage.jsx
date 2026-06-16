import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import PayButton from '../components/PayButton';
import {
  ArrowLeft, CreditCard, ShieldCheck, Wallet, Star, Crown,
  Zap, CheckCircle, ChevronRight
} from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const paramType = searchParams.get('type') || 'deposit';
  const paramAmount = parseInt(searchParams.get('amount'), 10) || 100000;
  const paramDesc = searchParams.get('desc') || '';

  const [invoiceNumber] = useState(() => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `LUCY_${timestamp}_${randomSuffix}`;
  });

  const [customAmount, setCustomAmount] = useState(paramAmount);
  const [userDescription, setUserDescription] = useState('');

  const amount = paramType === 'upgrade_pro'
    ? 200000
    : paramType === 'upgrade_super'
    ? 500000
    : customAmount;

  const description = userDescription || (
    paramType === 'upgrade_pro'
      ? `Nang cap tai khoan len goi LUCY Pro cho ${currentUser?.persona_name || 'Hoc vien'}`
      : paramType === 'upgrade_super'
      ? `Nang cap tai khoan len goi LUCY Super cho ${currentUser?.persona_name || 'Hoc vien'}`
      : paramDesc || `Nap LUCY Coin vao tai khoan ${currentUser?.persona_name || 'Hoc vien'}`
  );

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
    setCustomAmount(value);
  };

  const handleQuickSelect = (value) => {
    setCustomAmount(value);
  };

  const order = {
    invoiceNumber,
    amount,
    description,
    customerId: currentUser?.email || 'guest@lisa.edu.vn',
  };

  const isUpgrade = paramType === 'upgrade_pro' || paramType === 'upgrade_super';

  return (
    <div className="checkout-page">
      {/* Back link — Starbucks back-chevron style */}
      <div className="checkout-back" onClick={() => navigate('/wallet')}>
        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
        <span>Quay lai Vi</span>
      </div>

      {/* Page header */}
      <div className="checkout-hero">
        <h1 className="checkout-hero-title">Xac nhan Thanh toan</h1>
        <p className="checkout-hero-sub">Kiem tra thong tin giao dich truoc khi tiep tuc</p>
      </div>

      <div className="checkout-grid">
        {/* ── LEFT COLUMN: Payment details ── */}
        <div className="checkout-form-section">
          <Card className="checkout-card">
            <h2 className="checkout-section-title">
              <CreditCard size={20} color="var(--starbucks-green)" />
              Chi tiet thanh toan
            </h2>

            {/* Package upgrade banners */}
            {paramType === 'upgrade_pro' && (
              <div className="checkout-package-banner">
                <div className="checkout-package-icon" style={{ background: 'var(--green-accent)' }}>
                  <Star size={20} color="white" />
                </div>
                <div>
                  <div className="checkout-package-name">
                    <Star size={14} fill="currentColor" /> LUCY Pro
                  </div>
                  <div className="checkout-package-desc">
                    Mo khoa tinh nang Mentor: Tao phong Live Audio, quan ly hoc vien,
                    va nhan goi y tu AI trong luc day.
                  </div>
                </div>
              </div>
            )}

            {paramType === 'upgrade_super' && (
              <div className="checkout-package-banner checkout-package-banner--gold">
                <div className="checkout-package-icon" style={{ background: 'var(--gold)' }}>
                  <Crown size={20} color="white" />
                </div>
                <div>
                  <div className="checkout-package-name" style={{ color: 'var(--gold)' }}>
                    <Crown size={14} fill="currentColor" /> LUCY Super
                  </div>
                  <div className="checkout-package-desc">
                    Day du tinh nang goi Pro, bo sung ghi am phong Live chat luong cao,
                    xuat ban & kiem tien tu Podcast ca nhan.
                  </div>
                </div>
              </div>
            )}

            {/* Amount selection */}
            {!isUpgrade ? (
              <div className="checkout-amount-section">
                <label className="checkout-field-label">Chon so tien nap</label>
                <div className="checkout-quick-grid">
                  {quickAmounts.map((val) => (
                    <button
                      key={val}
                      className={`checkout-quick-chip ${amount === val ? 'active' : ''}`}
                      onClick={() => handleQuickSelect(val)}
                    >
                      {val.toLocaleString('vi-VN')} ₫
                    </button>
                  ))}
                </div>

                <div className="checkout-custom-amount">
                  <Input
                    label="Nhap so tien khac (VND)"
                    type="text"
                    value={amount ? amount.toLocaleString('vi-VN') : ''}
                    onChange={handleAmountChange}
                  />
                </div>
              </div>
            ) : (
              <div className="checkout-fixed-amount">
                <Wallet size={18} color="var(--text-black-soft)" />
                <div>
                  <div className="checkout-fixed-label">So tien goi co dinh</div>
                  <div className="checkout-fixed-value">
                    {amount.toLocaleString('vi-VN')} ₫<span className="checkout-fixed-period">/thang</span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="checkout-desc-field">
              <Input
                label="Noi dung thanh toan"
                type="text"
                value={description}
                onChange={(e) => setUserDescription(e.target.value)}
                disabled={isUpgrade}
              />
            </div>

            {/* SePay notice */}
            <div className="checkout-notice">
              <ShieldCheck size={14} color="var(--gold)" />
              <span>
                He thong su dung cong thanh toan tu dong <strong>SePay Checkout</strong>.
                Giao dich se duoc xu ly ngay lap tuc thong qua chuyen khoan ngan hang quet ma QR.
              </span>
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: Order summary ── */}
        <div className="checkout-summary-section">
          <Card className="checkout-summary-card">
            <h2 className="checkout-summary-heading">Tom tat don hang</h2>

            <div className="checkout-summary-rows">
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Khach hang</span>
                <span className="checkout-summary-value">
                  {currentUser?.persona_name || 'Khach truy cap'}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Ma hoa don</span>
                <span className="checkout-summary-value checkout-summary-code">
                  {invoiceNumber || 'Dang tao...'}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Loai giao dich</span>
                <span className="checkout-summary-value">
                  {paramType === 'deposit' ? 'Nap LUCY Coin' : 'Nang cap VIP'}
                </span>
              </div>
            </div>

            <div className="checkout-total-bar">
              <span className="checkout-total-label">Tong thanh toan</span>
              <span className="checkout-total-amount">
                {amount.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="checkout-pay-action">
              <PayButton order={order}>
                Xac nhan & Thanh toan ngay
              </PayButton>
            </div>

            <div className="checkout-security-note">
              <ShieldCheck size={14} color="var(--green-accent)" />
              Giao dich bao mat qua SePay
            </div>
          </Card>

          {/* Trust indicators */}
          <div className="checkout-trust">
            <div className="checkout-trust-item">
              <CheckCircle size={14} color="var(--green-accent)" />
              <span>Thanh toan mot lan, khong phat sinh phi</span>
            </div>
            <div className="checkout-trust-item">
              <CheckCircle size={14} color="var(--green-accent)" />
              <span>Du lieu duoc ma hoa va bao mat</span>
            </div>
            <div className="checkout-trust-item">
              <CheckCircle size={14} color="var(--green-accent)" />
              <span>Hoa don dien tu duoc gui qua email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
