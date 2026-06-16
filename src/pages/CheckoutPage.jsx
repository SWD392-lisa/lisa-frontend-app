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
      ? `Nâng cấp tài khoản lên gói LUCY Pro cho ${currentUser?.fullName || 'Học viên'}`
      : paramType === 'upgrade_super'
      ? `Nâng cấp tài khoản lên gói LUCY Super cho ${currentUser?.fullName || 'Học viên'}`
      : paramDesc || `Nạp LUCY Coin vào tài khoản ${currentUser?.fullName || 'Học viên'}`
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
    customerId: currentUser?.userId || 'guest',
    paymentMethod: 'BANK_TRANSFER',
  };

  const isUpgrade = paramType === 'upgrade_pro' || paramType === 'upgrade_super';

  return (
    <div className="checkout-page">
      {/* Back link — Starbucks back-chevron style */}
      <div className="checkout-back" onClick={() => navigate('/wallet')}>
        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
        <span>Quay lại Ví</span>
      </div>

      {/* Page header */}
      <div className="checkout-hero">
        <h1 className="checkout-hero-title">Xác nhận Thanh toán</h1>
        <p className="checkout-hero-sub">Kiểm tra thông tin giao dịch trước khi tiếp tục</p>
      </div>

      <div className="checkout-grid">
        {/* ── LEFT COLUMN: Payment details ── */}
        <div className="checkout-form-section">
          <Card className="checkout-card">
            <h2 className="checkout-section-title">
              <CreditCard size={20} color="var(--starbucks-green)" />
              Chi tiết thanh toán
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
                    Mở khóa tính năng Mentor: Tạo phòng Live Audio, quản lý học viên,
                    và nhận gợi ý từ AI trong lúc dạy.
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
                    Đầy đủ tính năng gói Pro, bổ sung ghi âm phòng Live chất lượng cao,
                    xuất bản & kiếm tiền từ Podcast cá nhân.
                  </div>
                </div>
              </div>
            )}

            {/* Amount selection */}
            {!isUpgrade ? (
              <div className="checkout-amount-section">
                <label className="checkout-field-label">Chọn số tiền nạp</label>
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
                    label="Nhập số tiền khác (VND)"
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
                  <div className="checkout-fixed-label">Số tiền gói cố định</div>
                  <div className="checkout-fixed-value">
                    {amount.toLocaleString('vi-VN')} ₫<span className="checkout-fixed-period">/tháng</span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="checkout-desc-field">
              <Input
                label="Nội dung thanh toán"
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
                Hệ thống sử dụng cổng thanh toán tự động <strong>SePay Checkout</strong>.
                Giao dịch sẽ được xử lý ngay lập tức thông qua chuyển khoản ngân hàng quét mã QR.
              </span>
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: Order summary ── */}
        <div className="checkout-summary-section">
          <Card className="checkout-summary-card">
            <h2 className="checkout-summary-heading">Tóm tắt đơn hàng</h2>

            <div className="checkout-summary-rows">
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Khách hàng</span>
                <span className="checkout-summary-value">
                  {currentUser?.fullName || 'Khách truy cập'}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Mã hóa đơn</span>
                <span className="checkout-summary-value checkout-summary-code">
                  {invoiceNumber || 'Đang tạo...'}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Loại giao dịch</span>
                <span className="checkout-summary-value">
                  {paramType === 'deposit' ? 'Nạp LUCY Coin' : 'Nâng cấp VIP'}
                </span>
              </div>
            </div>

            <div className="checkout-total-bar">
              <span className="checkout-total-label">Tổng thanh toán</span>
              <span className="checkout-total-amount">
                {amount.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="checkout-pay-action">
              <PayButton order={order}>
                Xác nhận & Thanh toán ngay
              </PayButton>
            </div>

            <div className="checkout-security-note">
              <ShieldCheck size={14} color="var(--green-accent)" />
              Giao dịch bảo mật qua SePay
            </div>
          </Card>

          {/* Trust indicators */}
          <div className="checkout-trust">
            <div className="checkout-trust-item">
              <CheckCircle size={14} color="var(--green-accent)" />
              <span>Thanh toán một lần, không phát sinh phí</span>
            </div>
            <div className="checkout-trust-item">
              <CheckCircle size={14} color="var(--green-accent)" />
              <span>Dữ liệu được mã hóa và bảo mật</span>
            </div>
            <div className="checkout-trust-item">
              <CheckCircle size={14} color="var(--green-accent)" />
              <span>Hóa đơn điện tử được gửi qua email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
