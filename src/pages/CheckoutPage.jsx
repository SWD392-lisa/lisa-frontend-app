import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { getUpgradePackages, createUpgradePayment } from '../services/roleUpgradeService';
import { createPayment } from '../services/paymentService';
import { submitToSePay } from '../utils/sePayForm';
import {
  ArrowLeft, CreditCard, ShieldCheck, Wallet, Star, Crown,
  Zap, CheckCircle, ChevronRight, Loader
} from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const paramType = searchParams.get('type') || 'deposit';
  const paramAmount = parseInt(searchParams.get('amount'), 10) || 100000;
  const rolePriceId = searchParams.get('rolePriceId');

  const [invoiceNumber] = useState(() => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `LUCY_${timestamp}_${randomSuffix}`;
  });

  const [customAmount, setCustomAmount] = useState(paramAmount);
  const [userDescription, setUserDescription] = useState('');
  const [upgradePackage, setUpgradePackage] = useState(null);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);

  const isUpgrade = paramType === 'upgrade';

  // Load upgrade package info
  useEffect(() => {
    if (!isUpgrade || !rolePriceId) return;

    let cancelled = false;
    const load = async () => {
      setLoadingPackage(true);
      try {
        const pkgs = await getUpgradePackages();
        const pkg = pkgs.find(p => p.rolePriceId === parseInt(rolePriceId, 10));
        if (!cancelled) setUpgradePackage(pkg || null);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingPackage(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isUpgrade, rolePriceId]);

  const amount = isUpgrade
    ? (upgradePackage?.price || paramAmount)
    : customAmount;

  const description = userDescription || (
    isUpgrade && upgradePackage
      ? `Nâng cấp tài khoản lên LUCY ${upgradePackage.roleName} cho ${currentUser?.fullName || 'Học viên'}`
      : `Nạp LUCY Coin vào tài khoản ${currentUser?.fullName || 'Học viên'}`
  );

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
    setCustomAmount(value);
  };

  const handleQuickSelect = (value) => {
    setCustomAmount(value);
  };

  const handlePay = async () => {
    if (!amount || amount <= 0) {
      setPayError('Số tiền thanh toán phải lớn hơn 0');
      return;
    }

    setPaying(true);
    setPayError(null);

    try {
      let formData;

      if (isUpgrade) {
        formData = await createUpgradePayment({
          rolePriceId: parseInt(rolePriceId, 10),
        });
      } else {
        formData = await createPayment({
          orderInvoiceNumber: invoiceNumber,
          orderAmount: amount,
          orderDescription: description,
          customerId: currentUser?.userId || 'guest',
          paymentMethod: 'BANK_TRANSFER',
        });
      }

      submitToSePay(formData);
    } catch (err) {
      console.error('Payment error:', err);
      setPayError(err.message || 'Có lỗi xảy ra khi tạo giao dịch.');
      setPaying(false);
    }
  };

  if (isUpgrade && loadingPackage) {
    return (
      <div className="checkout-page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
        <Loader size={32} className="spin" />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Back link */}
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
        {/* ── LEFT COLUMN ── */}
        <div className="checkout-form-section">
          <Card className="checkout-card">
            <h2 className="checkout-section-title">
              <CreditCard size={20} color="var(--starbucks-green)" />
              Chi tiết thanh toán
            </h2>

            {/* Upgrade package banner */}
            {isUpgrade && upgradePackage && (
              <div className={`checkout-package-banner ${upgradePackage.roleCode === 'SUPER' ? 'checkout-package-banner--gold' : ''}`}>
                <div className="checkout-package-icon" style={{
                  background: upgradePackage.roleCode === 'SUPER' ? 'var(--gold)' : 'var(--green-accent)'
                }}>
                  {upgradePackage.roleCode === 'SUPER' ? <Crown size={20} color="white" /> : <Star size={20} color="white" />}
                </div>
                <div>
                  <div className="checkout-package-name" style={
                    upgradePackage.roleCode === 'SUPER' ? { color: 'var(--gold)' } : {}
                  }>
                    LUCY {upgradePackage.roleName}
                  </div>
                  <div className="checkout-package-desc">
                    {upgradePackage.description || `Nâng cấp tài khoản lên gói ${upgradePackage.roleName}`}
                  </div>
                </div>
              </div>
            )}

            {/* Amount section */}
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

        {/* ── RIGHT COLUMN ── */}
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
                  {isUpgrade ? 'Tạo khi thanh toán' : (invoiceNumber || 'Đang tạo...')}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Loại giao dịch</span>
                <span className="checkout-summary-value">
                  {isUpgrade ? 'Nâng cấp tài khoản' : 'Nạp LUCY Coin'}
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
              <Button
                variant="primary-filled"
                fullWidth
                onClick={handlePay}
                disabled={paying}
              >
                {paying ? 'Đang xử lý...' : `Xác nhận & Thanh toán ngay`}
              </Button>
            </div>

            {payError && (
              <p style={{
                color: 'var(--red, #c82014)',
                fontSize: '1.4rem',
                marginTop: '8px',
                textAlign: 'center',
                fontWeight: 500
              }}>
                ⚠️ {payError}
              </p>
            )}

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
